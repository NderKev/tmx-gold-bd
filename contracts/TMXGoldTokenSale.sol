// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TMXGoldTokenSale is Ownable, ReentrancyGuard {

    IERC20 public tmxToken;         // TMX Gold Token
    uint256 public salePriceWei;    // price in wei per token unit (1e18)
    uint256 public tokensSold;      // total tokens sold
    uint256 public saleEndTime;     // sale expiration timestamp

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 spent);
    event TokensWithdrawn(address indexed owner, uint256 amount);
    event SalePriceUpdated(uint256 oldPrice, uint256 newPrice);

    
    constructor(
    address _tokenAddress,
    uint256 _salePriceWei,
    uint256 _durationSeconds
) Ownable(msg.sender) {
    require(_tokenAddress != address(0), "Invalid token address");
    tmxToken = IERC20(_tokenAddress);

    salePriceWei = _salePriceWei;
    saleEndTime = block.timestamp + _durationSeconds;
}

    modifier saleActive() {
        require(block.timestamp < saleEndTime, "Sale has ended");
        _;
    }

    /**
     * @notice Buy TMX tokens during active sale
     */
    function buyTokens(uint256 tokenAmount) external payable nonReentrant saleActive {
        require(tokenAmount > 0, "Must buy at least 1 token");
        uint256 cost = tokenAmount * salePriceWei;
        require(msg.value >= cost, "Insufficient ETH sent");

        uint256 contractBalance = tmxToken.balanceOf(address(this));
        require(contractBalance >= tokenAmount, "Not enough tokens in sale contract");

        tokensSold += tokenAmount;
        tmxToken.transfer(msg.sender, tokenAmount);

        // refund leftover ETH
        if (msg.value > cost) {
            (bool refunded, ) = payable(msg.sender).call{ value: msg.value - cost }("");
            require(refunded, "Refund failed");
        }

        emit TokensPurchased(msg.sender, tokenAmount, cost);
    }

    /**
     * @notice Withdraw sale proceeds to owner
     */
    function withdrawFunds(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        to.transfer(balance);
    }

    /**
     * @notice Withdraw remaining tokens
     */
    function withdrawRemaining(address to) external onlyOwner {
        uint256 balance = tmxToken.balanceOf(address(this));
        require(balance > 0, "No tokens left");
        tmxToken.transfer(to, balance);
    }

    /**
     * @notice Update sale price
     */
    function updateSalePrice(uint256 newPriceWei) external onlyOwner {
        emit SalePriceUpdated(salePriceWei, newPriceWei);
        salePriceWei = newPriceWei;
    }
}
