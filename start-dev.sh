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
echo "🔄 Starting backend server..."
cd server && npm run dev &
BACKEND_PID=$!

echo "🔄 Starting frontend server..."
cd client && npm run dev &
FRONTEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
