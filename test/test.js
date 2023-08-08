const {utils, Wallet, Provider, Contract} = require("zksync-web3");
const {ethers, logger} = require("ethers");
const {chai, expect} = require("chai");
const hre = require("hardhat");
const {Deployer} = require("@matterlabs/hardhat-zksync-deploy");
const {normalizeToBigInt} = require("hardhat/common");
const {address} = require("hardhat/internal/core/config/config-validation");
const {userConfig} = require("hardhat");
const {applyProviderWrappers} = require("hardhat/internal/core/providers/construction");


const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
const RICH_WALLET_PK1 = "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3";

async function deploy() {
    const provider = Provider.getDefaultProvider();

    const owner = new Wallet(RICH_WALLET_PK, provider);
    const user = new Wallet(RICH_WALLET_PK1, provider);

    const deployer = new Deployer(hre, owner);

    const FarmArtifact = await deployer.loadArtifact("Farm");
    const rewardTokenArtifacts = await deployer.loadArtifact("RewardToken");
    const depositTokenArtifacts = await deployer.loadArtifact("DepositToken");

    const rewardTokenContract = await deployer.deploy(rewardTokenArtifacts);
    const depositTokenContract = await deployer.deploy(depositTokenArtifacts);
    const farmContract = await deployer.deploy(FarmArtifact, [rewardTokenContract.address, depositTokenContract.address]);

    const minTx = await depositTokenContract.connect(user).mint(user.address, "1000000000000000000000000");
    await minTx.wait();
    const approveTx = await rewardTokenContract.connect(owner).approve(farmContract.address, "1000000000000000000000000");
    await approveTx.wait();
    const depositTx = await farmContract.depositRewardToken("1000000000000000000000000");
    await depositTx.wait();

    return {rewardTokenContract, depositTokenContract, farmContract, user, owner, provider}
}

describe("Tokens", () => {
    it("user must have 1000000e18 deposit tokens on the balance after minting", async () => {
        const {depositTokenContract, user} = await deploy();
        expect(await depositTokenContract.balanceOf(user.address)).to.eq("1000000000000000000000000");
    })
})

describe("Farming", () => {
    describe("depositRewardToken", () => {
        it("farm contract must have 1000000e18 reward tokens on balance after they are be deposited by owner", async () => {
            const {rewardTokenContract, farmContract} = await deploy();
            const rewardTokensBalance = await rewardTokenContract.balanceOf(farmContract.address);
            expect(rewardTokensBalance).to.eq("1000000000000000000000000");
        })
        it("must be reverted if function was called not by owner", async () => {
            const {rewardTokenContract, farmContract, user} = await deploy();
            await expect(farmContract.connect(user).depositRewardToken("100")).to.be.revertedWith("Ownable: caller is not the owner");
        })
        it("depositRewardToken should be reverted with: amount 0", async () => {
            const {farmContract, owner} = await deploy();
            await expect(farmContract.connect(owner).depositRewardToken("0")).to.be.revertedWith("amount 0");
        });
        it("depositRewardToken should be reverted with: you have not enough reward tokens", async () => {
            const {farmContract, owner} = await deploy();
            await expect(farmContract.connect(owner).depositRewardToken("1000000")).to.be.revertedWith("you have not enough reward tokens");
        });
        it("depositRewardToken should be reverted with: you haven't enough allowance", async () => {
            const {farmContract, rewardTokenContract, owner} = await deploy();
            const mintTx = await rewardTokenContract.connect(owner).mint(owner.address, "1000000");
            await mintTx.wait();
            const approveTx = await rewardTokenContract.connect(owner).approve(farmContract.address, "1000");
            await approveTx.wait();
            await expect(farmContract.connect(owner).depositRewardToken("1000000")).to.be.revertedWith("you haven't enough allowance");
        });
    })

    describe("setAccRewardPerSecond", () => {
        it("must be reverted if function was called not by owner", async () => {
            const {rewardTokenContract, farmContract, owner, user} = await deploy();
            await expect(farmContract.connect(user).setAccRewardPerSecond("100")).to.be.revertedWith("Ownable: caller is not the owner");
        })
        it("must be reverted if function set to 0", async () => {
            const {rewardTokenContract, farmContract, user, owner} = await deploy();
            await expect(farmContract.connect(owner).setAccRewardPerSecond("0")).to.be.revertedWith("accRewardPerShare can't be 0");
        })
        it("accRewardPerSecond should be changed to 100", async () => {
            const {farmContract, rewardTokenContract, owner} = await deploy();
            const tx = await farmContract.connect(owner).setAccRewardPerSecond("100");
            await tx.wait();
            const newAccRewardPerSecond = await farmContract.accRewardPerSecond();
            expect(newAccRewardPerSecond).to.eq("100");
        });
    })

    describe("stake", () => {
        it.only("time", async () => {
            const {farmContract, rewardTokenContract, owner, provider} = await deploy();
        })
    })
})
