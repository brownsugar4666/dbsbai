# BharatVote

**Decentralized AI-Assisted Voting System Prototype**

A secure, transparent, and verifiable electronic voting prototype for India, built on blockchain technology with advanced AI fraud detection.

![BharatVote](https://img.shields.io/badge/Status-Prototype-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🏛 Overview

BharatVote demonstrates the future of elections with:
- **Blockchain-backed integrity** - Every vote is cryptographically secured
- **AI fraud detection** - Real-time anomaly detection using multiple algorithms
- **Zero-Knowledge inspired privacy** - Vote without revealing identity
- **Government-style UI** - Familiar interface inspired by Indian government portals

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install frontend dependencies:**
```bash
cd frontend
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open** http://localhost:5173 in your browser

### Optional: Run Local Blockchain

```bash
cd contracts
npm install
npm run node        # Start Hardhat node in one terminal
npm run deploy:local # Deploy contract in another terminal
```

## 📁 Project Structure

```
DCVS_IND/
├── frontend/           # React + Vite + TypeScript app
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   ├── ai/         # Fraud detection algorithms
│   │   ├── blockchain/ # Smart contract integration
│   │   └── lib/        # Utilities and state management
│   └── ...
├── contracts/          # Hardhat + Solidity
│   ├── contracts/      # Smart contracts
│   ├── scripts/        # Deployment scripts
│   └── test/           # Contract tests
└── docs/               # Documentation
```

## 🎯 Features

### Voter Registration
- Simple form with name, ID, DOB, phone
- Simulated OTP verification
- ZK token generation for privacy

### Vote Casting
- Candidate selection interface
- Encrypted ballot submission
- Blockchain transaction recording

### Vote Verification
- Receipt-based vote lookup
- Merkle proof verification
- Blockchain transaction tracking

### AI Fraud Detection
| Algorithm | Purpose |
|-----------|---------|
| **Isolation Forest** | Detect outlier voting patterns |
| **LSTM Autoencoder** | Time-series spike detection |
| **KDE** | Distribution anomaly analysis |

### Admin Dashboard
- Real-time monitoring
- Anomaly alerts
- Election statistics

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript + TailwindCSS |
| State | Zustand with localStorage persistence |
| Blockchain | Solidity + Hardhat + ethers.js |
| AI | Pure TypeScript (no external APIs) |
| Charts | Recharts |
| Icons | Lucide React |

## 📦 Scripts

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

### Contracts
```bash
npm run compile       # Compile contracts
npm run test          # Run tests
npm run node          # Start local node
npm run deploy:local  # Deploy to local
npm run deploy:amoy   # Deploy to Polygon Amoy
```

## 🔒 Security Notes

> ⚠️ **This is a prototype for demonstration purposes only.**

- No real personal data is collected or stored
- OTP verification is simulated
- Cryptographic functions are simplified
- Not audited for production use

## 🎨 UI Pages

1. **Home** - Landing page with features overview
2. **Register** - Voter registration flow
3. **Vote** - Ballot casting interface
4. **Verify** - Vote verification portal
5. **Results** - Election results dashboard
6. **Admin** - AI monitoring dashboard

## 🤝 Contributing

This is a prototype project. For production use, please consult with election security experts and conduct thorough audits.

## 📄 License

MIT License - See LICENSE file for details.

---

**Made with ❤️ for India's democratic future**
