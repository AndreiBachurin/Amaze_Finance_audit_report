const { expect } = require("chai");
const { BigNumber, utils } = require("ethers");
const { ethers, deployments } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

function ether(eth) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount;
}

function etherUsdt(eth) {
  let weiAmount = ethers.utils.parseEther(eth) / 10 ** 12;
  return weiAmount;
}

async function getLatestBlockTimestamp() {
    return (await ethers.provider.getBlock("latest")).timestamp || 0;
}
  
async function skipTimeTo(timestamp) {
    await network.provider.send("evm_setNextBlockTimestamp", [timestamp]);
    await network.provider.send("evm_mine");
}

const DAY = 86400;
const TWO_DAYS = 172800;
const MONTH = 2592000;

describe ("NFT", async function () {

    describe("Set functions", async function () {
        it("setAddresses and getAddresses", async function () {
            const user1_address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
            await helpers.impersonateAccount(user1_address);
            const user1 = await ethers.getSigner(user1_address);
            const user2_address = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
            await helpers.impersonateAccount(user2_address);
            const user2 = await ethers.getSigner(user2_address);
            const user3_address = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
            await helpers.impersonateAccount(user3_address);
            const user3 = await ethers.getSigner(user3_address);
            const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

            DAI = await ethers.getContractFactory("MockERC20");
            dai = await DAI.deploy(500);
            await dai.deployed();
    
            USDT = await ethers.getContractFactory("MockERC20V1");
            usdt = await USDT.deploy(500);
            await usdt.deployed();
    
            NFT = await ethers.getContractFactory("NFT");
            nft = await NFT.deploy(
              owner, // special address
            );
            await nft.deployed();
    
            expect(await nft.specialAddresses(owner)).to.equal(true);
            expect(await nft.specialAddresses(user1_address)).to.equal(false);
            expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
            await expect (nft.connect(user1).setPortfolioAddress(owner)).to.be.revertedWith("Not special address");
            expect(await nft.setPortfolioAddress(owner));
            expect(await nft.getPortfolioAddress()).to.equal(owner);
    
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));
            expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
            expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
            expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));
    
            expect(await nft.balanceOf(owner)).to.equal(0);
            expect(await nft.balanceOf(user1_address)).to.equal(0);
            expect(await nft.balanceOf(user2_address)).to.equal(0);
            expect(await nft.balanceOf(user3_address)).to.equal(0);

          await expect (nft.setAddresses(1, 0, [usdt.address])).to.be.revertedWith("NFT not found");

          expect(await nft.supply()).to.equal(0);
          expect(await nft.balanceOf(user1_address)).to.equal(0);
          await expect (nft.connect(user1).mint(user1_address)).to.be.revertedWith("Not portfolio contract");
          expect(await nft.mint(user1_address));
          expect(await nft.balanceOf(user1_address)).to.equal(1);
          expect(await nft.supply()).to.equal(1);

          await expect (nft.connect(user1).setAddresses(1, 0, [usdt.address])).to.be.revertedWith("Not portfolio contract");

          let _getAddresses1 = await nft.getAddresses(1, 0);
          console.log(_getAddresses1);
          expect(await nft.setAddresses(1, 0, [usdt.address]));
          let _getAddresses2 = await nft.getAddresses(1, 0);
          console.log(_getAddresses2);
          expect(_getAddresses2[0]).to.equal(usdt.address);

          expect(await nft.setAddresses(1, 1, [dai.address, usdt.address]));
          let _getAddresses3 = await nft.getAddresses(1, 1);
          console.log(_getAddresses3);
          expect(_getAddresses3[0]).to.equal(dai.address);
          expect(_getAddresses3[1]).to.equal(usdt.address);

          await expect (nft.connect(user1).burn(1)).to.be.revertedWith("Not portfolio contract");
          expect(await nft.burn(1));

          expect(await nft.balanceOf(user1_address)).to.equal(0);
          await expect (nft.setAddresses(1, 0, [usdt.address])).to.be.revertedWith("NFT not found");
        });

        it("setPriceData and setAmount and getPriceData", async function () {
            const user1_address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
            await helpers.impersonateAccount(user1_address);
            const user1 = await ethers.getSigner(user1_address);
            const user2_address = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
            await helpers.impersonateAccount(user2_address);
            const user2 = await ethers.getSigner(user2_address);
            const user3_address = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
            await helpers.impersonateAccount(user3_address);
            const user3 = await ethers.getSigner(user3_address);
            const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

            DAI = await ethers.getContractFactory("MockERC20");
            dai = await DAI.deploy(500);
            await dai.deployed();
    
            USDT = await ethers.getContractFactory("MockERC20V1");
            usdt = await USDT.deploy(500);
            await usdt.deployed();
    
            NFT = await ethers.getContractFactory("NFT");
            nft = await NFT.deploy(
              owner, // special address
            );
            await nft.deployed();

            expect(await nft.specialAddresses(owner)).to.equal(true);
            expect(await nft.specialAddresses(user1_address)).to.equal(false);
            expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
            await expect (nft.connect(user1).setPortfolioAddress(owner)).to.be.revertedWith("Not special address");
            expect(await nft.setPortfolioAddress(owner));
            expect(await nft.getPortfolioAddress()).to.equal(owner);
    
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));
            expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
            expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
            expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));
    
            expect(await nft.balanceOf(owner)).to.equal(0);
            expect(await nft.balanceOf(user1_address)).to.equal(0);
            expect(await nft.balanceOf(user2_address)).to.equal(0);
            expect(await nft.balanceOf(user3_address)).to.equal(0);

          await expect (nft.setPriceData(1, usdt.address, 0, etherUsdt("100"), 2)).to.be.revertedWith("NFT not found");
          await expect (nft.setAmount(1, usdt.address, 0, etherUsdt("100"))).to.be.revertedWith("NFT not found");
          expect(await nft.mint(user1_address));
          await expect (nft.connect(user1).setPriceData(1, usdt.address, 0, etherUsdt("100"), 2)).to.be.revertedWith("Not portfolio contract");
          await expect (nft.connect(user1).setAmount(1, usdt.address, 0, etherUsdt("100"))).to.be.revertedWith("Not portfolio contract");

          let _getPriceData1 = await nft.getPriceData(1, usdt.address, 0);
          console.log(_getPriceData1);
          expect(await nft.setPriceData(1, usdt.address, 0, etherUsdt("100"), 2));
          let _getPriceData2 = await nft.getPriceData(1, usdt.address, 0);
          console.log(_getPriceData2);
          expect(_getPriceData2.amount).to.equal(etherUsdt("100"));
          expect(_getPriceData2.price).to.equal(2);

          expect(await nft.setAmount(1, usdt.address, 0, etherUsdt("82")));
          let _getPriceData3 = await nft.getPriceData(1, usdt.address, 0);
          console.log(_getPriceData3);
          expect(_getPriceData3.amount).to.equal(etherUsdt("82"));
          expect(_getPriceData3.price).to.equal(2);
        });

        it("setStatus and getStatus", async function () {
            const user1_address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
            await helpers.impersonateAccount(user1_address);
            const user1 = await ethers.getSigner(user1_address);
            const user2_address = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
            await helpers.impersonateAccount(user2_address);
            const user2 = await ethers.getSigner(user2_address);
            const user3_address = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
            await helpers.impersonateAccount(user3_address);
            const user3 = await ethers.getSigner(user3_address);
            const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

            DAI = await ethers.getContractFactory("MockERC20");
            dai = await DAI.deploy(500);
            await dai.deployed();
    
            USDT = await ethers.getContractFactory("MockERC20V1");
            usdt = await USDT.deploy(500);
            await usdt.deployed();
    
            NFT = await ethers.getContractFactory("NFT");
            nft = await NFT.deploy(
              owner, // special address
            );
            await nft.deployed();

            expect(await nft.specialAddresses(owner)).to.equal(true);
            expect(await nft.specialAddresses(user1_address)).to.equal(false);
            expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
            await expect (nft.connect(user1).setPortfolioAddress(owner)).to.be.revertedWith("Not special address");
            expect(await nft.setPortfolioAddress(owner));
            expect(await nft.getPortfolioAddress()).to.equal(owner);
    
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));
            expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
            expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
            expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));
    
            expect(await nft.balanceOf(owner)).to.equal(0);
            expect(await nft.balanceOf(user1_address)).to.equal(0);
            expect(await nft.balanceOf(user2_address)).to.equal(0);
            expect(await nft.balanceOf(user3_address)).to.equal(0);

            expect(await nft.getStatus(user1_address)).to.equal(false);
            await expect (nft.connect(user1).setStatus(user1_address, true)).to.be.revertedWith("Not portfolio contract");
            expect(await nft.setStatus(user1_address, true));
            expect(await nft.getStatus(user1_address)).to.equal(true);
        });

        it("setInfo", async function () {
            const user1_address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
            await helpers.impersonateAccount(user1_address);
            const user1 = await ethers.getSigner(user1_address);
            const user2_address = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
            await helpers.impersonateAccount(user2_address);
            const user2 = await ethers.getSigner(user2_address);
            const user3_address = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
            await helpers.impersonateAccount(user3_address);
            const user3 = await ethers.getSigner(user3_address);
            const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

            DAI = await ethers.getContractFactory("MockERC20");
            dai = await DAI.deploy(500);
            await dai.deployed();
    
            USDT = await ethers.getContractFactory("MockERC20V1");
            usdt = await USDT.deploy(500);
            await usdt.deployed();
    
            NFT = await ethers.getContractFactory("NFT");
            nft = await NFT.deploy(
              owner, // special address
            );
            await nft.deployed();

            expect(await nft.specialAddresses(owner)).to.equal(true);
            expect(await nft.specialAddresses(user1_address)).to.equal(false);
            expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
            await expect (nft.connect(user1).setPortfolioAddress(owner)).to.be.revertedWith("Not special address");
            expect(await nft.setPortfolioAddress(owner));
            expect(await nft.getPortfolioAddress()).to.equal(owner);
    
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));
            expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
            expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
            expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));
    
            expect(await nft.balanceOf(owner)).to.equal(0);
            expect(await nft.balanceOf(user1_address)).to.equal(0);
            expect(await nft.balanceOf(user2_address)).to.equal(0);
            expect(await nft.balanceOf(user3_address)).to.equal(0);

          await expect (nft.setInfo(1, [usdt.address], getLatestBlockTimestamp())).to.be.revertedWith("NFT not found");
          expect(await nft.mint(user1_address));
          await expect (nft.connect(user1).setInfo(1, [usdt.address], getLatestBlockTimestamp())).to.be.revertedWith("Not portfolio contract");

          let _getPortfolioTimestamps = await nft.getPortfolioTimestamps(1);
          console.log(_getPortfolioTimestamps);
          let _getAddresses = await nft.getAddresses(1, 0);
          console.log(_getAddresses);
          expect(await nft.setInfo(1, [usdt.address], getLatestBlockTimestamp()));
          let _getPortfolioTimestamps1 = await nft.getPortfolioTimestamps(1);
          console.log(_getPortfolioTimestamps1);
          let timeStamp = await getLatestBlockTimestamp() - 1;
          expect(_getPortfolioTimestamps1[0]).to.equal(timeStamp);
          let _getAddresses1 = await nft.getAddresses(1, 0);
          expect(_getAddresses1[0]).to.equal(usdt.address);

          await skipTimeTo((await getLatestBlockTimestamp()) + MONTH);
          expect(await nft.setInfo(1, [dai.address, usdt.address], getLatestBlockTimestamp()));
          let _getPortfolioTimestamps2 = await nft.getPortfolioTimestamps(1);
          console.log(_getPortfolioTimestamps2);
          let timeStamp1 = await getLatestBlockTimestamp() - 1;
          expect(_getPortfolioTimestamps2[0]).to.equal(timeStamp);
          expect(_getPortfolioTimestamps2[1]).to.equal(timeStamp1);

          let periods = await nft.getPeriods(1);
          console.log(periods);
          expect(periods[0]).to.equal(MONTH + 2);
          expect(periods[1]).to.equal(1);
        });
    });

    describe("withdrawTokensERC20", async function () {
        it("Special address", async function () {
            const user1_address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
            await helpers.impersonateAccount(user1_address);
            const user1 = await ethers.getSigner(user1_address);
            const user2_address = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
            await helpers.impersonateAccount(user2_address);
            const user2 = await ethers.getSigner(user2_address);
            const user3_address = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
            await helpers.impersonateAccount(user3_address);
            const user3 = await ethers.getSigner(user3_address);
            const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

            DAI = await ethers.getContractFactory("MockERC20");
            dai = await DAI.deploy(500);
            await dai.deployed();
    
            USDT = await ethers.getContractFactory("MockERC20V1");
            usdt = await USDT.deploy(500);
            await usdt.deployed();
    
            NFT = await ethers.getContractFactory("NFT");
            nft = await NFT.deploy(
              owner, // special address
            );
            await nft.deployed();

            expect(await nft.specialAddresses(owner)).to.equal(true);
            expect(await nft.specialAddresses(user1_address)).to.equal(false);
            expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
            await expect (nft.connect(user1).setPortfolioAddress(owner)).to.be.revertedWith("Not special address");
            expect(await nft.setPortfolioAddress(owner));
            expect(await nft.getPortfolioAddress()).to.equal(owner);
    
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));
            expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
            expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
            expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));
    
            expect(await nft.balanceOf(owner)).to.equal(0);
            expect(await nft.balanceOf(user1_address)).to.equal(0);
            expect(await nft.balanceOf(user2_address)).to.equal(0);
            expect(await nft.balanceOf(user3_address)).to.equal(0);

            expect(await nft.getTokenBalance(dai.address)).to.equal(ether("0"));
            expect(await nft.getTokenBalance(usdt.address)).to.equal(etherUsdt("0"));
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));
            expect(await dai.transfer(nft.address, ether("100")));
            expect(await dai.balanceOf(owner)).to.equal(ether("400"));
            expect(await nft.getTokenBalance(dai.address)).to.equal(ether("100"));

            await expect (nft.connect(user2).withdrawTokensERC20(dai.address, user1_address, 0)).to.be.revertedWith("Not special address");
            expect(await nft.withdrawTokensERC20(dai.address, owner, 0));
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));

            expect(await dai.transfer(nft.address, ether("100")));
            expect(await nft.withdrawTokensERC20(dai.address, owner, ether("120")));
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));

            expect(await dai.transfer(nft.address, ether("100")));
            expect(await nft.withdrawTokensERC20(dai.address, owner, ether("50")));
            expect(await dai.balanceOf(owner)).to.equal(ether("450"));
        });
    });

    describe("blank functions", async function () {
      it("use functions", async function () {
        const user1_address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
        await helpers.impersonateAccount(user1_address);
        const user1 = await ethers.getSigner(user1_address);
        const user2_address = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
        await helpers.impersonateAccount(user2_address);
        const user2 = await ethers.getSigner(user2_address);
        const user3_address = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
        await helpers.impersonateAccount(user3_address);
        const user3 = await ethers.getSigner(user3_address);
        const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

        DAI = await ethers.getContractFactory("MockERC20");
        dai = await DAI.deploy(500);
        await dai.deployed();

        USDT = await ethers.getContractFactory("MockERC20V1");
        usdt = await USDT.deploy(500);
        await usdt.deployed();

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          owner, // special address
        );
        await nft.deployed();

            expect(await nft.specialAddresses(owner)).to.equal(true);
            expect(await nft.specialAddresses(user1_address)).to.equal(false);
            expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
            await expect (nft.connect(user1).setPortfolioAddress(owner)).to.be.revertedWith("Not special address");
            expect(await nft.setPortfolioAddress(owner));
            expect(await nft.getPortfolioAddress()).to.equal(owner);
    
            expect(await dai.balanceOf(owner)).to.equal(ether("500"));
            expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
            expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
            expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));
    
            expect(await nft.balanceOf(owner)).to.equal(0);
            expect(await nft.balanceOf(user1_address)).to.equal(0);
            expect(await nft.balanceOf(user2_address)).to.equal(0);
            expect(await nft.balanceOf(user3_address)).to.equal(0);

        expect(await nft.mint(user1_address));
        expect(await nft.balanceOf(user1_address)).to.equal(1);
        expect(await nft.balanceOf(owner)).to.equal(0);

        expect(await nft.transferFrom(user1_address, owner, 1));
        expect(await nft.balanceOf(user1_address)).to.equal(1);
        expect(await nft.balanceOf(owner)).to.equal(0);
        
        expect(await nft["safeTransferFrom(address,address,uint256)"](user1_address, owner, 1));
        expect(await nft.balanceOf(user1_address)).to.equal(1);
        expect(await nft.balanceOf(owner)).to.equal(0);

        expect(await nft["safeTransferFrom(address,address,uint256,bytes)"](user1_address, owner, 1, 1));
        expect(await nft.balanceOf(user1_address)).to.equal(1);
        expect(await nft.balanceOf(owner)).to.equal(0);
      });
  });

});
