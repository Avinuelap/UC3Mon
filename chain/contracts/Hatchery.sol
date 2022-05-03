pragma solidity ^0.8.7;
/// @title Hatchery
/// @author Avinuela👑
/// @notice The place where all UC3Mons come from
/// @dev Contains all logic for monster creation, as well as storage of existing monsters

// SPDX-License-Identifier: AFL-3.0

import "./NFTHelper.sol";

contract Hatchery is NFTHelper{
    // FUNCTIONS

    /// Creation of UC3Mon
    /// @param _name Name to be given to new UC3Mon
    /// @dev As of now, DNA can be repeated in two different Mons if their names are the same. Anyway, their id (index in the array) will always be unique
    function createUC3Mon(string memory _name, string memory _img) public onlyOwner{
        uint dna = _generateRandomDna(_name);
        //string memory img = 'QmUGAgB5y3QqiHQEDMX6DCwcsemb896LsuYBxmQ4qbQrjq';
        _insertUC3Mon(_name, _img, dna, 1, msg.sender);
    }

    /// Creation of UC3Mon to an specified address
    /// @param _name Name to be given to new UC3Mon
    /// @dev As of now, DNA can be repeated in two different Mons if their names are the same. Anyway, their id (index in the array) will always be unique
    function createUC3MonToAddress(string memory _name, address _owner) public onlyOwner{
        // De momento solo se podrá crear un Mon por address
        // require(balanceOf(msg.sender)==0);
        uint dna = _generateRandomDna(_name);
        string memory img = 'QmUGAgB5y3QqiHQEDMX6DCwcsemb896LsuYBxmQ4qbQrjq';
        _insertUC3Mon(_name, img, dna, 1, _owner);
    }

    /// Inserts UC3Mon (Mon for short) in array, and mints new NFT
    /// @param _name Name to be given to new Mon
    /// @param _dna Dna to be given to new Mon
    function _insertUC3Mon(string memory _name, string memory _img, uint _dna, int32 _level, address _owner) internal{
        //Inserta el nuevo bicho y devuelve su id (.push devuelve el tamaño del array, por lo que tamaño - 1 será el ID del nuevo bicho)
        uc3mons.push(UC3Mon(_name, _img, _dna, _level, 0, false));
        uint id = uc3mons.length - 1;
        console.log('Owner of new NFT:', msg.sender);
        _mint(_owner, id);
        console.log('Minted new UC3Mon with name %s, image %s and ID %s', _name, _img, id);
        emit NFTMinted(_owner, id);
    }

    /// Generate random DNA from a string
    // @param _str String from which to generate dna
    function _generateRandomDna(string memory _str) internal view returns (uint){
        uint rand = uint(keccak256(bytes(_str)));
        return rand % dnaModulus;
    }
}
