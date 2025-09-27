# 🍫 MeltyFi Protocol - Sweet NFT Liquidity on Sui

> **Making the Illiquid Liquid** - Transform your NFTs into instant liquidity through innovative lottery mechanics on Sui blockchain.

[![Sui Network](https://img.shields.io/badge/Sui-Testnet-blue)](https://sui.io)
[![Move Language](https://img.shields.io/badge/Move-Smart_Contracts-green)](https://move-language.github.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 **What is MeltyFi?**

MeltyFi is a revolutionary DeFi protocol that solves NFT liquidity through gamified lending. Inspired by Willy Wonka's chocolate factory, our protocol creates win-win scenarios where:

- **NFT Owners** get instant liquidity by creating lotteries with their NFTs as prizes
- **Lenders** fund these lotteries by purchasing "WonkaBars" (lottery tickets) for a chance to win valuable NFTs
- **Everyone** earns ChocoChip rewards regardless of lottery outcomes

### 🏗️ **Protocol Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NFT Owner     │    │    Lenders      │    │   Protocol      │
│                 │    │                 │    │                 │
│ 1. Deposits NFT │───▶│ 2. Buy WonkaBars│───▶│ 3. Manages      │
│ 2. Gets 95% SUI │◀───│ 3. Get chance   │    │    Lottery      │
│ 3. Can repay to │    │    to win NFT   │    │ 4. Distributes  │
│    reclaim NFT  │    │ 4. Earn CHOC    │    │    rewards      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start**

### Prerequisites

- **Node.js** v18 or higher
- **Sui CLI** installed and configured
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/VincenzoImp/MeltyFi.git
cd MeltyFi

# Install all dependencies
npm run install:all

# Set up Sui testnet environment
npm run setup:testnet
# OR manually: ./scripts/sui_setup.sh
```

### Development Setup

```bash
# Validate environment
npm run validate:testnet

# Build Move contracts
npm run build:contracts

# Run contract tests
npm run test:contracts

# Deploy to testnet
npm run deploy:full

# Start frontend development server
npm run dev:frontend
```

### Environment Configuration

Create `.env` file in the root directory:

```env
# Sui Network Configuration - TESTNET
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PRIVATE_KEY=your_private_key_here

# Contract Addresses (filled after deployment)
NEXT_PUBLIC_MELTYFI_PACKAGE_ID=0x...
NEXT_PUBLIC_CHOCO_CHIP_TYPE=0x...::choco_chip::CHOCO_CHIP
NEXT_PUBLIC_WONKA_BARS_TYPE=0x...::wonka_bars::WonkaBars

# Application Configuration
NEXT_PUBLIC_APP_NAME=MeltyFi
NEXT_PUBLIC_APP_DESCRIPTION=Making the illiquid liquid
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
NETWORK=testnet
```

## 🧪 **Testnet Setup**

### Get Testnet SUI Tokens

You'll need testnet SUI to deploy contracts and interact with the protocol:

1. **Web Faucet (Recommended)**:
   - Visit: [https://faucet.testnet.sui.io](https://faucet.testnet.sui.io)
   - Enter your Sui address
   - Complete captcha and request tokens

2. **Discord Faucet**:
   - Join [Sui Discord](https://discord.gg/sui)
   - Go to `#testnet-faucet` channel
   - Use command: `!faucet YOUR_ADDRESS`

3. **CLI Faucet**:
   ```bash
   sui client faucet
   ```

### Verify Testnet Configuration

```bash
# Check current environment
sui client active-env
# Should show: testnet

# Check balance
sui client balance

# Validate entire setup
npm run validate:testnet
```

## 📚 **Technical Documentation**

### **Testnet Resources**
- 🚰 [Testnet Faucet](https://faucet.testnet.sui.io)
- 🔍 [Testnet Explorer](https://suiexplorer.com/?network=testnet)
- 📖 [Sui Testnet Guide](https://docs.sui.io/guides/developer/getting-started/sui-environment)

## ⚖️ **Legal & Disclaimers**

### **License**
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

### **Testnet Disclaimers**
- **Testnet Environment**: This deployment is for testing purposes only
- **No Real Value**: Testnet tokens have no monetary value
- **Experimental Software**: Use at your own risk for testing
- **Data Reset**: Testnet data may be reset at any time
- **No Guarantees**: No guarantees of data persistence or availability

### **Important Notes**
- **Testnet Only**: Do not use real assets or mainnet tokens
- **Educational Purpose**: Designed for learning and testing
- **Community Project**: Open source and community-driven
- **Active Development**: Features and functionality may change

### **Risk Factors**
- Smart contract bugs in testnet environment
- Testnet network instability
- Potential data loss during resets
- UI/UX improvements in progress

## 🍫 **Sweet Success on Testnet**

> *"Testing MeltyFi on testnet helped me understand how NFT liquidity works before risking real assets. The lottery mechanism is brilliant!"* - **Beta Tester**

> *"The testnet environment is perfect for experimenting with different lottery strategies. Can't wait for mainnet!"* - **Community Developer**

## 🚀 **Ready to Test?**

### **Quick Start Checklist**

1. **✅ Install Prerequisites**
   ```bash
   # Check if you have Node.js and Sui CLI
   node --version  # Should be v18+
   sui --version   # Should be latest
   ```

2. **✅ Clone and Setup**
   ```bash
   git clone https://github.com/VincenzoImp/MeltyFi.git
   cd MeltyFi
   npm run install:all
   ```

3. **✅ Configure Testnet**
   ```bash
   npm run setup:testnet
   npm run validate:testnet
   ```

4. **✅ Get Testnet Tokens**
   - Visit: [https://faucet.testnet.sui.io](https://faucet.testnet.sui.io)
   - Request testnet SUI for your address

5. **✅ Deploy and Test**
   ```bash
   npm run deploy:full
   npm run dev:frontend
   ```

### **Testing Scenarios**

Try these scenarios on testnet:

1. **📝 Create Your First Lottery**
   - Upload a test NFT
   - Set competitive pricing
   - Watch participants join

2. **🎫 Buy WonkaBars**
   - Browse active lotteries
   - Purchase lottery tickets
   - Track your chances

3. **🏆 Experience Wins/Losses**
   - Win NFTs through lotteries
   - Earn ChocoChip rewards
   - Claim refunds when lotteries are cancelled

4. **💰 Test Loan Repayment**
   - Create a lottery with your NFT
   - Repay the loan before expiration
   - Get your NFT back

### **Feedback & Contributions**

We're actively developing on testnet and value your feedback:

- **🐛 Report Bugs**: [GitHub Issues](https://github.com/VincenzoImp/MeltyFi/issues)
- **💡 Suggest Features**: [Discord Discussions](https://discord.gg/meltyfi)
- **🔧 Contribute Code**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **📝 Improve Docs**: Help us improve documentation

### **What's Next?**

- **Comprehensive Testing**: Help us test all features thoroughly
- **Community Feedback**: Share your experience and suggestions
- **Security Preparation**: Prepare for professional security audits
- **Mainnet Launch**: Target mainnet deployment after thorough testing

---

## 📋 **Troubleshooting**

### **Common Issues**

**❓ "Sui CLI not found"**
```bash
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

**❓ "Not connected to testnet"**
```bash
# Switch to testnet
sui client switch --env testnet
# Or create testnet environment
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
```

**❓ "No SUI balance"**
```bash
# Get testnet SUI
curl -X POST https://faucet.testnet.sui.io \
  -H "Content-Type: application/json" \
  -d '{"FixedAmountRequest":{"recipient":"YOUR_ADDRESS"}}'
```

**❓ "Frontend not connecting to contracts"**
```bash
# Check environment variables
npm run check:env
# Update .env with deployed contract addresses
```

**❓ "Move compilation errors"**
```bash
# Fix Move configuration
npm run fix:move-config
# Clean and rebuild
cd contracts/meltyfi && rm -rf build && sui move build
```

### **Getting Help**

If you encounter issues:

1. **Check Logs**: Look at `deployment.log` and `build.log`
2. **Validate Setup**: Run `npm run validate:testnet`
3. **Ask Community**: Join our [Discord](https://discord.gg/meltyfi)
4. **Report Issues**: Create a [GitHub Issue](https://github.com/VincenzoImp/MeltyFi/issues)

---

**Ready to turn your NFTs into liquid gold on testnet? Join the sweetest DeFi testing experience on Sui!** 🍫✨

[**🚀 Start Testing**](https://github.com/VincenzoImp/MeltyFi) | [**📖 Read Docs**](https://docs.meltyfi.com) | [**💬 Join Discord**](https://discord.gg/meltyfi) | [**🚰 Get Testnet SUI**](https://faucet.testnet.sui.io)Smart Contract Architecture**

#### **Core Modules**

1. **`meltyfi_core.move`** - Main protocol logic
   - Lottery creation and management
   - Fund distribution and escrow
   - Winner selection using Sui's randomness
   - Protocol fee collection

2. **`choco_chip.move`** - Governance & Reward Token
   - ERC-20 compatible token on Sui
   - Minting for lottery participants
   - Factory pattern for controlled minting

3. **`wonka_bars.move`** - Lottery Ticket NFTs
   - Non-fungible lottery tickets
   - Batch operations (split/merge)
   - Rich metadata for display

#### **Key Data Structures**

```move
// Core protocol state
struct Protocol has key {
    id: UID,
    admin: address,
    total_lotteries: u64,
    treasury: Balance<SUI>,
    active_lotteries: vector<ID>,
}

// Individual lottery instance
struct Lottery has key {
    id: UID,
    lottery_id: u64,
    owner: address,
    state: u8, // ACTIVE, CANCELLED, CONCLUDED
    expiration_date: u64,
    wonkabar_price: u64,
    max_supply: u64,
    sold_count: u64,
    winner: Option<address>,
    funds: Balance<SUI>,
    participants: Table<address, u64>,
}
```

### **Frontend Architecture**

#### **Technology Stack**
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom theme
- **Blockchain**: Sui dApp Kit for wallet integration
- **State**: React Query for server state management
- **UI Components**: Radix UI primitives

#### **Key Components**

```typescript
// Main hook for protocol interaction
const {
  createLottery,     // Create new lottery
  buyWonkaBars,      // Purchase lottery tickets
  redeemWonkaBars,   // Claim winnings/refunds
  lotteries,         // All active lotteries
  userWonkaBars,     // User's tickets
  userBalance,       // SUI balance
} = useMeltyFi()
```

## 🔧 **Protocol Mechanics**

### **Lottery Creation Process**

1. **NFT Deposit**: User deposits valuable NFT as collateral
2. **Parameter Setting**: 
   - WonkaBar price (minimum bid per ticket)
   - Maximum supply (total tickets available)
   - Duration (lottery lifetime)
3. **Immediate Liquidity**: User receives 95% of potential funds upfront
4. **Listing**: Lottery becomes publicly available

### **Economic Model**

```
Revenue Streams:
├── Protocol Fees (5% of all transactions)
├── ChocoChip Token Utility
└── Premium Features (future)

Token Distribution:
├── 60% - Community Rewards
├── 20% - Team & Development
├── 15% - Ecosystem Growth
└── 5% - Protocol Treasury
```

## 🚀 **Deployment Guide**

### **Automated Deployment**

```bash
# One-command deployment to testnet
npm run deploy:full
# OR
./scripts/deployment.sh
```

This script will:
1. ✅ Check prerequisites (Sui CLI, Node.js)
2. ✅ Set up Sui testnet environment and addresses
3. ✅ Install all dependencies
4. ✅ Build and test Move contracts
5. ✅ Deploy contracts to testnet
6. ✅ Update environment variables
7. ✅ Test frontend build

### **Manual Deployment Steps**

```bash
# 1. Setup testnet environment
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet

# 2. Get testnet SUI
# Visit: https://faucet.testnet.sui.io

# 3. Build contracts
cd contracts/meltyfi
sui move build

# 4. Run tests
sui move test

# 5. Deploy to testnet
sui client publish --gas-budget 100000000

# 6. Update frontend configuration
# Copy package ID to .env file

# 7. Build frontend
cd ../../frontend
npm run build
```

### **Deployment Verification**

After deployment, verify on **Sui Testnet Explorer**:
- [ ] Contracts deployed successfully
- [ ] Package ID updated in frontend
- [ ] Frontend builds without errors
- [ ] Wallet integration works
- [ ] Basic transactions functional

**Explorer URLs:**
- **Transaction**: `https://suiexplorer.com/txblock/{TRANSACTION_ID}?network=testnet`
- **Package**: `https://suiexplorer.com/object/{PACKAGE_ID}?network=testnet`

## 🧪 **Testing**

### **Smart Contract Tests**

```bash
# Run all Move tests
npm run test:contracts

# Run specific test module
cd contracts/meltyfi
sui move test --filter meltyfi_tests
```

**Test Coverage:**
- ✅ Lottery creation
- ✅ WonkaBar purchases
- ✅ Winner selection
- ✅ Redemption flows
- ⚠️ Edge cases (limited)

### **Frontend Tests**

```bash
# Run frontend tests
cd frontend
npm test
```

## 🛡️ **Security Features**

### **Smart Contract Security**
- **Randomness**: Uses Sui's native randomness for fair winner selection
- **Escrow**: Funds held in protocol-controlled accounts
- **Time Locks**: Prevents premature lottery resolution
- **Access Control**: Role-based permissions for admin functions

### **Testnet Safety**
- **Isolated Environment**: No real value at risk
- **Free Tokens**: Testnet SUI has no monetary value
- **Reset Capability**: Environment can be reset if needed
- **Monitoring**: All transactions are publicly viewable

### **Audit Status**
⚠️ **TESTNET DEPLOYMENT**: This is experimental software on testnet. Use only for testing purposes.

## 📊 **Available Commands**

### **Environment Setup**
```bash
npm run setup:testnet        # Setup Sui testnet environment
npm run validate:testnet     # Validate testnet configuration
npm run switch:testnet       # Switch to testnet environment
npm run balance             # Check SUI balance
npm run faucet              # Show faucet information
```

### **Development**
```bash
npm run build:contracts     # Build Move contracts
npm run test:contracts      # Run contract tests
npm run deploy:testnet      # Deploy to testnet
npm run deploy:full         # Full deployment with setup
npm run dev:frontend        # Start frontend dev server
npm run build:frontend      # Build frontend for production
```

### **Utilities**
```bash
npm run check:env          # Check environment configuration
npm run clean              # Clean node_modules
npm run fix:move-config    # Fix Move.toml configuration
```

## 🛣️ **Roadmap**

### **Phase 1: Testnet Launch** ✅
- [x] Core protocol on testnet
- [x] Basic lottery mechanics
- [x] NFT collateral system
- [x] WonkaBar ticket system
- [x] ChocoChip rewards

### **Phase 2: Testnet Optimization** 🚧
- [ ] Enhanced testing suite
- [ ] Gas optimization
- [ ] UI/UX improvements
- [ ] Security audits

### **Phase 3: Mainnet Preparation** 📋
- [ ] Comprehensive security audit
- [ ] Mainnet deployment
- [ ] Advanced lottery types
- [ ] Cross-collection support

### **Phase 4: Ecosystem Growth** 🔮
- [ ] Mobile application
- [ ] DAO governance
- [ ] Third-party integrations
- [ ] Educational platform

## 📞 **Support & Community**

### **Get Help**
- 📚 [Documentation](https://docs.meltyfi.com)
- 💬 [Discord Community](https://discord.gg/meltyfi)
- 🐦 [Twitter Updates](https://twitter.com/meltyfi)
- 🐛 [GitHub Issues](https://github.com/VincenzoImp/MeltyFi/issues)

### **