# Hardhat

## Compilar el contrato
El siguiente comando permite compilar los contratos:

```bash
npx hardhat compile
```

## Despliegue de prueba
Para el despligue de pruebas se debe ejecutar en la terminal los siguiente comandos en terminales separadas:

```bash
# Hacemos una instancia de Hardhat Network con la que puede conectarse con Metamask
npx hardhat node
```

```bash
npx hardhat run scripts/deploy-at.js --network localhost
```

## Ejecutar los tests
Para correr los test se debe ejecutar en la terminal el siguiente comando:

```bash
npx hardhat test
```