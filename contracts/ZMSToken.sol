//SPDX-License-Identifier: WTFPL
pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract ZMSToken {
    // public modifier makes a variable readable from outside the contract.
    string public name = "Zymosis Boozing Society Token";
    string public symbol = "ZMS";

    // fixed amount of tokens
    uint256 public totalSupply = 9000000000000000000000; // 9000
    uint8 public decimals = 18;

    address public owner;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        // assign totalSupply to the address which deploys this contract.
        balanceOf[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        // check that the transaction sender has enough tokens, otherwise reverts
        require(balanceOf[msg.sender] >= _value, "NOT_ENOUGH_TOKENS");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // check that the value transferred is smaller or equal to the balance of the address to be transferred from
        require(_value <= balanceOf[_from], "NOT_ENOUGH_TOKENS");
        require(_value <= allowance[_from][msg.sender], "NOT_ENOUGH_ALLOWANCE");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
