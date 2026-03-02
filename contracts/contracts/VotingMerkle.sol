// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VotingMerkle
 * @notice Smart contract for storing and verifying voting Merkle roots
 * @dev This contract stores Merkle roots of encrypted votes for public verification
 */
contract VotingMerkle {
    // State variables
    bytes32 public latestMerkleRoot;
    address public admin;
    uint256 public rootCount;
    
    // Mapping of election ID to Merkle root
    mapping(uint256 => bytes32) public electionRoots;
    
    // Mapping of election ID to timestamp
    mapping(uint256 => uint256) public electionTimestamps;
    
    // Events
    event MerkleRootSubmitted(
        uint256 indexed electionId,
        bytes32 indexed root,
        uint256 timestamp
    );
    
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "VotingMerkle: caller is not admin");
        _;
    }
    
    /**
     * @notice Constructor sets the deployer as admin
     */
    constructor() {
        admin = msg.sender;
        rootCount = 0;
    }
    
    /**
     * @notice Submit a new Merkle root for an election
     * @param electionId Unique identifier for the election
     * @param root The Merkle root of all encrypted votes
     */
    function submitMerkleRoot(uint256 electionId, bytes32 root) external onlyAdmin {
        require(root != bytes32(0), "VotingMerkle: root cannot be zero");
        require(electionRoots[electionId] == bytes32(0), "VotingMerkle: root already submitted");
        
        electionRoots[electionId] = root;
        electionTimestamps[electionId] = block.timestamp;
        latestMerkleRoot = root;
        rootCount++;
        
        emit MerkleRootSubmitted(electionId, root, block.timestamp);
    }
    
    /**
     * @notice Get the Merkle root for a specific election
     * @param electionId The election identifier
     * @return The Merkle root bytes32 value
     */
    function getElectionRoot(uint256 electionId) external view returns (bytes32) {
        return electionRoots[electionId];
    }
    
    /**
     * @notice Get the latest Merkle root
     * @return The most recently submitted Merkle root
     */
    function getLatestMerkleRoot() external view returns (bytes32) {
        return latestMerkleRoot;
    }
    
    /**
     * @notice Verify if a vote hash exists in the Merkle tree
     * @param electionId The election identifier
     * @param voteHash The hash of the vote to verify
     * @param proof The Merkle proof array
     * @param index The index of the vote in the tree
     * @return True if the proof is valid
     */
    function verifyVote(
        uint256 electionId,
        bytes32 voteHash,
        bytes32[] calldata proof,
        uint256 index
    ) external view returns (bool) {
        bytes32 root = electionRoots[electionId];
        require(root != bytes32(0), "VotingMerkle: election not found");
        
        bytes32 computedHash = voteHash;
        
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            
            if (index % 2 == 0) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
            
            index = index / 2;
        }
        
        return computedHash == root;
    }
    
    /**
     * @notice Transfer admin rights to a new address
     * @param newAdmin The address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "VotingMerkle: new admin cannot be zero address");
        
        address oldAdmin = admin;
        admin = newAdmin;
        
        emit AdminChanged(oldAdmin, newAdmin);
    }
    
    /**
     * @notice Get election statistics
     * @param electionId The election identifier
     * @return root The Merkle root
     * @return timestamp When the root was submitted
     * @return exists Whether the election exists
     */
    function getElectionInfo(uint256 electionId) external view returns (
        bytes32 root,
        uint256 timestamp,
        bool exists
    ) {
        root = electionRoots[electionId];
        timestamp = electionTimestamps[electionId];
        exists = root != bytes32(0);
    }
}
