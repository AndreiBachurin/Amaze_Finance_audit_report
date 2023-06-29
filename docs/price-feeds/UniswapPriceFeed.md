# UniswapPriceFeed









## Methods

### estimateAmountOut

```solidity
function estimateAmountOut(address tokenIn, address tokenOut, uint128 amountIn, uint32 secondsAgo, uint24 _fee) external view returns (uint256 amountOut)
```

Returns the latest price of token



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenIn | address | token for which we are requesting a price  |
| tokenOut | address | token in which we request a price |
| amountIn | uint128 | 1 * 10 ** decimals  |
| secondsAgo | uint32 | price for 10 seconds ago |
| _fee | uint24 | fee of pool |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountOut | uint256 | price of tokenIn  |

### factory

```solidity
function factory() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getFactory

```solidity
function getFactory() external view returns (address)
```

Get factory address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | factory factory address |

### setFactory

```solidity
function setFactory(address _newAddress) external nonpayable
```

Set factory address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newAddress | address | new factory address |




