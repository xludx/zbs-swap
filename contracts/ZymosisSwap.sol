//SPDX-License-Identifier: WTFPL
pragma solidity ^0.7.6;

import "hardhat/console.sol";
import "./ZMSToken.sol";

contract ZymosisSwap {
    string public name = "ZymosisSwap Instant Exchange";
    ZMSToken public token;
    uint256 public rate = 2000;

    event TokensPurchased(address account, address token, uint256 amount, uint256 rate);
    event TokensSold(address account, address token, uint256 amount, uint256 rate);

    constructor(ZMSToken _token) {
        token = _token;
    }

    // msg, see: https://docs.soliditylang.org/en/v0.8.4/units-and-global-variables.html#special-variables-and-functions
    function buyTokens() public payable {
        // calculate the number of tokens received for msg.value
        uint256 tokenAmount = msg.value * rate;
        // console.log('tokenAmount', tokenAmount);
        // console.log('balance', token.balanceOf(address(this)));

        // require that ZymosisSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount, "NOT_ENOUGH_TOKENS");

        // then transfer tokens to the user
        token.transfer(msg.sender, tokenAmount);

        // emit event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    // transfer from investor to ZymosisSwap
    // msg.sender is the caller of the function
    function sellTokens(uint256 _tokenAmount) public {
        // investor cant sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _tokenAmount, "NOT_ENOUGH_TOKENS");

        // calculate the amount of ether to redeem
        uint256 etherAmount = _tokenAmount / rate;

        // require that ZymosisSwap has enough ether
        require(address(this).balance >= etherAmount, "NOT_ENOUGH_ETHER");

        // transfer tokens to ZymosisSwap
        // transferFrom used when allowing other contracts to spend your tokens
        // need to call approve() before this
        token.transferFrom(msg.sender, address(this), _tokenAmount);

        // send
        msg.sender.transfer(etherAmount);

        // emit event
        emit TokensSold(msg.sender, address(token), _tokenAmount, rate);
    }
}
