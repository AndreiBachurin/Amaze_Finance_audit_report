# NFT



> NFT investment portfolios contract

You can only use this contract to get information about the user&#39;s portfolio



## Methods

### approve

```solidity
function approve(address to, uint256 tokenId) external nonpayable
```



*See {IERC721-approve}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| tokenId | uint256 | undefined |

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```



*See {IERC721-balanceOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### burn

```solidity
function burn(uint256 _idNFT) external nonpayable
```

Removes the NFT portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | NFT id for remove |

### getAddresses

```solidity
function getAddresses(uint256 _idNFT, uint256 _idTimeStamp) external view returns (address[])
```

Gets token addresses by timestamp id and NFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | NFT id for getting token addresses |
| _idTimeStamp | uint256 | timestamp id for getting token addresses |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | addresses returns the addresses of the tokens in the selected timestamp id |

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address)
```



*See {IERC721-getApproved}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getPeriods

```solidity
function getPeriods(uint256 _idNFT) external view returns (uint256[])
```

Get all periods of added liquidity



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | id of NFT portfolio |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256[] | uint256[] array of periods in seconds |

### getPortfolioAddress

```solidity
function getPortfolioAddress() external view returns (address)
```

Get portfolio address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | address portfolio contract address |

### getPortfolioTimestamps

```solidity
function getPortfolioTimestamps(uint256 _idNFT) external view returns (uint256[])
```

Get all timestamps of added liquidity



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | id of NFT portfolio |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256[] | uint256[] array of timestamps |

### getPriceData

```solidity
function getPriceData(uint256 _idNFT, address _token, uint256 _idTimeStamp) external view returns (struct NFT.infoPrice)
```

Gets amount and price of token by timestamp id, NFT and token address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | NFT id for getting amount and price of token |
| _token | address | token address  |
| _idTimeStamp | uint256 | timestamp id for setting price of token |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | NFT.infoPrice | infoPrice struct with amount and price |

### getStatus

```solidity
function getStatus(address _user) external view returns (bool)
```

Gets user&#39;s premium status



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | address of user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | bool true or false - status  |

### getTokenBalance

```solidity
function getTokenBalance(contract IERC20 _tokenAddress) external view returns (uint256)
```

Get balance of tokens in this contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokenAddress | contract IERC20 | address of token |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | uint256 amount in wei of tokens |

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool)
```



*See {IERC721-isApprovedForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| operator | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### mint

```solidity
function mint(address _user) external nonpayable
```

Сreates a new NFT portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | address of the owner of the new NFT portfolio |

### name

```solidity
function name() external view returns (string)
```



*See {IERC721Metadata-name}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address)
```



*See {IERC721-ownerOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### portfolio

```solidity
function portfolio() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### removeSpecialAddress

```solidity
function removeSpecialAddress(address _specialAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _specialAddress | address | undefined |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external nonpayable
```

Overrides safeTransferFrom function to don&#39;t allow user transfer NFT portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external nonpayable
```

Overrides safeTransferFrom function to don&#39;t allow user transfer NFT portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |
| data | bytes | undefined |

### setAddresses

```solidity
function setAddresses(uint256 _idNFT, uint256 _idTimeStamp, address[] _addresses) external nonpayable
```

Set token addresses by timestamp id and NFT



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | NFT id for setting token addresses |
| _idTimeStamp | uint256 | timestamp id for setting token addresses |
| _addresses | address[] | addresses of tokens to add |

### setAmount

```solidity
function setAmount(uint256 _idNFT, address _token, uint256 _idTimeStamp, uint256 _amount) external nonpayable
```

Set amount of token by timestamp id, NFT and token address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | NFT id for setting amount of token |
| _token | address | token address  |
| _idTimeStamp | uint256 | timestamp id for setting price of token |
| _amount | uint256 | new amount of tokens |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external nonpayable
```



*See {IERC721-setApprovalForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined |
| approved | bool | undefined |

### setInfo

```solidity
function setInfo(uint256 _idNFT, address[] _addresses, uint256 _timeStamp) external nonpayable
```

Set information about a new liquidity addition



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | id of NFT portfolio |
| _addresses | address[] | addresses of tokens that have been added |
| _timeStamp | uint256 | timestamp of new liquidity addition |

### setPortfolioAddress

```solidity
function setPortfolioAddress(address _newPortfolio) external nonpayable
```

Set new portfolio contract address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newPortfolio | address | new portfolio contract address |

### setPriceData

```solidity
function setPriceData(uint256 _idNFT, address _token, uint256 _idTimeStamp, uint256 _amount, uint256 _price) external nonpayable
```

Set amount and price of token by timestamp id, NFT and token address



#### Parameters

| Name | Type | Description |
|---|---|---|
| _idNFT | uint256 | NFT id for setting amount and price of token |
| _token | address | token address  |
| _idTimeStamp | uint256 | timestamp id for setting amount and price of token |
| _amount | uint256 | the number of tokens that have been added |
| _price | uint256 | the price of 1 token (1 * 10 ** decimals) |

### setSpecialAddress

```solidity
function setSpecialAddress(address _specialAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _specialAddress | address | undefined |

### setStatus

```solidity
function setStatus(address _user, bool _type) external nonpayable
```

Change of user&#39;s premium status



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | address of user |
| _type | bool | status |

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

### supply

```solidity
function supply() external view returns (uint256)
```

Get amount of NFT portfolios




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | uint256 number of created portfolios |

### supplyCounter

```solidity
function supplyCounter() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*See {IERC165-supportsInterface}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### symbol

```solidity
function symbol() external view returns (string)
```



*See {IERC721Metadata-symbol}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### tokenByIndex

```solidity
function tokenByIndex(uint256 index) external view returns (uint256)
```



*See {IERC721Enumerable-tokenByIndex}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### tokenOfOwnerByIndex

```solidity
function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)
```



*See {IERC721Enumerable-tokenOfOwnerByIndex}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### tokenURI

```solidity
function tokenURI(uint256 tokenId) external view returns (string)
```



*See {IERC721Metadata-tokenURI}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*See {IERC721Enumerable-totalSupply}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external nonpayable
```

Overrides transferFrom function to don&#39;t allow user transfer NFT portfolio



#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| tokenId | uint256 | undefined |

### withdrawTokensERC20

```solidity
function withdrawTokensERC20(contract IERC20 _tokenAddress, address _to, uint256 _amount) external nonpayable
```

Withdraws funds accidentally sent to this contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokenAddress | contract IERC20 | address of token |
| _to | address | recipient address |
| _amount | uint256 | amount to withdraw |



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| approved `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| operator `indexed` | address | undefined |
| approved  | bool | undefined |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |



