# Freelance Marketplace with Aptos Smart Contract Integration

A modern, responsive freelance marketplace built with **React**, **TypeScript**, and **TailwindCSS**, integrated with **Aptos blockchain** smart contracts for secure job escrow payments.

---

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX** with TailwindCSS and Framer Motion animations  
- **Responsive Design** optimized for all devices  
- **Dark/Light Theme** toggle with persistent preferences  
- **User Authentication** system with local storage  
- **Job Management** – browse, post, and manage freelance jobs  
- **Freelancer Profiles** with portfolios and reviews  
- **Advanced Filtering** and search functionality  
- **Form Validation** using Formik + Yup  

### 🔗 Blockchain Integration
- **Aptos Smart Contract** integration for job escrow  
- **Wallet Connection** with account creation and import  
- **Secure Job Creation** with escrow payments  
- **Job Completion** and fund release functionality  
- **Real-time Balance** tracking  
- **Transaction History** and verification  

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Aptos CLI (for smart contract deployment)

### Installation

# Clone the repository
git clone <your-repo-url>
cd projectfl

# Install dependencies
npm install

# Start the development server
npm run dev
🔧 Smart Contract Integration
Smart Contract Functions

Integrated with JobEscrow smart contract:

create_job – Create a new job with escrow payment

complete_job – Mark job as complete and release escrow

get_job_info – Retrieve job details from blockchain

Wallet Connection Flow

Connect Wallet – Click "Connect Wallet

projectfl/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # Theme, Auth, Wallet contexts
│   │   ├── data/        # Mock data, interfaces
│   │   ├── pages/       # Pages
│   │   ├── utils/       # Utility functions, Aptos client
│   │   └── main.tsx
├── contract/           # Aptos Move smart contracts
│   └── sources/
│       └── job_escrow.move
├── scripts/            # Deployment scripts
└── package.json
🎯 Key Components

WalletConnect – Wallet connection & management

SmartContractJobForm – Create blockchain-powered jobs

JobCard – Job information display

Layout – App layout & navigation

aptosClient.ts – Blockchain client functions

🌐 Deployment
Frontend

Vercel (recommended)

Netlify

GitHub Pages

Firebase Hosting

# Compile
aptos move compile

# Deploy
aptos move publish

# Update contract address in frontend/src/utils/aptosClient.ts

🔒 Security

Secure private key management

Transaction validation & error handling

Escrow-based payments

Strong input sanitization

📱 Responsive Design

Optimized for:

Desktop – Full feature set

Tablet – Touch-friendly layouts

Mobile – Mobile-first UI

🎨 Customization

TailwindCSS utility-first styling

Custom CSS variables for theming

Environment variables for API & network configs

🤝 Contributing

Fork the repo

Create a feature branch

Commit changes

Add tests if applicable

Submit a PR

📄 License

Licensed under the Apache 2.0 License.

🆘 Support

Check documentation

Review code examples

Open a GitHub issue

🔮 Future Enhancements

Multi-chain support

Milestone-based escrow

Dispute resolution system

Traditional payment method integration

Mobile app

AI-powered job matching

Team Members:

1.Geetham Venkata Siva Sai P-geetamvenkatasiva@gmail.com

2.B.Chaitanya Venkata-chaitanyavenkat24@gmail.com

3.K.Sankar Narayana-ss7272717@gmail.com

