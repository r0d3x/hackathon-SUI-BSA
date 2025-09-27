#!/bin/bash

# Enhanced Sui Environment Setup Script for MeltyFi - TESTNET
# Comprehensive setup with error handling and validation for testnet

set -e  # Exit on any error

echo "🔧 Setting up Sui testnet environment for MeltyFi..."

# Colors and formatting
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# Logging
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/../sui_setup.log"

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') INFO: $1" >> "$LOG_FILE"
}

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') SUCCESS: $1" >> "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') WARNING: $1" >> "$LOG_FILE"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR: $1" >> "$LOG_FILE"
}

print_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') STEP: $1" >> "$LOG_FILE"
}

print_header() {
    echo -e "${BOLD}${PURPLE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                    🍫 MeltyFi Setup                        ║"
    echo "║             Sui Testnet Environment Configuration          ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Initialize logging
echo "Sui testnet environment setup started at $(date)" > "$LOG_FILE"

# Error handling
handle_error() {
    print_error "Setup failed at step: $1"
    print_info "Check the log file for details: $LOG_FILE"
    print_info "Common solutions:"
    print_info "1. Ensure Sui CLI is properly installed"
    print_info "2. Check your internet connection"
    print_info "3. Try running the script again"
    exit 1
}

# Trap errors
trap 'handle_error "Unknown error"' ERR

# Prerequisites check
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if Sui CLI is installed
    if ! command -v sui &> /dev/null; then
        print_error "Sui CLI not found!"
        echo
        print_info "Please install Sui CLI first:"
        echo -e "${YELLOW}cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui${NC}"
        echo
        print_info "Or use the install script:"
        echo -e "${YELLOW}curl -fsSL https://github.com/MystenLabs/sui/raw/main/scripts/install.sh | bash${NC}"
        exit 1
    fi
    
    # Check if jq is available (for JSON parsing)
    if ! command -v jq &> /dev/null; then
        print_warning "jq not found. Installing would improve balance checking."
        print_info "Install with: brew install jq (macOS) or apt-get install jq (Ubuntu)"
    fi
    
    local sui_version=$(sui --version | head -1)
    print_status "Sui CLI found: $sui_version"
}

# Configure Sui client for testnet
configure_sui_client() {
    print_step "Configuring Sui client for testnet..."
    
    print_info "Configuring testnet environment..."
    
    # Check if testnet environment exists
    if sui client envs 2>/dev/null | grep -q "testnet"; then
        print_info "Testnet environment already exists"
    else
        print_info "Creating testnet environment..."
        sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
        print_status "Testnet environment created"
    fi
    
    # Switch to testnet
    print_info "Switching to testnet..."
    sui client switch --env testnet
    print_status "Switched to testnet"
    
    print_status "Successfully configured for testnet"
}

# Setup Sui address
setup_address() {
    print_step "Setting up Sui address..."
    
    print_info "Checking for existing addresses..."
    local address_count=$(sui client addresses 2>/dev/null | grep -c "0x" || echo "0")
    
    if [ "$address_count" -gt 0 ]; then
        print_status "Existing address found"
        print_info "Found $address_count address(es)"
    else
        print_info "Creating new address..."
        if sui client new-address ed25519; then
            print_status "New ed25519 address created"
        else
            handle_error "Failed to create new address"
        fi
    fi
    
    # Display active address
    local active_address=$(sui client active-address 2>/dev/null || echo "unknown")
    if [ "$active_address" != "unknown" ]; then
        print_status "Active address: $active_address"
    else
        handle_error "No active address found"
    fi
}

# Check balance and guide user through faucet process
check_balance_and_faucet() {
    print_step "Checking SUI balance and faucet setup..."
    
    local current_address=$(sui client active-address 2>/dev/null || echo "")
    if [ -z "$current_address" ] || [ "$current_address" = "unknown" ]; then
        print_error "No active address found"
        return 1
    fi
    
    print_info "Checking balance for address: $current_address"
    
    # Get balance with improved parsing
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
            
            if [ "$balance_mist" != "0" ] && [ "$balance_mist" != "null" ]; then
                balance_sui=$(echo "scale=2; $balance_mist / 1000000000" | bc 2>/dev/null || echo "0")
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
                balance_mist=$(echo "$balance_sui * 1000000000" | bc 2>/dev/null | cut -d'.' -f1 || echo "0")
                balance_mist=${balance_mist:-0}
            fi
        fi
    fi
    
    print_info "Current balance: $balance_sui SUI"
    
    # Define minimum balance threshold (0.1 SUI = 100,000,000 MIST)
    local min_balance_threshold=100000000
    
    # Compare balance in MIST units
    if [ "$balance_mist" -lt "$min_balance_threshold" ]; then
        if [ "$balance_mist" -eq "0" ]; then
            print_warning "No SUI balance found. You need testnet tokens to deploy contracts."
        else
            print_warning "Low SUI balance detected. You may need more testnet tokens for deployment."
        fi
        
        print_info ""
        print_info "🚰 Getting testnet SUI tokens:"
        print_info "════════════════════════════════════"
        print_info "Option 1 - Web Faucet (Recommended):"
        print_info "  1. Visit: https://faucet.testnet.sui.io"
        print_info "  2. Enter your address: $current_address"
        print_info "  3. Complete captcha and request tokens"
        print_info ""
        print_info "Option 2 - Discord Faucet:"
        print_info "  1. Join Sui Discord: https://discord.gg/sui"
        print_info "  2. Go to #testnet-faucet channel"
        print_info "  3. Use command: !faucet $current_address"
        print_info ""
        print_info "Option 3 - CLI Faucet:"
        print_info "  Run: sui client faucet"
        print_info ""
        
        echo "Choose your preferred method:"
        echo "1) I'll use Web faucet"
        echo "2) I'll use Discord faucet"
        echo "3) Use CLI faucet now"
        echo "4) Skip for now"
        read -p "Enter choice (1-4): " choice
        
        case $choice in
            1)
                print_info "Opening web faucet in browser..."
                if command -v open &> /dev/null; then
                    open "https://faucet.testnet.sui.io"
                elif command -v xdg-open &> /dev/null; then
                    xdg-open "https://faucet.testnet.sui.io"
                else
                    print_info "Please visit: https://faucet.testnet.sui.io"
                fi
                print_info "Please use web faucet manually."
                ;;
            2)
                print_info "Opening Discord in browser..."
                if command -v open &> /dev/null; then
                    open "https://discord.gg/sui"
                elif command -v xdg-open &> /dev/null; then
                    xdg-open "https://discord.gg/sui"
                else
                    print_info "Please visit: https://discord.gg/sui"
                fi
                print_info "Use command: !faucet $current_address"
                ;;
            3)
                print_info "Requesting SUI from CLI faucet..."
                if sui client faucet; then
                    print_status "Faucet request successful!"
                else
                    print_warning "CLI faucet failed. Please use web or Discord faucet manually."
                fi
                ;;
            4)
                print_info "Skipping faucet request."
                if [ "$balance_sui" != "0" ]; then
                    print_info "You have $balance_sui SUI, which might be sufficient for deployment."
                fi
                ;;
            *)
                print_warning "Invalid choice. Please use web or Discord faucet manually."
                ;;
        esac
        
        if [ "$choice" != "4" ]; then
            print_info ""
            read -p "$(echo -e ${YELLOW}Press Enter after requesting SUI tokens...${NC})"
            
            # Recheck balance using the same logic
            print_info "Rechecking balance..."
            sleep 2
            
            # Re-run balance check logic
            local new_balance_output=$(sui client balance 2>/dev/null || echo "")
            if echo "$new_balance_output" | grep -q "SUI"; then
                local new_balance_sui=$(echo "$new_balance_output" | grep -oE '[0-9]+(\.[0-9]+)?\s*SUI' | grep -oE '[0-9]+(\.[0-9]+)?' | head -1 || echo "0")
                local new_balance_mist=$(echo "$new_balance_sui * 1000000000" | bc 2>/dev/null | cut -d'.' -f1 || echo "0")
                new_balance_mist=${new_balance_mist:-0}
                
                if [ "$new_balance_mist" -gt "$min_balance_threshold" ]; then
                    print_status "✨ SUI tokens received! New balance: $new_balance_sui SUI"
                else
                    print_warning "Balance still low. Transactions may take a few moments to appear."
                    print_info "You can check your balance later with: sui client balance"
                fi
            fi
        fi
    else
        print_status "✨ SUI balance available: $balance_sui SUI"
        
        # Convert balance to integer for comparison (remove decimals)
        local balance_check=$(echo "$balance_sui * 1000000000" | bc 2>/dev/null | cut -d'.' -f1 || echo "0")
        
        # Ensure balance_check is a valid integer
        balance_check=${balance_check:-0}
        
        if [ "$balance_check" -ge 1000000000 ]; then
            print_status "Excellent balance for contract deployment!"
        elif [ "$balance_check" -ge "$min_balance_threshold" ]; then
            print_status "Good balance for deployment. Should be sufficient for most operations."
        else
            print_warning "Moderate balance. Consider getting more SUI for multiple transactions."
        fi
    fi
}

# Display configuration summary
display_summary() {
    print_step "Configuration Summary"
    
    local current_env=$(sui client active-env 2>/dev/null || echo "unknown")
    local current_address=$(sui client active-address 2>/dev/null || echo "unknown")
    
    # Get balance for summary using the same improved logic
    local summary_balance="0"
    local balance_output=$(sui client balance 2>/dev/null || echo "")
    if echo "$balance_output" | grep -q "SUI"; then
        summary_balance=$(echo "$balance_output" | grep -oE '[0-9]+(\.[0-9]+)?\s*SUI' | grep -oE '[0-9]+(\.[0-9]+)?' | head -1 || echo "0")
    fi
    
    echo
    echo -e "${BOLD}📋 Sui Configuration Summary:${NC}"
    echo "═══════════════════════════════════════"
    echo -e "Environment:  ${GREEN}$current_env${NC}"
    echo -e "Address:      ${GREEN}$current_address${NC}"
    echo -e "Balance:      ${GREEN}$summary_balance SUI${NC}"
    echo -e "RPC URL:      ${GREEN}https://fullnode.testnet.sui.io:443${NC}"
    echo "═══════════════════════════════════════"
    echo
}

# Main setup function
main() {
    print_header
    
    print_info "Starting Sui testnet environment setup for MeltyFi protocol..."
    print_info "This script will configure your Sui CLI for testnet deployment."
    echo
    
    check_prerequisites
    configure_sui_client
    setup_address
    check_balance_and_faucet
    display_summary
    
    print_status "🎉 Sui testnet environment setup complete!"
    print_info ""
    print_info "Next steps:"
    print_info "1. Run the deployment script: ./scripts/deployment.sh"
    print_info "2. Or use the project scripts: npm run deploy:testnet"
    print_info ""
    print_info "For troubleshooting, check the log: $LOG_FILE"
    
    # Save configuration to file
    local config_file="$SCRIPT_DIR/../sui-config.txt"
    cat > "$config_file" << EOF
# Sui Configuration for MeltyFi
Environment: $(sui client active-env 2>/dev/null || echo "unknown")
Address: $(sui client active-address 2>/dev/null || echo "unknown")
Setup Date: $(date)
Log File: $LOG_FILE
EOF
    
    print_info "Configuration saved to: $config_file"
}

# Cleanup function
cleanup() {
    # Remove any temporary files if created
    true
}

# Set cleanup trap
trap cleanup EXIT

# Run main function
main "$@"