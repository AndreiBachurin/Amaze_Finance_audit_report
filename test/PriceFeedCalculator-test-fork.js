//addresses in polygon mainnet
const { expect } = require("chai")
const { ethers } = require("hardhat")
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
// USDC
const USDC = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" // 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa
const DECIMALS_0 = 18n
// WETH
const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" // testnet 0x9c3c9283d3e44854697cd22d3faa240cfb032889
const DECIMALS_1 = 18n
// 0.3%
const FEE = 3000
// Pair
// 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8

//const USDC = "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7"
const DAI = "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D"
const BTC = "0xc907E116054Ad103354f2D350FD2514433D57F6f"
const USDT = "0x0A6513e40db6EB1b165753AD52E80663aeA50545"
const Alpha = "0x289833F252eaB98582D62db94Bd75aB48AD9CF0D"
const DAI_ETH = "0xFC539A559e170f848323e19dfD66007520510085"

const margin = 4;
const chainlinkDecimals = 8;


function ether(eth) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount.toString();
}

describe("Calculator", async function () {
    beforeEach(async () => {
        
    });

    it("Owner functions and view functions", async function () {
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const mock0 = await MockERC20.deploy(100);
        await mock0.deployed();

        const MockERC20_1 = await ethers.getContractFactory("MockERC20V1");
        const mock1 = await MockERC20_1.deploy(100);
        await mock1.deployed();

        const ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
        const priceContract = await ChainlinkPriceFeed.deploy();
        await priceContract.deployed();

        const UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed");
        const twap = await UniswapV3Twap.deploy(FACTORY);
        await twap.deployed();

        const Calculator = await ethers.getContractFactory("Calculator");
        await expect(Calculator.deploy(priceContract.address, twap.address, DAI, margin, chainlinkDecimals, [BTC, DAI], [FEE])).to.be.revertedWith("Calculator: Different size");

        const calculator = await Calculator.deploy(
            priceContract.address,
            twap.address,
            USDC, // DAI
            margin,
            chainlinkDecimals,
            [BTC, WETH], 
            [FEE, FEE],
        );
        await calculator.deployed();

        const address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        await helpers.impersonateAccount(address);
        const impersonatedSigner = await ethers.getSigner(address);
        //expect(await calculator.setSpecialAddress(impersonatedSigner.address)).to.ok;

        await expect(calculator.connect(impersonatedSigner).setProxyInfo([BTC], [BTC])).to.be.revertedWith("Not special address");
        await expect(calculator.setProxyInfo([BTC, DAI], [BTC])).to.be.revertedWith("Calculator: Different size");
        await expect(calculator.setProxyInfo([BTC], [BTC])).to.ok;

        await expect(calculator.connect(impersonatedSigner).setUniswapFees([BTC], [FEE])).to.be.revertedWith("Not special address");
        await expect(calculator.setUniswapFees([BTC, DAI], [FEE])).to.be.revertedWith("Calculator: Different size");
        await expect(calculator.setUniswapFees([DAI], [FEE])).to.ok;

        const priceBTCLink1 = await calculator.getTokensPrice([BTC]);
        const priceBTCLink = await priceContract.getLatestPrice(BTC);
        console.log(`price: ${priceBTCLink1}`);
        console.log(`price: ${priceBTCLink}`);

        await expect(calculator.connect(impersonatedSigner).setChainlinkPriceFeed(priceContract.address)).to.be.revertedWith("Not special address");
        expect(await calculator.chainlinkPriceFeed()).to.equal(priceContract.address);
        expect(await calculator.setChainlinkPriceFeed(priceContract.address)).to.ok;
        expect(await calculator.chainlinkPriceFeed()).to.equal(priceContract.address);

        await expect(calculator.connect(impersonatedSigner).setStatusPriceFeedUniswap(true)).to.be.revertedWith("Not special address");
        expect(await calculator.statusPriceFeedUniswap()).to.equal(false);
        expect(await calculator.setStatusPriceFeedUniswap(true)).to.ok;
        expect(await calculator.statusPriceFeedUniswap()).to.equal(true);

        await expect(calculator.connect(impersonatedSigner).setUniswapPriceFeed(twap.address)).to.be.revertedWith("Not special address");
        expect(await calculator.uniswapPriceFeed()).to.equal(twap.address);
        expect(await calculator.setUniswapPriceFeed(twap.address)).to.ok;
        expect(await calculator.uniswapPriceFeed()).to.equal(twap.address);

        await expect(calculator.connect(impersonatedSigner).setUsd(USDC)).to.be.revertedWith("Not special address");
        expect(await calculator.usd()).to.equal(USDC);
        expect(await calculator.setUsd(USDC)).to.ok;
        expect(await calculator.usd()).to.equal(USDC);

        const priceWETHUni1 = await calculator.getTokensPrice([WETH]);
        const priceWETHUni = await twap.estimateAmountOut(WETH, USDC, 10n ** DECIMALS_1, 10, FEE)
        console.log(`price: ${priceWETHUni1}`);
        console.log(`price: ${priceWETHUni}`);

        await expect(calculator.connect(impersonatedSigner).setMargin(5)).to.be.revertedWith("Not special address");
        expect(await calculator.setMargin(5)).to.ok;
        expect(await calculator.margin()).to.equal(5);

        await expect(calculator.connect(impersonatedSigner).setChainlinkDecimals(8)).to.be.revertedWith("Not special address");
        expect(await calculator.setChainlinkDecimals(8)).to.ok;
        expect(await calculator.chainlinkDecimals()).to.equal(8);

        expect(await calculator.getUniswapFees(BTC)).to.equal(FEE);
        expect(await calculator.getChainlinkProxies(BTC)).to.equal(BTC);

        expect(await calculator.calculateMargin(1000, 2000)).to.equal(250000000);
        expect(await calculator.calculateMargin(1000, 800)).to.equal(0);

        expect(await calculator.editDecimalsTo8(ether("2"))).to.equal(200000000);
        console.log(await mock0.decimals());
        console.log(await mock1.decimals());

        expect(await calculator.editDecimalsToToken(ether("2"))).to.equal(20000000000);
        console.log(await mock0.decimals());
        console.log(await mock1.decimals());
    });

});