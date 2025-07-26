pragma solidity ^0.5.7;

contract Will {
    address owner;
    uint fortune;
    bool isDeceased;

    // 작업을 처음 배포할 때 이더가 있어야 함.
    constructor() payable public {
        owner = msg.sender; // 호출한 사람의 주소
        fortune = msg.value; // 호출할 때 이더를 함께 보냄
        isDeceased = false;
    }

    // modifier 생성해서 계약 호출 가능한 유일한 사람이 owner 이게 만듦
    modifier onlyOwner{
        require(msg.sender == owner);
        _; // 밑줄을 입력하면 함수가 계속됨.
    }

    // modifier 생성해서 deceased 가 true 일 때만 배분
    modifier mustBeDeceased{
        require(isDeceased == true);
        _; // 밑줄을 입력하면 함수가 계속됨.
    }

    address payable[] familyWallets;

    mapping(address => uint) inheritance; 

    // 각 주소에 상속 설정
    // 상속 설정도 소유자가 해야함.
    function setInheritance(address payable wallet, uint amount) public onlyOwner {
        inheritance[wallet] = amount;
        familyWallets.push(wallet);
    }

    // 개별 가족한테 지불
    function payout() private mustBeDeceased {
        for(uint i=0; i < familyWallets.length; i++) {
            familyWallets[i].transfer(inheritance[familyWallets[i]]);
        }
    }

   // 실제로 현실 세계에서 돌아가시면, 버튼을 트리거 해서 이 함수를 실행시킨다.
   // 오라클 스위치 시뮬레이션
    function hasDeceased() public onlyOwner {
        isDeceased = true;
        payout();
    }
}