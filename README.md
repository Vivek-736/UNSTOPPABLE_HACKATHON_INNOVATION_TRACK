<div align="center">
  <img 
    src="public/favicon.png" 
    alt="YieldGuard Logo" 
    width="150" 
    height="150" 
  />
  
  # 🌾 YieldGuard
  
  ### AI-Powered Crop Insurance Platform with Automated Payouts
  
  *Protecting farmers from crop failures through blockchain technology and artificial intelligence*

  [![Next.js](https://img.shields.io/badge/Next.js-15.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=for-the-badge&logo=ethereum)](https://ethereum.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

</div>

---

## 📖 About YieldGuard

**YieldGuard** is a revolutionary decentralized crop insurance platform that combines the transparency of blockchain technology with the intelligence of AI to protect farmers from crop failures. Built for the **UNSTOPPABLE HACKATHON**, YieldGuard automates the entire insurance lifecycle—from policy creation to claim verification and instant payouts.

### 🎯 The Problem

Traditional crop insurance is plagued by:
- ❌ Lengthy claim processing times (weeks to months)
- ❌ Manual verification prone to bias and errors
- ❌ High administrative costs
- ❌ Lack of transparency in decision-making
- ❌ Delayed payouts affecting farmers' livelihoods

### ✨ Our Solution

YieldGuard revolutionizes crop insurance with:
- ✅ **Instant Smart Contract Deployment** - Create policies on-chain in seconds
- ✅ **AI-Powered Claim Verification** - Gemini AI analyzes weather data and crop conditions
- ✅ **Automated Payouts** - Funds transferred immediately upon approval
- ✅ **Complete Transparency** - All decisions explained with detailed analysis
- ✅ **Zero Intermediaries** - Direct farmer-to-contract interaction

---

## 🚀 Key Features

### 🤖 AI-Driven Verification
- **Gemini 2.5 Flash Lite** analyzes claims using real-time weather data
- Comprehensive assessment covering:
  - Weather conditions and anomalies
  - Crop-specific impact analysis
  - Regional climate context
  - Risk factor identification
  - Detailed decision rationale

### ⛓️ Blockchain Integration
- **Ethereum Sepolia Testnet** for secure, transparent transactions
- **Smart Contracts** handle policy creation, claim submission, and payouts
- **Privy Wallet** integration for seamless authentication
- Immutable on-chain records of all policies and claims

### 💰 Automated Payouts
- Claims processed in real-time
- Funds transferred directly to farmer's wallet
- No manual intervention required
- Complete audit trail on blockchain

### 📊 Detailed Analytics
- Weather data integration (OpenWeatherMap API)
- Temperature, rainfall, and anomaly tracking
- Historical climate pattern analysis
- Transparent decision explanations

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.6** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive UI
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications

### Blockchain
- **Ethers.js 6.16** - Ethereum interaction
- **Hardhat** - Smart contract development
- **Solidity** - Smart contract language
- **Privy** - Wallet authentication

### AI & APIs
- **Google Gemini AI** - Claim verification intelligence
- **OpenWeatherMap API** - Real-time weather data
- **Next.js API Routes** - Backend endpoints

### Development Tools
- **ESLint** - Code quality
- **TypeScript** - Type checking
- **Hardhat Toolbox** - Contract testing

---

## 🎮 Usage Guide

### For Farmers

#### 1️⃣ **Connect Your Wallet**
- Click "Connect Wallet" on the homepage
- Authenticate with Privy (supports MetaMask, WalletConnect, etc.)
- Ensure you're on Sepolia testnet

#### 2️⃣ **Create a Policy**
- Navigate to "Register Your Farm"
- Fill in policy details:
  - Crop type (e.g., Wheat, Rice, Cotton)
  - Region (e.g., Punjab, India)
  - Coverage amount (in ETH)
  - Premium amount (in ETH)
  - Duration (in days)
- Submit transaction and pay premium

#### 3️⃣ **Submit a Claim**
- Go to your profile
- Click "Submit Claim" on an active policy
- Describe the crop damage reason
- Click "Verify with AI"

#### 4️⃣ **AI Verification**
- Gemini AI analyzes:
  - Your claim description
  - Current weather conditions
  - Historical climate data
  - Crop-specific vulnerabilities
- Receive instant decision with detailed explanation

#### 5️⃣ **Receive Payout**
- If approved, click "Submit Claim"
- Smart contract automatically transfers coverage amount
- Funds appear in your wallet immediately
- View transaction on Sepolia Etherscan

---

## 🏗️ Smart Contract Architecture

### InsuranceRegistry Contract

**Key Functions:**
- `createPolicy()` - Register new insurance policy
- `submitClaim()` - File claim and trigger automated payout
- `getPoliciesByFarmer()` - Retrieve farmer's policies
- `policies()` - View policy details

**Automated Payout Logic:**
1. Validates policy is active and within coverage period
2. Checks contract has sufficient funds
3. Marks policy as inactive
4. Transfers coverage amount to farmer
5. Updates claim status to "Paid"

---

## 🧠 AI Verification Process

### How It Works

1. **Data Collection**
   - Farmer submits claim with reason
   - System fetches real-time weather data for region
   - Retrieves policy details (crop, region, dates)

2. **AI Analysis**
   - Gemini AI receives comprehensive prompt with:
     - Claim description
     - Weather metrics (temperature, rainfall)
     - Crop type and regional context
     - Policy coverage period
   - AI evaluates severity and validity

3. **Decision Output**
   - **Approve/Reject** decision
   - **Brief reason** (80 words)
   - **Detailed summary** (200 words) covering:
     - Weather conditions observed
     - Impact on specific crop
     - Regional climate context
     - Risk factors identified
     - Final assessment rationale

4. **Transparency**
   - All analysis displayed to farmer
   - Weather data shown with metrics
   - Complete audit trail maintained

---

## 🌟 Project Highlights

### Innovation
- **First-of-its-kind** AI + Blockchain crop insurance
- **Zero manual intervention** in claim processing
- **Sub-minute** payout times vs. weeks in traditional systems

### Impact
- Protects farmers' livelihoods
- Reduces insurance fraud through AI verification
- Eliminates administrative overhead
- Provides financial security during crop failures

### Technical Excellence
- Clean, modular architecture
- Type-safe TypeScript throughout
- Comprehensive error handling
- Responsive, accessible UI
- Production-ready smart contracts

---

## 🔮 Future Enhancements

- [ ] Multi-chain support (Polygon, Arbitrum, Base)
- [ ] Satellite imagery integration for crop health monitoring
- [ ] Parametric insurance triggers (automatic claims)
- [ ] Mobile app (iOS & Android)
- [ ] Multi-language support
- [ ] Integration with agricultural IoT sensors
- [ ] Reinsurance pool for risk distribution
- [ ] Governance token for community decisions

---

## 🙏 Acknowledgments

- **UNSTOPPABLE HACKATHON** - For the opportunity to build this solution
- **Google Gemini** - For powerful AI capabilities
- **Privy** - For seamless wallet authentication
- **OpenWeatherMap** - For reliable weather data
- **Ethereum Foundation** - For blockchain infrastructure

---

## 🌾 Impact Statement

YieldGuard represents more than just a technical solution—it's a commitment to protecting farmers and ensuring food security. By combining cutting-edge AI with blockchain transparency, we're building a future where crop insurance is fair, fast, and accessible to all.

Every claim processed, every payout delivered, and every farmer protected brings us closer to a world where agricultural risk doesn't mean financial ruin.

---

<div align="center">
  
  ### 🌟 Star this repo if you believe in protecting farmers! 🌟
  
  **Made with 💖 by Vivek**
  
</div>