const path = require("path");

const toWei = (num) => ethers.utils.parseEther(num.toString()).toString()
const fromWei = (num) => ethers.utils.formatEther(num)

async function main() {

  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
      "gets automatically created and destroyed every time. Use the Hardhat" +
      " option '--network localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", `${fromWei(await deployer.getBalance())} ETH`);

  let initialSupply = '1000000000000000000000'; // 1000 * 1e18

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy('CGEASS', 'CGS', initialSupply);

  console.log("Token address:", token.address);

  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "..", "frontend", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const pathSmartContract = path.join(contractsDir, "smart-contract.json")
  const deployTransaction = {
    hash: token.deployTransaction.hash,
    chainId: token.deployTransaction.chainId
  }
  let jsonSmartContract = {}
  if (fs.existsSync(pathSmartContract)) {
    jsonSmartContract = JSON.parse(fs.readFileSync(pathSmartContract))
    jsonSmartContract[deployTransaction.chainId] = token.address
    jsonSmartContract = JSON.stringify(jsonSmartContract, undefined, 2)
  } else {
    jsonSmartContract = JSON.stringify({ [`${deployTransaction.chainId}`] : token.address }, undefined, 2)
  }

  fs.writeFileSync(pathSmartContract, jsonSmartContract);

  console.log('File contract-address.json created in frontend')

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    path.join(contractsDir, "token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );

  console.log('File Token.json created in frontend')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });