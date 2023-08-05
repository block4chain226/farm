// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenA is ERC20, Ownable {
    constructor() ERC20("TokenA", "TKA"){
        _mint(owner(), 1000000e18);
    }
}