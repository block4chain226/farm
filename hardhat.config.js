// require("@nomicfoundation/hardhat-toolbox");
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");
require("@matterlabs/hardhat-zksync-toolbox");

require('dotenv').config();
const {HardhatUserConfig} = require("hardhat/config");

const config = {
    zksolc: {
        version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
        settings: {}
    },
    defaultNetwork: "zkSyncTestnet",
    networks: {
        hardhat: {
            zksync: false
        },
        goerli: {
            url: "https://goerli.com/api/abcdef12345",
            zksync: false
        },
        mainnet: {
            url: "https://ethereum.mainnet.com/api/abcdef12345",
            zksync: false
        },
        zkSyncTestnet: process.env.NODE_ENV === "test"
            ? {
                url: "http://localhost:8011",
                ethNetwork: "http://localhost:8545",
                zksync: true
            }
            : {
                url: "https://testnet.era.zksync.dev",
                ethNetwork: "goerli", // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
                zksync: true,
                verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
            }
    },
    solidity: {
        version: "0.8.19"
    }
    // OTHER SETTINGS...
};

module.exports = config;