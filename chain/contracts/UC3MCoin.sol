pragma solidity ^0.8.7;
/// @title Token
/// @author Avinuela👑
/// @notice The place where Token standard ERC20 implementation resides
/// @dev

// SPDX-License-Identifier: CC-BY-NC-ND-2.5

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./utils/Managed.sol";

contract UC3MCoin is ERC20Burnable, Managed {
    constructor() ERC20("UC3MCoin", "UC3M") {}

function decimals() public view virtual override returns (uint8) {
        return 0;
    }
    function mint(address _address, uint256 _quantity) public onlyManager {
        _mint(_address, _quantity);
    }
}
