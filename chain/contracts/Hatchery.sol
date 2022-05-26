pragma solidity ^0.8.7;
/// @title Hatchery
/// @author Avinuela👑
/// @notice The place where all UC3Mons come from
/// @dev Contains all logic for monster creation, as well as storage of existing monsters

// SPDX-License-Identifier: CC-BY-NC-ND-2.5

import "./NFTHelper.sol";

contract Hatchery is NFTHelper{
    // FUNCTIONS

    /// Creation of UC3Mon
    function createUC3Mon(string memory _name, string memory _img) public onlyOwner{
        _insertUC3Mon(_name, _img, 1, msg.sender);
    }

    /// Creation of UC3Mon to an specified address
    function createUC3MonToAddress(string memory _name, string memory _img,  address _owner) public onlyOwner{
        _insertUC3Mon(_name, _img, 1, _owner);
    }

    /// Inserts UC3Mon (Mon for short) in array, and mints new NFT
    function _insertUC3Mon(string memory _name, string memory _img, int32 _level, address _owner) internal{
        //Inserta el nuevo bicho y devuelve su id (.push devuelve el tamaño del array, por lo que tamaño - 1 será el ID del nuevo bicho)
        uc3mons.push(UC3Mon(_name, _img, _level, 0, false));
        uint id = uc3mons.length - 1;
        console.log('Owner of new NFT:', msg.sender);
        _mint(_owner, id);
        console.log('Minted new UC3Mon with name %s, image %s and ID %s', _name, _img, id);
        emit NFTMinted(_owner, id);
    }
}
