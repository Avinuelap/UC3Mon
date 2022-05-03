pragma solidity ^0.8.7;
// SPDX-License-Identifier: AFL-3.0  
import "./Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
library HelpFunctions {
    /// max() function for int32 types
    /// @param a First number
    /// @param b Second number
    /// @return Max of both numbers
    function maxInt32(int32 a, int32 b) internal pure returns (int32){
        return a >= b ? a : b;
    }

    /// function to return tokenURI
    function tokenURI(  uint256 _id, 
                        string memory _name, 
                        string memory _img, 
                        uint _dna, 
                        uint32 _level,
                        uint _exp ) 
                        internal pure returns (string memory) 
    {   
        string memory json = Base64.encode(
             abi.encodePacked(
                '{"name": "',
                _name,
                " -- ID #: ",
                Strings.toString(_id),
                '", "description": "This is an NFT that lets people play the UC3Mon Game!", "image": "',
                _img,
                '", "attributes": [ { "trait_type": "DNA", "value": ',
                Strings.toString(_dna),
                '}, { "trait_type": "Level", "value": ',
                Strings.toString(_level),
                '}, { "trait_type": "Exp", "value": ',
                Strings.toString(_exp),
                ', "max_value": ', Strings.toString(100),
                '}]}'
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    /// Calculate experience gained by winner. As it gets a bit messy, its better to dedicate a new function to it
    /// @param _winner Winner of the fight (1/2, or 0 if they draw)
    /// @param _mon1Level Unique Mon1 ID (index in array)
    /// @param _mon2Level Unique Mon2 ID (index in array)
    /// @return exp Experience calculated
    /// @dev Formula: Exp = max(10, 100 - (LevelDiff * 25))
    function calculateExp(uint _winner, int32 _mon1Level, int32 _mon2Level) internal pure returns (uint32 exp) 
    {
        int32 _exp = 10;
        int32 _auxExp = 0;
        int32 _levelDiff = 0;

        if (_winner == 1) {
            //_monId1 is the winner
            _levelDiff = int32(_mon1Level - _mon2Level);
        } else if (_winner == 2){
        //_monId2 is the winner
        _levelDiff = int32(_mon2Level - _mon1Level);
        } else {
        //draw
        return uint32(_exp); // 10 experience gained for each fighter. TODO: this can get quite unfair
        }

        // If exp calculated is bigger than 10, all good. Otherwise, return 10. Basically, max(10, _auxExp)
        _auxExp = 100 - (_levelDiff * 25);
        _exp = maxInt32(_exp, _auxExp); //max function from Math.sol for int32 type
        return uint32(_exp);

    }
}