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

// const DAY = 86400;
// const TWO_DAYS = 172800;
// const MONTH = 2592000;

// describe ("NFT", async function () {
//     let owner, user1, user2, user3;

//     beforeEach ("Deploy the contract", async function () {
//         [owner, user1, user2, user3] = await ethers.getSigners();

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

//         expect(await nft.specialAddresses(owner.address)).to.equal(true);
//         expect(await nft.specialAddresses(user1.address)).to.equal(false);
//         expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
//         await expect (nft.connect(user1).setPortfolioAddress(owner.address)).to.be.revertedWith("Not special address");
//         expect(await nft.connect(owner).setPortfolioAddress(owner.address));
//         expect(await nft.getPortfolioAddress()).to.equal(owner.address);

//         expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));
//         expect(await usdt.balanceOf(owner.address)).to.equal(etherUsdt("500"));
//         expect(await dai.balanceOf(user1.address)).to.equal(ether("0"));
//         expect(await usdt.balanceOf(user1.address)).to.equal(etherUsdt("0"));

//         expect(await nft.balanceOf(owner.address)).to.equal(0);
//         expect(await nft.balanceOf(user1.address)).to.equal(0);
//         expect(await nft.balanceOf(user2.address)).to.equal(0);
//         expect(await nft.balanceOf(user3.address)).to.equal(0);

//         // expect(await token.connect(owner).mint(owner.address, ether("500")));
//         // expect(await token.connect(owner).changeMintOnce());
//         // expect(await token.connect(owner).mint(user1.address, ether("500")));
//         // expect(await token.connect(owner).changeMintOnce());
//         // expect(await token.connect(owner).mint(user2.address, ether("500")));
//         // expect(await token.connect(owner).changeMintOnce());
//         // expect(await token.balanceOf(owner.address)).to.equal(ether("500"));
//         // expect(await token.balanceOf(user1.address)).to.equal(ether("500"));
//         // expect(await token.balanceOf(user2.address)).to.equal(ether("500"));

//         // // set address cinema
//         // expect(await nft.connect(owner)._addressCinema()).to.equal(ethers.constants.AddressZero);
//         // await expect (nft.connect(user2).setAddressCinema(cinema.address)).to.be.revertedWith("Not special address");
//         // expect(await nft.connect(owner)._addressCinema()).to.equal(ethers.constants.AddressZero); 
//         // expect(await nft.connect(owner).setAddressCinema(cinema.address));
//         // expect(await nft.connect(owner)._addressCinema()).to.equal(cinema.address);
          
//     });

  

//     describe("Set functions", async function () {
//         it("setAddresses and getAddresses", async function () {
//           await expect (nft.connect(owner).setAddresses(1, 0, [usdt.address])).to.be.revertedWith("NFT not found");

//           expect(await nft.supply()).to.equal(0);
//           expect(await nft.connect(owner).balanceOf(user1.address)).to.equal(0);
//           await expect (nft.connect(user1).mint(user1.address)).to.be.revertedWith("Not portfolio contract");
//           expect(await nft.connect(owner).mint(user1.address));
//           expect(await nft.connect(owner).balanceOf(user1.address)).to.equal(1);
//           expect(await nft.supply()).to.equal(1);

//           await expect (nft.connect(user1).setAddresses(1, 0, [usdt.address])).to.be.revertedWith("Not portfolio contract");

//           let _getAddresses1 = await nft.connect(owner).getAddresses(1, 0);
//           console.log(_getAddresses1);
//           expect(await nft.connect(owner).setAddresses(1, 0, [usdt.address]));
//           let _getAddresses2 = await nft.connect(owner).getAddresses(1, 0);
//           console.log(_getAddresses2);
//           expect(_getAddresses2[0]).to.equal(usdt.address);

//           expect(await nft.connect(owner).setAddresses(1, 1, [dai.address, usdt.address]));
//           let _getAddresses3 = await nft.connect(owner).getAddresses(1, 1);
//           console.log(_getAddresses3);
//           expect(_getAddresses3[0]).to.equal(dai.address);
//           expect(_getAddresses3[1]).to.equal(usdt.address);

//           await expect (nft.connect(user1).burn(1)).to.be.revertedWith("Not portfolio contract");
//           expect(await nft.connect(owner).burn(1));

//           expect(await nft.connect(owner).balanceOf(user1.address)).to.equal(0);
//           await expect (nft.connect(owner).setAddresses(1, 0, [usdt.address])).to.be.revertedWith("NFT not found");
//         });

//         it("setPriceData and setAmount and getPriceData", async function () {
//           await expect (nft.connect(owner).setPriceData(1, usdt.address, 0, etherUsdt("100"), 2)).to.be.revertedWith("NFT not found");
//           await expect (nft.connect(owner).setAmount(1, usdt.address, 0, etherUsdt("100"))).to.be.revertedWith("NFT not found");
//           expect(await nft.connect(owner).mint(user1.address));
//           await expect (nft.connect(user1).setPriceData(1, usdt.address, 0, etherUsdt("100"), 2)).to.be.revertedWith("Not portfolio contract");
//           await expect (nft.connect(user1).setAmount(1, usdt.address, 0, etherUsdt("100"))).to.be.revertedWith("Not portfolio contract");

//           let _getPriceData1 = await nft.connect(owner).getPriceData(1, usdt.address, 0);
//           console.log(_getPriceData1);
//           expect(await nft.connect(owner).setPriceData(1, usdt.address, 0, etherUsdt("100"), 2));
//           let _getPriceData2 = await nft.connect(owner).getPriceData(1, usdt.address, 0);
//           console.log(_getPriceData2);
//           expect(_getPriceData2.amount).to.equal(etherUsdt("100"));
//           expect(_getPriceData2.price).to.equal(2);

//           expect(await nft.connect(owner).setAmount(1, usdt.address, 0, etherUsdt("82")));
//           let _getPriceData3 = await nft.connect(owner).getPriceData(1, usdt.address, 0);
//           console.log(_getPriceData3);
//           expect(_getPriceData3.amount).to.equal(etherUsdt("82"));
//           expect(_getPriceData3.price).to.equal(2);
//         });

//         it("setStatus and getStatus", async function () {
//             expect(await nft.connect(owner).getStatus(user1.address)).to.equal(false);
//             await expect (nft.connect(user1).setStatus(user1.address, true)).to.be.revertedWith("Not portfolio contract");
//             expect(await nft.connect(owner).setStatus(user1.address, true));
//             expect(await nft.connect(owner).getStatus(user1.address)).to.equal(true);
//         });

//         it("setInfo", async function () {
//           await expect (nft.connect(owner).setInfo(1, [usdt.address], getLatestBlockTimestamp())).to.be.revertedWith("NFT not found");
//           expect(await nft.connect(owner).mint(user1.address));
//           await expect (nft.connect(user1).setInfo(1, [usdt.address], getLatestBlockTimestamp())).to.be.revertedWith("Not portfolio contract");

//           let _getPortfolioTimestamps = await nft.connect(owner).getPortfolioTimestamps(1);
//           console.log(_getPortfolioTimestamps);
//           let _getAddresses = await nft.connect(owner).getAddresses(1, 0);
//           console.log(_getAddresses);
//           expect(await nft.connect(owner).setInfo(1, [usdt.address], getLatestBlockTimestamp()));
//           let _getPortfolioTimestamps1 = await nft.connect(owner).getPortfolioTimestamps(1);
//           console.log(_getPortfolioTimestamps1);
//           let timeStamp = await getLatestBlockTimestamp() - 1;
//           expect(_getPortfolioTimestamps1[0]).to.equal(timeStamp);
//           let _getAddresses1 = await nft.connect(owner).getAddresses(1, 0);
//           expect(_getAddresses1[0]).to.equal(usdt.address);

//           await skipTimeTo((await getLatestBlockTimestamp()) + MONTH);
//           expect(await nft.connect(owner).setInfo(1, [dai.address, usdt.address], getLatestBlockTimestamp()));
//           let _getPortfolioTimestamps2 = await nft.connect(owner).getPortfolioTimestamps(1);
//           console.log(_getPortfolioTimestamps2);
//           let timeStamp1 = await getLatestBlockTimestamp() - 1;
//           expect(_getPortfolioTimestamps2[0]).to.equal(timeStamp);
//           expect(_getPortfolioTimestamps2[1]).to.equal(timeStamp1);

//           let periods = await nft.connect(owner).getPeriods(1);
//           console.log(periods);
//           expect(periods[0]).to.equal(MONTH + 2);
//           expect(periods[1]).to.equal(1);
//         });
//     });

//     describe("withdrawTokensERC20", async function () {
//         it("Special address", async function () {
//             expect(await nft.getTokenBalance(dai.address)).to.equal(ether("0"));
//             expect(await nft.getTokenBalance(usdt.address)).to.equal(etherUsdt("0"));
//             expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));
//             expect(await dai.connect(owner).transfer(nft.address, ether("100")));
//             expect(await dai.connect(owner).balanceOf(owner.address)).to.equal(ether("400"));
//             expect(await nft.getTokenBalance(dai.address)).to.equal(ether("100"));

//             await expect (nft.connect(user2).withdrawTokensERC20(dai.address, user1.address, 0)).to.be.revertedWith("Not special address");
//             expect(await nft.connect(owner).withdrawTokensERC20(dai.address, owner.address, 0));
//             expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));

//             expect(await dai.connect(owner).transfer(nft.address, ether("100")));
//             expect(await nft.connect(owner).withdrawTokensERC20(dai.address, owner.address, ether("120")));
//             expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));

//             expect(await dai.connect(owner).transfer(nft.address, ether("100")));
//             expect(await nft.connect(owner).withdrawTokensERC20(dai.address, owner.address, ether("50")));
//             expect(await dai.balanceOf(owner.address)).to.equal(ether("450"));
//         });
//     });

//     describe("blank functions", async function () {
//       it("use functions", async function () {
//         expect(await nft.connect(owner).mint(user1.address));
//         expect(await nft.balanceOf(user1.address)).to.equal(1);
//         expect(await nft.balanceOf(owner.address)).to.equal(0);

//         expect(await nft.connect(owner).transferFrom(user1.address, owner.address, 1));
//         expect(await nft.balanceOf(user1.address)).to.equal(1);
//         expect(await nft.balanceOf(owner.address)).to.equal(0);
        
//         expect(await nft.connect(owner)["safeTransferFrom(address,address,uint256)"](user1.address, owner.address, 1));
//         expect(await nft.balanceOf(user1.address)).to.equal(1);
//         expect(await nft.balanceOf(owner.address)).to.equal(0);

//         expect(await nft.connect(owner)["safeTransferFrom(address,address,uint256,bytes)"](user1.address, owner.address, 1, 1));
//         expect(await nft.balanceOf(user1.address)).to.equal(1);
//         expect(await nft.balanceOf(owner.address)).to.equal(0);

//           // expect(await nft.getTokenBalance(dai.address)).to.equal(ether("0"));
//           // expect(await nft.getTokenBalance(usdt.address)).to.equal(etherUsdt("0"));
//           // expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));
//           // expect(await dai.connect(owner).transfer(nft.address, ether("100")));
//           // expect(await dai.connect(owner).balanceOf(owner.address)).to.equal(ether("400"));
//           // expect(await nft.getTokenBalance(dai.address)).to.equal(ether("100"));

//           // await expect (nft.connect(user2).withdrawTokensERC20(dai.address, user1.address, 0)).to.be.revertedWith("Not special address");
//           // expect(await nft.connect(owner).withdrawTokensERC20(dai.address, owner.address, 0));
//           // expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));

//           // expect(await dai.connect(owner).transfer(nft.address, ether("100")));
//           // expect(await nft.connect(owner).withdrawTokensERC20(dai.address, owner.address, ether("120")));
//           // expect(await dai.balanceOf(owner.address)).to.equal(ether("500"));

//           // expect(await dai.connect(owner).transfer(nft.address, ether("100")));
//           // expect(await nft.connect(owner).withdrawTokensERC20(dai.address, owner.address, ether("50")));
//           // expect(await dai.balanceOf(owner.address)).to.equal(ether("450"));
//       });
//   });

// });
