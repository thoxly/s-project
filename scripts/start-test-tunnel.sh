#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting test tunnel for backend...${NC}"

# Load environment
if [ -f ../.env ]; then
    export $(grep -v '^#' ../.env | xargs)
fi

# Check if TUNA_TOKEN is set
if [ -z "$TUNA_TOKEN" ]; then
    echo -e "${RED}❌ TUNA_TOKEN is not set!${NC}"
    echo -e "${YELLOW}Please set your TUNA token in .env file:${NC}"
    echo -e "${YELLOW}TUNA_TOKEN=your_token_here${NC}"
    exit 1
fi

echo -e "${GREEN}✅ TUNA_TOKEN is configured${NC}"

# Check if backend is running on port 3000
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running on port 3000!${NC}"
    echo -e "${YELLOW}Please start backend server first:${NC}"
    echo -e "${YELLOW}cd ../server && npm start${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running on port 3000${NC}"

# Kill existing tunnel on this domain if any
echo -e "${YELLOW}🧹 Cleaning up existing tunnels...${NC}"
pkill -f "tuna.*sb24xv-194-0-112-167" 2>/dev/null || true
sleep 1

# Start tunnel
echo -e "${YELLOW}📡 Starting tunnel on sb24xv-194-0-112-167.ru.tuna.am:3000...${NC}"
tuna http 3000 --domain=sb24xv-194-0-112-167.ru.tuna.am --token $TUNA_TOKEN

# Wait a moment
sleep 2

echo ""
echo -e "${GREEN}🎉 Tunnel is running!${NC}"
echo ""
echo -e "${YELLOW}📡 Test tunnel URL:${NC}"
echo -e "   🔌 API: https://sb24xv-194-0-112-167.ru.tuna.am"
echo -e "   🔍 Health check: https://sb24xv-194-0-112-167.ru.tuna.am/api/health"
echo -e "   📨 Support requests: https://sb24xv-194-0-112-167.ru.tuna.am/api/requests/support"
echo ""
echo -e "${YELLOW}⚠️  Note: This is a temporary tunnel (30 seconds)${NC}"
echo -e "${YELLOW}🛑 Press Ctrl+C to stop${NC}"

