const {utils, Wallet, Provider, Contract} = require("zksync-web3");
const {ethers} = require("ethers");
const {chai} = require("chai");
const hre = require("hardhat");
const {Deployer} = require("@matterlabs/hardhat-zksync-deploy");


const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
const RICH_WALLET_PK1 = "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3";

async function deploy() {
    const provider = Provider.getDefaultProvider();

    const owner = new Wallet(RICH_WALLET_PK, provider);
    const user = new Wallet(RICH_WALLET_PK1, provider);

    const deployer = new Deployer(hre, owner);

    const FarmArtifact = await deployer.loadArtifact("Farm");
    const TokenAArtifacts = await deployer.loadArtifact("TokenA");
    const TokenBArtifacts = await deployer.loadArtifact("TokenB");

    const tokenAContract = await deployer.deploy(TokenAArtifacts);
    const tokenBContract = await deployer.deploy(TokenBArtifacts);
    const farmContract = await deployer.deploy(FarmArtifact, [tokenAContract.address, tokenBContract.address]);

    return {tokenAContract, tokenBContract, farmContract, deployer, user, owner}
}

describe("TokenA", () => {
    it("test", async () => {

        const {tokenAContract, tokenBContract, RICH_WALLET_PK, farmContract, user, deployer, owner} = await deploy();

        await tokenBContract.mint(user.address, "100000000000000000000");
        await tokenAContract.approve(farmContract.address, "10000000000000000000");
        await farmContract.depositRewardToken("10000000000000000000");
        await tokenBContract.approve(farmContract.address, "10000000000000000000");
        await farmContract.connect(user).stake("10000000000000000000", {value: ethers.utils.formatUnits("1000", "wei")});


    })
})