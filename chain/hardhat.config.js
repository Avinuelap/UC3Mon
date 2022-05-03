require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2500  
      }
    }
  },
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/iwV_hHnxNPNYKkkAqaDiHBlWM-G7AYka',
      accounts: ['ac8683460459916bf2d979f0ca510e8262dd8bb0f266c9cc5cc3ee9e35888e76']
    }
  }
};
