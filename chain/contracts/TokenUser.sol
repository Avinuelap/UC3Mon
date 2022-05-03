pragma solidity ^0.8.7;
/// @title TokenHelper
/// @author Avinuela👑
/// @notice Token interaction
/// @dev

// SPDX-License-Identifier: AFL-3.0

import "./UC3MCoin.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract TokenUser is Ownable {
  UC3MCoin public uc3mToken;

  function initialSupply(uint _supply) public {
    uc3mToken.mint(address(this), _supply);
  }

  function createUC3MToken(address _contract) public onlyOwner {
    uc3mToken = UC3MCoin(_contract);
  }

  function getTokenOwner() public view returns (address) {
    return uc3mToken.owner();
  }

  function getMsgSender() public view returns (address) {
    return msg.sender;
  }

  function _rewardPlayer(address _address, uint _reward) internal{
    uc3mToken.mint(_address, _reward);
  }
}
