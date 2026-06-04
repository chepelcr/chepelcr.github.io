#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Rebooting JCampos server...${NC}"

# Kill existing server processes by name
echo "Stopping existing processes..."
taskkill //F //IM node.exe 2>/dev/null || true
taskkill //F //IM tsx.exe 2>/dev/null || true

# Force kill processes on specific ports
echo "Stopping processes on port 9100..."
for port in 9100; do
  pid=$(netstat -ano | grep ":$port" | grep LISTENING | awk '{print $5}' | head -1)
  if [ ! -z "$pid" ]; then
    taskkill //F //PID $pid 2>/dev/null || true
  fi
done

# Wait a moment for processes to terminate
sleep 2

# Clean Vite caches
echo "Cleaning Vite caches..."
rm -rf client/node_modules/.vite client/.vite client/dist
rm -rf node_modules/.vite .vite dist
echo "Caches cleared"

# Create logs directory if it doesn't exist
mkdir -p logs

# Start server in background
echo -e "${GREEN}🚀 Starting server (Express + Vite HMR)...${NC}"
nohup pnpm dev > logs/server.log 2>&1 &
DEV_PID=$!

# Wait a moment to check if process started successfully
sleep 3

# Check if process is still running
if ps -p $DEV_PID > /dev/null; then
    echo -e "${GREEN}✅ Server started successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Process PID:${NC} $DEV_PID"
    echo ""
    echo -e "${YELLOW}URLs:${NC}"
    echo -e "  • ${MAGENTA}Portfolio:${NC} http://localhost:9100"
    echo ""
    echo -e "${YELLOW}Logs:${NC}"
    echo "  • Server: tail -f logs/server.log"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo "  • Restart: ./reboot-server.sh"
else
    echo "❌ Server failed to start. Check logs/server.log for details."
    exit 1
fi
