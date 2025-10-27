#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Configuration
SERVER_PORT=${SERVER_PORT:-3000}
CLIENT_PORT=${CLIENT_PORT:-5173}
SERVER_COMMAND=${SERVER_COMMAND:-"npm run start:server"}
CLIENT_COMMAND=${CLIENT_COMMAND:-"npm run start:client"}
TUNA_DOMAIN="surius.ru.tuna.am"

echo -e "${BLUE}🚀 Starting Portal S with Tuna Tunnels...${NC}"
echo -e "${BLUE}📁 Project directory: $(pwd)${NC}"
echo -e "${BLUE}🌍 Domain: $TUNA_DOMAIN${NC}"
echo ""

# Function to check if tuna is installed
check_tuna() {
    if ! command -v tuna &> /dev/null; then
        echo -e "${RED}❌ tuna is not installed!${NC}"
        echo -e "${YELLOW}📥 Installing tuna...${NC}"
        
        # Detect OS and install tuna
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install yuccastream/tap/tuna
            else
                echo -e "${RED}❌ Homebrew not found. Please install tuna manually:${NC}"
                echo "   https://tuna.yuccastream.com/"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            echo -e "${YELLOW}📥 Please install tuna manually for Linux:${NC}"
            echo "   https://tuna.yuccastream.com/"
            exit 1
        else
            echo -e "${RED}❌ Unsupported OS. Please install tuna manually:${NC}"
            echo "   https://tuna.yuccastream.com/"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ tuna is installed${NC}"
        local version=$(tuna --version 2>/dev/null | head -1)
        echo -e "${CYAN}   Version: $version${NC}"
    fi
}

# Function to check if tuna token is configured
check_tuna_token() {
    echo -e "${YELLOW}🔍 Checking tuna token configuration...${NC}"
    
    if [ -z "$TUNA_TOKEN" ]; then
        echo -e "${RED}❌ TUNA_TOKEN environment variable not set${NC}"
        echo -e "${YELLOW}   Please set your tuna token:${NC}"
        echo -e "${YELLOW}   export TUNA_TOKEN=your_token_here${NC}"
        echo -e "${YELLOW}   Or add it to your .env file${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ TUNA_TOKEN is set${NC}"
    fi
}

# Function to check if Node.js dependencies are installed
check_dependencies() {
    echo -e "${YELLOW}🔍 Checking dependencies...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found${NC}"
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        npm install
    fi
    
    # Check for js-yaml dependency
    if ! npm list js-yaml &> /dev/null; then
        echo -e "${YELLOW}📦 Installing js-yaml...${NC}"
        npm install js-yaml
    fi
    
    echo -e "${GREEN}✅ Dependencies ready${NC}"
}

# Function to check and clean up existing processes
pre_cleanup() {
    echo -e "${YELLOW}🔍 Pre-cleaning existing processes...${NC}"
    
    # Kill any existing tuna processes
    pkill -f "tuna.*http" 2>/dev/null
    pkill -f "tuna.*tcp" 2>/dev/null
    
    # Kill any existing project processes
    pkill -f "node.*src/index.js" 2>/dev/null
    pkill -f "nodemon.*src/index" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    pkill -f "concurrently.*dev" 2>/dev/null
    pkill -f "tunnel-manager" 2>/dev/null
    
    # Clean up ports
    lsof -ti:3000,5173,8080 2>/dev/null | xargs kill -9 2>/dev/null
    
    sleep 1
    echo -e "${GREEN}✅ Pre-cleanup completed${NC}"
}

# Function to check if port is available
check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $port is already in use by $service_name. Killing existing processes...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Function to wait for server to be ready
wait_for_server() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to start on port $port...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready on port $port${NC}"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start on port $port after $max_attempts seconds${NC}"
    return 1
}

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all processes...${NC}"
    
    # Kill tunnel manager
    pkill -f "tunnel-manager" 2>/dev/null
    echo -e "${GREEN}✅ Tunnel manager stopped${NC}"
    
    # Kill tuna processes
    pkill -f "tuna.*http" 2>/dev/null
    pkill -f "tuna.*tcp" 2>/dev/null
    pkill -f "tuna" 2>/dev/null
    echo -e "${GREEN}✅ Tuna processes stopped${NC}"
    
    # Kill server processes
    pkill -f "node.*src/index.js" 2>/dev/null
    pkill -f "nodemon.*src/index" 2>/dev/null
    pkill -f "npm.*start:server" 2>/dev/null
    echo -e "${GREEN}✅ Server processes stopped${NC}"
    
    # Kill client processes
    pkill -f "vite" 2>/dev/null
    pkill -f "npm.*start:client" 2>/dev/null
    pkill -f "npm.*dev:client" 2>/dev/null
    echo -e "${GREEN}✅ Client processes stopped${NC}"
    
    # Clean up ports
    lsof -ti:$SERVER_PORT,$CLIENT_PORT 2>/dev/null | xargs kill -9 2>/dev/null
    
    echo -e "${GREEN}✅ All processes stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Pre-cleanup any existing processes
pre_cleanup

# Check if tuna is installed
check_tuna

# Check tuna token configuration
check_tuna_token

# Check dependencies
check_dependencies

# Check and free up ports
check_port $SERVER_PORT "server"
check_port $CLIENT_PORT "client"

echo -e "${GREEN}✅ Ports are free. Starting servers...${NC}"
echo ""

# Start server
echo -e "${BLUE}🔄 Starting backend server...${NC}"
cd server && $SERVER_COMMAND &
SERVER_PID=$!

# Wait for server to be ready
if ! wait_for_server $SERVER_PORT "Backend server"; then
    cleanup
    exit 1
fi

# Start client (if command is provided)
if [ ! -z "$CLIENT_COMMAND" ]; then
    echo -e "${BLUE}🔄 Starting frontend client...${NC}"
    cd client && $CLIENT_COMMAND &
    CLIENT_PID=$!
    
    # Wait for client to be ready
    if ! wait_for_server $CLIENT_PORT "Frontend client"; then
        cleanup
        exit 1
    fi
fi

echo ""
echo -e "${PURPLE}🌐 Local URLs:${NC}"
echo -e "${CYAN}   Backend API: http://localhost:$SERVER_PORT/api/health${NC}"
if [ ! -z "$CLIENT_PID" ]; then
    echo -e "${CYAN}   Frontend: http://localhost:$CLIENT_PORT${NC}"
fi
echo ""

# Start Tuna tunnels using tunnel manager
echo -e "${BLUE}🌍 Starting Tuna tunnels...${NC}"

# Wait a moment for servers to be fully ready
sleep 2

# Start tunnel manager
echo -e "${YELLOW}📡 Starting tunnel manager...${NC}"
node tunnel-manager.js &
TUNNEL_MANAGER_PID=$!

# Wait for tunnel manager to start
sleep 3

# Check if tunnel manager started successfully
if ! ps -p $TUNNEL_MANAGER_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ Tunnel manager failed to start${NC}"
    echo -e "${YELLOW}💡 Check if all dependencies are installed${NC}"
    cleanup
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Tuna tunnels established!${NC}"
echo -e "${GREEN}🌍 Your project is now accessible via Tuna tunnels${NC}"
echo -e "${YELLOW}📝 Check the tunnel manager output above for the public URLs${NC}"
echo -e "${YELLOW}🛑 Press Ctrl+C to stop all servers and close the tunnels${NC}"
echo ""

# Wait for all processes
wait $SERVER_PID $CLIENT_PID $TUNNEL_MANAGER_PID