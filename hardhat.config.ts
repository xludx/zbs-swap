import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-gas-reporter';
// import 'hardhat-ethernal';
import '@typechain/hardhat';
import 'solidity-coverage';
import { chainIds, network } from './utils/network';
import { resolve } from 'path';
import { config as dotenvConfig } from 'dotenv';

// tasks
// import './tasks/accounts';
// import './tasks/balance';
// import './tasks/block';
import './tasks/clean';

dotenvConfig({ path: resolve(__dirname, './.env') });

// Ensure that we have all the environment variables we need.
let mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  mnemonic = 'test test test test test test test test test test test junk';
}

// While waiting for hardhat PR: https://github.com/nomiclabs/hardhat/pull/1542
if (process.env.HARDHAT_FORK) {
  process.env['HARDHAT_DEPLOY_FORK'] = process.env.HARDHAT_FORK;
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.7.6',
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: 'none',
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
    investor: 1,
    simpleERC20Beneficiary: 2,
  },
  networks: {
    localhost: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
        accountsBalance: '9000000000000000000000',
      },
      chainId: chainIds.localhost,
    },
    hardhat: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
        accountsBalance: '10000000000000000000000',
      },
      chainId: chainIds.hardhat,
    },
    staging: network('rinkeby'),
    production: network('mainnet'),
    mainnet: network('mainnet'),
    rinkeby: network('rinkeby'),
    kovan: network('kovan'),
    goerli: network('goerli'),
  },
  paths: {
    // artifacts: "./gui/src/artifacts",
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts', // "./src",
    tests: './test',
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
    excludeContracts: [],
    src: './src',
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
  },
  /* TODO add hardhat-watcher
  watcher: {
    // https://hardhat.org/plugins/hardhat-watcher.html
    compilation: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
    test: {
      tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
      files: ["./test/**ASDFREMOVEASDF/*"],
      verbose: true,
    },
  }
  */
};
/*
extendEnvironment((hre) => {
  hre.ethernalSync = true;
  hre.ethernalWorkspace = 'hardhat';
});
*/
export default config;
