# Hardhat

## Compile the contract
The following command allows you to compile contracts:

```bash
npx hardhat compile --force
```

## Test deployment
For the deployment of tests, the following commands in separate terminals must be executed:

```bash
# Allows the hardhat network to be lifted
npx hardhat node
```

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Deploy in Ganache
```bash
npx hardhat run scripts/deploy.js --network ganache
```

## Run the tests
To run the tests, the following command must be executed in the terminal:

```bash
npx hardhat test
```