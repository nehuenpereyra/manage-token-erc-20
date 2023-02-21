# Tutorial de Hardhat

## Configuración del proyecto

Creación del proyecto
```bash
mkdir hardhat-tutorial
cd hardhat-tutorial
npm init
npm install --save-dev hardhat
npx hardhat
```

En este tutorial vamos a utilizar nuestro plugin recomendado,
@nomicfoundation/hardhat-toolbox
, que tiene todo lo que necesita para desarrollar contratos inteligentes.

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

Se debe agregar la importación en el archivo ```hardhat.config.js```

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};
```

## Compilación de contratos
Para compilar el contrato ejecutar npx hardhat compile en su terminal. La computación es una de las tareas integradas.

```bash
npx hardhat compile
```

## Ejecutar los tests
Para correr los test se debe ejecutar en la terminal el siguiente comando:

```bash
npx hardhat test
```

## Deploy en live

Para hacer un deploy en live pero utilizando la red Hardhat Network (de prueba integrada en Hardhat) utilizar el siguiente comando:

```bash
npx hardhat run scripts/deploy.js
```

Para decirle a Hardhat que se conecte a una red Ethereum específica, puede usar el ```--network``` parámetro al ejecutar cualquier tarea:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

Para implementar en una red remota como mainnet o cualquier red de prueba, debe agregar una networkentrada a su archivo ```hardhat.config.js```. Usaremos Goerli para este ejemplo, pero puede agregar cualquier red de manera similar:

```javascript
require("@nomicfoundation/hardhat-toolbox");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "KEY";

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const GOERLI_PRIVATE_KEY = "YOUR GOERLI PRIVATE KEY";

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};
```

Finalmente, ejecuta:

```bash
npx hardhat run scripts/deploy.js --network goerli
```