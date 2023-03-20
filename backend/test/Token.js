const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);
const PRICE = 0.2;

describe("Token contract", () => {

  async function deployTokenFixture() {
    const initialSupply = '1000000000000000000000';

    const Token = await ethers.getContractFactory("Token");

    const [owner, addr1, addr2] = await ethers.getSigners();

    const token = await Token.deploy('AsianToken', 'AT', initialSupply);

    await token.deployed();

    return { token, owner, addr1, addr2, initialSupply };
  }

  async function buyTokens(token, address, numTokens) {
    const buyPriceInWei = toWei(numTokens * PRICE);
    await token.connect(address).buyTokens(toWei(numTokens), { value: buyPriceInWei });
  }

  describe("Deployment", () =>  {

    it("Should assign the total supply of tokens to the owner", async () => {
      const { token, owner } = await loadFixture(deployTokenFixture);

      const ownerBalance = await token.balanceOf(owner.address);

      expect(0).to.equal(ownerBalance);
    });

    it("The smart contract should have the same amount as the initial supply", async () => {
      const { token } = await loadFixture(deployTokenFixture);

      const scBalance = await token.balanceOf(token.address);

      expect(await token.totalSupply()).to.equal(scBalance);
    });
  })

  describe("Purchase and return of tokens to the smart contract", function () {

    it("Should pay the smart contract, transfer tokens to the buyer", async () => {
      const { token, addr1 } = await loadFixture(deployTokenFixture);
      const amount = 300;

      const scInitialEthBal = await ethers.provider.getBalance(token.address);
      const addr1InitialEthBal = await ethers.provider.getBalance(addr1.address);

      const scInitialTokensBal = await token.balanceOf(token.address);
      const addr1InitialTokensBal = await token.balanceOf(addr1.address);

      const totalPriceInWei = toWei(amount * PRICE);

      const tx = await token.connect(addr1).buyTokens(toWei(amount), { value: totalPriceInWei });
      const gas = tx.gasPrice
      await tx.wait();
      
      const scFinalEthBal = await ethers.provider.getBalance(token.address);
      const addr1FinalEthBal = await ethers.provider.getBalance(addr1.address);

      const scFinalTokensBal = await token.balanceOf(token.address);
      const addr1FinalTokensBal = await token.balanceOf(addr1.address);

      expect(fromWei(scFinalEthBal)).to.equal(fromWei(scInitialEthBal.add(totalPriceInWei)));
      expect(parseInt(fromWei(addr1FinalEthBal))).to.equal(parseInt(fromWei(addr1InitialEthBal.sub(totalPriceInWei).sub(gas))));

      expect(scFinalTokensBal).to.equal(scInitialTokensBal.sub(toWei(amount)));
      expect(addr1FinalTokensBal).to.equal(addr1InitialTokensBal.add(toWei(amount)));
    });

    it("Users should be able to return tokens", async () => {
      const { token, addr1 } = await loadFixture(deployTokenFixture);

      const numTokens = 50
      const buyPriceInWei = toWei(numTokens * PRICE);
      await token.connect(addr1).buyTokens(toWei(numTokens), { value: buyPriceInWei });

      const scInitialEthBal = await ethers.provider.getBalance(token.address);
      const addr1InitialEthBal = await ethers.provider.getBalance(addr1.address);

      const scInitialTokensBal = await token.balanceOf(token.address);
      const addr1InitialTokensBal = await token.balanceOf(addr1.address);

      const totalPriceInWei = toWei(numTokens * PRICE);
      
      const tx = await token.connect(addr1).repayTokens(toWei(numTokens));
      const gas = tx.gasPrice
      await tx.wait();

      const scFinalEthBal = await ethers.provider.getBalance(token.address);
      const addr1FinalEthBal = await ethers.provider.getBalance(addr1.address);

      const scFinalTokensBal = await token.balanceOf(token.address);
      const addr1FinalTokensBal = await token.balanceOf(addr1.address);

      expect(parseInt(fromWei(scInitialEthBal))).to.equal(numTokens * PRICE);
      expect(parseInt(fromWei(scFinalEthBal))).to.equal(0);
      expect(parseInt(fromWei(addr1FinalEthBal))).to.equal(parseInt(fromWei(addr1InitialEthBal.add(totalPriceInWei).sub(gas))));

      expect(scFinalTokensBal).to.equal(scInitialTokensBal.add(toWei(numTokens)));
      expect(addr1FinalTokensBal).to.equal(addr1InitialTokensBal.sub(toWei(numTokens)));
    });

  })

  describe("Transactions", () => {

    it("Should transfer tokens between accounts", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      await buyTokens(token, owner, 50)

      await expect(
        token.transfer(addr1.address, 50)
      ).to.changeTokenBalances(token, [owner, addr1], [-50, 50]);

      await expect(
        token.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(token, [addr1, addr2], [-50, 50]);
    });

    // Verifica que se este ejecutando los eventos
    it("Should emit Transfer events", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      await buyTokens(token, owner, 50)

      await expect(token.transfer(addr1.address, 50))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      await expect(token.connect(addr1).transfer(addr2.address, 50))
        .to.emit(token, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });


    it("Should fail if sender doesn't have enough tokens", async function () {
      const { token, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should transfer tokens from one account to another with approve", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      await buyTokens(token, owner, 50)

      await expect(
        token.transfer(addr1.address, 50)
      ).to.changeTokenBalances(token, [owner, addr1], [-50, 50]);

      await token.connect(addr1).approve(owner.address, 50);

      await expect(50).to.equal(await token.allowance(addr1.address, owner.address));

      await expect(
        token.transferFrom(addr1.address, addr2.address, 50)
      ).to.changeTokenBalances(token, [addr1, addr2], [-50, 50]);
    });

  }),
  describe("Token and Ethers Balance in the smart contract", () => {

    it("Should show Tokens balances correctly", async () => {
      const { token, addr1 } = await loadFixture(deployTokenFixture);

      const scBalance = await  token.balanceOf(token.address);
      const scBalance2 = await token.connect(addr1).balanceTokensSC();
      
      expect(await token.totalSupply()).to.equal(scBalance);
      expect(await token.totalSupply()).to.equal(scBalance2);
    });

    it("Should show ethers balances in the contract correctly", async () => {
      const { token, owner } = await loadFixture(deployTokenFixture);
      const numTokens = 50
      const scBalanceInitialEther = await  token.connect(owner).balanceEthersSC();
      await buyTokens(token, owner, numTokens)
      const scBalanceFinalEther = await  token.connect(owner).balanceEthersSC();
      
      expect(scBalanceInitialEther).to.equal(0);
      expect(scBalanceFinalEther).to.equal(numTokens*PRICE);
    });

    it("Should not allow one that is not Owner show the ether balance", async () => {
      const { token, addr1 } = await loadFixture(deployTokenFixture);
      await expect(
        token.connect(addr1).balanceEthersSC()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

  })
  describe("Mint and burn tokens", () => {

    it("Mint tokens", async () => {
      const { token, addr1, owner } = await loadFixture(deployTokenFixture);
      const numTokens = 50

      const scInitialBalance = await  token.balanceOf(token.address);

      await expect(
        token.connect(addr1).mint(numTokens)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      
      await token.connect(owner).mint(numTokens)

      const scFinalBalance = await  token.balanceOf(token.address);
     
      expect(scFinalBalance.toString()).to.equal(scInitialBalance.add(numTokens).toString());
    });

    it("Burn tokens", async () => {
      const { token, addr1, owner } = await loadFixture(deployTokenFixture);
      const numTokens = 50

      const scInitialBalance = await  token.balanceOf(token.address);

      await expect(
        token.connect(addr1).burn(numTokens)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      
      await token.connect(owner).burn(numTokens)

      const scFinalBalance = await  token.balanceOf(token.address);
     
      expect(scFinalBalance.toString()).to.equal(scInitialBalance.sub(numTokens).toString());
    });
    
  })
});