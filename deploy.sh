#!/bin/bash
set -e

echo "Starting deployment..."

git pull origin main
echo "✓ Pulled latest code"

npm install
echo "✓ Dependencies installed"

npm run build
echo "✓ Build successful"

npx pm2 restart ciscogni
echo "✓ PM2 restarted"

echo "Deployment complete!"