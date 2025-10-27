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

# Kill existing processes
pkill -f tuna 2>/dev/null
pkill -f "node.*src/index" 2>/dev/null
pkill -f vite 2>/dev/null
sleep 2

# Start backend server
echo -e "${BLUE}🔄 Starting backend server...${NC}"
cd server && npm start &
SERVER_PID=$!
sleep 3

# Start frontend with specific host configuration
echo -e "${BLUE}🔄 Starting frontend server...${NC}"
cd client && HOST=0.0.0.0 npm run dev &
CLIENT_PID=$!
sleep 5

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

# Wait for tunnels
sleep 8

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

# Cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping...${NC}"
    kill $BACKEND_TUNNEL_PID $FRONTEND_TUNNEL_PID $SERVER_PID $CLIENT_PID 2>/dev/null
    pkill -f tuna 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
