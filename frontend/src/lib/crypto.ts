// Cryptographic utility functions for BharatVote
// Note: These are SIMULATED functions for the prototype

/**
 * Generate a ZK (Zero-Knowledge) Token for voter identity
 * In a real system, this would use actual ZK cryptography
 */
export function generateZKToken(voterId: string, secret: string): string {
    const data = voterId + secret + Date.now();
    return hashData(data);
}

/**
 * Generate a nullifier hash to prevent double voting
 * This ensures each voter can only vote once
 */
export function generateNullifierHash(zkToken: string): string {
    return hashData(zkToken + 'nullifier');
}

/**
 * Encrypt a vote (simulated)
 * In production, this would use proper encryption like AES or threshold encryption
 */
export function encryptVote(candidateId: string, zkToken: string): string {
    return hashData(candidateId + zkToken + Date.now());
}

/**
 * Simple hash function for demo purposes
 * Uses a basic hash algorithm - in production, use SHA-256 or similar
 */
export function hashData(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Convert to hex and pad to ensure consistent length
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');

    // Create a longer hash by hashing multiple times
    let fullHash = hexHash;
    for (let i = 0; i < 7; i++) {
        let subHash = 0;
        const subData = data + i.toString();
        for (let j = 0; j < subData.length; j++) {
            const char = subData.charCodeAt(j);
            subHash = ((subHash << 5) - subHash) + char;
            subHash = subHash & subHash;
        }
        fullHash += Math.abs(subHash).toString(16).padStart(8, '0');
    }

    return fullHash;
}

/**
 * Generate a Merkle Root from an array of hashes
 * Simplified implementation for demo
 */
export function generateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return hashData('empty');
    if (hashes.length === 1) return hashes[0];

    const combined = hashes.join('');
    return hashData(combined);
}

/**
 * Verify a vote exists in a Merkle tree (simulated)
 */
export function verifyMerkleProof(
    voteHash: string,
    merkleRoot: string,
    proof: string[]
): boolean {
    // Simplified verification - in production, this would be proper Merkle proof verification
    let currentHash = voteHash;
    for (const proofElement of proof) {
        currentHash = hashData(currentHash + proofElement);
    }
    return currentHash === merkleRoot;
}
