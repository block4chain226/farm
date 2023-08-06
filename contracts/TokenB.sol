// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenB is ERC20, Ownable {

    constructor() ERC20("TokenB", "TKB"){
    }

    uint public a;

    function mint(address _account, uint256 _amount) external {
        require(_account != address(0), "zero address");
        require(_amount > 0, "amount should be more than 0");
        _mint(_account, _amount);
    }

    function set() public {
        a = 10;
    }
}