import React, { Component } from 'react';
import tokenLogo from '../token-logo.png';
import ethLogo from '../eth-logo.png';
import { ethers } from 'ethers';
import { BigNumber } from "bignumber.js";

export type BuyFormProps = {
  ethBalance: string,
  tokenBalance: string,
  tokenSymbol: string,
  rate: string,
  buyTokens: Function,
}

export type SellFormProps = {
  ethBalance: string,
  tokenBalance: string,
  tokenSymbol: string,
  rate: string,
  sellTokens: Function,
}

export type FormState = {
  output: string,
};

export function isNumber(value: string | number): boolean {
  return ((value != null) &&
    (value !== '') &&
    !isNaN(Number(value.toString())));
}

export function roundCryptoValueString(str: string, decimalPlaces= 18) {
  const arr = str.split(".");
  let fraction = '0';
  if (arr[1]) {
    fraction = arr[1].substr(0, decimalPlaces);
    return arr[0] + "." + fraction;
  } else {
    return arr[0];
  }
}

class BuyForm extends Component<BuyFormProps, FormState> {

  constructor(props: BuyFormProps) {
    super(props);
    this.state = {
      output: '0'
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!isNumber(event.target.value))  {
        throw new Error('Not a number!');
      }
      const etherAmount = new BigNumber(event.target.value);
      const result = etherAmount.multipliedBy(Number(this.props.rate));
      const output = roundCryptoValueString(result.toString())
      this.setState({
        output: output.toString()
      });

    } catch (error) {
      console.error('error:', error);
      this.setState({ output: '0' });
    }
  }

  handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      input: { value: string };
    };
    const input = target.input.value;
    const etherAmount = ethers.utils.parseEther(roundCryptoValueString(input));
    console.log('etherAmount:', etherAmount.toString());
    this.props.buyTokens(etherAmount);
  }

  render() {

    return (
      <form className="mb-3" onSubmit={this.handleFormSubmit}>
        <div className="d-flex justify-content-between">
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {ethers.utils.formatEther(this.props.ethBalance)}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={this.handleInputChange}
            name="input"
            className="form-control form-control-lg"
            placeholder="0"
            required/>
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height='32' alt=""/>
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {ethers.utils.formatEther(this.props.tokenBalance)}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height='32' alt=""/>
              &nbsp; {this.props.tokenSymbol}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 ETH = {this.props.rate} {this.props.tokenSymbol}</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
      </form>
    );
  }
}

export default BuyForm;
