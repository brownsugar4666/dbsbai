import { ethers } from "hardhat";

async function main() {
    console.log("Deploying VotingMerkle contract...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    const VotingMerkle = await ethers.getContractFactory("VotingMerkle");
    const votingMerkle = await VotingMerkle.deploy();

    await votingMerkle.waitForDeployment();

    const address = await votingMerkle.getAddress();
    console.log("VotingMerkle deployed to:", address);

    // Verify deployment
    const admin = await votingMerkle.admin();
    console.log("Admin address:", admin);

    console.log("\nDeployment complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Contract Address:", address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return address;
}

main()
    .then((address) => {
        console.log("\n✅ Deployment successful!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
