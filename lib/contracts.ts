// WorkspaceFactory Contract Addresses
const MAINNET_ADDRESS = '0x69101CcBFCd921d5d42d10A48C3c99324042739a' as `0x${string}`;
const TESTNET_ADDRESS = (process.env.NEXT_PUBLIC_TESTNET_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

// Use testnet for development, mainnet for production
export const WORKSPACE_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_USE_MAINNET === 'true'
  ? MAINNET_ADDRESS
  : TESTNET_ADDRESS;

export const WORKSPACE_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createWorkspace',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_description', type: 'string' }
    ],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    type: 'function',
    name: 'getUserWorkspaces',
    stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ name: '', type: 'address[]' }]
  },
  {
    type: 'function',
    name: 'getAllWorkspaces',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }]
  },
  {
    type: 'function',
    name: 'getWorkspaceCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'event',
    name: 'WorkspaceCreated',
    inputs: [
      { name: 'workspace', type: 'address', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ]
  }
] as const;

// Workspace Contract ABI (for interacting with individual workspaces)
export const WORKSPACE_ABI = [
  // View functions
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    type: 'function',
    name: 'description',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    type: 'function',
    name: 'treasury',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'taskCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getMembers',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }]
  },
  {
    type: 'function',
    name: 'getMemberCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getBalance',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getTreasuryBalance',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getTask',
    stateMutability: 'view',
    inputs: [{ name: '_taskId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'title', type: 'string' },
          { name: 'descriptionHash', type: 'string' },
          { name: 'creator', type: 'address' },
          { name: 'assignee', type: 'address' },
          { name: 'bounty', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'deliverableLink', type: 'string' }
        ]
      }
    ]
  },
  // Write functions - Task Management
  {
    type: 'function',
    name: 'createTask',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_title', type: 'string' },
      { name: '_descriptionHash', type: 'string' },
      { name: '_bounty', type: 'uint256' },
      { name: '_deadline', type: 'uint256' },
      { name: '_assignee', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'claimTask',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_taskId', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'submitTask',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_taskId', type: 'uint256' },
      { name: '_deliverableLink', type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'approveTask',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_taskId', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'cancelTask',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_taskId', type: 'uint256' }],
    outputs: []
  },
  // Write functions - Member Management
  {
    type: 'function',
    name: 'addMember',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_member', type: 'address' },
      { name: '_name', type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'removeMember',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_member', type: 'address' }],
    outputs: []
  },
  // Write functions - Treasury Management
  {
    type: 'function',
    name: 'withdrawFunds',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'receive',
    stateMutability: 'payable'
  },
  // Events
  {
    type: 'event',
    name: 'TaskCreated',
    inputs: [
      { name: 'taskId', type: 'uint256', indexed: true },
      { name: 'title', type: 'string', indexed: false },
      { name: 'bounty', type: 'uint256', indexed: false },
      { name: 'assignee', type: 'address', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'TaskAssigned',
    inputs: [
      { name: 'taskId', type: 'uint256', indexed: true },
      { name: 'assignee', type: 'address', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'TaskSubmitted',
    inputs: [
      { name: 'taskId', type: 'uint256', indexed: true },
      { name: 'deliverableLink', type: 'string', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'TaskApproved',
    inputs: [
      { name: 'taskId', type: 'uint256', indexed: true },
      { name: 'assignee', type: 'address', indexed: false },
      { name: 'bounty', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'TaskCancelled',
    inputs: [
      { name: 'taskId', type: 'uint256', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'MemberAdded',
    inputs: [
      { name: 'member', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'MemberRemoved',
    inputs: [
      { name: 'member', type: 'address', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'FundsDeposited',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'FundsWithdrawn',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  }
] as const;
