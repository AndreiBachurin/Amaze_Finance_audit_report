# Calculator



> Price feed and calculator contract

Here you can calculate the margin and price of tokens taken from oracles



## Methods

### calculateMargin

```solidity
function calculateMargin(uint256 _firstPrice, uint256 _lastPrice) external view returns (uint256 _margins)
```

Calculate margin



#### Parameters

| Name | Type | Description |
|---|---|---|
| _firstPrice | uint256 | Token price on deposit |
| _lastPrice | uint256 | Token price on withdrawal |

#### Returns

| Name | Type | Description |
|---|---|---|
| _margins | uint256 | returns margin |

### chainlinkDecimals

```solidity
function chainlinkDecimals() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### chainlinkPriceFeed

```solidity
function chainlinkPriceFeed() external view returns (contract ChainlinkPriceFeed)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ChainlinkPriceFeed | undefined |

### editDecimalsTo8

```solidity
function editDecimalsTo8(uint256 _amount) external view returns (uint256)
```

Edit token decimals to chainlink decimals



#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | Token amount |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | _amount returns amount in chainlink decimals |

### editDecimalsToToken

```solidity
function editDecimalsToToken(uint256 _amount) external view returns (uint256)
```

Edit chainlink decimals to token decimals



#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | Token amount |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | _amount returns amount in token decimals |

### getChainlinkProxies

```solidity
function getChainlinkProxies(address _token) external view returns (address)
```

get chainlink proxies



#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | address | address token |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | chainlinkProxies returns chainlink proxies |

### getTokensPrice

```solidity
function getTokensPrice(address[] _tokens) external view returns (uint256[])
```

Gets token prices in $



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokens | address[] | An array of addresses of the tokens whose prices you want to get |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256[] | _prices returns the prices of the tokens in $ |

### getUniswapFees

```solidity
function getUniswapFees(address _token) external view returns (uint24)
```

get uniswap fees



#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | address | address token |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint24 | uniswapFees returns uniswap fees |

### margin

```solidity
function margin() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### removeSpecialAddress

```solidity
function removeSpecialAddress(address _specialAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _specialAddress | address | undefined |

### setChainlinkDecimals

```solidity
function setChainlinkDecimals(uint256 _chainlinkDecimals) external nonpayable
```

set chainlink decimals



#### Parameters

| Name | Type | Description |
|---|---|---|
| _chainlinkDecimals | uint256 | chainlink decimals |

### setChainlinkPriceFeed

```solidity
function setChainlinkPriceFeed(contract ChainlinkPriceFeed _chainlinkPriceFeed) external nonpayable
```

Set chainlink price feed



#### Parameters

| Name | Type | Description |
|---|---|---|
| _chainlinkPriceFeed | contract ChainlinkPriceFeed | The contact address of the chanlink price feed |

### setMargin

```solidity
function setMargin(uint256 _margin) external nonpayable
```

Set margin



#### Parameters

| Name | Type | Description |
|---|---|---|
| _margin | uint256 | margin |

### setProxyInfo

```solidity
function setProxyInfo(address[] _tokens, address[] _proxies) external nonpayable
```

Set proxy for tokens for chainlink price feed



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokens | address[] | An array of addresses of the tokens |
| _proxies | address[] | An array of addresses of the proxies in chainlink |

### setSpecialAddress

```solidity
function setSpecialAddress(address _specialAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _specialAddress | address | undefined |

### setStatusPriceFeedUniswap

```solidity
function setStatusPriceFeedUniswap(bool _statusPriceFeedUniswap) external nonpayable
```

Set status price feed uniswap. Needed only when our chanlink broke



#### Parameters

| Name | Type | Description |
|---|---|---|
| _statusPriceFeedUniswap | bool | Price feed from uniswap or chainlink |

### setUniswapFees

```solidity
function setUniswapFees(address[] _tokens, uint24[] _fees) external nonpayable
```

Set uniswap fees



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokens | address[] | An array of addresses of the tokens |
| _fees | uint24[] | An array of addresses of the fees in uniswap |

### setUniswapPriceFeed

```solidity
function setUniswapPriceFeed(contract IUniswapPriceFeed _uniswapPriceFeed) external nonpayable
```

Set uniswap price feed



#### Parameters

| Name | Type | Description |
|---|---|---|
| _uniswapPriceFeed | contract IUniswapPriceFeed | The contact address of the uniswap price feed |

### setUsd

```solidity
function setUsd(address _usd) external nonpayable
```

Set stablecoin dollar address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _usd | address | stablecoin dollar address |

### specialAddresses

```solidity
function specialAddresses(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### statusPriceFeedUniswap

```solidity
function statusPriceFeedUniswap() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### uniswapPriceFeed

```solidity
function uniswapPriceFeed() external view returns (contract IUniswapPriceFeed)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IUniswapPriceFeed | undefined |

### usd

```solidity
function usd() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |




