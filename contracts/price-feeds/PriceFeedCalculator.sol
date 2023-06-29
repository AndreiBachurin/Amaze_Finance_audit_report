// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

import "../portfolio/NFT.sol";
import "./ChainlinkPriceFeed.sol";
import "../interfaces/IUniswapPriceFeed.sol";
import "../libraries/SpecialAddress.sol";

/// @title Price feed and calculator contract
/// @notice Here you can calculate the margin and price of tokens taken from oracles
contract Calculator is SpecialAddress {

    ChainlinkPriceFeed public chainlinkPriceFeed;
    IUniswapPriceFeed public uniswapPriceFeed;
    address public usd;
    uint256 public margin; 
    uint256 public chainlinkDecimals; 
    bool public statusPriceFeedUniswap;

    mapping(address => uint24) internal uniswapFees;
    mapping(address => address) internal chainlinkProxies; // address token => address proxy

    /// @notice Constructor, where the contract is initialized
    /// @param _chainlinkPriceFeed The contact address of the chanlink price feed
    /// @param _uniswapPriceFeed The contact address of the uniswap price feed
    /// @param _usd Stablecoin dollar address
    /// @param _margin Margin percentage
    /// @param _chainlinkDecimals Decimals of the chainlink, default 8
    /// @param _tokens Array of token addresses required for uniswap price feed
    /// @param _fees Array of fees for tokens required for uniswap price feed
    constructor(
        ChainlinkPriceFeed _chainlinkPriceFeed,
        IUniswapPriceFeed _uniswapPriceFeed,
        address _usd,
        uint256 _margin,
        uint256 _chainlinkDecimals,
        address[] memory _tokens,
        uint24[] memory _fees
    ) {
        chainlinkPriceFeed = _chainlinkPriceFeed;
        uniswapPriceFeed = _uniswapPriceFeed;
        usd = _usd;
        margin = _margin;
        chainlinkDecimals = _chainlinkDecimals;
        specialAddresses[msg.sender] = true;

        uint256 _size = _tokens.length;
        require(_size == _fees.length, "Calculator: Different size");
        for (uint256 i = 0; i < _size;) {
            uniswapFees[_tokens[i]] = _fees[i];
            unchecked { i++; }
        }
    }

    /// @notice Gets token prices in $
    /// @param _tokens An array of addresses of the tokens whose prices you want to get
    /// @return _prices returns the prices of the tokens in $
    function getTokensPrice(
        address[] calldata _tokens
    ) public view 
        returns (uint256[] memory) 
    {
        uint256 _size = _tokens.length;
        uint256[] memory _prices = new uint256[](_size);
        for(uint256 i = 0; i < _size;) {
            if (statusPriceFeedUniswap == false) { 
                _prices[i] = uint(chainlinkPriceFeed.getLatestPrice(chainlinkProxies[_tokens[i]]));
            } else {
                _prices[i] = uint(uniswapPriceFeed.estimateAmountOut(_tokens[i], usd, 10 ** 18, 10, uniswapFees[_tokens[i]]));
                _prices[i] = editDecimalsTo8(_prices[i]);
            }
            unchecked { i++; }
        }
        return _prices;
    }

    /// @notice Calculate margin
    /// @param _firstPrice Token price on deposit
    /// @param _lastPrice Token price on withdrawal
    /// @return _margins returns margin
    function calculateMargin(
        uint256 _firstPrice,
        uint256 _lastPrice
    ) external view 
        returns (uint256 _margins) 
    {
        if (_lastPrice > _firstPrice) {
            _margins = ((_lastPrice - _firstPrice) * margin / 100) * 100 * 10 ** chainlinkDecimals / _lastPrice;
        } else {
            _margins = 0;
        }
        return _margins;
    }

    /// @notice Edit token decimals to chainlink decimals
    /// @param _amount Token amount
    /// @return _amount returns amount in chainlink decimals
    function editDecimalsTo8(uint256 _amount) public view returns(uint256) {
        _amount = _amount / 10 ** (18 - chainlinkDecimals);        
        return _amount;
    }

    /// @notice Edit chainlink decimals to token decimals
    /// @param _amount Token amount
    /// @return _amount returns amount in token decimals
    function editDecimalsToToken(uint256 _amount) public view returns(uint256) {
        _amount = _amount / 10 ** chainlinkDecimals;
        return _amount;
    }

    /// @notice Set proxy for tokens for chainlink price feed
    /// @param _tokens An array of addresses of the tokens
    /// @param _proxies An array of addresses of the proxies in chainlink
    function setProxyInfo(
        address[] calldata _tokens,
        address[] calldata _proxies
    ) external _SpecialAddress
    {
        uint256 _size = _tokens.length;
        require(
            _size == _proxies.length,
            "Calculator: Different sizes"
        );
        for(uint256 i = 0; i < _size;) {
            chainlinkProxies[_tokens[i]] = _proxies[i];
            unchecked { i++; }
        }
    }

    /// @notice Set uniswap fees
    /// @param _tokens An array of addresses of the tokens
    /// @param _fees An array of addresses of the fees in uniswap
    function setUniswapFees(
        address[] calldata _tokens,
        uint24[] calldata _fees
    ) external _SpecialAddress
    {
        uint256 _size = _tokens.length;
        require(_size == _fees.length, "Calculator: Different size");
        for (uint256 i = 0; i < _size;) {
            uniswapFees[_tokens[i]] = _fees[i];
            unchecked { i++; }
        }
    }

    /// @notice Set chainlink price feed
    /// @param _chainlinkPriceFeed The contact address of the chanlink price feed
    function setChainlinkPriceFeed(ChainlinkPriceFeed _chainlinkPriceFeed) external _SpecialAddress {
        chainlinkPriceFeed = _chainlinkPriceFeed;
    }

    /// @notice Set status price feed uniswap. Needed only when our chanlink broke
    /// @param _statusPriceFeedUniswap Price feed from uniswap or chainlink
    function setStatusPriceFeedUniswap(bool _statusPriceFeedUniswap) external _SpecialAddress {
        statusPriceFeedUniswap = _statusPriceFeedUniswap;
    }

    /// @notice Set uniswap price feed
    /// @param _uniswapPriceFeed The contact address of the uniswap price feed
    function setUniswapPriceFeed(IUniswapPriceFeed _uniswapPriceFeed) external _SpecialAddress {
        uniswapPriceFeed = _uniswapPriceFeed;
    }

    /// @notice Set stablecoin dollar address
    /// @param _usd stablecoin dollar address
    function setUsd(address _usd) external _SpecialAddress {
        usd = _usd;
    }

    /// @notice Set margin
    /// @param _margin margin
    function setMargin(uint256 _margin) external _SpecialAddress {
        margin = _margin;
    }

    /// @notice set chainlink decimals
    /// @param _chainlinkDecimals chainlink decimals
    function setChainlinkDecimals(uint256 _chainlinkDecimals) external _SpecialAddress {
        chainlinkDecimals = _chainlinkDecimals;
    }

    /// @notice get uniswap fees
    /// @param _token address token
    /// @return uniswapFees returns uniswap fees
    function getUniswapFees(address _token) public view returns (uint24) {
        return uniswapFees[_token];
    }

    /// @notice get chainlink proxies
    /// @param _token address token
    /// @return chainlinkProxies returns chainlink proxies
    function getChainlinkProxies(address _token) public view returns (address) {
        return chainlinkProxies[_token];
    }
}