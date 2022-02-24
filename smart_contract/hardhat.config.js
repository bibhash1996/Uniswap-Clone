require("@nomiclabs/hardhat-waffle");



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      // Can use infura as well
      url: 'https://eth-rinkeby.alchemyapi.io/v2/mEJIAuxHnE2HsvBATUIEBiTLrd-dN5X3',
      accounts: [
        '4fa4cd71bf0526b5ae7863e8d11754ba16947ad9c4c6066f5002f07609e6dde2',
      ],
    },
  },
};
