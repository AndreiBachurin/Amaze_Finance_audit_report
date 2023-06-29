// const { expect } = require("chai");
// const { BigNumber, utils } = require("ethers");
// const { ethers, deployments } = require("hardhat");

// function ether(eth) {
//     let weiAmount = ethers.utils.parseEther(eth)
//     return weiAmount;
// }

// function etherUsdt(eth) {
//   let weiAmount = ethers.utils.parseEther(eth) / 10 ** 12;
//   return weiAmount;
// }

// async function getLatestBlockTimestamp() {
//     return (await ethers.provider.getBlock("latest")).timestamp || 0;
// }
  
// async function skipTimeTo(timestamp) {
//     await network.provider.send("evm_setNextBlockTimestamp", [timestamp]);
//     await network.provider.send("evm_mine");
// }

// const FACTORY = "0x1f98431c8ad98523631ae4a59f267346ea31f984"
// const ethUSDC = "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0"
// const DAI_Address = "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046"
// const NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
// const DAY = 86400;
// const TWO_DAYS = 172800;
// const MONTH = 2592000;

// describe ("Portfolio_1", async function () {

//     beforeEach ("Deploy the contract", async function () {

//         DAI = await ethers.getContractFactory("MockERC20");
//         dai = await DAI.deploy(500);
//         await dai.deployed();

//         USDT = await ethers.getContractFactory("MockERC20V1");
//         usdt = await USDT.deploy(500);
//         await usdt.deployed();

//         NFT = await ethers.getContractFactory("NFT");
//         nft = await NFT.deploy(
//           owner.address, // special address
//         );
//         await nft.deployed();

//         ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
//         priceContract = await ChainlinkPriceFeed.deploy();
//         await priceContract.deployed();

//         UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed");
//         twap = await UniswapV3Twap.deploy(FACTORY);
//         await twap.deployed();

//         Calculator = await ethers.getContractFactory("Calculator");
//         calculator = await Calculator.deploy(
//           priceContract.address,
//           twap.address,
//           DAI_Address,
//           [ethUSDC],
//           [300],
//         );
//         await calculator.deployed();

//         Portfolio = await ethers.getContractFactory("Portfolio");
//         portfolio = await Portfolio.deploy(
//           nft.address, // nft address
//           dai.address, // payment token
//           calculator.address, // calculator
//           usdt.address, // native
//           user3.address, // fee keeper
//           ether("100"), // cost
//           owner.address, // special
//         );
//         await portfolio.deployed();


//         expect(await nft.specialAddresses(owner.address)).to.equal(true);
//         expect(await nft.specialAddresses(user1.address)).to.equal(false);
//         expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
//         await expect (nft.connect(user1).setPortfolioAddress(portfolio.address)).to.be.revertedWith("Not special address");
//         expect(await nft.connect(owner).setPortfolioAddress(portfolio.address));
//         expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);

//         expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));
//         expect(await usdt.balanceOf(owner.address)).to.equal(etherUsdt("500"));
//         expect(await dai.balanceOf(user1.address)).to.equal(ether("0"));
//         expect(await usdt.balanceOf(user1.address)).to.equal(etherUsdt("0"));

//         expect(await nft.balanceOf(owner.address)).to.equal(0);
//         expect(await nft.balanceOf(user1.address)).to.equal(0);
//         expect(await nft.balanceOf(user2.address)).to.equal(0);
//         expect(await nft.balanceOf(user3.address)).to.equal(0);

          
//     });

//     describe("Local functions", async function () {
//       it("buyPremium", async function () {
//         expect(await nft.connect(owner).getStatus(user1.address)).to.equal(false);
//         expect(await dai.connect(owner).balanceOf(owner.address)).to.equal(ether("500"));
//         expect(await dai.connect(owner).approve(portfolio.address, ether("100")));
//         expect(await portfolio.connect(owner).buyPremium());
//         expect(await nft.connect(owner).getStatus(owner.address)).to.equal(true);
//         expect(await dai.connect(owner).balanceOf(user3.address)).to.equal(ether("100"));

//         await expect (portfolio.connect(owner).buyPremium()).to.be.revertedWith("You alredy get premium status");
//       });

//       it("withdrawTokens", async function () {
//         // expect(await portfolio.connect(owner).setNativeToken(NATIVE));
//         expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));
//         expect(await usdt.balanceOf(owner.address)).to.equal(etherUsdt("500"));
//         expect(await portfolio.getTokenBalance(usdt.address)).to.equal(0);
//         expect(await portfolio.getTokenBalance(dai.address)).to.equal(0);
//         expect(await dai.connect(owner).transfer(portfolio.address, ether("120")));
//         expect(await usdt.connect(owner).transfer(portfolio.address, etherUsdt("120")));
//         expect(await portfolio.getTokenBalance(usdt.address)).to.equal(etherUsdt("120"));
//         expect(await portfolio.getTokenBalance(dai.address)).to.equal(ether("120"));

//         await expect (portfolio.connect(owner).withdrawTokens(
//           [dai.address],
//           [ether("0"), ether("1")],
//           [0]
//         )).to.be.revertedWith("Not same size");
//         await expect (portfolio.connect(owner).withdrawTokens(
//           [dai.address, usdt.address],
//           [ether("0")],
//           [0]
//         )).to.be.revertedWith("Not same size");
//         expect(await portfolio.connect(owner).withdrawTokens(
//           [dai.address],
//           [ether("0")],
//           [0]
//         ));
//         expect(await portfolio.getTokenBalance(usdt.address)).to.equal(etherUsdt("120"));
//         expect(await portfolio.getTokenBalance(dai.address)).to.equal(0);

//         expect(await portfolio.connect(owner).withdrawTokens(
//           [usdt.address],
//           [etherUsdt("130")],
//           [0]
//         ));

//         expect(await portfolio.getTokenBalance(usdt.address)).to.equal(0);
//         expect(await portfolio.getTokenBalance(dai.address)).to.equal(0);

//         const provider = ethers.provider;
//         expect (await provider.getBalance(portfolio.address)).to.equal(0);
//         await owner.sendTransaction({
//             to: portfolio.address,
//             value: ether("100"),
//         });
//         expect (await provider.getBalance(portfolio.address)).to.equal(ether("100"));

//         expect(await portfolio.connect(owner).withdrawTokens(
//           [usdt.address],
//           [etherUsdt("0")],
//           ether("25")
//         ));
//         expect (await provider.getBalance(portfolio.address)).to.equal(ether("75"));

//         expect(await usdt.connect(owner).transfer(portfolio.address, etherUsdt("120")));

//         await expect (portfolio.connect(user1).withdrawTokens(
//           [usdt.address],
//           [etherUsdt("20")],
//           ether("25")
//         )).to.be.revertedWith("Not special address");

//         expect(await portfolio.connect(owner).withdrawTokens(
//           [usdt.address],
//           [etherUsdt("20")],
//           ether("25")
//         ));
//         expect (await provider.getBalance(portfolio.address)).to.equal(ether("50"));
//         expect(await portfolio.getTokenBalance(usdt.address)).to.equal(etherUsdt("100"));
//       });

//       it("setPaymentToken setAmaze setNativeToken setCost", async function () {
//         expect(await portfolio.getPaymentToken()).to.equal(dai.address);
//         await expect (portfolio.connect(user1).setPaymentToken(usdt.address)).to.be.revertedWith("Not special address");
//         expect(await portfolio.connect(owner).setPaymentToken(usdt.address));
//         expect(await portfolio.getPaymentToken()).to.equal(usdt.address);

//         NFT1 = await ethers.getContractFactory("NFT");
//         nft1 = await NFT1.deploy(
//           owner.address, // special address
//         );
//         await nft1.deployed();

//         expect(await portfolio.getAmaze()).to.equal(nft.address);
//         await expect (portfolio.connect(user1).setAmaze(nft1.address)).to.be.revertedWith("Not special address");
//         expect(await portfolio.connect(owner).setAmaze(nft1.address));
//         expect(await portfolio.getAmaze()).to.equal(nft1.address);

//         expect(await portfolio.getNativeToken()).to.equal(usdt.address);
//         await expect (portfolio.connect(user1).setNativeToken(NATIVE)).to.be.revertedWith("Not special address");
//         expect(await portfolio.connect(owner).setNativeToken(NATIVE));
//         expect(await portfolio.getNativeToken()).to.equal(NATIVE);

//         expect(await portfolio.getCost()).to.equal(ether("100"));
//         await expect (portfolio.connect(user1).setCost(ether("251"))).to.be.revertedWith("Not special address");
//         expect(await portfolio.connect(owner).setCost(ether("258")));
//         expect(await portfolio.getCost()).to.equal(ether("258"));
//       });

//       it("", async function () {
        
//       });
//     });

// });
