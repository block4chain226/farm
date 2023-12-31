require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");
require("@matterlabs/hardhat-zksync-toolbox");

require('dotenv').config();
const {HardhatUserConfig} = require("hardhat/config");
const zkSyncTestnet =
    process.env.NODE_ENV === "test"
        ? {
            url: "http://localhost:3050",
            ethNetwork: "http://localhost:8545",
            zksync: true
        }
        : {
            url: "https://testnet.era.zksync.dev",
            ethNetwork: "goerli",
            zksync: true
        };

module.exports = {
    zksolc: {
        version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
        settings: {}
    },
    // defaults to zkSync network
    defaultNetwork: "zkSyncTestnet",
    networks: {
        hardhat: {
            zksync: false
        },
        // load test network details
        zkSyncTestnet
    },
    solidity: {
        version: "0.8.17"
    }
};