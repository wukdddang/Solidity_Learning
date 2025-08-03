const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", (accounts) => {
  const [owner, customer, customer2, unauthorized] = accounts;
  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number.toString(), "ether");
  }

  // 각 테스트 전에 실행되는 설정
  beforeEach(async () => {
    // 새로운 컨트랙트 인스턴스 생성
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // 초기 토큰 분배
    await rwd.transfer(decentralBank.address, tokens("1000000"));
    await tether.transfer(customer, tokens("100"), { from: owner });
    await tether.transfer(customer2, tokens("50"), { from: owner });
  });

  describe("컨트랙트 배포", () => {
    it("올바른 이름으로 배포되어야 함", async () => {
      const tetherName = await tether.name();
      const rwdName = await rwd.name();
      const bankName = await decentralBank.name();

      assert.equal(tetherName, "Tether");
      assert.equal(rwdName, "Reward Token");
      assert.equal(bankName, "Decentral Bank");
    });

    it("초기 토큰 분배가 올바르게 되어야 함", async () => {
      const bankRwdBalance = await rwd.balanceOf(decentralBank.address);
      const bankTetherBalance = await tether.balanceOf(decentralBank.address);
      const customerTetherBalance = await tether.balanceOf(customer);

      assert.equal(bankRwdBalance.toString(), tokens("1000000"));
      assert.equal(bankTetherBalance.toString(), tokens("0"));
      assert.equal(customerTetherBalance.toString(), tokens("100"));
    });
  });

  describe("토큰 승인", () => {
    it("고객이 토큰 사용을 승인할 수 있어야 함", async () => {
      const approveAmount = tokens("50");

      await tether.approve(decentralBank.address, approveAmount, {
        from: customer,
      });

      const allowance = await tether.allowance(customer, decentralBank.address);
      assert.equal(allowance.toString(), approveAmount);
    });

    it("승인된 금액보다 많은 금액을 승인할 수 있어야 함", async () => {
      const approveAmount = tokens("200"); // 고객이 가진 것보다 많음

      await tether.approve(decentralBank.address, approveAmount, {
        from: customer,
      });

      const allowance = await tether.allowance(customer, decentralBank.address);
      assert.equal(allowance.toString(), approveAmount);
    });

    it("승인을 0으로 리셋할 수 있어야 함", async () => {
      await tether.approve(decentralBank.address, tokens("50"), {
        from: customer,
      });
      await tether.approve(decentralBank.address, 0, { from: customer });

      const allowance = await tether.allowance(customer, decentralBank.address);
      assert.equal(allowance.toString(), "0");
    });
  });

  describe("스테이킹 입금", () => {
    beforeEach(async () => {
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
    });

    it("고객이 스테이킹에 토큰을 입금할 수 있어야 함", async () => {
      const depositAmount = tokens("50");

      await decentralBank.depositTokens(depositAmount, { from: customer });

      const stakingBalance = await decentralBank.stakingBalance(customer);
      const customerBalance = await tether.balanceOf(customer);
      const bankBalance = await tether.balanceOf(decentralBank.address);

      assert.equal(stakingBalance.toString(), depositAmount);
      assert.equal(customerBalance.toString(), tokens("50")); // 100 - 50
      assert.equal(bankBalance.toString(), depositAmount);
    });

    it("스테이킹 상태가 올바르게 업데이트되어야 함", async () => {
      await decentralBank.depositTokens(tokens("50"), { from: customer });

      const isStaking = await decentralBank.isStaking(customer);
      const hasStaked = await decentralBank.hasStaked(customer);

      assert.equal(isStaking, true);
      assert.equal(hasStaked, true);
    });

    it("승인된 금액보다 많은 금액을 입금하려고 하면 실패해야 함", async () => {
      const tooMuchAmount = tokens("150"); // 승인된 100보다 많음

      await decentralBank
        .depositTokens(tooMuchAmount, { from: customer })
        .should.be.rejectedWith("VM Exception while processing transaction");
    });

    it("0 토큰을 입금하려고 하면 실패해야 함", async () => {
      await decentralBank
        .depositTokens(0, { from: customer })
        .should.be.rejectedWith("VM Exception while processing transaction");
    });

    it("토큰을 가지고 있지 않은 계정이 입금하려고 하면 실패해야 함", async () => {
      await tether.approve(decentralBank.address, tokens("10"), {
        from: unauthorized,
      });

      await decentralBank
        .depositTokens(tokens("10"), { from: unauthorized })
        .should.be.rejectedWith("VM Exception while processing transaction");
    });
  });

  describe("스테이킹 출금", () => {
    beforeEach(async () => {
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
      await decentralBank.depositTokens(tokens("50"), { from: customer });
    });

    it("고객이 스테이킹된 토큰을 출금할 수 있어야 함", async () => {
      await decentralBank.unstakeTokens({ from: customer });

      const stakingBalance = await decentralBank.stakingBalance(customer);
      const customerBalance = await tether.balanceOf(customer);
      const bankBalance = await tether.balanceOf(decentralBank.address);

      assert.equal(stakingBalance.toString(), "0");
      assert.equal(customerBalance.toString(), tokens("100")); // 원래대로 복구
      assert.equal(bankBalance.toString(), "0");
    });

    it("출금 후 스테이킹 상태가 올바르게 업데이트되어야 함", async () => {
      await decentralBank.unstakeTokens({ from: customer });

      const isStaking = await decentralBank.isStaking(customer);
      const hasStaked = await decentralBank.hasStaked(customer);

      assert.equal(isStaking, false);
      assert.equal(hasStaked, false);
    });

    it("스테이킹하지 않은 계정이 출금하려고 하면 실패해야 함", async () => {
      await decentralBank
        .unstakeTokens({ from: customer2 })
        .should.be.rejectedWith("VM Exception while processing transaction");
    });

    it("이미 출금한 계정이 다시 출금하려고 하면 실패해야 함", async () => {
      await decentralBank.unstakeTokens({ from: customer });
      await decentralBank
        .unstakeTokens({ from: customer })
        .should.be.rejectedWith("VM Exception while processing transaction");
    });
  });

  describe("리워드 토큰 발급", () => {
    beforeEach(async () => {
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
      await decentralBank.depositTokens(tokens("50"), { from: customer });
    });

    it("owner만 리워드 토큰을 발급할 수 있어야 함", async () => {
      await decentralBank.issueTokens({ from: owner });

      const customerRwdBalance = await rwd.balanceOf(customer);
      // 50 / 9 = 5.555555555555555555 (정수 나눗셈)
      assert.equal(customerRwdBalance.toString(), "5555555555555555555");
    });

    it("owner가 아닌 계정이 리워드 토큰을 발급하려고 하면 실패해야 함", async () => {
      await decentralBank
        .issueTokens({ from: customer })
        .should.be.rejectedWith("caller must be the owner");
    });

    it("스테이킹하지 않은 계정은 리워드를 받지 못해야 함", async () => {
      await decentralBank.issueTokens({ from: owner });

      const customer2RwdBalance = await rwd.balanceOf(customer2);
      assert.equal(customer2RwdBalance.toString(), "0");
    });

    it("여러 번 리워드를 발급할 수 있어야 함", async () => {
      await decentralBank.issueTokens({ from: owner });
      await decentralBank.issueTokens({ from: owner });

      const customerRwdBalance = await rwd.balanceOf(customer);
      // 5.555555555555555555 * 2 = 11.111111111111111110
      assert.equal(customerRwdBalance.toString(), "11111111111111111110");
    });
  });

  describe("엣지 케이스", () => {
    it("매우 큰 금액을 스테이킹해도 정상 작동해야 함", async () => {
      // customer2에게 큰 금액 전송 (실제로 가진 금액보다 적게)
      await tether.transfer(customer2, tokens("100"), { from: owner });
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer2,
      });

      await decentralBank.depositTokens(tokens("100"), { from: customer2 });

      const stakingBalance = await decentralBank.stakingBalance(customer2);
      assert.equal(stakingBalance.toString(), tokens("100"));
    });

    it("여러 계정이 동시에 스테이킹할 수 있어야 함", async () => {
      await tether.approve(decentralBank.address, tokens("50"), {
        from: customer,
      });
      await tether.approve(decentralBank.address, tokens("50"), {
        from: customer2,
      });

      await decentralBank.depositTokens(tokens("30"), { from: customer });
      await decentralBank.depositTokens(tokens("40"), { from: customer2 });

      const customerStaking = await decentralBank.stakingBalance(customer);
      const customer2Staking = await decentralBank.stakingBalance(customer2);
      const bankBalance = await tether.balanceOf(decentralBank.address);

      assert.equal(customerStaking.toString(), tokens("30"));
      assert.equal(customer2Staking.toString(), tokens("40"));
      assert.equal(bankBalance.toString(), tokens("70"));
    });

    it("스테이킹 후 출금 후 다시 스테이킹할 수 있어야 함", async () => {
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });

      // 첫 번째 스테이킹
      await decentralBank.depositTokens(tokens("50"), { from: customer });
      await decentralBank.unstakeTokens({ from: customer });

      // 두 번째 스테이킹
      await decentralBank.depositTokens(tokens("30"), { from: customer });

      const stakingBalance = await decentralBank.stakingBalance(customer);
      const isStaking = await decentralBank.isStaking(customer);

      assert.equal(stakingBalance.toString(), tokens("30"));
      assert.equal(isStaking, true);
    });
  });
});
