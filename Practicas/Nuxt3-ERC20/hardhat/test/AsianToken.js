const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Asian Token contract", () => {

  async function deployTokenFixture() {
    const initialSupply = '10000000000000000000000'; // 10000 * 1e18

    // El metodo getContractFactory crea una instancia del contrato.
    const AsianToken = await ethers.getContractFactory("AsianToken");

    /* Signeren es un objeto que representa una cuenta de Ethereum.
   Se utiliza para enviar transacciones a contratos y otras cuentas.
   En este caso se conecta a la red  Hardhat Network.
   */
    const [owner, addr1, addr2] = await ethers.getSigners();

    /* Llamar deploy() del ContractFactory iniciará la implementación y 
    devolverá una Promise que se resuelve en un Contract. 
    Este es el objeto que tiene un método para cada una de sus funciones del 
    contrato inteligente.
    */
    const asianToken = await AsianToken.deploy(initialSupply);

    await asianToken.deployed();

    // Los Fixtures pueden devolver cualquier cosa que considere útil para sus pruebas.
    return { AsianToken, asianToken, owner, addr1, addr2, initialSupply };
  }

  describe("Deployment", function () {

    it("Should assign the total supply of tokens to the owner", async () => {
      const { asianToken, owner } = await loadFixture(deployTokenFixture);

      // Se obtiene el saldo de la cuenta del propietario.
      const ownerBalance = await asianToken.balanceOf(owner.address);

      /* Se compara si la cantidad de tokens suministrados es la misma que
      los que posee el propietario.
      */
      expect(await asianToken.totalSupply()).to.equal(ownerBalance);
    });

    it("The owner should have the same amount as the initial supply", async () => {
      const { owner, initialSupply, asianToken } = await loadFixture(deployTokenFixture);

      // Se obtiene el saldo de la cuenta del propietario.
      const ownerBalance = await asianToken.balanceOf(owner.address);

      expect(initialSupply).to.equal(ownerBalance);
    });
  })


  describe("Transactions", () => {

    it("Should transfer tokens between accounts", async function () {
      const { asianToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      /* Transfiere 50 tokens desde el owner a la dirección 1.
      Verifica con el metodo changeTokenBalances.
      */
      await expect(
        asianToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(asianToken, [owner, addr1], [-50, 50]);

      /* Transfiere 50 tokens desde la dirección 1 a la dirección 2.
      El metodo connect permite conectarse a otra cuenta.
      */
      await expect(
        asianToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(asianToken, [addr1, addr2], [-50, 50]);
    });

    // Verifica que se este ejecutando los eventos
    it("Should emit Transfer events", async function () {
      const { asianToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      await expect(asianToken.transfer(addr1.address, 50))
        .to.emit(asianToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      await expect(asianToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(asianToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });


    it("Should fail if sender doesn't have enough tokens", async function () {
      const { asianToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await asianToken.balanceOf(owner.address);

      /* Intenta enviar 1 token desde la direccion 1 (con 0 tokens)
      al owner. Se debe ejecutar el require que revierte la transaccion.
      */
      await expect(
        asianToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // El balance del owner no debiera haber cambiado.
      expect(await asianToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should transfer tokens from one account to another with approve", async function () {
      const { asianToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      /* Transfiere 50 tokens desde el owner a la dirección 1.
      Verifica con el metodo changeTokenBalances.
      */
      await expect(
        asianToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(asianToken, [owner, addr1], [-50, 50]);

      // Permitiendo gestionar desde la cuenta owner la cuenta 1
      await asianToken.connect(addr1).approve(owner.address, 50);

      // Verifica la cantidad de tokens que puede gestionar el owner
      await expect(50).to.equal(await asianToken.allowance(addr1.address, owner.address));
    
      /* Transfiere 50 tokens desde la direccion 1 a la 2 pero sin necesidad
      de realizar el 'connect' ya que tiene los permisos el owner.
      */
      await expect(
        asianToken.transferFrom(addr1.address, addr2.address, 50)
      ).to.changeTokenBalances(asianToken, [addr1, addr2], [-50, 50]);
    });

  })

});