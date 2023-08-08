const {utils, Wallet} = require("zksync-web3");
const {ethers} = require("ethers");
const hre = require("hardhat");
const {Deployer} =
    require("@matterlabs/hardhat-zksync-deploy");

module.exports = async function() {
    console.log(`Running deploy script`);

    // Initialize the wallet.
    const wallet = new Wallet("d16e6c40dd9cf3377fcef37dbd686405a9ef8d4f1dd8349317f0e500777c4000");

    const deployer = new Deployer(hre, wallet);
    // Load contract
    const FarmArtifact = await deployer.loadArtifact("Farm");
    const RewardTokenArtifacts = await deployer.loadArtifact("RewardToken");
    const DepositTokenArtifacts = await deployer.loadArtifact("DepositToken");

    const rewardTokenContract = await deployer.deploy(RewardTokenArtifacts);
    const depositTokenContract = await deployer.deploy(DepositTokenArtifacts);
    const farmContract = await deployer.deploy(FarmArtifact, [rewardTokenContract.address, depositTokenContract.address]);

    // Show the contract info.
    console.log(`${RewardTokenArtifacts.contractName} was deployed to ${rewardTokenContract.address}`);
    console.log(`${DepositTokenArtifacts.contractName} was deployed to ${depositTokenContract.address}`);
    console.log(`${FarmArtifact.contractName} was deployed to ${farmContract.address}`);
}
