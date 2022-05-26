pragma solidity ^0.8.7;
/// @title RandomNumberConsumer
/// @author Avinuela👑
/// @notice Randomizator using Chainlink. From https://docs.chain.link/docs/intermediates-tutorial/
/// @dev VRFConsumerBase contract at https://github.com/daiquilibrium/daiquilibrium-protocol/blob/master/protocol/contracts/lottery/chainlink/VRFConsumerBase.sol

// SPDX-License-Identifier: CC-BY-NC-ND-2.5

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract RandomNumberConsumer is VRFConsumerBase, Ownable{
    // Variables
    bytes32 internal s_keyHash;
    uint256 internal s_fee;
    uint256 private constant ROLL_IN_PROGRESS = 2500;
    mapping(bytes32 => uint32) private max_roll; //Needed for adaptation to PVP fights. Contains the maximum number to be rolled by a specific request. PVE is 100.
    mapping(bytes32 => address) private s_rollers;
    mapping(address => uint256) private s_results;

    /// These values comes from constructor in PVEArena
    //address vrfCoordinator = 0x3d2341ADb2D31f1c5530cDC622016af293177AE0;
    //address link = 0xb0897686c545045aFc77CF20eC7A532E3120E0F1;

    // Events
    event DiceRolled(bytes32 indexed requestId, address indexed roller);
    event ResultReceived(bytes32 indexed requestId, uint256 indexed result);

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     */
    constructor(address vrfCoordinator, address link, bytes32 keyHash, uint256 fee)
      VRFConsumerBase(vrfCoordinator, link){
        s_keyHash = keyHash;
        s_fee = fee;
      }

    // *************************************************************************
    // Modifiers
    /// Checks if result is available for a given address
    modifier ifResultIsAvailable (address roller){
      require(s_results[roller] != 0, "Player has not engaged in battle!");
      require(s_results[roller] != ROLL_IN_PROGRESS, "Battle in progress!");
      _;
    }

    // *************************************************************************
    // FUNCTIONS
    /// Getters
    function getRolledNumber(address _player) external view returns (uint256 result){
        return s_results[_player];
    }

    /// Roll dice. This function makes the necessary calls to Chainlink VRF
    /// @param _roller Address of monster owner, the address making the call for a random number
    /// @param _maxRoll Max number allowed to roll
    function rollDice(address _roller, uint32 _maxRoll) internal returns (bytes32 requestId){
        require(s_results[_roller]!= ROLL_IN_PROGRESS, "Wait for your other Mons to finish fighting");
        console.log("RNG Contract address",address(this));
        // Checking LINK balance
        require(LINK.balanceOf(address(this)) >= s_fee, "Not enough LINK in contract.");
        // Requesting randomness
        requestId = requestRandomness(s_keyHash, s_fee);
        max_roll[requestId] = _maxRoll;
        // Storing requestId and roller address
        s_rollers[requestId] = _roller;
        // Emitting event to signal rolling of dice
        s_results[_roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, _roller);
    }

    /// The coordinator sends the result of our generated randomness back to fulfillRandomness.
    /// @dev fulfillRandomness is a special function defined within the VRFConsumerBase contract that our contract extends from.
    function fulfillRandomness(bytes32 requestId, uint256 randomness) override internal {
        // Transform the result to a number between 0 and max_roll[requestId], both included. Using % as modulo
        require(max_roll[requestId]!=0, "Modulo zero!");
        uint256 d100Value = (randomness % max_roll[requestId]) + 1; // +1 so s_results[player] can be 0 if no dice has been rolled
        // Assign the transformed value to the address in the s_results mapping variable.
        s_results[s_rollers[requestId]] = d100Value;
        // Emit a ResultReceived event.
        emit ResultReceived(requestId, d100Value);
    }

    /// Determines whether the player wins or lose the battle against a PVE enemy, based on a fixed chance (0-100)
    /// @param _player Address of fighting Mon's owner
    /// @param _chance Chance of victory, determined by the enemy involved in the fight
    function PvePlayerWins(address _player, uint8 _chance) internal view returns (bool wins){
        console.log("Number rolled:", s_results[_player]);
        return s_results[_player] <= (_chance + 1); //+1 because dice is 1-101
    }

    /// Determines who of the two fighters win
    /// @param _player1 Address of first fighting Mon's owner
    /// @param _player2 Address of second fighting Mon's owner
    function PvpWinner(address _player1, address _player2) internal view returns(uint){
        console.log("Player1 number rolled:", s_results[_player1]);
        console.log("Player2 number rolled:", s_results[_player2]);
        if (s_results[_player1] > s_results[_player2]){
          console.log("Player 1 wins!");
          return 1;
        } else if (s_results[_player1] < s_results[_player2]){
          console.log("Player 2 wins!");
          return 2;
        } else {
          console.log("Its a draw!");
          return 0;
        }
    }
}
