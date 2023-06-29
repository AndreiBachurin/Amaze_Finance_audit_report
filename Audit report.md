# AMAZE PORTFOLIO AUDIT REPORT

##### Performed by Andrey Bachurin

## 1. INTRODUCTION

### 1.1 Disclaimer
The audit makes no statements or warranties about utility of the code, safety of the code, suitability of the business model,
investment advice, endorsement of the platform or its products, regulatory regime for the business model,
or any other statements about fitness of the contracts to purpose, or their bug free status. The audit documentation is 
for discussion purposes only. The information presented in this report is confidential and privileged. 
If you are reading this report, you agree to keep it confidential, not to copy, disclose or disseminate without the agreement of the Client.
If you are not the intended recipient(s) of this document, please note that any disclosure, copying or dissemination of its content is strictly forbidden.

### 1.2 Security Assessment Methodology

One auditor were involved in the work on the audit. He check the provided source code in accordance with the methodology described below:

#### 1. Project architecture review:

* General code review.
* Reverse research and study of the project architecture on the source code alone.


##### Stage goals
* Build an independent view of the project's architecture.
* Identifying logical flaws.


#### 2. Checking the code in accordance with the vulnerabilities checklist:

* Manual code check for vulnerabilities listed on the Contractor's internal checklist. The Contractor's checklist is constantly updated based on the analysis of hacks, research, and audit of the clients' codes.


##### Stage goal 
Eliminate typical vulnerabilities (e.g. reentrancy, gas limit, flash loan attacks etc.).

#### 3. Checking the code for compliance with the desired security model:

* Examination of contracts tests.
* Examination of comments in code.
* Comparison of the desired model obtained during the study with the reversed view obtained during the blind audit.

##### Stage goal
Detect inconsistencies with the desired model.


#### Finding Severity breakdown

All vulnerabilities discovered during the audit are classified based on their potential severity and have the following classification:

Severity | Description
--- | ---
Critical | Bugs leading to assets theft, fund access locking, or any other loss of funds.
High     | Bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement.
Medium   | Bugs that can break the intended contract logic or expose it to DoS attacks, but do not cause direct loss funds.
Low | Bugs that do not have a significant immediate impact and could be easily fixed.


### 1.3 Project Overview

Amaze Finance is platform for manage investment portfolio: create or delete investment portfolio, add or remove liquidity to portfolio. The platform uses Uniswap and Chainlink price oracles to get the current cost of the assets in the user's portfolio.

### 1.4 Project Dashboard

#### Project Summary

Title | Description
--- | ---
Client             | Amaze Portfolio
Project name       | Amaze Portfolio
Timeline           | 29.05.2023 - 03.06.2023
Number of Auditors | 1

#### Project Log

Date | Commit Hash | Note
--- | --- | ---
29.05.2023 | 2a3fdac5fad2f0c271980ec660157bfbde647097 | initial commit for the audit

#### Project Scope
The audit covered the following files:

File name | Link
--- | ---
libraries/SpecialAddress.sol | https://github.com/amaze-finance/Amaze-Portfolio/blob/2a3fdac5fad2f0c271980ec660157bfbde647097/contracts/libraries/SpecialAddress.sol
portfolio/NFT.sol | https://github.com/amaze-finance/Amaze-Portfolio/blob/2a3fdac5fad2f0c271980ec660157bfbde647097/contracts/portfolio/NFT.sol
portfolio/Portfolio.sol | https://github.com/amaze-finance/Amaze-Portfolio/blob/2a3fdac5fad2f0c271980ec660157bfbde647097/contracts/portfolio/Portfolio.sol
price-feeds/PriceFeedCalculator.sol | https://github.com/amaze-finance/Amaze-Portfolio/blob/2a3fdac5fad2f0c271980ec660157bfbde647097/contracts/price-feeds/PriceFeedCalculator.sol
price-feeds/UniswapPriceFeed.sol | https://github.com/amaze-finance/Amaze-Portfolio/blob/2a3fdac5fad2f0c271980ec660157bfbde647097/contracts/price-feeds/UniswapPriceFeed.sol
price-feeds/ChainlinkPriceFeed.sol | https://github.com/amaze-finance/Amaze-Portfolio/blob/2a3fdac5fad2f0c271980ec660157bfbde647097/contracts/price-feeds/ChainlinkPriceFeed.sol

### 1.5 Summary of findings

Severity | # of Findings
--- | ---
CRITICAL| 7
HIGH    | 2
MEDIUM  | 6
LOW | 4

### 1.6 Conclusion

The Amaze Portfolio audit identified 7 critical, 2 high, 6 medium and 4 low vulnerabilities. Code quality and readability left much to be desired, so only local recommendations to improve code readability were given in the Low section.

## 2. FINDINGS REPORT

### Critical

#### [C-1] Cross-contract reentrancy possibility through poisoned token in investment portfolio
##### Description
###### NFT.sol#L227
###### Portfolio.sol#L287,L391,L432
In `NFT` contract `withdrawTokensERC20()` function implements external call to the `transfer()` function of any ERC20-token contract to withdraw funds accidentally sent to contract.
The `transfer()` function of the token contract may contain malicious logic that implements a reentrancy attack on `removeLiquidity()` or `removePortfolio()` functions of `Portfolio` contract. This will result in a loss of funds for the project.
To implement a reentrancy attack, the malicious token contract must be the owner of idNFT to pass the `onlyNftOwner()` modifier. There are no barriers to this within the project scope.
##### Recomendation
1) Use check-effects-iterations pattern (e.g., update state of `Portfolio` contract before external call to ERC20 `transfer()`);
2) Maintain a whitelist of tokens whose addresses can be passed to the `withdrawTokensERC20()` function and restrict arbitrary token contract addresses from being passed to `withdrawTokensERC20()` function.

#### [C-2] Rug pull possibility
##### Description
###### Portfolio.sol#L414
By calling the `withdrawTokens()` function of the `Portfolio` smart contract from an address included in the specialAddress list, without additional checks, malicious project owners can withdraw all the funds on the contract (and the function description states that it is implemented to withdraw only margin from the project).
##### Recomendation
1) Rewrite the logic of the function so that it allows to withdraw only margin, not all funds from the project;
2) Implement the functionality to exclude the possibility to withdraw any funds from the protocol by one user (e.g. using multi-signature or role-based access model).

#### [C-3] Anyone can change factory address for oracle price manipulation
##### Description
###### UniswapPriceFeed.sol#L72
In `setFactory()` function of the `UniswapPriceFeed` contract anyone can set a new factory address. A custom factory contract can return fake `_pool` address, which return a distorted `tickCumulatives` array. This will lead to manipulate the tokens price returned by UniswapPriceFeed.
##### Recomendation
Use access modifier in the `setFactory()` function (e.g., `_SpecialAddress` or OpenZeppelin's onlyOwner).

#### [C-4] Blocking funds in the Portfolio due to a gas limit
##### Description
###### Portfolio.sol#L263,L365,L370
Loops in `removeLiquidity()` and `removePortfolio()` functions implements expensive gas external calls to tokens contracts for transfer tokens to `msg.sender`. Given that this loops is not limited (timestamps or tokens array length not limited), it can lead to reach gas limit so transaction will revert and funds will be locked on `Portfolio` contract without ability to withdraw.
##### Recomendation
Limit maximum number of timestamps and tokens in portfolio or divide heavy loops with external calls into several transactions.

#### [C-5] There is no mechanism for migration when switching to a new NFT-contract
##### Description
###### Portfolio.sol#L445
In `setAmaze()` function of the `Portfolio` contract settig a new NFT contract, but there is no provision for any contract state migration. Migrating to a new NFT contract will lead to reset NFT contract state: (ex. token balances), and the basic contract functions to become inoperable.
##### Recomendation
Implement the functionality of NFT-contract state migration during its replacement.

#### [C-5] No checks when changing the native token
##### Description
###### Portfolio.sol#L451
in the `setNativeToken()` function of the `Portfolio` contract, an arbitrary native token can be set without any checks. If the set token is not native for the blockchain on which the contract is deployed, the user's withdrawal of liquidity via `removeLiquidity()` or `removePortfolio()` will cause the transaction to rollback and block user funds.
##### Recomendation
1) Specify native token addresses for different blockchains in immutable contract constants;
2) In the setNativeToken() function, implement checking the address of the new native token against the address from step 1 for a particular blockchain;
3) Provide scripts that deploy a smart contact in a particular blockchain with the value of the native token address.

#### [C-6] No checks when installing a project's new native steblecoin
##### Description
###### PriceFeedCalculator.sol#L167
in the `setUsd()` function of the PriceFeedCalculator contract, `specialAddress` can set the address of an arbitrary contract as a stabelcoin contract without any checks.
##### Recomendation
1) Specify valid stablcoin addresses in immutable contract constants;
2) In the setUsd() function, implement checking the address of the new native stablecoin against the address from step 1;
3) Provide scripts for deployment of the smart contract, specifying the default value of the native stablecoin address.

#### [C-7] Incorrect work with the Uniswap price oracle
##### Description
###### PriceFeedCalculator.sol#L59
the PriceFeedCalculator's `getPrice()` function calls the Uniswap price oracle:
 ```Solidity
    _prices[i] = uint(uniswapPriceFeed.estimateAmountOut(_tokens[i], usd, 10 ** 18, 10, uniswapFees[_tokens[i]]));
 ```
 with the value "10" always passed as the fourth parameter (secondsAgo). If the value of a token in the pool is always taken for a fixed time of 10 seconds, then if the attacker manipulates the price oracle, the `Portfolio` contract will get the value of the assets in the portfolio distorted by the attacker.
##### Recomendation
Request the current correct "secondsAgo" value from the uniswapPriceFeed contract and use it when calling the `estimateAmountOut()` function of  `uniswapPriceFeed` contract.

### High

#### [H-1] Using only one price oracle
##### Description
###### PriceFeedCalculator.sol#L69
The logic of `getTokensPrice()` assumes that only one price oracle (Uniswap or Chainlink) is used at a time (depending on the value of the `statusPriceFeedUniswap` boolean variable), that does not protect against oracle price manipulation or unintended disabling of one of the price oracles.
###### Recomendation
Use multiple price oracles in parallel and compare their responses to determine the current correct token price, prevent price oracle manipulation or unplanned disable of one of the price oracle.

#### [H-2] Incorrect processing of Chainlink price oracle call results
##### Description
###### ChainlinkPriceFeed.sol#L20
The getLatestPrice() function of the ChainlinkPriceFeed contract calls the latestRoundData() function of the Chainlink price oracle, but only one parameter returned by the oracle is used:
 ```Solidity
    function getLatestPrice(address priceFeed) public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = IAggregatorV3Interface(priceFeed).latestRoundData();
        return price;
    }
 ```
but interacting with the Chainlink price oracle involves using all returned parameters to correctly process the response from the price oracle.
###### Recomendation
handle all parameters returned by `latestRoundData()` function.

### Medium

#### [M-1] Unsafe version of ERC20 transfer/transferFrom
##### Description
###### NFT.sol#L227
###### Portfolio.sol#L98,L184,L287,L391,L432
Some of the tokens do not revert on failed transfer/transferFrom, some tokens (like USDT) do not return bool as result of transfer/transferFrom. Thus, using unsafed versions of tranfer/transferFrom can lead to unexpected call results. 
###### Recomendation
Use OpenZeppelin's safeTransfer/safeTransferFrom library.

#### [M-2] DoS possibility due to reaching gas limit while loop iterating
##### Description
###### Portfolio.sol#L182
Loop in `_addLiquidity()` function implements expensive gas external calls to tokens contracts for receive tokens from `msg.sender`. Given that the loop is not limited (tokens array length not limited), it can lead to reach gas limit so transaction will revert.
###### Recomendation
Limit maximum number of tokens in portfolio or divide heavy loops with external calls into several transactions.

#### [M-3] Excessive centralization of administrative powers
##### Description
###### SpecialAddress.sol#L14
Adding and removing new `specialAddresses` that have access rights to the key functions of the `NFT`, `Portfolio` and `Calculator` contracts is done by single `msg.sender` that already has `specialAddress` rights. This could result in withdrawing all funds from the `Portfolio` contract via `withdrawTokens()` function, changing `Portfolio` parameters or changing the price feed contract by single user with excessive access rights.
###### Recomendation
Introduce multisig or role mechanism for admins (e.g., OpenZeppelin's AccessControl).

#### [M-4] No check of tokens balance before and after transfer
##### Description
###### Portfolio.sol#L98,L184
`buyPremium()` and `_addLiquidity()` functions accept tokens from the user, but do not check their token balance before and after the transfer. Given that the token contract may be poisoned (e.g. transferring less tokens than specified in the transfer), or the token contract may charge its own transfer fee, this can lead to undercounting of funds.
###### Recomendation
Add token balance check on the contract before and after the transfer.

#### [M-5] Error probability: division by zero
##### Description
###### UniswapPriceFeed.sol#L54
The `estimateAmountOut()` function has the mathematical operation of dividing without a remainder by the `secondsAgo` parameter. If it is zero, it will lead to error: division by zero.
###### Recomendation
Add token balance check on the contract before and after the transfer.

#### [M-6] No check of minimum margin value
##### Description
###### PriceFeedCalculator.sol#L89
If `(_lastPrice - _firstPrice) * margin` is less than 100, then `calculateMargin()` function will return zero as result of dividing by 100 and calculating `_margins`, that may be incorrect.
###### Recomendation
Add check for the minimum `margin` value, or additionally multiply by 100 and divide by 100 at the end of the calculation to correctly calculate the `_margins` value:
```Solidity
    _margins = ((_lastPrice - _firstPrice) * margin * 100 / 100) * 100 * 10 ** chainlinkDecimals / (_lastPrice * 100);
```

### Low

#### [L-1] Variables that can be set only once are not labeled immutable
##### Description
###### Portfolio.sol#L24,L26
The `feeKeeper` and `calculator` variables are only set in the constructor and cannot be changed further in the contract.
###### Recomendation
Label `feeKeeper` and `calculator` variables as immutable.

#### [L-2] Possibility to pass a non-existent idNFT and idTimeStamp
##### Description
###### NFT.sol#L66
It is possible to pass non-existent values `_idNFT` and `_idTimeStamp` to `getAddresses()` function, that will lead to return address zero. Considering that the `getAddresses()` function can be called by anyone with any parameters, this can affect external programs that interact with `NFT` contract.
###### Recomendation
Add an existence check of `_idNFT` and `_idTimeStamp`.

#### [L-3] Inefficient line order worsens code readability
##### Description
###### Portfolio.sol#L118,L119
In `createPortfolio()` function the local variable `_supply` is entered, equal `amaze.supply() + 1`, and then `mint()` function is called, which increments `supplyCounter` variable. 
###### Recomendation
Swap lines and improve code readability:
```Solidity
    amaze.mint(msg.sender);
    uint256 _supply = amaze.supply();
```

#### [L-4] The same checks can be replaced by the modifier
##### Description
###### Portfolio.sol#L211,L257,L422
The `getData()`, `removeLiquidity()`, and `withdrawTokens()` functions have the same checks that compare the length of the array of token addresses to the length of the array of amounts. 
###### Recomendation
Replace these checks to modifier (e.g. checkLength(tokens, amounts)), which will require these arrays to be the same length. This will improve the readability of the contract code.

