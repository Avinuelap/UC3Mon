pragma solidity ^0.8.7;
/// @title NFT
/// @author Avinuela👑
/// @notice The place where NFT standard ERC721 implementation resides
/// @dev

// SPDX-License-Identifier: AFL-3.0

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
contract NFT is ERC721{
    constructor() ERC721("UC3Mon", unicode'👾') {}

    // ********* VARIABLES ********* //
    //El ADN de cada UC3Mon estará determinado por un número de 16 dígitos:
    uint dnaDigits = 16;
    // Para asegurar que el ADN de cada UC3Mon tenga solo 16 digitos usamos 10^16 para calcular modulos
    uint dnaModulus = 10 ** dnaDigits;

    // Struct UC3Mon
    struct UC3Mon {
        string name;
        string img;
        uint dna;
        int32 level;
        uint32 exp;
        bool fighting;
    }

    // Storage of existing UC3Mons
    UC3Mon[] public uc3mons;

    // ********* EVENTOS ********* //
    event NFTMinted(address sender, uint256 tokenId);
}
