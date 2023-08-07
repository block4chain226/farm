// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Farm is Ownable, ReentrancyGuard {
    struct Position {
        uint256 amount;
        uint256 startDate;
    }

    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public fee = 1000 wei;
    uint256 public accRewardPerSecond = 100000000000000;
    uint256 public totalStaked;
    uint256 public totalRewardsPaid;

    mapping(address => Position) public positions;

    constructor(address _tokenA, address _tokenB){
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    event Stake(address indexed user, uint256 amount, uint256 indexed startDate);
    event Claim(address indexed user, uint256 amount, uint256 indexed date);
    event UnStake(address indexed user, uint256 amount, uint256 indexed date);
    event SetAccRewardPerSecond(uint256 oldAmount, uint256 newAmount, uint256 indexed date);
    event SetFee(uint256 oldFee, uint256 newFee, uint256 indexed date);
    event DepositRewardToken(uint256 amount, uint256 indexed date);

    modifier requireFee() {
        require(msg.value == fee, "you need to pay minting fee");
        _;
    }

    function stake(uint256 _amount) external payable requireFee {
        require(tokenB.balanceOf(msg.sender) >= _amount, "you don't have enough tokens");
        Position storage newPosition = positions[msg.sender];
        tokenB.transferFrom(msg.sender, address(this), _amount);
        if (newPosition.amount > 0) {
            claim();
        }
        newPosition.startDate = block.timestamp;
        newPosition.amount += _amount;
        totalStaked += _amount;
        emit Stake(msg.sender, _amount, newPosition.startDate);
    }

    function unStake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "amount 0");
        require(tokenB.balanceOf(address(this)) >= _amount, "contract hasn't enough tokens");
        Position storage userPosition = positions[msg.sender];
        require(userPosition.amount >= _amount, "you have not enough position amount");
        claim();
        userPosition.amount -= _amount;
        tokenB.transfer(msg.sender, _amount);
        totalStaked -= _amount;
        emit UnStake(msg.sender, _amount, block.timestamp);
    }
    //claim problem at unStake
    function claim() public {
        Position storage userPosition = positions[msg.sender];
        require(userPosition.amount > 0, "user don't stake");
        require(block.timestamp > userPosition.startDate, "time error");
        uint256 stakeTime = block.timestamp - userPosition.startDate;
        uint256 claimAmount = (userPosition.amount * 365 * accRewardPerSecond) / 1e18;
        console.log("claimAmount", claimAmount);
        require(claimAmount > 0, "user have not rewards");
        require(tokenA.balanceOf(address(this)) >= claimAmount, "contract has not enough reward tokens");
        tokenA.transfer(msg.sender, claimAmount);
        totalRewardsPaid += claimAmount;
        userPosition.startDate = block.timestamp;
        emit Claim(msg.sender, claimAmount, block.timestamp);
    }

    function depositRewardToken(uint256 _amount) external onlyOwner {
        require(_amount > 0, "amount 0");
        require(tokenA.balanceOf(owner()) >= _amount, "you have not enough reward tokens");
        require(tokenA.allowance(msg.sender, address(this)) >= _amount, "you haven't enough allowance");
        tokenA.transferFrom(owner(), address(this), _amount);
        emit DepositRewardToken(_amount, block.timestamp);
    }

    function setAccRewardPerSecond(uint256 _newAmount) private onlyOwner {
        require(_newAmount > 0, "accRewardPerShare can't be 0");
        uint256 oldAmount = accRewardPerSecond;
        accRewardPerSecond = _newAmount;
        emit SetAccRewardPerSecond(oldAmount, _newAmount, block.timestamp);
    }

    function setFee(uint256 _newFee) private onlyOwner {
        require(_newFee > 0, "accRewardPerShare can't be 0");
        uint256 oldFee = fee;
        fee = _newFee;
        emit SetFee(oldFee, _newFee, block.timestamp);
    }

}