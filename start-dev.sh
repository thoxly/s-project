#!/bin/bash

echo "🚀 Starting Portal S with hot reload..."
echo "📁 Project directory: $(pwd)"
echo ""

# Check if ports are available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Killing existing processes..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5173 is already in use. Killing existing processes..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
fi

echo "✅ Ports are free. Starting development servers..."
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers with hot reload
npm run dev
