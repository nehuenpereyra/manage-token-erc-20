async function main() {
  /* Hardhat siempre ejecuta la tarea de compilación 
  al ejecutar scripts con su interfaz de línea de comando.
  */

  /* Si este script se ejecuta directamente usando `node`, 
  es posible que desee una compilación de llamada manualmente 
  para asegurarse de que todo esté compilado
  await hre.run('compile');
  */

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Supply Inicial
  let initialSupply = '10000000000000000000000'; // 10000 * 1e18

  // Obtenemos el contrato para implementar
  const Token = await ethers.getContractFactory("AsianToken");
  const token = await Token.deploy(initialSupply);

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });