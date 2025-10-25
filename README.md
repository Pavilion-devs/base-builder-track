# TABSY - Onchain Workspace Collaboration Platform

TABSY is a decentralized workspace management platform built on Base blockchain. Create workspaces, manage tasks, track bounties, and execute payments onchain with a beautiful neobrutalist design.

## Features

- **Workspace Management**: Create and manage onchain workspaces with your team
- **Task Lifecycle**: Complete task workflow from creation to approval and automatic payment
- **Treasury System**: Fund workspaces and track locked/available balances
- **Member Management**: Add team members and collaborate onchain
- **Smart Wallet Support**: No seed phrases required with Coinbase Smart Wallet
- **Dual Network Support**: Switch between Base Mainnet and Base Sepolia Testnet

## Live Demo

**Network**: Base Sepolia Testnet
**WorkspaceFactory Contract**: `0xb9D245Fc41e68e54302F05393382C875bc9a913C`

### Get Test Tokens

To test the app, you'll need Base Sepolia ETH:

1. **Coinbase Faucet**: https://portal.cdp.coinbase.com/products/faucet
   - Sign in with Coinbase account
   - Select "Base Sepolia" network
   - Paste your wallet address
   - Claim 0.1 ETH (once per 24 hours)

2. **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia
   - Sign in with Alchemy account
   - Select "Base Sepolia"
   - Paste your wallet address
   - Claim test ETH

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS v4
- **Blockchain**: Base (Mainnet & Sepolia Testnet)
- **Web3**: OnchainKit, Wagmi v2, Viem v2
- **Smart Contracts**: Solidity
- **Design**: Neobrutalism (8px borders, brutal shadows, rounded corners)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Coinbase Wallet or MetaMask

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tabsy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
# Network Configuration (false = Base Sepolia Testnet, true = Base Mainnet)
NEXT_PUBLIC_USE_MAINNET=false

# Contract Addresses
NEXT_PUBLIC_MAINNET_FACTORY_ADDRESS=0x69101CcBFCd921d5d42d10A48C3c99324042739a
NEXT_PUBLIC_TESTNET_FACTORY_ADDRESS=0xb9D245Fc41e68e54302F05393382C875bc9a913C

# OnchainKit API Key (get from https://portal.cdp.coinbase.com/)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

1. **Connect Wallet**: Click "Connect Wallet" and connect with Coinbase Wallet or MetaMask
2. **Get Test ETH**: Use one of the faucets above to get Base Sepolia ETH
3. **Create Workspace**: Click "New Workspace" to create your first onchain workspace
4. **Fund Treasury**: Add funds to your workspace treasury to create tasks with bounties
5. **Create Tasks**: Create tasks with bounties and collaborate with your team

## How to Use

### Creating a Workspace

1. Click "New Workspace" on the dashboard
2. Enter workspace name and description
3. Confirm the blockchain transaction
4. Your workspace is now live onchain

### Managing Tasks

**Create a Task**:
1. Open your workspace
2. Click "New Task"
3. Fill in title, description, bounty, and deadline
4. Confirm transaction (bounty will be locked from treasury)

**Task Lifecycle**:
- **Open**: Task created and available to claim
- **In Progress**: Someone claimed the task
- **Submitted**: Work delivered and awaiting approval
- **Completed**: Approved and bounty paid automatically
- **Cancelled**: Task cancelled and bounty returned to treasury

### Managing Treasury

- **Fund Treasury**: Click "Fund Treasury" to add ETH
- **View Balances**:
  - Available Balance: Can be used for new tasks
  - Locked in Tasks: Reserved for active task bounties
  - Total Balance: Available + Locked
- **Withdraw Funds**: Owner can withdraw available (unlocked) funds

### Managing Members

1. Go to "Members" page in your workspace
2. Click "Add Member"
3. Enter member's wallet address and name
4. Confirm transaction

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_USE_MAINNET=false`
   - `NEXT_PUBLIC_MAINNET_FACTORY_ADDRESS=0x69101CcBFCd921d5d42d10A48C3c99324042739a`
   - `NEXT_PUBLIC_TESTNET_FACTORY_ADDRESS=0xb9D245Fc41e68e54302F05393382C875bc9a913C`
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables via dashboard or CLI:
```bash
vercel env add NEXT_PUBLIC_USE_MAINNET
vercel env add NEXT_PUBLIC_MAINNET_FACTORY_ADDRESS
vercel env add NEXT_PUBLIC_TESTNET_FACTORY_ADDRESS
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY
```

5. Deploy to production:
```bash
vercel --prod
```

### Important Notes

- Use `NEXT_PUBLIC_USE_MAINNET=false` for testnet (recommended for testing)
- Use `NEXT_PUBLIC_USE_MAINNET=true` for mainnet (production only)
- Make sure to get your OnchainKit API key from https://portal.cdp.coinbase.com/

## Smart Contracts

### WorkspaceFactory

Deployed at:
- **Base Mainnet**: `0x69101CcBFCd921d5d42d10A48C3c99324042739a`
- **Base Sepolia**: `0xb9D245Fc41e68e54302F05393382C875bc9a913C`

Functions:
- `createWorkspace(name, description)`: Deploy a new workspace
- `getUserWorkspaces(user)`: Get all workspaces owned by a user
- `getAllWorkspaces()`: Get all deployed workspaces

### Workspace Contract

Each workspace is an individual smart contract with:

**Task Management**:
- `createTask()`: Create a new task with bounty
- `claimTask()`: Claim an open task
- `submitTask()`: Submit work for review
- `approveTask()`: Approve and release payment
- `cancelTask()`: Cancel task and return bounty

**Member Management**:
- `addMember()`: Add team member
- `removeMember()`: Remove team member
- `getMembers()`: Get all members

**Treasury**:
- `receive()`: Accept ETH deposits
- `withdrawFunds()`: Withdraw available funds (owner only)
- `treasury`: View available balance
- `getBalance()`: View total balance

## Project Structure

```
tabsy/
├── app/                        # Next.js app directory
│   ├── page.tsx               # Landing page
│   ├── dashboard/             # Dashboard pages
│   └── workspace/[id]/        # Workspace pages
├── components/
│   ├── ui/                    # UI components
│   └── workspace/             # Workspace components
├── lib/
│   ├── contracts.ts           # Smart contract ABIs
│   ├── providers.tsx          # Web3 providers
│   └── hooks/                 # Custom React hooks
└── public/                    # Static assets
```

## Key Hooks

- `useUserWorkspaces()`: Fetch user's workspaces
- `useWorkspaceTasks()`: Fetch workspace tasks
- `useCreateTask()`: Create new tasks
- `useClaimTask()`: Claim tasks
- `useSubmitTask()`: Submit deliverables
- `useApproveTask()`: Approve tasks
- `useFundTreasury()`: Fund workspace treasury
- `useAddMember()`: Add team members

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the Base documentation: https://docs.base.org
- OnchainKit docs: https://onchainkit.xyz

---

Built with ❤️ on Base
