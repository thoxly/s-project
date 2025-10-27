#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Portal S with Custom Domain...${NC}"

# Load environment
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Check if TUNA_TOKEN is set
if [ -z "$TUNA_TOKEN" ]; then
    echo -e "${RED}❌ TUNA_TOKEN is not set!${NC}"
    echo -e "${YELLOW}Please set your TUNA token in .env file:${NC}"
    echo -e "${YELLOW}TUNA_TOKEN=your_token_here${NC}"
    exit 1
fi

echo -e "${GREEN}✅ TUNA_TOKEN is configured${NC}"

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local service_name=$2
    
    echo -e "${YELLOW}🔍 Checking port $port ($service_name)...${NC}"
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $port is occupied. Freeing it up...${NC}"
        
        # Kill processes on the port
        lsof -ti:$port | xargs kill -9 2>/dev/null
        
        # Wait a moment for processes to die
        sleep 2
        
        # Double check
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${RED}❌ Failed to free port $port${NC}"
            return 1
        else
            echo -e "${GREEN}✅ Port $port is now free${NC}"
        fi
    else
        echo -e "${GREEN}✅ Port $port is free${NC}"
    fi
}

# Function to kill all related processes
cleanup_processes() {
    echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
    
    # Kill tuna processes
    pkill -f tuna 2>/dev/null
    pkill -f "tuna.*http" 2>/dev/null
    pkill -f "tuna.*tcp" 2>/dev/null
    
    # Kill project processes
    pkill -f "node.*src/index" 2>/dev/null
    pkill -f "nodemon.*src/index" 2>/dev/null
    pkill -f "npm.*start" 2>/dev/null
    pkill -f "npm.*dev" 2>/dev/null
    pkill -f vite 2>/dev/null
    
    # Kill any processes on our ports
    kill_port 3000 "Backend"
    kill_port 5173 "Frontend"
    kill_port 4040 "TUNA Web Interface"
    kill_port 4041 "TUNA Web Interface"
    
    sleep 2
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Clean up existing processes
cleanup_processes

# Function to wait for service to be ready
wait_for_service() {
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

# Start backend server
echo -e "${BLUE}🔄 Starting backend server...${NC}"
cd server && npm start &
SERVER_PID=$!

# Wait for backend to be ready
if ! wait_for_service 3000 "Backend server"; then
    echo -e "${RED}❌ Failed to start backend server${NC}"
    cleanup_processes
    exit 1
fi

# Start frontend with specific host configuration
echo -e "${BLUE}🔄 Starting frontend server...${NC}"
cd client && HOST=0.0.0.0 npm run dev &
CLIENT_PID=$!

# Wait for frontend to be ready
if ! wait_for_service 5173 "Frontend server"; then
    echo -e "${RED}❌ Failed to start frontend server${NC}"
    cleanup_processes
    exit 1
fi

# Start tunnels
echo -e "${BLUE}🌍 Starting tunnels...${NC}"

# Frontend tunnel with your custom domain
echo -e "${YELLOW}📡 Starting frontend tunnel on surius.ru.tuna.am...${NC}"
tuna http 5173 --domain=surius.ru.tuna.am --token $TUNA_TOKEN &
FRONTEND_TUNNEL_PID=$!

# Backend tunnel with separate domain
echo -e "${YELLOW}📡 Starting API tunnel on api-surius.ru.tuna.am...${NC}"
tuna http 3000 --domain=api-surius.ru.tuna.am --token $TUNA_TOKEN &
BACKEND_TUNNEL_PID=$!

# Wait for tunnels to establish
echo -e "${YELLOW}⏳ Waiting for tunnels to establish...${NC}"
sleep 8

# Check if tunnels are running
if ! ps -p $FRONTEND_TUNNEL_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ Frontend tunnel failed to start${NC}"
    cleanup_processes
    exit 1
fi

if ! ps -p $BACKEND_TUNNEL_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend tunnel failed to start${NC}"
    cleanup_processes
    exit 1
fi

echo -e "${GREEN}✅ Tunnels established successfully${NC}"

echo ""
echo -e "${GREEN}🎉 Portal S is running!${NC}"
echo ""
echo -e "${YELLOW}📡 Your tunnels:${NC}"
echo -e "   🌟 Frontend: https://surius.ru.tuna.am"
echo -e "   🔌 API: https://api-surius.ru.tuna.am"
echo -e "   🔍 Health check: https://api-surius.ru.tuna.am/api/health"
echo -e "   📨 Webhook endpoint: https://api-surius.ru.tuna.am/api/webhooks"
echo ""
echo -e "${YELLOW}🛑 Press Ctrl+C to stop${NC}"

# Enhanced cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    
    # Kill tunnels
    if [ ! -z "$BACKEND_TUNNEL_PID" ]; then
        kill $BACKEND_TUNNEL_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend tunnel stopped${NC}"
    fi
    
    if [ ! -z "$FRONTEND_TUNNEL_PID" ]; then
        kill $FRONTEND_TUNNEL_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend tunnel stopped${NC}"
    fi
    
    # Kill servers
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend server stopped${NC}"
    fi
    
    if [ ! -z "$CLIENT_PID" ]; then
        kill $CLIENT_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend server stopped${NC}"
    fi
    
    # Clean up any remaining processes
    cleanup_processes
    
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
