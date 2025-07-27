// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

// contract 는 생성자만 코인 생성을 허용해야한다.
// 이더리움 키페어(계약주소, 수량)만 있으면 개별 사용자들은 등록하지 않고 누구에게나 코인을 전송할 수 있다.

contract Coin {
    // 다른 contract 에서 이 변수에 접근 가능하기 위해 public 으로 설
    address public minter;
    mapping(address => uint) public balances;

    // event 는 contract 의 상속가능한 메머다
    // 이벤트가 emit 하면 전달받은 arguments 들을 트랜잭션 로그로 전달한다.
    // 이 로그는 블록체인에 저장된다.
    // contract 가 블록체인 상에 존재하 언제든 조회 가능하다.
    event Sent(address from, address to, uint amount);

    // 생성자는 contract 를 맨 처음 배포할 때만 실행된다.
    constructor() {
        minter = msg.sender;
    }

    // 새로운 코인을 만들고 주소로 전달한다.
    // 소유자만 코인을 보낼 수 있게 한다.
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        balances[receiver] += amount;
    }

    error insufficientBalance(uint requested, uint available);

    // 코인 전송 함수
    function send(address receiver, uint amount) public {
        if(balances[msg.sender] < amount) {
            revert insufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });
        }

        balances[msg.sender] -= amount;
        balances[receiver] += amount;

        emit Sent(msg.sender, receiver, amount);
    }
}