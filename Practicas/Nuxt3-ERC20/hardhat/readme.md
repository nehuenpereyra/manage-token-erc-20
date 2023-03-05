# Hardhat

## Compilar el contrato
El siguiente comando permite compilar los contratos:

```bash
npx hardhat compile
```

## Despliegue de prueba
Para el despligue de pruebas se debe ejecutar en la terminal los siguiente comandos en terminales separadas:

```bash
# Permite levantar la red de  Hardhat
npx hardhat node
```

```bash
npx hardhat run scripts/deploy-at.js --network localhost
```

Para desplegar en ganache
```bash
npx hardhat run scripts/deploy-at.js --network ganache
```

## Ejecutar los tests
Para correr los test se debe ejecutar en la terminal el siguiente comando:

```bash
npx hardhat test
```