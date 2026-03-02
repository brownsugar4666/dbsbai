// Blockchain configuration for BharatVote
// Supports local Hardhat and Polygon Amoy testnet

export const CHAIN_IDS = {
    HARDHAT: 31337,
    POLYGON_AMOY: 80002,
} as const;

export const CHAINS = {
    [CHAIN_IDS.HARDHAT]: {
        name: 'Hardhat Local',
        rpcUrl: 'http://127.0.0.1:8545',
        blockExplorer: '',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    [CHAIN_IDS.POLYGON_AMOY]: {
        name: 'Polygon Amoy Testnet',
        rpcUrl: 'https://rpc-amoy.polygon.technology',
        blockExplorer: 'https://amoy.polygonscan.com',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
        },
    },
} as const;

// Default to local Hardhat for development
export const DEFAULT_CHAIN_ID = CHAIN_IDS.HARDHAT;

// Contract addresses (to be updated after deployment)
export const CONTRACT_ADDRESSES: Record<number, { votingMerkle: string }> = {
    [CHAIN_IDS.HARDHAT]: {
        votingMerkle: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Default Hardhat address
    },
    [CHAIN_IDS.POLYGON_AMOY]: {
        votingMerkle: '', // To be filled after deployment
    },
};

// VotingMerkle Contract ABI
export const VOTING_MERKLE_ABI = [
    // Read functions
    {
        inputs: [],
        name: "admin",
        outputs: [{ type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "latestMerkleRoot",
        outputs: [{ type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "rootCount",
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "electionId", type: "uint256" }],
        name: "getElectionRoot",
        outputs: [{ type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLatestMerkleRoot",
        outputs: [{ type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "electionId", type: "uint256" }],
        name: "getElectionInfo",
        outputs: [
            { name: "root", type: "bytes32" },
            { name: "timestamp", type: "uint256" },
            { name: "exists", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },

    // Write functions
    {
        inputs: [
            { name: "electionId", type: "uint256" },
            { name: "root", type: "bytes32" },
        ],
        name: "submitMerkleRoot",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "electionId", type: "uint256" },
            { name: "voteHash", type: "bytes32" },
            { name: "proof", type: "bytes32[]" },
            { name: "index", type: "uint256" },
        ],
        name: "verifyVote",
        outputs: [{ type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "newAdmin", type: "address" }],
        name: "transferAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },

    // Events
    {
        type: "event",
        name: "MerkleRootSubmitted",
        inputs: [
            { name: "electionId", type: "uint256", indexed: true },
            { name: "root", type: "bytes32", indexed: true },
            { name: "timestamp", type: "uint256", indexed: false },
        ],
    },
    {
        type: "event",
        name: "AdminChanged",
        inputs: [
            { name: "oldAdmin", type: "address", indexed: true },
            { name: "newAdmin", type: "address", indexed: true },
        ],
    },
] as const;
