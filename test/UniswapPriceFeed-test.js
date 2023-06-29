//addresses in polygon mainnet
const { expect } = require("chai")
const { ethers } = require("hardhat")

const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
// USDC
const TOKEN_0 = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" // 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619
const DECIMALS_0 = 18n
// WETH
const TOKEN_1 = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" // testnet 0x9c3c9283d3e44854697cd22d3faa240cfb032889
const DECIMALS_1 = 18n
// 0.3%
const FEE = 3000

describe("UniswapV3Twap", () => {
  it("get price", async () => {
    // require(tokenIn != tokenOut, "invalid token");

    // require(_pool != address(0), "pool doesn't exist");

    const UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed")
    const twap = await UniswapV3Twap.deploy(FACTORY)
    await twap.deployed()

    await expect (twap.estimateAmountOut(TOKEN_1, TOKEN_1, 10n ** DECIMALS_1, 10, FEE)).to.be.revertedWith("invalid token");
    await expect (twap.estimateAmountOut(TOKEN_1, ethers.constants.AddressZero, 10n ** DECIMALS_1, 10, FEE)).to.be.revertedWith("pool doesn't exist");
    const price = await twap.estimateAmountOut(TOKEN_1, TOKEN_0, 10n ** DECIMALS_1, 10, FEE);

    console.log(`price: ${price}`)

    expect(await twap.getFactory()).to.equal(FACTORY);
    expect(await twap.setFactory(ethers.constants.AddressZero));
    expect(await twap.getFactory()).to.equal(ethers.constants.AddressZero);
  })
})