//SPDX-License-Identifier: WTFPL
pragma solidity ^0.7.6;

import "hardhat-deploy/solc_0.7/proxy/Proxied.sol";
import "hardhat/console.sol";

contract Greeter {
    event MessageChanged(address indexed user, string message);

    string public greeting;

    // function postUpgrade(string memory _greeting) public proxied {
    //     greeting = _greeting;
    // }

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
        // the proxied modifier from `hardhat-deploy` ensure postUpgrade effect
        // can only be used once when the contract is deployed without proxy
        // by calling that function in the constructor we ensure the contract
        // behave the same whether it is deployed through a proxy or not.
        // postUpgrade(_greeting);
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;

        emit MessageChanged(msg.sender, greeting);
    }
}
