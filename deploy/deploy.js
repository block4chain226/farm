const {utils, Wallet} = require("zksync-web3");
const {ethers} = require("ethers");
const hre = require("hardhat");
const {Deployer} =
    require("@matterlabs/hardhat-zksync-deploy");

//TokenA was deployed to 0xB27b7dEAb92f6581260BACBc856D15ec7E5f1AA4
//TokenB was deployed to 0x390A1bb64f0c4b56B2196619419C0358b6927638
//Farm was deployed to 0xf2A0e375157B4a2fF8E5fF99B2CE85Ed360EA94A


// An example of a deploy script that will deploy and call a simple contract.
module.exports = async function() {
    console.log(`Running deploy script`);

    // Initialize the wallet.
    const wallet = new Wallet("d16e6c40dd9cf3377fcef37dbd686405a9ef8d4f1dd8349317f0e500777c4000");

    // Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, wallet);
    // Load contract
    const FarmArtifact1 = await deployer.loadArtifact("Farm");
    const TokenAArtifacts = await deployer.loadArtifact("TokenA");
    const TokenBArtifacts = await deployer.loadArtifact("TokenB");

    // Deploy this contract. The returned object will be of a `Contract` type,
    // similar to the ones in `ethers`.

    // `greeting` is an argument for contract constructor.
    const tokenAContract = await deployer.deploy(TokenAArtifacts);
    const tokenBContract = await deployer.deploy(TokenBArtifacts);
    const farmContract = await deployer.deploy(FarmArtifact1, [tokenAContract.address, tokenBContract.address]);

    // Show the contract info.
    console.log(`${TokenAArtifacts.contractName} was deployed to ${tokenAContract.address}`);
    console.log(`${TokenBArtifacts.contractName} was deployed to ${tokenBContract.address}`);
    console.log(`${FarmArtifact1.contractName} was deployed to ${farmContract.address}`);
}
