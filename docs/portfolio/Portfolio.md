# Portfolio



> Investment portfolios contract

You can only use this contract to add and remove liquidity in your portfolio



## Methods

### addLiquidity

```solidity
function addLiquidity(address[] _tokens, uint256[] _amounts, uint256 _idNFT) external payable
```

Adds liquidity to portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokens | address[] | addresses of tokens which should be in portfolio |
| _amounts | uint256[] | amounts of tokens which should be in portfolio |
| _idNFT | uint256 | id portfolio for adding liquidity |

### amaze

```solidity
function amaze() external view returns (contract NFT)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract NFT | undefined |

### buyPremium

```solidity
function buyPremium() external nonpayable
```

Changes premium status of sender




### calculator

```solidity
function calculator() external view returns (contract Calculator)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract Calculator | undefined |

### cost

```solidity
function cost() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### createPortfolio

```solidity
function createPortfolio(address[] _tokens, uint256[] _amounts) external payable
```

Creating NFT portfolio for user



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokens | address[] | addresses of tokens which should be in portfolio |
| _amounts | uint256[] | amounts of tokens which should be in portfolio |

### feeKeeper

```solidity
function feeKeeper() external view returns (address payable)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address payable | undefined |

### getAmaze

```solidity
function getAmaze() external view returns (address)
```

Get amaze




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | amaze address |

### getBalanceFee

```solidity
function getBalanceFee(address _token) external view returns (uint256)
```

Get balance of company margin for token address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | address | token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | balanceFee of this token |

### getCost

```solidity
function getCost() external view returns (uint256)
```

Get cost of premium status




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | cost of premium |

### getNativeToken

```solidity
function getNativeToken() external view returns (address)
```

Get native token address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | native address |

### getPaymentToken

```solidity
function getPaymentToken() external view returns (address)
```

Get paymentToken




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | paymentToken address |

### getTokenBalance

```solidity
function getTokenBalance(contract IERC20 _tokenAddress) external view returns (uint256)
```

Get balance token of this contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokenAddress | contract IERC20 | token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | balance of this accounts |

### native

```solidity
function native() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### paymentToken

```solidity
function paymentToken() external view returns (contract IERC20)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20 | undefined |

### removeLiquidity

```solidity
function removeLiquidity(address[] _tokens, uint256[] _amounts, uint256 _idNFT) external payable
```

Removing liquidity from portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokens | address[] | addresses of removing tokens |
| _amounts | uint256[] | amounts for remove |
| _idNFT | uint256 | id portfolio to remove liquidity |

### removePortfolio

```solidity
function removePortfolio(uint256 _idNFT) external payable
```

Removing all liquidity from portfolio and removing NFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | id portfolio to remove portfolio |

### removeSpecialAddress

```solidity
function removeSpecialAddress(address _specialAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _specialAddress | address | undefined |

### setAmaze

```solidity
function setAmaze(contract NFT _newAmaze) external nonpayable
```

Set NFT contract address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newAmaze | contract NFT | new NFT contract address |

### setCost

```solidity
function setCost(uint256 _newCost) external nonpayable
```

Set new cost for premium



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newCost | uint256 | new cost |

### setNativeToken

```solidity
function setNativeToken(address _newNative) external nonpayable
```

Set address for native token



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newNative | address | new address for native token |

### setPaymentToken

```solidity
function setPaymentToken(contract IERC20 _newToken) external nonpayable
```

Set payment token



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newToken | contract IERC20 | new address of payment token |

### setSpecialAddress

```solidity
function setSpecialAddress(address _specialAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _specialAddress | address | undefined |

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

### withdrawTokens

```solidity
function withdrawTokens(contract IERC20[] _tokenAddresses, uint256[] _amounts, uint256 _amountNative) external payable
```

Withdraws margin from contract portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokenAddresses | contract IERC20[] | token addresses to withdraw |
| _amounts | uint256[] | amounts of tokens to withdraw |
| _amountNative | uint256 | amount native |



## Events

### AddLiquidity

```solidity
event AddLiquidity(address indexed owner, uint256 indexed id, address[] tokens, uint256[] amounts, uint256[] prices, uint256 timestamp)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| id `indexed` | uint256 | undefined |
| tokens  | address[] | undefined |
| amounts  | uint256[] | undefined |
| prices  | uint256[] | undefined |
| timestamp  | uint256 | undefined |

### BuyPremium

```solidity
event BuyPremium(address indexed from, contract IERC20 indexed token, uint256 indexed amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| token `indexed` | contract IERC20 | undefined |
| amount `indexed` | uint256 | undefined |

### Create

```solidity
event Create(address indexed owner, uint256 indexed id, address[] tokens, uint256[] amounts, uint256[] prices, uint256 timestamp)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| id `indexed` | uint256 | undefined |
| tokens  | address[] | undefined |
| amounts  | uint256[] | undefined |
| prices  | uint256[] | undefined |
| timestamp  | uint256 | undefined |

### EtherFee

```solidity
event EtherFee(address indexed from, uint256 indexed amountFee)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| amountFee `indexed` | uint256 | undefined |

### Fallback

```solidity
event Fallback(address indexed sender, uint256 indexed value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender `indexed` | address | undefined |
| value `indexed` | uint256 | undefined |

### TokenFee

```solidity
event TokenFee(address indexed token, address indexed from, uint256 indexed amountFee)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token `indexed` | address | undefined |
| from `indexed` | address | undefined |
| amountFee `indexed` | uint256 | undefined |



