// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

interface IUniswapPriceFeed {
    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint32 secondsAgo,
        uint24 _fee
    ) external view returns (uint amountOut);
}