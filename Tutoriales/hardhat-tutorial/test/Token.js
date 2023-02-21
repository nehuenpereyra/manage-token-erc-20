const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", () => {

  async function deployTokenFixture() {
    // El metodo getContractFactory crea una instancia del contrato.
    const Token = await ethers.getContractFactory("Token");

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
    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // Los Fixtures pueden devolver cualquier cosa que considere útil para sus pruebas.
    return { Token, hardhatToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async () => {
      // LoadFixture permite no realizar tanta duplicación de codigo.
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      /* Este test espera que la variable del propietario almacenada en el 
      contrato sea igual al propietario de nuestro firmante.
      */
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async () => {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      // Se obtiene el saldo de la cuenta del propietario.
      const ownerBalance = await hardhatToken.balanceOf(owner.address);

      /* Se compara si la cantidad de tokens suministrados es la misma que
      los que posee el propietario.
      */
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  })

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfiere 50 tokens desde el owner a la dirección 1.
      await hardhatToken.transfer(addr1.address, 50);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

      /* Transfiere 50 tokens desde la dirección 1 a la dirección 2.
      El metodo connect permite conectarse a otra cuenta.
      */
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      /* Transfiere 50 tokens desde el owner a la dirección 1.
      Verifica con el metodo changeTokenBalances.
      */
      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      /* Transfiere 50 tokens desde la dirección 1 a la dirección 2.
      El metodo connect permite conectarse a otra cuenta.
      */
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    // Verifica que se este ejecutando los eventos
    it("Should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      /* Intenta enviar 1 token desde la direccion 1 (con 0 tokens)
      al owner. Se debe ejecutar el require que revierte la transaccion.
      */
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // El balance del owner no debiera haber cambiado.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  })
});