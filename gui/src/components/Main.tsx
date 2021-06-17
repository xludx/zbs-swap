import React, { Component, FormEvent } from 'react';
import BuyForm from './BuyForm'
import SellForm from './SellForm'

type MainProps = {
  ethBalance: string,
  tokenBalance: string,
  tokenSymbol: string,
  rate: string,
  buyTokens: Function,
  sellTokens: Function,
}

type MainState = {
  currentForm: 'buy' | 'sell',
};

class Main extends Component<MainProps, MainState> {

    constructor(props: MainProps) {
        super(props)
        this.state = {
            currentForm: 'buy'
        }
        this.handleOnClickBuy = this.handleOnClickBuy.bind(this);
        this.handleOnClickSell = this.handleOnClickSell.bind(this);

    }

    handleOnClickBuy(event: FormEvent) {
        this.setState({ currentForm: 'buy' });
    }

    handleOnClickSell(event: FormEvent) {
        this.setState({ currentForm: 'sell' });
    }

    render() {
        let content;
        if (this.state.currentForm === 'buy') {
            content = <BuyForm
                ethBalance={this.props.ethBalance}
                tokenBalance={this.props.tokenBalance}
                buyTokens={this.props.buyTokens}
                tokenSymbol={this.props.tokenSymbol}
                rate={this.props.rate}
            />
        } else {
            content = <SellForm
                ethBalance={this.props.ethBalance}
                tokenBalance={this.props.tokenBalance}
                sellTokens={this.props.sellTokens}
                tokenSymbol={this.props.tokenSymbol}
                rate={this.props.rate}
            />
        }

        return (
            <div id="content" className="mt-3">
                <h1>{this.state.currentForm}</h1>
                <div className="d-flex justify-content-between mb-3">
                    <button
                        className="btn btn-light"
                        onClick={this.handleOnClickBuy}
                    >
                        Buy
                    </button>
                    <span className="text-muted">&lt; &nbsp; &gt;</span>
                    <button
                        className="btn btn-light"
                        onClick={this.handleOnClickSell}
                    >
                        Sell
                    </button>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        {content}
                    </div>
                </div>
            </div>


        );
    }
}

export default Main;
