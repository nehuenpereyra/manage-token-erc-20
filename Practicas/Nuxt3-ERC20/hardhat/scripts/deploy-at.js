const path = require("path");

// Funciones de utilidad
const toWei = (num) => ethers.utils.parseEther(num.toString()).toString()
const fromWei = (num) => ethers.utils.formatEther(num)

async function main() {
  /* Hardhat siempre ejecuta la tarea de compilación 
  al ejecutar scripts con su interfaz de línea de comando.
  */

  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
      "gets automatically created and destroyed every time. Use the Hardhat" +
      " option '--network localhost'"
    );
  }

  /* Si este script se ejecuta directamente usando `node`, 
  es posible que desee una compilación de llamada manualmente 
  para asegurarse de que todo esté compilado
  await hre.run('compile');
  */

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", fromWei(await deployer.getBalance()));

  // Supply Inicial
  let initialSupply = '10000';

  // Obtenemos el contrato para implementar.
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy('AsianToken', 'AT', initialSupply);

  console.log("Token address:", token.address);

  /* También guardamos los artefactos y 
  la dirección del contrato en el directorio de frontend.
  */
  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "..", "frontend", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  console.log('File contract-address.json created in frontend')

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    path.join(contractsDir, "AsianToken.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );

  console.log('File AsianToken.json created in frontend')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });