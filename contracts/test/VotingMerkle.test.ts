import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingMerkle } from "../typechain-types";

describe("VotingMerkle", function () {
    let votingMerkle: VotingMerkle;
    let admin: any;
    let user: any;

    beforeEach(async function () {
        [admin, user] = await ethers.getSigners();

        const VotingMerkle = await ethers.getContractFactory("VotingMerkle");
        votingMerkle = await VotingMerkle.deploy();
    });

    describe("Deployment", function () {
        it("Should set the deployer as admin", async function () {
            expect(await votingMerkle.admin()).to.equal(admin.address);
        });

        it("Should start with zero root count", async function () {
            expect(await votingMerkle.rootCount()).to.equal(0);
        });
    });

    describe("Submit Merkle Root", function () {
        it("Should allow admin to submit a root", async function () {
            const electionId = 1;
            const root = ethers.keccak256(ethers.toUtf8Bytes("test-root"));

            await expect(votingMerkle.submitMerkleRoot(electionId, root))
                .to.emit(votingMerkle, "MerkleRootSubmitted")
                .withArgs(electionId, root, await getBlockTimestamp());

            expect(await votingMerkle.getElectionRoot(electionId)).to.equal(root);
            expect(await votingMerkle.getLatestMerkleRoot()).to.equal(root);
            expect(await votingMerkle.rootCount()).to.equal(1);
        });

        it("Should reject non-admin submissions", async function () {
            const electionId = 1;
            const root = ethers.keccak256(ethers.toUtf8Bytes("test-root"));

            await expect(
                votingMerkle.connect(user).submitMerkleRoot(electionId, root)
            ).to.be.revertedWith("VotingMerkle: caller is not admin");
        });

        it("Should reject zero root", async function () {
            await expect(
                votingMerkle.submitMerkleRoot(1, ethers.ZeroHash)
            ).to.be.revertedWith("VotingMerkle: root cannot be zero");
        });

        it("Should reject duplicate election submissions", async function () {
            const electionId = 1;
            const root = ethers.keccak256(ethers.toUtf8Bytes("test-root"));

            await votingMerkle.submitMerkleRoot(electionId, root);

            await expect(
                votingMerkle.submitMerkleRoot(electionId, root)
            ).to.be.revertedWith("VotingMerkle: root already submitted");
        });
    });

    describe("Election Info", function () {
        it("Should return correct election info", async function () {
            const electionId = 1;
            const root = ethers.keccak256(ethers.toUtf8Bytes("test-root"));

            await votingMerkle.submitMerkleRoot(electionId, root);

            const info = await votingMerkle.getElectionInfo(electionId);
            expect(info.root).to.equal(root);
            expect(info.exists).to.be.true;
        });

        it("Should return false for non-existent election", async function () {
            const info = await votingMerkle.getElectionInfo(999);
            expect(info.exists).to.be.false;
        });
    });

    describe("Admin Transfer", function () {
        it("Should allow admin to transfer rights", async function () {
            await expect(votingMerkle.transferAdmin(user.address))
                .to.emit(votingMerkle, "AdminChanged")
                .withArgs(admin.address, user.address);

            expect(await votingMerkle.admin()).to.equal(user.address);
        });

        it("Should reject zero address", async function () {
            await expect(
                votingMerkle.transferAdmin(ethers.ZeroAddress)
            ).to.be.revertedWith("VotingMerkle: new admin cannot be zero address");
        });
    });
});

async function getBlockTimestamp(): Promise<number> {
    const block = await ethers.provider.getBlock("latest");
    return block!.timestamp;
}
