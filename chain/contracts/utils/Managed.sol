pragma solidity ^0.8.7;
/// @title Managed
/// @author Avinuela👑
/// @notice Support for contracts managed by other contracts
/// @dev

// SPDX-License-Identifier: AFL-3.0

import "@openzeppelin/contracts/access/Ownable.sol";

contract Managed is Ownable {
    mapping (address => bool) public managers;

    constructor() {
        managers[owner()] = true;
    }

    /**@dev Allows execution by managers only */
    modifier onlyManager {
        require(managers[msg.sender], "Only token managers can perform this action");
        _;
    }

    /// Checks if an address has manager privileges
    /// @param _address Address to be checked
    /// @return True if manager, False if not
    function isManager(address _address) public view returns(bool){
        return managers[_address];
    }

    /// Gives an address manager privileges
    /// @param _address Address to be added as manager
    /// @dev This action can only be performed from the original Managed contract, by its owner
    function addManager(address _address) public onlyOwner{
        managers[_address] = true;
    }

    /// Denies an address manager privileges
    /// @param _address Address to be removed from manager
    /// @dev This action can only be performed from the original Managed contract, by its owner
    function removeManager(address _address) public onlyOwner{
        managers[_address] = false;
    }
}
