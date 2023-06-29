require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('solidity-coverage');
require('hardhat-docgen');
require('@primitivefi/hardhat-dodoc');
// require("@nomicfoundation/hardhat-toolbox");
// require("hardhat-gas-reporter");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

 require('dotenv').config()
 const MORALIS_URL = process.env.MORALIS_URL
 const PRIVATE_KEY = process.env.PRIVATE_KEY
 const API_KEY = process.env.API_KEY

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.13",
      },
      {
        version: "0.7.6",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mainnet.g.alchemy.com/v2/AtVUj7BSbemKccob5NbWlGufZdyIxrOW",
      },
      // accounts: {
      //   count: 200,
      //   //accountsBalance: ethers.utils.parseEther('10000').toString(),
      // }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },  
    testnet: {
        url: MORALIS_URL,
        accounts: [`0x${PRIVATE_KEY}`]
      }
  },
  etherscan: {
    apiKey: API_KEY
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  },
  dodoc: {
    runOnCompile: true,
    debugMode: true,
    // More options...
  },
};


// npx hardhat test --network localhost