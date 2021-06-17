import 'dotenv/config';
import { HardhatNetworkAccountsUserConfig, NetworkUserConfig } from 'hardhat/types';

export function node_url(networkName: string): string {
  if (networkName) {
    const uri = process.env['ETH_NODE_URI_' + networkName.toUpperCase()];
    if (uri && uri !== '') {
      return uri;
    }
  }

  if (networkName === 'localhost') {
    // do not use ETH_NODE_URI
    return 'http://localhost:8545';
  }

  let uri = process.env.ETH_NODE_URI;
  if (uri) {
    uri = uri.replace('{{networkName}}', networkName);
  }
  if (!uri || uri === '') {
    // throw new Error(`environment variable "ETH_NODE_URI" not configured `);
    return '';
  }
  if (uri.indexOf('{{') >= 0) {
    throw new Error(`invalid uri or network not supported by node provider : ${uri}`);
  }
  return uri;
}

export function getMnemonic(networkName?: string): string {
  if (networkName) {
    const mnemonic = process.env['MNEMONIC_' + networkName.toUpperCase()];
    if (mnemonic && mnemonic !== '') {
      return mnemonic;
    }
  }

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic === '') {
    return 'test test test test test test test test test test test junk';
  }
  return mnemonic;
}

export function accounts(networkName?: string): HardhatNetworkAccountsUserConfig {
  return {
    count: 10,
    initialIndex: 0,
    mnemonic: getMnemonic(networkName),
    path: "m/44'/60'/0'/0",
    accountsBalance: '10000000000000000000000',
  };
}

export const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  localhost: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

export function network(networkName: keyof typeof chainIds): NetworkUserConfig {
  return {
    url: node_url(networkName),
    accounts: accounts(),
    chainId: chainIds[networkName],
  };
}
