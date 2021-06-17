import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';
import { ethers } from 'ethers';
import { contracts } from '../contractsInfo.json';
import { Web3Provider } from '@ethersproject/providers';
import { EthereumProvider } from 'hardhat/types';
import { ZMSToken, ZymosisSwap } from '../typechain';
import detectEthereumProvider from '@metamask/detect-provider';
import { Signer } from '@ethersproject/abstract-signer';

export type AppProps = {
}

export type AppState = {
  account: string,
  provider: Web3Provider,
  signer: Signer,
  zmsToken: ZMSToken,
  zymosisSwap: ZymosisSwap,
  ethBalance: string,
  tokenBalance: string,
  rate: string,
  loading: boolean,
  tokenSymbol: string,
  noProviderAbort: boolean
};

// Greeter deployed to:  0xAc55e626A4e0aae6D7D12E24738D941460f162B4
// Counter deployed to:  0xbF72f48e630adBdc0c5c8abDEdFeB26D597219B6
// ZMSToken deployed to:  0x17c93D4416C12a048C5544be96bF9b197f77D0C9
// ZymosisSwap deployed to:  0xDce3B9dd363425346D0e13b44A5A65B4975F744b

const tokenAddress = contracts.ZMSToken.address;
const swapAddress = contracts.ZymosisSwap.address;

// let provider: Web3Provider;
// let signer: Signer;
// let tokenContract: ZMSToken;
// let swapContract: ZymosisSwap;
// let noProviderAbort = true;

class App extends Component<AppProps, AppState> {

  async componentDidMount() {
    const ethereum = await detectEthereumProvider() as EthereumProvider;

    if (ethereum) {
      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (ethereum !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
        this.setState({ noProviderAbort: true });

      } else {
        // From now on, this should always be true:
        // provider === window.ethereum
        this.setState({ noProviderAbort: false });

        // handle chain (network) and chainChanged (per EIP-1193)
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('chainId:', chainId);

        ethereum.on('chainChanged', this.handleChainChanged);
        ethereum.on('accountsChanged', this.handleAccountsChanged);

        // handle user accounts and accountsChanged (per EIP-1193)
        ethereum
          .request({ method: 'eth_accounts' })
          .then(this.handleAccountsChanged)
          .catch((err) => {
            // Some unexpected error.
            // For backwards compatibility reasons, if no accounts are available,
            // eth_accounts will return an empty array.
            console.error(err);
          });

        await this.loadBlockchainData(ethereum);
      }
    } else {
      console.log('Please install MetaMask!');
      this.setState({ noProviderAbort: true });
    }
  }

  async loadBlockchainData(ethereum: EthereumProvider) {
    let signer;
    let provider: Web3Provider;

    try {
      provider = new ethers.providers.Web3Provider(ethereum as any);
      signer = provider.getSigner(); // Your current metamask account;
      this.setState({ signer: signer });
      console.log('signer', signer);

      const zmsToken = new ethers.Contract(tokenAddress, contracts.ZMSToken.abi, provider) as ZMSToken;
      const zymosisSwap = new ethers.Contract(swapAddress, contracts.ZymosisSwap.abi, provider) as ZymosisSwap;

      this.setState({
        provider: provider,
        signer: signer,
        zmsToken: zmsToken,
        zymosisSwap: zymosisSwap
      });

      await zymosisSwap
        .on('TokensPurchased', async (event) => {
          console.log('TokensPurchased:', event);
          await this.updateBalances();
          this.setState({ loading: false });
        })
        .on('TokensSold', async (event) => {
          console.log('TokensSold:', event);
          await this.updateBalances();
          this.setState({ loading: false });
        });

      await signer.getAddress()
        .then(signerAddress => {
          this.setState({ account: signerAddress });
        });

      await this.updateBalances();

      await zmsToken.symbol()
        .then(tokenSymbol => {
          this.setState({ tokenSymbol: tokenSymbol });
          console.log('tokenSymbol', tokenSymbol);
        });

      await zymosisSwap.rate()
        .then(rate => {
          this.setState({ rate: rate.toString() });
          console.log('rate', rate.toString());
        });

      // done loading...
      this.setState({
        loading: false,
      });

    } catch(error) {
      console.log('loadBlockchainData errored!')
      console.error('error', error);
      // User denied account access
      this.setState({ noProviderAbort: true });
    }
  }

  handleAccountsChanged = async (_accounts: unknown) => {
    const accounts: string[] = _accounts as string[];
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== this.state.account) {
      this.setState({ account: accounts[0] });
      console.log('handleAccountsChanged(), this.state.account', this.state.account);

      const ethereum = await detectEthereumProvider() as EthereumProvider;
      await this.loadBlockchainData(ethereum);
    }
  }

  handleChainChanged = async (chainId: number) => {
    console.log('handleChainChanged:', chainId);
    window.location.reload();
  }

  updateBalances = async () => {
    console.log('updateBalances:', this.state.account);

    await this.state.provider.getBalance(this.state.account)
      .then(ethBalance => {
        this.setState({ ethBalance: ethBalance.toString() });
        console.log('ethBalance', ethBalance.toString());
      });

    await this.state.zmsToken.balanceOf(this.state.account)
      .then(tokenBalance => {
        this.setState({ tokenBalance: tokenBalance.toString() });
        console.log('tokenBalance', tokenBalance.toString());
      });
  }

  /**
   * @param etherAmount in wei
   */
  buyTokens = async (etherAmount: number) => {
    this.setState({ loading: true });

    try {
      console.log('buyTokens(), this.state.account', this.state.account);
      const zymosisSwap = await this.state.zymosisSwap.connect(this.state.signer);
      const result = await zymosisSwap.buyTokens({ value: etherAmount });
      console.log('buyTokens(), result:', result);

    } catch(error) {
      this.setState({ loading: false });
      console.error(error);
    }
  };

  sellTokens = async (tokenAmount: number) => {
    this.setState({ loading: true });

    try {
      const zmsToken = this.state.zmsToken.connect(this.state.signer);
      const zymosisSwap = this.state.zymosisSwap.connect(this.state.account);

      await zmsToken.approve(this.state.zymosisSwap.address, tokenAmount);
      await zymosisSwap.sellTokens(tokenAmount)

    } catch(error) {
      this.setState({ loading: false });
      console.log('error', error);
    }
  };

  constructor(props: AppProps) {
    super(props);
    this.state = {
      account: '',
      provider: {} as Web3Provider,
      signer: {} as Signer,
      zmsToken: {} as ZMSToken,
      zymosisSwap: {} as ZymosisSwap,
      ethBalance: '0',
      tokenBalance: '0',
      rate: '0',
      loading: true,
      tokenSymbol: '',
      noProviderAbort: false,
    };
  }

  render() {
    let content;
    const loading = this.state.loading;
    const noProviderAbort = this.state.noProviderAbort;

    // Abort if metamask etc not present
    if (noProviderAbort) {
      content = <p id="loader" className="text-center"><a href="https://metamask.io">Metamask</a> or equivalent required to access this page.</p>;
    } else {
      if (loading) {
        content = <p id="loader" className="text-center">Loading / waiting for tx...</p>;
      } else {
        content = <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          tokenSymbol={this.state.tokenSymbol}
          rate={this.state.rate}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
        />;
      }
    }

    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main"
                  className="col-lg-12 ml-auto mr-auto text-center"
                  style={{maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
