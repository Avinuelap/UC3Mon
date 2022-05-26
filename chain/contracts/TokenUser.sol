pragma solidity ^0.8.7;
/// @title TokenHelper
/// @author Avinuela👑
/// @notice Token interaction
/// @dev

// SPDX-License-Identifier: CC-BY-NC-ND-2.5

import "./UC3MCoin.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract TokenUser is Ownable {
  UC3MCoin public uc3mToken;

  // Importa el contrato del token desde _contract
  function importUC3MToken(address _contract) public onlyOwner {
    uc3mToken = UC3MCoin(_contract);
  }

  function _rewardPlayer(address _address, uint _reward) internal{
    uc3mToken.mint(_address, _reward);
  }
}
