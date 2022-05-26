pragma solidity ^0.8.7;
/// @title PVPArena
/// @author Avinuela👑
/// @notice The UC3Mon Battlegrounds
/// @dev

// SPDX-License-Identifier: CC-BY-NC-ND-2.5

import "./RandomNumberConsumer.sol";
import "./Hatchery.sol";

contract PVPArena is RandomNumberConsumer, Hatchery {
  // *************************************************************************
  // RandomNumberConsumer parameters for RINKEBY testnet, and constructor
  address _vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
  address _link = 	0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
  bytes32 _keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
  uint256 _fee = 0.1 * 10 ** 18; // 0.1 LINK
  constructor() RandomNumberConsumer(_vrfCoordinator, _link, _keyHash, _fee) {}

  // *************************************************************************
  // VARIABLES
  // Mapping to prevent earning rewards more than once from each fight. Second part of mapping refers to the ID of the enemy from which the reward has been taken
  mapping(address => address) private rewardEarned;
  // This indicates that the specific address is able to earn a reward again.
  address private constant REWARD_AVAILABLE = address(0);

  // *************************************************************************
  // FUNCTIONS

  /// Fight Mon vs Mon
  /// @param _monId1 Unique ID of first UC3Mon (index in array)
  /// @param _monId2 Unique ID of second UC3Mon (index in array)
  /// @dev rollDice prevents a monster from fighting more than one battle at the same time
  /// @dev Random number takes a couple minutes to generate
  function fight (uint _monId1, uint _monId2) external {
    require(!uc3mons[_monId1].isFighting, 'Mon 1 is already engaged in a fight!');
    require(!uc3mons[_monId2].isFighting, 'Mon 2 is already engaged in a fight!');
    require(ownerOf(_monId1) != ownerOf(_monId2), 'Two Mons with same owner cannot fight!');
    setFighting(_monId1, true);
    setFighting(_monId2, true);
    //require(1==0, 'setFighting OK');
    address _player1 = ownerOf(_monId1);
    address _player2 = ownerOf(_monId2);
    //console.log(_player);
    console.log("Fighters:", uc3mons[_monId1].name, "vs", uc3mons[_monId2].name);
    //Only the Mon owner can call this function
    //require(msg.sender==ownerOf(_monId), "Fight caller must be the NFT owner");
    console.log("Fight!");
    rewardEarned[_player1] = REWARD_AVAILABLE;
    rewardEarned[_player2] = REWARD_AVAILABLE;
    rollDice(_player1, uint32(uc3mons[_monId1].level * 100));
    rollDice(_player2, uint32(uc3mons[_monId2].level * 100));
  }

  /// Resolve battle and deliver rewards and exp.
  /// @param _monId1 Unique Mon1 ID (index in array)
  /// @param _monId1 Unique Mon2 ID (index in array)
  /// @dev Function cannot be executed until the fight is over and random numbers generated
  /// @dev rewardEarned prevents exploits by ensuring only one reward is earned per fight
  function fightResult (uint _monId1, uint _monId2) ifResultIsAvailable(ownerOf(_monId1)) ifResultIsAvailable(ownerOf(_monId2)) external{
    address _player1 = ownerOf(_monId1);
    address _player2 = ownerOf(_monId2);
    require(rewardEarned[_player1] != _player2, "Fight already resolved, reward already earned");
    require(rewardEarned[_player2] != _player1, "Fight already resolved, reward already earned");
    rewardEarned[_player1] = _player2; // So reward cannot be earned more than once from a single fight
    rewardEarned[_player2] = _player1; // So reward cannot be earned more than once from a single fight
    setFighting(_monId1, false);
    setFighting(_monId2, false);
    uint winner = PvpWinner(_player1, _player2);
    uint32 exp = HelpFunctions.calculateExp(winner, uc3mons[_monId1].level, uc3mons[_monId2].level);
    //gets here nicely
    //require(1==0, "forced require");
    if (winner == 1) {
      _gainExp(_monId1, exp);
    } else if (winner == 2){
      _gainExp(_monId2, exp);
    } else { // Draw
      _gainExp(_monId1, exp);
      _gainExp(_monId2, exp);
    }
  }
}
