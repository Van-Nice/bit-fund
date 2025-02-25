# 🚀 BitFund - Bitcoin-Powered DeFi Crowdfunding  

BitFund is a **decentralized crowdfunding platform** that enables users to **raise and contribute Bitcoin (sBTC)** using **Stacks smart contracts**.  
https://youtu.be/A6pHdoSxu3M
## 🔥 Why BitFund?  
✅ **Trustless** – Funds are secured via smart contracts.  
✅ **Transparent** – Every transaction is verifiable on-chain.  
✅ **Bitcoin-Native** – Users can **mint BTC to sBTC** for DeFi interactions.  
✅ **No Intermediaries** – Direct sBTC contributions without centralized control.  

## ⚙️ How It Works  

### 1️⃣ Mint BTC to sBTC  
- Users **lock BTC** and mint **1:1 pegged sBTC**.  
- sBTC enables **smart contract interactions** on Stacks.  
- Users can **burn sBTC** to reclaim BTC at any time.  

### 2️⃣ Create a Campaign  
- Users submit **project name, funding goal, deadline**.  
- The **`createCampaign`** smart contract function stores it on-chain.  

### 3️⃣ Contribute to a Campaign  
- Users **invest sBTC** into campaigns via the **`contribute`** function.  
- Transactions are recorded on **Stacks Devnet** and can be verified.  

## 🔗 Smart Contract Integration  
✔ **Clarity-powered** – Immutable & secure funding logic.  
✔ **Key functions:**  
  - `createCampaign` – Stores campaign details on-chain.  
  - `contribute` – Transfers sBTC to campaigns.  
  - *Future:* `withdrawFunds` for campaign owners.  

## 🚀 Roadmap  
- **Enable Wallet Connection** – Use **Leather Wallet** for direct sBTC contributions.  
- **Fetch campaign IDs from DB** *(instead of using random numbers).*  
- **Integrate Smart Contract Functions**:  
  - **Enable Withdrawals** – Fundraisers can withdraw raised sBTC.  
  - **Enable Refunds** – Contributors can reclaim funds if funding fails.  
  - **Implement Milestone-Based Funding** – Funds released in stages based on progress.  

## 💡 Conclusion  
BitFund showcases **Bitcoin-native DeFi crowdfunding** using **sBTC & Stacks**, ensuring **secure, transparent, and trustless** funding. Even in MVP form, it proves that **Bitcoin can go beyond payments and power decentralized applications**.  

---

## 🚀 Getting Started  
working version in succefullpayment branch
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-username/bitfund.git
   cd bitfund

