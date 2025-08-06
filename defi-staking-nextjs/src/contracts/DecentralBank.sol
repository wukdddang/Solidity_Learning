// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import './Tether.sol';
import './RWD.sol';

contract DecentralBank {
  string public name = 'Decentral Bank';
  address public owner;
  Tether public tether;
  RWD public rwd;

  address[] public stakers;

  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(RWD _rwd, Tether _tether)  {
    rwd = _rwd;
    tether = _tether;
    owner = msg.sender;
  }

  function depositTokens(uint256 _amount) public {
    require(_amount > 0, "amount cannot be 0");

    // 스테이킹을 위해 테더 토큰을 컨트랙트에 입금
    tether.transferFrom(msg.sender, address(this), _amount);
    stakingBalance[msg.sender] += _amount;

    if (!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
  }

  function unstakeTokens() public {
    uint256 balance = stakingBalance[msg.sender];
    require(balance > 0, "staking balance cannot be 0");

    tether.transfer(msg.sender, balance);
    stakingBalance[msg.sender] = 0;

    isStaking[msg.sender] = false;
    hasStaked[msg.sender] = false;

    for (uint i = 0; i < stakers.length; i++) {
      if (stakers[i] == msg.sender) {
        stakers[i] = stakers[stakers.length - 1];
        delete stakers[stakers.length - 1];
      }
    }
  }

  // 리워드 토큰 발급
  function issueTokens() public {
    require(msg.sender == owner, "caller must be the owner");

    for (uint i = 0; i < stakers.length; i++) {
      address recipient = stakers[i];
      uint256 balance = stakingBalance[recipient] / 9;

      if (balance > 0) {
        rwd.transfer(recipient, balance);
      }
    }
  }
}
