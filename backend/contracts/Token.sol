// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Token is ERC20, Ownable, ReentrancyGuard {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(address(this), initialSupply);
    }

    // Visualization of the Smart Contract Tokens Balance
    function balanceTokensSC() public view returns (uint256) {
        return balanceOf(address(this));
    }

    // Visualization of the Smart Contract Ethers Balance
    function balanceEthersSC() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    // Generation of new ERC-20 tokens
    function mint(uint256 amount) public onlyOwner {
        _mint(address(this), amount);
    }

    // Burn ERC-20 tokens
    function burn(uint256 amount) public onlyOwner {
        _burn(address(this), amount);
    }

    // ERC-20 tokens purchase - numToken * decimals()
    function buyTokens(uint256 numTokens) public payable nonReentrant {
        uint256 cost = priceTokens(numTokens / (10 ** decimals()));
        require(msg.value >= cost, "Buy less tokens or pay with more ethers");
        uint256 balance = balanceTokensSC();
        require(numTokens <= balance, "Buy a smaller number of tokens");
        uint256 returnValue = msg.value - cost;
        payable(msg.sender).transfer(returnValue);
        _transfer(address(this), msg.sender, numTokens);
    }

    // Smart Contract ERC-20 tokens return
    function repayTokens(uint numTokens) public payable nonReentrant {
        require(
            numTokens > 0,
            "You need to return a tokens number greater than 0"
        );
        require(
            numTokens <= balanceOf(msg.sender),
            "You don't have the tokens you want to return"
        );
        _transfer(msg.sender, address(this), numTokens);
        payable(msg.sender).transfer(priceTokens(numTokens / (10 ** decimals())));
    }

    // ERC-20 tokens price
    function priceTokens(uint256 numTokens) internal pure returns (uint256) {
        return numTokens * (0.01 ether);
    }
}
