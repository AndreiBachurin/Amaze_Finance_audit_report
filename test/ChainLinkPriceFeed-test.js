//addresses in polygon mainnet
const { expect } = require("chai")
const { ethers } = require("hardhat")


const USDC = "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7"
const DAI = "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D"
const BTC = "0xc907E116054Ad103354f2D350FD2514433D57F6f"
const USDT = "0x0A6513e40db6EB1b165753AD52E80663aeA50545"
const Alpha = "0x289833F252eaB98582D62db94Bd75aB48AD9CF0D"
const DAI_ETH = "0xFC539A559e170f848323e19dfD66007520510085"
const ETH = "0xF9680D99D6C9589e2a93a78A04A279e509205945"


    describe("ChainlinkPriceFeed", async function () {
        it("get ETH price in USD", async () => {
            const ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
            const priceContract = await ChainlinkPriceFeed.deploy();
            await priceContract.deployed();
        
            const priceETH = await priceContract.getLatestPrice(ETH);
            console.log(`price: ${priceETH}`);
        });

        it("get USDC price in USD", async () => {
            const ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
            const priceContract = await ChainlinkPriceFeed.deploy();
            await priceContract.deployed();

            const priceUSDC = await priceContract.getLatestPrice(USDC);
            console.log(`price: ${priceUSDC}`);
          });

          it("get DAI price in USD", async () => {
            const ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
            const priceContract = await ChainlinkPriceFeed.deploy();
            await priceContract.deployed();

            const priceDAI = await priceContract.getLatestPrice(DAI);
            console.log(`price: ${priceDAI}`);
          });

          it("get USDT price in USD", async () => {
            const ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
            const priceContract = await ChainlinkPriceFeed.deploy();
            await priceContract.deployed();
            
            const priceUSDT = await priceContract.getLatestPrice(USDT);
            console.log(`price: ${priceUSDT}`);
          });

          it("get BTC price in USD", async () => {
            const ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
            const priceContract = await ChainlinkPriceFeed.deploy();
            await priceContract.deployed();
            
            const priceBTC = await priceContract.getLatestPrice(BTC);
            console.log(`price: ${priceBTC}`);
          });

          it("get Alpha price in USD", async () => {
            const ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
            const priceContract = await ChainlinkPriceFeed.deploy();
            await priceContract.deployed();
            
            const priceAlpha = await priceContract.getLatestPrice(Alpha);
            console.log(`price: ${priceAlpha}`);
          });
    });