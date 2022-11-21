
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-ethers');

require('dotenv').config({path: '.env'})

// Change private keys accordingly - ONLY FOR DEMOSTRATION PURPOSES - PLEASE STORE PRIVATE KEYS IN A SAFE PLACE
// Export your private key as
//       export PRIVKEY=0x.....
const {
   ALCHEMY_KEY,
   PRIVATE_KEY
 } = process.env;

module.exports = {
   defaultNetwork: 'hardhat',

   networks: {
      hardhat: {
         forking: {
           url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
           //blockNumber: 13952971
           accounts: [PRIVATE_KEY]
         },
         gasPrice: "auto"
       },
      localhost: {
         url: 'http://127.0.0.1:8545'
       },
      moonbase: {
         url: 'https://rpc.api.moonbase.moonbeam.network',
         accounts: [PRIVATE_KEY],
         chainId: 1287,
      },
      mumbai: {
         url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
         accounts: [PRIVATE_KEY],
         gasPrice: "auto"
      },
      goerli: {
         url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
         accounts: [PRIVATE_KEY],
         gasPrice: "auto"
      },
   },
   solidity: {
      compilers: [
         {
            version: '0.5.16',
            settings: {
               optimizer: {
                  enabled: true,
                  runs: 200,
               },
            },
         },
         {
            version: '0.6.6',
            settings: {
               optimizer: {
                  enabled: true,
                  runs: 200,
               },
            },
         },
      ],
   },
   paths: {
      sources: './contracts',
      cache: './cache',
      artifacts: './artifacts',
   },
   mocha: {
      timeout: 20000,
   },
};
