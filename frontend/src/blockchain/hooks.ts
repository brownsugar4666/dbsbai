// Extend Window interface for ethereum
declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
            on: (event: string, handler: (...args: unknown[]) => void) => void;
            removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
        };
    }
}

/**
 * Blockchain hooks for interacting with the VotingMerkle contract
 * Uses ethers.js for simplicity (no wagmi dependency for this prototype)
 */

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { VOTING_MERKLE_ABI, CONTRACT_ADDRESSES, CHAINS } from './config';

// Types
interface ContractState {
    connected: boolean;
    address: string | null;
    chainId: number | null;
    error: string | null;
}

interface ElectionInfo {
    root: string;
    timestamp: number;
    exists: boolean;
}

/**
 * Hook for managing wallet connection
 */
export function useWallet() {
    const [state, setState] = useState<ContractState>({
        connected: false,
        address: null,
        chainId: null,
        error: null,
    });

    const connect = useCallback(async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('Please install MetaMask to use blockchain features');
            }

            const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
            const accounts = await provider.send('eth_requestAccounts', []);
            const network = await provider.getNetwork();

            setState({
                connected: true,
                address: accounts[0],
                chainId: Number(network.chainId),
                error: null,
            });

            return { provider, address: accounts[0] };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
            setState(prev => ({ ...prev, error: errorMessage }));
            throw error;
        }
    }, []);

    const disconnect = useCallback(() => {
        setState({
            connected: false,
            address: null,
            chainId: null,
            error: null,
        });
    }, []);

    return { ...state, connect, disconnect };
}

/**
 * Hook for interacting with VotingMerkle contract
 */
export function useVotingMerkle() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getContract = useCallback(async (needsSigner = false) => {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask not installed');
        }

        const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        const addresses = CONTRACT_ADDRESSES[chainId];
        if (!addresses?.votingMerkle) {
            throw new Error(`Contract not deployed on chain ${chainId}`);
        }

        if (needsSigner) {
            const signer = await provider.getSigner();
            return new ethers.Contract(addresses.votingMerkle, VOTING_MERKLE_ABI, signer);
        }

        return new ethers.Contract(addresses.votingMerkle, VOTING_MERKLE_ABI, provider);
    }, []);

    const getLatestMerkleRoot = useCallback(async (): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            const root = await contract.getLatestMerkleRoot();
            return root;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    const getElectionInfo = useCallback(async (electionId: number): Promise<ElectionInfo> => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            const [root, timestamp, exists] = await contract.getElectionInfo(electionId);
            return {
                root,
                timestamp: Number(timestamp),
                exists,
            };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    const submitMerkleRoot = useCallback(async (
        electionId: number,
        merkleRoot: string
    ): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract(true);

            // Convert string to bytes32 if needed
            const root = merkleRoot.startsWith('0x')
                ? merkleRoot
                : ethers.keccak256(ethers.toUtf8Bytes(merkleRoot));

            const tx = await contract.submitMerkleRoot(electionId, root);
            await tx.wait();

            return tx.hash;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    const verifyVote = useCallback(async (
        electionId: number,
        voteHash: string,
        proof: string[],
        index: number
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            const isValid = await contract.verifyVote(electionId, voteHash, proof, index);
            return isValid;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    return {
        loading,
        error,
        getLatestMerkleRoot,
        getElectionInfo,
        submitMerkleRoot,
        verifyVote,
    };
}

/**
 * Utility function to generate bytes32 hash from string
 */
export function hashToBytes32(data: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
}

/**
 * Utility function to format address for display
 */
export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get chain name from ID
 */
export function getChainName(chainId: number): string {
    return CHAINS[chainId as keyof typeof CHAINS]?.name || `Unknown (${chainId})`;
}

export { };
