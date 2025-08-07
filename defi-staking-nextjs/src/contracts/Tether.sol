// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

contract Tether {
  string public name = 'Tether';
  string public symbol = 'USDT';
  uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
  uint8 public decimals = 18;

  // indexed는 이벤트 로그에 포함되어 주소 검색 가능하게 해줌
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint _value
  );

  // 이벤트당 최대 3개의 indexed만 가능
  event Approve(
    address indexed _owner, // 토큰 소유자
    address indexed _spender, // 제 3자가 소유자의 토큰을 사용할 수 있도록 허용하는 주소
    uint _value // 허용된 토큰 수량
  );

  mapping(address => uint) public balanceOf;
  mapping(address => mapping(address => uint)) public allowance;

  constructor()  {
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint256  _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    allowance[msg.sender][_spender] = _value;
    emit Approve(msg.sender, _spender, _value); 
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(_value <= balanceOf[_from]);
    require(_value <= allowance[_from][msg.sender]);

    balanceOf[_to] += _value;
    balanceOf[_from] -= _value;

    allowance[_from][msg.sender] -= _value;
    emit Transfer(_from, _to, _value);
    return true;
  }
}