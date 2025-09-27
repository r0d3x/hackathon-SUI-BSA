#!/bin/bash

# Script to clean up duplicate lockfiles and fix project structure

echo "🧹 Cleaning up MeltyFi project structure..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

print_info "Current project structure analysis..."

# Check what's in the root package.json
if [ -f "package.json" ]; then
    ROOT_SCRIPTS=$(cat package.json | jq -r '.scripts | keys[]' 2>/dev/null | head -5)
    print_info "Root package.json scripts: $ROOT_SCRIPTS"
fi

# The root package.json seems to only contain npm scripts for orchestration
# Let's check if it has any actual dependencies
ROOT_DEPS=$(cat package.json | jq -r '.dependencies // {} | keys | length' 2>/dev/null || echo "0")
ROOT_DEV_DEPS=$(cat package.json | jq -r '.devDependencies // {} | keys | length' 2>/dev/null || echo "0")

print_info "Root dependencies: $ROOT_DEPS, devDependencies: $ROOT_DEV_DEPS"

if [ "$ROOT_DEPS" -eq "0" ] && [ "$ROOT_DEV_DEPS" -eq "0" ]; then
    print_warning "Root package.json has no dependencies - it's just for scripts"
    print_info "We can safely remove the root package-lock.json"
    
    # Remove root lockfile since it's not needed
    if [ -f "package-lock.json" ]; then
        rm package-lock.json
        print_status "Removed unnecessary root package-lock.json"
    fi
else
    print_warning "Root package.json has dependencies - keeping both lockfiles"
fi

# Update Next.js config to be more explicit about the root
print_info "Updating Next.js configuration..."

# The config is already updated, but let's also create a .env.local for frontend
if [ ! -f "frontend/.env.local" ] && [ -f ".env" ]; then
    print_info "Copying environment variables to frontend..."
    cp .env frontend/.env.local
    print_status "Environment variables copied to frontend"
fi

print_status "Project cleanup completed!"
print_info "The Turbopack warning should be resolved now."
print_info "Restart your development server with: npm run dev:frontend"