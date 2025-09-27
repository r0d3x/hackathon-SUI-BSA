#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    error "jq is not installed. Please install it first:"
    echo "  macOS: brew install jq"
    echo "  Ubuntu/Debian: sudo apt-get install jq"
    exit 1
fi

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    error "Sui CLI is not installed. Please install it from: https://docs.sui.io/build/install"
    exit 1
fi

# Get active environment
ACTIVE_ENV=$(sui client active-env 2>/dev/null)
log "Active environment: $ACTIVE_ENV"

# Get active address
ACTIVE_ADDRESS=$(sui client active-address 2>/dev/null)
log "Active address: $ACTIVE_ADDRESS"

# Check balance
BALANCE=$(sui client gas --json 2>/dev/null | jq -r '.[0].mistBalance // 0')
log "Current balance: $BALANCE MIST"

if [ "$BALANCE" -lt 100000000 ]; then
    warning "Low balance. You may need more SUI for deployment."
    echo "Get testnet SUI: https://faucet.testnet.sui.io"
fi

# Navigate to contracts directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../contracts/meltyfi" || exit 1

log "Building Move package..."
sui move build 2>&1 | tee build.log

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    error "Build failed. Check build.log for details."
    exit 1
fi

log "Publishing Move package..."

# Capture the full output
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 --json 2>&1)
DEPLOY_STATUS=$?

# Save raw output for debugging
echo "$DEPLOY_OUTPUT" > deployment_output.json

# Check if deployment was successful
if [ $DEPLOY_STATUS -ne 0 ]; then
    error "Deployment command failed with status: $DEPLOY_STATUS"
    cat deployment_output.json
    exit 1
fi

# Extract JSON: Find the line that starts with '{' and take everything from there
JSON_START_LINE=$(grep -n "^{" deployment_output.json | head -1 | cut -d: -f1)

if [ -z "$JSON_START_LINE" ]; then
    error "Could not find JSON start in output"
    cat deployment_output.json
    exit 1
fi

# Extract from JSON start to end of file
JSON_OUTPUT=$(tail -n +${JSON_START_LINE} deployment_output.json)

# Validate JSON
if ! echo "$JSON_OUTPUT" | jq empty 2>/dev/null; then
    error "Failed to parse JSON output"
    echo "=== Attempted JSON (from line $JSON_START_LINE) ==="
    echo "$JSON_OUTPUT" | head -20
    echo "==================="
    exit 1
fi

# Extract package ID
PACKAGE_ID=$(echo "$JSON_OUTPUT" | jq -r '.objectChanges[]? | select(.type == "published") | .packageId' 2>/dev/null)

# Validate package ID
if [ -z "$PACKAGE_ID" ] || [ "$PACKAGE_ID" == "null" ]; then
    error "Failed to extract package ID from deployment output"
    echo "=== JSON Output ==="
    echo "$JSON_OUTPUT" | jq . 2>/dev/null || echo "$JSON_OUTPUT"
    echo "==================="
    exit 1
fi

log "Package deployed successfully!"
log "Package ID: $PACKAGE_ID"

# Extract other important object IDs
ADMIN_CAP=$(echo "$JSON_OUTPUT" | jq -r '.objectChanges[]? | select(.objectType | contains("AdminCap")) | .objectId' 2>/dev/null)
PROTOCOL=$(echo "$JSON_OUTPUT" | jq -r '.objectChanges[]? | select(.objectType | contains("Protocol")) | .objectId' 2>/dev/null)
CHOCOLATE_FACTORY=$(echo "$JSON_OUTPUT" | jq -r '.objectChanges[]? | select(.objectType | contains("ChocolateFactory")) | .objectId' 2>/dev/null)
FACTORY_ADMIN=$(echo "$JSON_OUTPUT" | jq -r '.objectChanges[]? | select(.objectType | contains("FactoryAdmin")) | .objectId' 2>/dev/null)
UPGRADE_CAP=$(echo "$JSON_OUTPUT" | jq -r '.objectChanges[]? | select(.objectType | contains("UpgradeCap")) | .objectId' 2>/dev/null)
COIN_METADATA=$(echo "$JSON_OUTPUT" | jq -r '.objectChanges[]? | select(.objectType | contains("CoinMetadata")) | .objectId' 2>/dev/null)

# Create deployment info file
cat > deployment_info.json <<EOF
{
  "network": "$ACTIVE_ENV",
  "deployer": "$ACTIVE_ADDRESS",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "packageId": "$PACKAGE_ID",
  "objects": {
    "adminCap": "$ADMIN_CAP",
    "protocol": "$PROTOCOL",
    "chocolateFactory": "$CHOCOLATE_FACTORY",
    "factoryAdmin": "$FACTORY_ADMIN",
    "upgradeCap": "$UPGRADE_CAP",
    "coinMetadata": "$COIN_METADATA"
  }
}
EOF

log "Deployment info saved to: deployment_info.json"

# Update environment files
log "Updating environment files..."

# Navigate back to project root
cd "$SCRIPT_DIR/.."

# Create/update frontend .env.local
FRONTEND_ENV="$SCRIPT_DIR/../frontend/.env.local"
cat > "$FRONTEND_ENV" <<EOF
# =============================================================================
# MeltyFi Protocol Configuration
# Auto-generated on $(date)
# =============================================================================

# Network Configuration
NEXT_PUBLIC_SUI_NETWORK=$ACTIVE_ENV
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses
NEXT_PUBLIC_MELTYFI_PACKAGE_ID=$PACKAGE_ID
NEXT_PUBLIC_PROTOCOL_OBJECT_ID=$PROTOCOL
NEXT_PUBLIC_CHOCOLATE_FACTORY_ID=$CHOCOLATE_FACTORY

# Token Types
NEXT_PUBLIC_CHOCO_CHIP_TYPE=${PACKAGE_ID}::choco_chip::CHOCO_CHIP
NEXT_PUBLIC_WONKA_BAR_TYPE=${PACKAGE_ID}::wonka_bars::WonkaBars

# Admin Capabilities (for admin features)
NEXT_PUBLIC_ADMIN_CAP_ID=$ADMIN_CAP
NEXT_PUBLIC_FACTORY_ADMIN_ID=$FACTORY_ADMIN
NEXT_PUBLIC_UPGRADE_CAP_ID=$UPGRADE_CAP

# Deployment Info
DEPLOYMENT_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DEPLOYED_BY=$ACTIVE_ADDRESS
EOF

log "Frontend .env.local updated"

# Also create/update root .env if needed
ROOT_ENV="$SCRIPT_DIR/../.env"
if [ ! -f "$ROOT_ENV" ] || grep -q "NEXT_PUBLIC_MELTYFI_PACKAGE_ID=0x" "$ROOT_ENV" 2>/dev/null; then
    cp "$FRONTEND_ENV" "$ROOT_ENV"
    log "Root .env updated"
fi

# Create .env.example for reference
ENV_EXAMPLE="$SCRIPT_DIR/../frontend/.env.example"
cat > "$ENV_EXAMPLE" <<EOF
# Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses (replace with your deployed values)
NEXT_PUBLIC_MELTYFI_PACKAGE_ID=0x...
NEXT_PUBLIC_PROTOCOL_OBJECT_ID=0x...
NEXT_PUBLIC_CHOCOLATE_FACTORY_ID=0x...

# Token Types
NEXT_PUBLIC_CHOCO_CHIP_TYPE=PACKAGE_ID::choco_chip::CHOCO_CHIP
NEXT_PUBLIC_WONKA_BAR_TYPE=PACKAGE_ID::wonka_bars::WonkaBars

# Admin Capabilities
NEXT_PUBLIC_ADMIN_CAP_ID=0x...
NEXT_PUBLIC_FACTORY_ADMIN_ID=0x...
NEXT_PUBLIC_UPGRADE_CAP_ID=0x...
EOF

log ".env.example created"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                         🎉 DEPLOYMENT SUCCESSFUL 🎉                        ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Network:${NC}          $ACTIVE_ENV"
echo -e "${BLUE}Deployer:${NC}         $ACTIVE_ADDRESS"
echo ""
echo -e "${GREEN}📦 Package ID:${NC}"
echo "   $PACKAGE_ID"
echo ""
echo -e "${GREEN}🔑 Admin Cap:${NC}         $ADMIN_CAP"
echo -e "${GREEN}🏛️  Protocol:${NC}          $PROTOCOL"
echo -e "${GREEN}🍫 Chocolate Factory:${NC} $CHOCOLATE_FACTORY"
echo -e "${GREEN}👤 Factory Admin:${NC}     $FACTORY_ADMIN"
echo -e "${GREEN}⬆️  Upgrade Cap:${NC}       $UPGRADE_CAP"
echo -e "${GREEN}🪙 Coin Metadata:${NC}     $COIN_METADATA"
echo ""
echo -e "${BLUE}🔗 View on Explorer:${NC}"
echo "   https://suiscan.xyz/$ACTIVE_ENV/object/$PACKAGE_ID"
echo ""
echo -e "${GREEN}✅ Environment files automatically updated:${NC}"
echo "   - frontend/.env.local"
echo "   - .env (root)"
echo "   - frontend/.env.example"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Restart your frontend: npm run dev:frontend"
echo "   2. Connect your wallet to testnet"
echo "   3. Start testing the application!"
echo ""