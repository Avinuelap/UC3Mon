pragma solidity ^0.8.7;
/// @title NFT
/// @author Avinuela👑
/// @notice The place where NFT standard ERC721 implementation resides
/// @dev

// SPDX-License-Identifier: CC-BY-NC-ND-2.5

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
contract NFT is ERC721{
    constructor() ERC721("UC3Mon", unicode'👾') {}

    // ********* VARIABLES ********* //
    // Struct UC3Mon
    struct UC3Mon {
        string name;
        string img;
        int32 level;
        uint32 exp;
        bool isFighting;
    }

    // Storage of existing UC3Mons
    UC3Mon[] public uc3mons;

    // ********* EVENTOS ********* //
    event NFTMinted(address sender, uint256 tokenId);
}
