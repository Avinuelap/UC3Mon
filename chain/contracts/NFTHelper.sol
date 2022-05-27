pragma solidity ^0.8.7;
/// @title NFTHelper
/// @author Avinuela👑
/// @notice The place where NFTs ask for help
/// @dev

// SPDX-License-Identifier: CC-BY-NC-ND-2.5

import "@openzeppelin/contracts/access/Ownable.sol"; // For ownership control

// Helper we wrote to encode in Base64
import "./utils/Base64.sol";
import "./utils/HelpFunctions.sol";
import "./NFT.sol";

contract NFTHelper is NFT, Ownable{
    /// Returns list with all UC3Mons owned by an address
    /// @param _owner Address from which to retrieve all owned UC3Mons
    function getOwnedMonsByAddress(address _owner) external view returns(uint[] memory){
        //Create a list with size equal to the number of Mons owned by _owner
        uint[] memory result = new uint[](balanceOf(_owner));
        // Iterate through every Mon checking if owner = _owner
        uint counter = 0;
        for (uint id=0; id < uc3mons.length; id++){
            if (ownerOf(id) == _owner){
                result[counter] = id;
                counter++;
            }
        }
        return result;
    }

    // If no paramater, use msg.sender
    function getOwnedMons() external view returns(uint[] memory){
        //Create a list with size equal to the number of Mons owned by _owner
        uint[] memory result = new uint[](balanceOf(msg.sender));
        // Iterate through every Mon checking if owner = _owner
        uint counter = 0;
        for (uint id=0; id < uc3mons.length; id++){
            if (ownerOf(id) == msg.sender){
                result[counter] = id;
                counter++;
            }
        }
        return result;
    }

    function getMonInfo(uint _id) external view returns(UC3Mon memory) {
        return uc3mons[_id];
    }

    /// Change name of a UC3Mon.
    /// @param _id Index of UC3Mon in array
    /// @param _newName New name to be assigned
    function changeName(uint _id, string memory _newName) internal {
        //Only the Mon owner can call this function
        require(msg.sender==ownerOf(_id));
        //Change the name
        uc3mons[_id].name = _newName;
    }
    /// Change value of 'fighting' in UC3Mon
    /// @param _id Index of UC3Mon in array
    /// @param _value True or False (fighting or not fighting)
    function setFighting(uint _id, bool _value) internal {
        //Set fighting to the passed value
        uc3mons[_id].isFighting = _value;
    }

    /// Gain exp. If 100 exp is reached, level up
    /// @param _id Index of UC3Mon in array
    /// @param _expGained Experience earned
    function _gainExp(uint _id, uint32 _expGained) internal {
        //Only the Mon owner can call this function
        //require(msg.sender==ownerOf(_id), "Only Mon owner can make it gain exp!");
        //Gain exp
        uc3mons[_id].exp += _expGained / uint32(uc3mons[_id].level); //Each level requires double the exp from the previous level
        //If 100 exp, levelUp and reset exp. Considers 'extra' experience from previous level
        if (uc3mons[_id].exp >= 100) {
            uint32 _extraExp = (uc3mons[_id].exp - 100) / uint32(uc3mons[_id].level + 1); // Take into account experience halving due to new level
            _levelUp(_id, _extraExp);
        }
    }

    /// Level up.
    /// @param _id Index of UC3Mon in array
    function _levelUp(uint _id, uint32 _extraExp) internal{
        uc3mons[_id].level += 1;
        uc3mons[_id].exp = _extraExp;
    }

     /// function to return tokenURI
    function tokenURI( uint256 _tokenId) 
                        public view override returns (string memory) 
    {   
        string memory json = Base64.encode(
             abi.encodePacked(
                '{"name": "',
                uc3mons[_tokenId].name,
                " -- ID #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play the UC3Mon Game", "image": "',
                uc3mons[_tokenId].img,
                '", "attributes": [ { "trait_type": "Level", "value": ',
                Strings.toString(uint32(uc3mons[_tokenId].level)),
                '}, { "trait_type": "Exp", "value": ',
                Strings.toString(uc3mons[_tokenId].exp),
                ', "max_value": ', Strings.toString(100),
                '}]}'
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

}
