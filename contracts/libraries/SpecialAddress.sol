// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

abstract contract SpecialAddress {
    
    mapping(address => bool) public specialAddresses;

    modifier _SpecialAddress() {
        require(specialAddresses[msg.sender], "Not special address");
        _;
    }

    function setSpecialAddress(address _specialAddress) external _SpecialAddress{
        specialAddresses[_specialAddress] = true;
    }

    function removeSpecialAddress(address _specialAddress) external _SpecialAddress{
        specialAddresses[_specialAddress] = false;
    }

}