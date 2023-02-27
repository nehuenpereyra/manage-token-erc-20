// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.4; 

// Importar un Smart Contract desde Openzeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Declaracion del Smart Contract 
contract AsianToken is ERC20 {

    constructor(uint256 initialSupply) ERC20("AsianToken", "AT") {
        _mint(msg.sender, initialSupply);
    }

    // Receive function
    receive() external payable {}

    // Fallback function
    fallback() external payable {}
}