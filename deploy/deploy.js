const {utils, Wallet} = require("zksync-web3");
const {ethers} = require("ethers");
const hre = require("hardhat");
const {Deployer} =
    require("@matterlabs/hardhat-zksync-deploy");


// An example of a deploy script that will deploy and call a simple contract.
module.exports = async function() {
    console.log(`Running deploy script`);

    // Initialize the wallet.
    const wallet = new Wallet("d16e6c40dd9cf3377fcef37dbd686405a9ef8d4f1dd8349317f0e500777c4000");

    // Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, wallet);
    // Load contract
    const FarmArtifact = await deployer.loadArtifact("Farm");
    const TokenAArtifacts = await deployer.loadArtifact("TokenA");
    const TokenBArtifacts = await deployer.loadArtifact("TokenB");

    // Deploy this contract. The returned object will be of a `Contract` type,
    // similar to the ones in `ethers`.

    // `greeting` is an argument for contract constructor.
    const tokenAContract = await deployer.deploy(TokenAArtifacts);
    const tokenBContract = await deployer.deploy(TokenBArtifacts);
    const farmContract = await deployer.deploy(FarmArtifact, [tokenAContract.address, tokenBContract.address]);

    // Show the contract info.
    console.log(`${TokenAArtifacts.contractName} was deployed to ${tokenAContract.address}`);
    console.log(`${TokenBArtifacts.contractName} was deployed to ${tokenBContract.address}`);
    console.log(`${FarmArtifact.contractName} was deployed to ${farmContract.address}`);
}
