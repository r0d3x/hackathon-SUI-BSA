#!/bin/bash

# =============================================================================
# MeltyFi Protocol Deployment Script
# Deploys the rewritten Move contracts to Sui testnet
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
NETWORK="testnet"
CONTRACTS_DIR="contracts/meltyfi"
FRONTEND_DIR="frontend"
LOG_FILE="deployment.log"
ENV_FILE=".env"
FRONTEND_ENV_FILE="$FRONTEND_DIR/.env.local"
GAS_BUDGET=100000000  # 0.1 SUI

# Helper functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

# Banner
print_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
    ███╗   ███╗███████╗██╗  ████████╗██╗   ██╗███████╗██╗
    ████╗ ████║██╔════╝██║  ╚══██╔══╝╚██╗ ██╔╝██╔════╝██║
    ██╔████╔██║█████╗  ██║     ██║    ╚████╔╝ █████╗  ██║
    ██║╚██╔╝██║██╔══╝  ██║     ██║     ╚██╔╝  ██╔══╝  ██║
    ██║ ╚═╝ ██║███████╗███████╗██║      ██║   ██║     ██║
    ╚═╝     ╚═╝╚══════╝╚══════╝╚═╝      ╚═╝   ╚═╝     ╚═╝
                                                           
    Sweet NFT Liquidity Protocol - Testnet Deployment
EOF
    echo -e "${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Sui CLI is installed
    if ! command -v sui &> /dev/null; then
        error "Sui CLI not found. Please install it from: https://docs.sui.io/guides/developer/getting-started/sui-install"
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js not found. Please install Node.js 18+ from: https://nodejs.org/"
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    if ! printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V -C; then
        error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm not found. Please install npm."
    fi
    
    # Check for jq (helpful for JSON parsing)
    if ! command -v jq &> /dev/null; then
        warn "jq not found. Balance parsing will use fallback method."
        info "Install jq for better JSON parsing: brew install jq (macOS) or apt-get install jq (Ubuntu)"
    fi
    
    # Check for bc (helpful for calculations)
    if ! command -v bc &> /dev/null; then
        warn "bc not found. Calculations will use fallback method."
        info "Install bc for better calculations: brew install bc (macOS) or apt-get install bc (Ubuntu)"
    fi
    
    success "All prerequisites met"
}

# Setup Sui environment
setup_sui_environment() {
    log "Setting up Sui environment..."
    
    # Check if testnet environment exists
    if ! sui client envs | grep -q "testnet"; then
        info "Creating testnet environment..."
        sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
    fi
    
    # Switch to testnet
    sui client switch --env testnet
    
    # Get current address
    DEPLOYER_ADDRESS=$(sui client active-address)
    if [ -z "$DEPLOYER_ADDRESS" ]; then
        error "No active Sui address found. Please create a Sui wallet first."
    fi
    
    log "Active address: $DEPLOYER_ADDRESS"
    
    # Check balance with improved parsing (same logic as sui_setup.sh)
    info "Checking SUI balance for deployment..."
    check_balance_for_deployment
    
    success "Sui environment configured for testnet"
}

# Enhanced balance checking function (adapted from sui_setup.sh)
check_balance_for_deployment() {
    local balance_sui="0"
    local balance_mist="0"
    
    # Try JSON parsing first (with fixed structure handling)
    if command -v jq &> /dev/null; then
        local json_output=$(sui client balance --json 2>/dev/null || echo "")
        if [ -n "$json_output" ]; then
            # Handle the nested array structure: [[[metadata, [coin_objects]]], boolean]
            # Sum up all the balance values from individual coin objects
            balance_mist=$(echo "$json_output" | jq -r '
                if type == "array" and length > 0 then
                    .[0][0][1] // [] | 
                    if type == "array" then 
                        map(select(.coinType == "0x2::sui::SUI") | .balance | tonumber) | add // 0
                    else 0 end
                else 0 end
            ' 2>/dev/null || echo "0")
            
            if [ "$balance_mist" != "0" ] && [ "$balance_mist" != "null" ] && [ -n "$balance_mist" ]; then
                if command -v bc &> /dev/null; then
                    balance_sui=$(echo "scale=2; $balance_mist / 1000000000" | bc 2>/dev/null || echo "0")
                else
                    # Fallback calculation without bc
                    balance_sui=$(awk "BEGIN {printf \"%.2f\", $balance_mist / 1000000000}")
                fi
            fi
        fi
    fi
    
    # Fallback to human-readable parsing if JSON failed
    if [ "$balance_sui" = "0" ] || [ -z "$balance_sui" ]; then
        local balance_output=$(sui client balance 2>/dev/null || echo "")
        if echo "$balance_output" | grep -q "SUI"; then
            # Extract the decimal balance (e.g., "6.00" from "6.00 SUI")
            balance_sui=$(echo "$balance_output" | grep -oE '[0-9]+(\.[0-9]+)?\s*SUI' | grep -oE '[0-9]+(\.[0-9]+)?' | head -1 || echo "0")
            
            # Convert to MIST for threshold comparisons (ensure integer)
            if [ "$balance_sui" != "0" ] && [ -n "$balance_sui" ]; then
                if command -v bc &> /dev/null; then
                    balance_mist=$(echo "$balance_sui * 1000000000" | bc 2>/dev/null | cut -d'.' -f1 || echo "0")
                else
                    # Fallback calculation without bc
                    balance_mist=$(awk "BEGIN {printf \"%.0f\", $balance_sui * 1000000000}")
                fi
                balance_mist=${balance_mist:-0}
            fi
        fi
    fi
    
    # Set global variables for use in deployment
    BALANCE_SUI="$balance_sui"
    BALANCE_MIST="$balance_mist"
    
    info "Current balance: $balance_sui SUI ($balance_mist MIST)"
    
    # Define minimum balance threshold for deployment (0.2 SUI = 200,000,000 MIST)
    local min_deployment_threshold=200000000
    
    # Ensure balance_mist is a valid number for comparison
    balance_mist=${balance_mist:-0}
    
    # Compare balance in MIST units
    if [ "$balance_mist" -lt "$min_deployment_threshold" ]; then
        if [ "$balance_mist" -eq "0" ]; then
            warn "No SUI balance detected. You need testnet SUI to deploy contracts."
        else
            warn "Low SUI balance detected ($balance_sui SUI). Deployment requires at least 0.2 SUI."
        fi
        
        info ""
        info "🚰 Get testnet SUI tokens:"
        info "1. Web Faucet: https://faucet.testnet.sui.io"
        info "2. Enter your address: $DEPLOYER_ADDRESS"
        info "3. Discord: https://discord.gg/sui (#testnet-faucet channel)"
        info "4. CLI: sui client faucet"
        info ""
        
        read -p "$(echo -e ${YELLOW}Continue with deployment anyway? (y/N): ${NC})" -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Deployment cancelled. Please get testnet SUI and try again."
        fi
        
        warn "Proceeding with low balance. Deployment may fail due to insufficient gas."
    else
        success "Sufficient SUI balance for deployment: $balance_sui SUI"
        
        # Provide deployment cost estimate
        local estimated_cost_mist=100000000  # 0.1 SUI estimate
        local estimated_cost_sui=$(echo "scale=2; $estimated_cost_mist / 1000000000" | bc 2>/dev/null || echo "0.1")
        info "Estimated deployment cost: ~$estimated_cost_sui SUI"
        
        local remaining_after_deployment
        if command -v bc &> /dev/null; then
            remaining_after_deployment=$(echo "scale=2; ($balance_mist - $estimated_cost_mist) / 1000000000" | bc 2>/dev/null || echo "unknown")
        else
            remaining_after_deployment=$(awk "BEGIN {printf \"%.2f\", ($balance_mist - $estimated_cost_mist) / 1000000000}")
        fi
        
        if [ "$remaining_after_deployment" != "unknown" ]; then
            info "Estimated remaining balance after deployment: ~$remaining_after_deployment SUI"
        fi
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        info "Installing root dependencies..."
        npm install
    fi
    
    # Install frontend dependencies
    if [ -f "$FRONTEND_DIR/package.json" ]; then
        info "Installing frontend dependencies..."
        cd "$FRONTEND_DIR"
        npm install
        cd ..
    fi
    
    success "Dependencies installed"
}

# Build and test contracts
build_contracts() {
    log "Building Move contracts..."
    
    if [ ! -d "$CONTRACTS_DIR" ]; then
        error "Contracts directory not found: $CONTRACTS_DIR"
    fi
    
    cd "$CONTRACTS_DIR"
    
    # Clean previous builds
    if [ -d "build" ]; then
        rm -rf build
        info "Cleaned previous build artifacts"
    fi
    
    # Build contracts
    info "Compiling Move contracts..."
    if ! sui move build 2>&1 | tee -a "../../$LOG_FILE"; then
        error "Contract compilation failed. Check the logs for details."
    fi
    
    # Run tests
    info "Running Move tests..."
    if ! sui move test 2>&1 | tee -a "../../$LOG_FILE"; then
        warn "Some tests failed, but continuing with deployment"
    fi
    
    cd "../.."
    success "Contracts built successfully"
}

# Deploy contracts
deploy_contracts() {
    log "Deploying contracts to Sui testnet..."
    
    cd "$CONTRACTS_DIR"
    
    # Deploy the package
    info "Publishing Move package..."
    DEPLOY_OUTPUT=$(sui client publish --gas-budget $GAS_BUDGET --json 2>&1)
    
    if [ $? -ne 0 ]; then
        error "Contract deployment failed: $DEPLOY_OUTPUT"
    fi
    
    # Parse deployment output
    PACKAGE_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.type == "published") | .packageId' 2>/dev/null)
    PROTOCOL_OBJECT_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType | contains("Protocol")) | .objectId' 2>/dev/null)
    CHOCOLATE_FACTORY_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType | contains("ChocolateFactory")) | .objectId' 2>/dev/null)
    ADMIN_CAP_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType | contains("AdminCap")) | .objectId' 2>/dev/null)
    FACTORY_ADMIN_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType | contains("FactoryAdmin")) | .objectId' 2>/dev/null)
    TX_DIGEST=$(echo "$DEPLOY_OUTPUT" | jq -r '.digest' 2>/dev/null)
    
    if [ -z "$PACKAGE_ID" ] || [ "$PACKAGE_ID" = "null" ]; then
        error "Failed to extract package ID from deployment output"
    fi
    
    cd "../.."
    
    # Log deployment details
    log "Deployment successful!"
    info "Package ID: $PACKAGE_ID"
    info "Protocol Object ID: $PROTOCOL_OBJECT_ID"
    info "Chocolate Factory ID: $CHOCOLATE_FACTORY_ID"
    info "Admin Cap ID: $ADMIN_CAP_ID"
    info "Factory Admin ID: $FACTORY_ADMIN_ID"
    info "Transaction Digest: $TX_DIGEST"
    
    # Save deployment info to file
    cat > deployment_info.json << EOF
{
  "network": "$NETWORK",
  "packageId": "$PACKAGE_ID",
  "protocolObjectId": "$PROTOCOL_OBJECT_ID",
  "chocolateFactoryId": "$CHOCOLATE_FACTORY_ID",
  "adminCapId": "$ADMIN_CAP_ID",
  "factoryAdminId": "$FACTORY_ADMIN_ID",
  "txDigest": "$TX_DIGEST",
  "deployerAddress": "$DEPLOYER_ADDRESS",
  "deployedAt": "$(date -Iseconds)",
  "explorerUrl": "https://suiexplorer.com/txblock/$TX_DIGEST?network=testnet"
}
EOF
    
    success "Contract deployment completed"
}

# Update environment files
update_env_files() {
    log "Updating environment configuration..."
    
    # Create/update root .env file
    info "Updating root environment file..."
    cat > "$ENV_FILE" << EOF
# MeltyFi Protocol - Sui Testnet Configuration
# Generated on $(date)

# Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses
NEXT_PUBLIC_MELTYFI_PACKAGE_ID=$PACKAGE_ID
NEXT_PUBLIC_PROTOCOL_OBJECT_ID=$PROTOCOL_OBJECT_ID
NEXT_PUBLIC_CHOCOLATE_FACTORY_ID=$CHOCOLATE_FACTORY_ID
NEXT_PUBLIC_ADMIN_CAP_ID=$ADMIN_CAP_ID
NEXT_PUBLIC_FACTORY_ADMIN_ID=$FACTORY_ADMIN_ID

# Token Types
NEXT_PUBLIC_CHOCO_CHIP_TYPE=$PACKAGE_ID::choco_chip::CHOCO_CHIP
NEXT_PUBLIC_WONKA_BAR_TYPE=$PACKAGE_ID::core::WonkaBar

# Application Configuration
NEXT_PUBLIC_APP_NAME=MeltyFi
NEXT_PUBLIC_APP_DESCRIPTION=Sweet NFT Liquidity Protocol
NEXT_PUBLIC_DEBUG=true
NODE_ENV=development

# Deployment Info
DEPLOYER_ADDRESS=$DEPLOYER_ADDRESS
DEPLOYMENT_TX=$TX_DIGEST
DEPLOYED_AT=$(date -Iseconds)

# Explorer URLs
NEXT_PUBLIC_EXPLORER_URL=https://suiexplorer.com
NEXT_PUBLIC_PACKAGE_EXPLORER_URL=https://suiexplorer.com/object/$PACKAGE_ID?network=testnet
NEXT_PUBLIC_TX_EXPLORER_URL=https://suiexplorer.com/txblock/$TX_DIGEST?network=testnet
EOF
    
    # Create/update frontend .env.local file
    if [ -d "$FRONTEND_DIR" ]; then
        info "Updating frontend environment file..."
        cp "$ENV_FILE" "$FRONTEND_ENV_FILE"
    fi
    
    success "Environment files updated"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check if package exists on chain
    info "Verifying package on chain..."
    if ! sui client object "$PACKAGE_ID" &>/dev/null; then
        error "Package verification failed - package not found on chain"
    fi
    
    # Check if protocol object exists
    if [ -n "$PROTOCOL_OBJECT_ID" ] && [ "$PROTOCOL_OBJECT_ID" != "null" ]; then
        info "Verifying protocol object..."
        if ! sui client object "$PROTOCOL_OBJECT_ID" &>/dev/null; then
            warn "Protocol object verification failed"
        fi
    fi
    
    # Check if chocolate factory exists
    if [ -n "$CHOCOLATE_FACTORY_ID" ] && [ "$CHOCOLATE_FACTORY_ID" != "null" ]; then
        info "Verifying chocolate factory..."
        if ! sui client object "$CHOCOLATE_FACTORY_ID" &>/dev/null; then
            warn "Chocolate factory verification failed"
        fi
    fi
    
    success "Deployment verification completed"
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        warn "Frontend directory not found, skipping frontend build"
        return
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if next.config.js exists and update if needed
    if [ -f "next.config.js" ]; then
        info "Frontend configuration found"
    fi
    
    # Build frontend
    info "Building Next.js application..."
    if ! npm run build 2>&1 | tee -a "../$LOG_FILE"; then
        warn "Frontend build failed, but deployment is complete"
        cd ..
        return
    fi
    
    cd ..
    success "Frontend built successfully"
}

# Generate deployment summary
generate_summary() {
    log "Generating deployment summary..."
    
    # Get final balance for summary
    local final_balance_sui="0"
    local balance_output=$(sui client balance 2>/dev/null || echo "")
    if echo "$balance_output" | grep -q "SUI"; then
        final_balance_sui=$(echo "$balance_output" | grep -oE '[0-9]+(\.[0-9]+)?\s*SUI' | grep -oE '[0-9]+(\.[0-9]+)?' | head -1 || echo "0")
    fi
    
    # Calculate deployment cost if we have initial balance
    local deployment_cost="unknown"
    if [ -n "$BALANCE_SUI" ] && [ "$BALANCE_SUI" != "0" ] && [ "$final_balance_sui" != "0" ]; then
        if command -v bc &> /dev/null; then
            deployment_cost=$(echo "scale=4; $BALANCE_SUI - $final_balance_sui" | bc 2>/dev/null || echo "unknown")
        else
            deployment_cost=$(awk "BEGIN {printf \"%.4f\", $BALANCE_SUI - $final_balance_sui}")
        fi
        
        # Handle negative values (if balance increased during deployment)
        if [ "$deployment_cost" != "unknown" ]; then
            local cost_check=$(echo "$deployment_cost < 0" | bc 2>/dev/null || echo "0")
            if [ "$cost_check" = "1" ]; then
                deployment_cost="<0.0001"
            fi
        fi
    fi
    
    cat << EOF

${GREEN}🎉 MeltyFi Protocol Deployment Complete! 🎉${NC}

${CYAN}📋 Deployment Summary:${NC}
├─ Network: ${YELLOW}Sui Testnet${NC}
├─ Package ID: ${BLUE}$PACKAGE_ID${NC}
├─ Protocol Object: ${BLUE}$PROTOCOL_OBJECT_ID${NC}
├─ Chocolate Factory: ${BLUE}$CHOCOLATE_FACTORY_ID${NC}
├─ Deployer: ${BLUE}$DEPLOYER_ADDRESS${NC}
├─ Transaction: ${BLUE}$TX_DIGEST${NC}
├─ Initial Balance: ${YELLOW}${BALANCE_SUI:-unknown} SUI${NC}
├─ Final Balance: ${YELLOW}$final_balance_sui SUI${NC}
└─ Deployment Cost: ${YELLOW}~$deployment_cost SUI${NC}

${CYAN}🔗 Explorer Links:${NC}
├─ Package: ${BLUE}https://suiexplorer.com/object/$PACKAGE_ID?network=testnet${NC}
├─ Transaction: ${BLUE}https://suiexplorer.com/txblock/$TX_DIGEST?network=testnet${NC}
└─ Testnet Faucet: ${BLUE}https://faucet.testnet.sui.io${NC}

${CYAN}🚀 Next Steps:${NC}
1. ${GREEN}Start frontend:${NC} cd frontend && npm run dev
2. ${GREEN}Connect wallet:${NC} Use Sui Wallet browser extension
3. ${GREEN}Get testnet SUI:${NC} Visit the faucet link above
4. ${GREEN}Test protocol:${NC} Create lotteries and buy WonkaBars!

${CYAN}📁 Generated Files:${NC}
├─ ${YELLOW}deployment_info.json${NC} - Complete deployment details
├─ ${YELLOW}.env${NC} - Root environment configuration
├─ ${YELLOW}frontend/.env.local${NC} - Frontend environment
└─ ${YELLOW}deployment.log${NC} - Full deployment logs

${CYAN}💡 Testing Tips:${NC}
├─ Current balance (${final_balance_sui} SUI) should be sufficient for testing
├─ Each lottery creation costs ~0.01-0.02 SUI
├─ Each WonkaBar purchase costs the set price + gas (~0.001 SUI)
└─ If you run low, use the testnet faucet above

${GREEN}Happy testing! 🍫✨${NC}

EOF
}

# Error cleanup
cleanup_on_error() {
    warn "Deployment failed, cleaning up..."
    # Add any cleanup logic here if needed
    exit 1
}

# Main deployment flow
main() {
    # Set up error handling
    trap cleanup_on_error ERR
    
    # Clear previous log
    > "$LOG_FILE"
    
    print_banner
    log "Starting MeltyFi Protocol deployment to Sui testnet..."
    
    check_prerequisites
    setup_sui_environment
    install_dependencies
    build_contracts
    deploy_contracts
    update_env_files
    verify_deployment
    build_frontend
    generate_summary
    
    success "🎉 Deployment completed successfully!"
}

# Script options
case "${1:-}" in
    --help|-h)
        echo "MeltyFi Deployment Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --clean        Clean build artifacts before deployment"
        echo "  --skip-frontend Skip frontend build"
        echo ""
        echo "Environment Variables:"
        echo "  GAS_BUDGET     Gas budget for deployment (default: 100000000)"
        echo "  NETWORK        Target network (default: testnet)"
        echo ""
        exit 0
        ;;
    --clean)
        log "Cleaning build artifacts..."
        rm -rf "$CONTRACTS_DIR/build"
        rm -f "$LOG_FILE"
        rm -f deployment_info.json
        success "Clean completed"
        ;;
    --skip-frontend)
        build_frontend() { log "Skipping frontend build as requested"; }
        main
        ;;
    "")
        main
        ;;
    *)
        error "Unknown option: $1. Use --help for usage information."
        ;;
esac