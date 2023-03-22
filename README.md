# Manage token ERC-20

This Token ERC20 administrator allows:
- Buy/Sell Tokens
- Transfer tokens between accounts
- Mint and burn tokens (only owner)
- View the amount of BNB in the contract (only owner)

## Prerequisites
Node JS must be installed in the system. The recommended version is:
- Node js (```node>=18```) with NPM (```npm>=9```).

## Installation of dependencies

```bash
# In the backend folder
npm i

# In the frontend folder
npm i
```

## Run the tests
```bash
# In the backend folder
npx hardhat test
```


## Execute developing software

```bash
# In the backend folder
npx hardhat node

# In the backend folder but in another terminal
npx hardhat run scripts/deploy.js --network localhost

# In the frontend folder
npm run dev
```