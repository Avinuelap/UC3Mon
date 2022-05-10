pragma solidity ^0.8.7;
/// @title Managed
/// @author Avinuela👑
/// @notice Support for contracts managed by other contracts

// SPDX-License-Identifier: AFL-3.0

import "@openzeppelin/contracts/access/Ownable.sol";

contract Managed is Ownable {
    mapping (address => bool) public managers;

    constructor() {
        managers[owner()] = true;
        
        // Set dev account as manager
        managers[0x6FCF971066e89B51a2ECd1C04FddAda4bfa5aA20] = true;
    }

    /**@dev Allows execution by managers only */
    modifier onlyManager {
        require(managers[msg.sender], "Only token managers can perform this action");
        _;
    }

    /// Checks if caller address has manager privileges
    /// @return True if manager, False if not
    function isManager() public view returns(bool){
        return managers[msg.sender];
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
