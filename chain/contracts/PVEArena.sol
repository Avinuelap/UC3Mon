pragma solidity ^0.8.7;
/// @title PVEArena
/// @author Avinuela👑
/// @notice The Enemy Battlegrounds
/// @dev

// SPDX-License-Identifier: AFL-3.0

import "./RandomNumberConsumer.sol";
import "./Hatchery.sol";
import "./TokenUser.sol";

contract PVEArena is RandomNumberConsumer, Hatchery, TokenUser {
    // *************************************************************************
    // RandomNumberConsumer parameters for RINKEBY testnet, and constructor
    address _vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
    address _link = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    bytes32 _keyHash =
        0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    uint256 _fee = 0.1 * 10**18; // 0.1 LINK

    constructor()
        RandomNumberConsumer(_vrfCoordinator, _link, _keyHash, _fee)
    {}

    // *************************************************************************
    // VARIABLES
    // Struct enemy
    struct enemy {
        string name;
        string img;
        uint8 chance; // this reflects the victory chance of the mon fighting AGAINST the monster!
        bool alive;
    }
    // Storage of existing enemies
    enemy[] public enemies;

    // Number of alive enemies
    uint256 public numAliveEnemies;

    // Mapping to prevent earning rewards more than once from each fight. Second part of mapping refers to the ID of the enemy from which the reward has been taken
    mapping(address => uint256) private rewardEarned;

    // Max value for uint256. There will (hopefully) never exist that many enemies.
    // This indicates that the specific address is able to earn a reward again.
    uint256 private constant REWARD_AVAILABLE = 2**256 - 1;
    // Max pve dice roll. This gets complicated with pvp fights.
    uint32 private constant MAX_PVE_ROLL = 100;
    // EVENTS
    event createdEnemy(uint256 id, string name);

    // *************************************************************************
    // FUNCTIONS

    /// Fight Mon vs enemy
    /// @param _monId Unique Mon ID (index in array)
    /// @param _enemyId Unique enemy ID (index in array)
    /// @dev rollDice prevents a monster from fighting more than one battle at the same time
    /// @dev Random number takes a couple minutes to generate
    function fight(uint256 _monId, uint256 _enemyId) external {
        require(
            !uc3mons[_monId].fighting,
            "UC3Mon already engaged in a fight!"
        );
        setFighting(_monId, true);
        address _player = ownerOf(_monId);
        //console.log(_player);
        console.log(
            "Fighters:",
            uc3mons[_monId].name,
            "vs",
            enemies[_enemyId].name
        );
        //Only the Mon owner can call this function
        //require(msg.sender==ownerOf(_monId), "Fight caller must be the NFT owner");
        uint8 _chance = enemies[_enemyId].chance;
        console.log("Fight! Victory chance:", _chance, "%");
        rewardEarned[_player] = REWARD_AVAILABLE;
        rollDice(_player, MAX_PVE_ROLL);
    }

    /// Resolve battle according to chance of victory and deliver rewards and exp.
    /// @param _monId Unique Mon ID (index in array)
    /// @param _enemyId Unique enemy ID (index in array)
    /// @dev Function cannot be executed until the fight is over and random number generated is available
    /// @dev rewardEarned prevents exploits by ensuring only one reward is earned per fight
    function fightResult(uint256 _monId, uint256 _enemyId)
        external
        ifResultIsAvailable(ownerOf(_monId))
    {
        address _player = ownerOf(_monId);
        require(
            rewardEarned[_player] != _enemyId,
            "Fight already resolved, reward already earned"
        );
        rewardEarned[_player] = _enemyId; // So reward cannot be earned more than once from a single fight
        setFighting(_monId, false);
        uint8 _chance = enemies[_enemyId].chance;
        // Exp gained if the player wins is calculated as: 100 - chance
        uint8 _exp = 100 - _chance;
        if (PvePlayerWins(_player, enemies[_enemyId].chance)) {
            console.log("Player wins!");
            // Reward tokens are calculated as: (100*level) + (100*level * (100-chance) / 100)
            uint256 _reward = uint256(
                uint32(
                    (100 * uc3mons[_monId].level) +
                        ((100 * uc3mons[_monId].level) *
                            (100 - int32(int8(_chance)))) /
                        5
                )
            );
            _rewardPlayer(_player, _reward);

            _gainExp(_monId, _exp);
        } else {
            console.log("Monster wins!");
            // If the player loses, exp gained is reduced by a factor of 10
            _gainExp(_monId, _exp / 10);
        }
    }

    /// Create new enemy
    /// @param _name Name to be assigned to new enemy
    /// @param _chance Victory chance of the mon fighting AGAINST the enemy
    /// @dev Only contract owner can create new enemies
    function createEnemy(
        string memory _name,
        string memory _img,
        uint8 _chance
    ) public onlyOwner {
        enemies.push(enemy(_name, _img, _chance, true));
        uint256 id = enemies.length - 1;
        console.log("Created enemy with name", _name, "and ID", id);
        numAliveEnemies++;
        emit createdEnemy(id, _name);
    }

    /// "Kills" an enemy
    /// @param _enemyId Index of the enemy to kill
    function killEnemy(uint _enemyId) public onlyOwner {
      enemies[_enemyId].alive == false;
      numAliveEnemies--;
    }

    /// Get the indexes of alive enemies
    function getExistingEnemiesIds() external view returns (uint256[] memory) {
        //Create a list which will contain the index of every existing monster
        uint256[] memory aliveEnemies = new uint256[](numAliveEnemies);
        // Iterate through every monster checking if alive = true
        uint256 counter = 0;
        for (uint256 id = 0; id < enemies.length; id++) {
            if (enemies[id].alive) {
                aliveEnemies[counter] = id;
                counter++;
            }
        }
        return aliveEnemies;
    }

    /// Access to enemy array, by index
    /// @param _enemyId Index of the monster to be returned
    function getEnemyInfo(uint256 _enemyId) external view returns (enemy memory) {
        return enemies[_enemyId];
    }

    // // TEST FUNCTION
    // function testRewardOnThisAddress() public {
    //   //setUC3MTokenOwner(address(this));
    //   _rewardPlayer(msg.sender, 100);
    // }
}
