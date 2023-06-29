// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./ERC20_For_Mockv1.sol";

contract MockERC20V1 is ERC20 {

    // added decimals in constructor
    constructor(uint256 _amount) ERC20("TokenERC20", "TKN20", 6) {
        _mint(msg.sender, _amount * 10 ** decimals());
    }
}