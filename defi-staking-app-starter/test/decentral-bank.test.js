const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number.toString(), "ether");
  }

  before(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    await rwd.transfer(decentralBank.address, tokens("1000000"));
    await tether.transfer(customer, tokens("100"), {
      from: owner,
    });
  });

  // 테스트 코드
  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
  });

  describe("Mock RWD Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("DecentralBank", async () => {
    it("has a default name", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance.toString(), tokens("1000000"));

      balance = await tether.balanceOf(decentralBank.address);
      assert.equal(balance.toString(), tokens("0"));
    });
  });

  describe("이자 농사", async () => {
    it("스테이킹 보상 토큰 발급", async () => {
      let result;

      result = await tether.balanceOf(customer);
      assert.equal(result.toString(), tokens("100"));

      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
      await decentralBank.depositTokens(tokens("100"), { from: customer });

      // 고객의 테더 토큰 잔액 확인
      result = await tether.balanceOf(customer);
      assert.equal(result.toString(), tokens("0"));

      // 고객이 스테이킹 되었는지 확인
      result = await decentralBank.stakingBalance(customer);
      assert.equal(result.toString(), tokens("100"));

      // 고객이 스테이킹 되었는지 확인
      result = await decentralBank.isStaking(customer);
      assert.equal(result, true);

      // 고객이 스테이킹 되었는지 확인
      result = await decentralBank.hasStaked(customer);
      assert.equal(result, true);

      // 탈중앙화 은행의 테더 토큰 잔액 확인
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(result.toString(), tokens("100"));

      // 탈중앙화 은행의 리워드 토큰 잔액 확인
      result = await rwd.balanceOf(decentralBank.address);
      assert.equal(result.toString(), tokens("1000000"));

      // 탈중앙화 은행의 리워드 토큰 발급
      await decentralBank
        .issueTokens({ from: customer })
        .should.be.rejectedWith("caller must be the owner");

      await decentralBank.issueTokens({ from: owner });

      // 고객의 리워드 토큰 잔액 확인
      result = await rwd.balanceOf(customer);
      assert.equal(result.toString(), tokens("11.111111111111111111"));
    });
  });
});
