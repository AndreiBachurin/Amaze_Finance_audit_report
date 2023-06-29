const { expect } = require("chai")
const { ethers } = require("hardhat")
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const FACTORY = "0x1f98431c8ad98523631ae4a59f267346ea31f984"
// USDC
const TOKEN_0 = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa" // 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa
const DECIMALS_0 = 18n
// WETH
const TOKEN_1 = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889" // testnet 0x9c3c9283d3e44854697cd22d3faa240cfb032889
const DECIMALS_1 = 18n
// 0.3%
const FEE = 3000
// Pair
// 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8

// chainlink proxies
const C_USDC = "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7"
const C_DAI = "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D"
const C_BTC = "0xc907E116054Ad103354f2D350FD2514433D57F6f"
const C_USDT = "0x0A6513e40db6EB1b165753AD52E80663aeA50545"
const C_Alpha = "0x289833F252eaB98582D62db94Bd75aB48AD9CF0D"
const DAI_ETH = "0xFC539A559e170f848323e19dfD66007520510085"
const NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const C_ETH = "0xF9680D99D6C9589e2a93a78A04A279e509205945"

function ether(eth) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount.toString();
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

describe("Portfolio", async function () {

    it("create portfolio and add liquidity", async () => {
        DAI = await ethers.getContractFactory("MockERC20");
        dai = await DAI.deploy(500);
        await dai.deployed();

        USDT = await ethers.getContractFactory("MockERC20V1");
        usdt = await USDT.deploy(500);
        await usdt.deployed();

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special address
        );
        await nft.deployed();

        ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
        priceContract = await ChainlinkPriceFeed.deploy();
        await priceContract.deployed();

        UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed");
        twap = await UniswapV3Twap.deploy(FACTORY);
        await twap.deployed();

        Calculator = await ethers.getContractFactory("Calculator");
        calculator = await Calculator.deploy(
          priceContract.address,
          twap.address,
          TOKEN_1,
          10,
          8,
          [dai.address],
          [300],
        );
        await calculator.deployed();

        Portfolio = await ethers.getContractFactory("Portfolio");
        portfolio = await Portfolio.deploy(
          nft.address, // nft address
          dai.address, // payment token
          calculator.address, // calculator
          NATIVE, // native
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // fee keeper
          ether("100"), // cost
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special
        );
        await portfolio.deployed();

        const provider = ethers.provider;
        const address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
        await helpers.impersonateAccount(address);
        const impersonatedSigner = await ethers.getSigner(address);
        expect(await nft.setPortfolioAddress(portfolio.address));
        expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);

        expect(await calculator.setProxyInfo(
            [usdt.address, dai.address, NATIVE],
            [C_USDT, C_DAI, C_ETH]
        ));

        expect(await calculator.getChainlinkProxies(usdt.address)).to.equal(C_USDT);
        expect(await calculator.getChainlinkProxies(dai.address)).to.equal(C_DAI);
        expect(await calculator.getChainlinkProxies(NATIVE)).to.equal(C_ETH);

        expect(await usdt.approve(portfolio.address, etherUsdt("20")));
        expect(await dai.approve(portfolio.address, ether("100")));
        await expect (portfolio.createPortfolio(
                [NATIVE, usdt.address, dai.address],
                [ether("100")],
                {value: ether("0")}))
            .to.be.revertedWith("Not same length");

        await expect (portfolio.createPortfolio(
                [usdt.address, NATIVE],
                [etherUsdt("100"), ether("100")],
                {value: ether("100")}))
        .to.be.revertedWith("Wrong data");

        // await expect (portfolio.createPortfolio(
        //     [NATIVE, usdt.address],
        //     [ether("150"), etherUsdt("20")],
        //     {value: ether("100")}))
        // .to.be.revertedWith("Wrong price");

        expect(await portfolio.createPortfolio(
            [NATIVE, usdt.address],
            [ether("150"), etherUsdt("20")],
            {value: ether("100")}
        ));

        let timestamps = await nft.getPortfolioTimestamps(1);
        console.log(`timestamps : ${timestamps}`)
        expect(await timestamps[0]).to.equal(await getLatestBlockTimestamp());

        let addresses1 = await nft.getAddresses(1, 0);
        console.log(`addresses : ${addresses1}`)
        expect(await addresses1[0]).to.equal(NATIVE);
        expect(await addresses1[1]).to.equal(usdt.address);

        const priceUSDT = await priceContract.getLatestPrice(C_USDT);
        console.log(`price: ${priceUSDT}`);

        const priceETH = await priceContract.getLatestPrice(C_ETH);
        console.log(`price: ${priceETH}`);

        const priceDAI = await priceContract.getLatestPrice(C_DAI);
        console.log(`price: ${priceDAI}`);

        let getPriceDataETH = await nft.getPriceData(1, NATIVE, 0);
        console.log(`getPriceData ETH: ${getPriceDataETH}`);
        expect(await getPriceDataETH.amount).to.equal(ether("100"));
        expect(await getPriceDataETH.price).to.equal(priceETH);

        let getPriceDataUSDT = await nft.getPriceData(1, usdt.address, 0);
        console.log(`getPriceData USDT: ${getPriceDataUSDT}`);
        expect(await getPriceDataUSDT.amount).to.equal(etherUsdt("20"));
        expect(await getPriceDataUSDT.price).to.equal(priceUSDT);

        await expect (portfolio.createPortfolio(
            [NATIVE, usdt.address, dai.address],
            [ether("100"), etherUsdt("20"), ether("60")],
            {value: ether("100")}))
        .to.be.revertedWith("You should by premium");
        
        expect(await portfolio.buyPremium());

        expect(await usdt.approve(portfolio.address, etherUsdt("40")));
        expect(await portfolio.createPortfolio(
            [usdt.address],
            [etherUsdt("40")]
        ));

        await expect (portfolio.connect(impersonatedSigner).addLiquidity(
            [NATIVE],
            [etherUsdt("100")],
            2,
            {value: ether("100")}))
        .to.be.revertedWith("Not user's NFT");

        expect(await usdt.approve(portfolio.address, etherUsdt("80")));
        expect(await dai.approve(portfolio.address, ether("81")));

        await expect (portfolio.addLiquidity(
            [usdt.address, NATIVE],
            [etherUsdt("80"), ether("100")],
            2,
            {value: ether("100")}))
        .to.be.revertedWith("Wrong data");

        expect(await portfolio.addLiquidity(
            [NATIVE, usdt.address, dai.address],
            [ether("200"), etherUsdt("80"), ether("81")],
            2,
            {value: ether("90")}
        ));

        expect(await usdt.approve(portfolio.address, etherUsdt("35")));
        expect(await dai.approve(portfolio.address, ether("45")));
        expect(await portfolio.addLiquidity(
            [usdt.address, dai.address],
            [etherUsdt("35"), ether("45")],
            2
        ));

        let timestamps1 = await nft.getPortfolioTimestamps(2);
        console.log(`timestamps : ${timestamps1}`)
        console.log(`timestamp : ${await getLatestBlockTimestamp()}`)
        expect(await timestamps1[0]).to.equal(await getLatestBlockTimestamp() - 8);
        expect(await timestamps1[1]).to.equal(await getLatestBlockTimestamp() - 3);
        expect(await timestamps1[2]).to.equal(await getLatestBlockTimestamp());

        let addresses2_0 = await nft.getAddresses(2, 0);
        console.log(`addresses : ${addresses2_0}`)
        expect(await addresses2_0[0]).to.equal(usdt.address);

        let getPriceDataETH_2_0 = await nft.getPriceData(2, NATIVE, 0);
        console.log(`getPriceData ETH: ${getPriceDataETH_2_0}`);
        expect(await getPriceDataETH_2_0.amount).to.equal(0);
        expect(await getPriceDataETH_2_0.price).to.equal(0);

        let getPriceDataUSDT_2_0 = await nft.getPriceData(2, usdt.address, 0);
        console.log(`getPriceData USDT: ${getPriceDataUSDT_2_0}`);
        expect(await getPriceDataUSDT_2_0.amount).to.equal(etherUsdt("40"));
        expect(await getPriceDataUSDT_2_0.price).to.equal(priceUSDT);

        let addresses2_1 = await nft.getAddresses(2, 1);
        console.log(`addresses : ${addresses2_1}`)
        expect(await addresses2_1[0]).to.equal(NATIVE);
        expect(await addresses2_1[1]).to.equal(usdt.address);
        expect(await addresses2_1[2]).to.equal(dai.address);

        let getPriceDataETH_2_1 = await nft.getPriceData(2, NATIVE, 1);
        console.log(`getPriceData ETH: ${getPriceDataETH_2_1}`);
        expect(await getPriceDataETH_2_1.amount).to.equal(ether("90"));
        expect(await getPriceDataETH_2_1.price).to.equal(priceETH);

        let getPriceDataUSDT_2_1 = await nft.getPriceData(2, usdt.address, 1);
        console.log(`getPriceData USDT: ${getPriceDataUSDT_2_1}`);
        expect(await getPriceDataUSDT_2_1.amount).to.equal(etherUsdt("80"));
        expect(await getPriceDataUSDT_2_1.price).to.equal(priceUSDT);

        let getPriceDataDAI_2_1 = await nft.getPriceData(2, dai.address, 1);
        console.log(`getPriceData DAI: ${getPriceDataDAI_2_1}`);
        expect(await getPriceDataDAI_2_1.amount).to.equal(ether("81"));
        expect(await getPriceDataDAI_2_1.price).to.equal(priceDAI);

        let getPriceDataUSDT_2_2 = await nft.getPriceData(2, usdt.address, 2);
        console.log(`getPriceData USDT: ${getPriceDataUSDT_2_2}`);
        expect(await getPriceDataUSDT_2_2.amount).to.equal(etherUsdt("35"));
        expect(await getPriceDataUSDT_2_2.price).to.equal(priceUSDT);

        let getPriceDataDAI_2_2 = await nft.getPriceData(2, dai.address, 2);
        console.log(`getPriceData DAI: ${getPriceDataDAI_2_2}`);
        expect(await getPriceDataDAI_2_2.amount).to.equal(ether("45"));
        expect(await getPriceDataDAI_2_2.price).to.equal(priceDAI);

    });

    it("remove liquidity and remove portfolio", async () => {
        DAI = await ethers.getContractFactory("MockERC20");
        dai = await DAI.deploy(500);
        await dai.deployed();

        USDT = await ethers.getContractFactory("MockERC20V1");
        usdt = await USDT.deploy(500);
        await usdt.deployed();

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special address
        );
        await nft.deployed();

        ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
        priceContract = await ChainlinkPriceFeed.deploy();
        await priceContract.deployed();

        UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed");
        twap = await UniswapV3Twap.deploy(FACTORY);
        await twap.deployed();

        Calculator = await ethers.getContractFactory("Calculator");
        calculator = await Calculator.deploy(
          priceContract.address,
          twap.address,
          TOKEN_1,
          10,
          8,
          [dai.address],
          [300],
        );
        await calculator.deployed();

        Portfolio = await ethers.getContractFactory("Portfolio");
        portfolio = await Portfolio.deploy(
          nft.address, // nft address
          dai.address, // payment token
          calculator.address, // calculator
          NATIVE, // native
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // fee keeper
          ether("100"), // cost
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special
        );
        await portfolio.deployed();

        const address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
        await helpers.impersonateAccount(address);
        const impersonatedSigner = await ethers.getSigner(address);
        const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

        const priceUSDT = await priceContract.getLatestPrice(C_USDT);
        const priceETH = await priceContract.getLatestPrice(C_ETH);
        const priceDAI = await priceContract.getLatestPrice(C_DAI);

        // create portfolio with special prices for ETH, DAI, USDT
        // ETH price is less then actaul
        // DAI price is equal to actual
        // USDT price is higher
        expect(await nft.setPortfolioAddress(owner));
        expect(await nft.getPortfolioAddress()).to.equal(owner);
        expect(await nft.mint(owner));
        const provider = ethers.provider;
        expect (await provider.getBalance(portfolio.address)).to.equal(0);
        await impersonatedSigner.sendTransaction({
            to: portfolio.address,
            value: ether("100"),
        });
        expect (await provider.getBalance(portfolio.address)).to.equal(ether("100"));
        expect(await dai.transfer(portfolio.address, ether("200")));
        expect(await usdt.transfer(portfolio.address, etherUsdt("100")));
        expect(await nft.setPriceData(1, NATIVE, 0, ether("40"), 100000000));
        expect(await nft.setPriceData(1, dai.address, 0, ether("100"), priceDAI)).to.ok;
        expect(await nft.setPriceData(1, usdt.address, 0, etherUsdt("100"), 200008995)).to.ok;
        expect(await nft.setInfo(
            1,
            [NATIVE, dai.address, usdt.address],
            await getLatestBlockTimestamp()
        ));
        expect(await nft.setPriceData(1, NATIVE, 1, ether("60"), 50000000000));
        expect(await nft.setPriceData(1, dai.address, 1, ether("100"), priceDAI));
        expect(await nft.setInfo(
            1,
            [NATIVE, dai.address],
            await getLatestBlockTimestamp() + 3
        ));
        // create portfolio with special prices for ETH, DAI, USDT
        expect(await calculator.setProxyInfo(
            [usdt.address, dai.address, NATIVE],
            [C_USDT, C_DAI, C_ETH]
        ));

        expect(await calculator.getChainlinkProxies(usdt.address)).to.equal(C_USDT);
        expect(await calculator.getChainlinkProxies(dai.address)).to.equal(C_DAI);
        expect(await calculator.getChainlinkProxies(NATIVE)).to.equal(C_ETH);

        expect(await nft.setPortfolioAddress(portfolio.address));
        expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);

        await expect (portfolio.connect(impersonatedSigner).removeLiquidity(
            [NATIVE],
            [etherUsdt("100")],
            1
        )).to.be.revertedWith("Not user's NFT");

        await expect (portfolio.connect(impersonatedSigner).removePortfolio(
            1,
        )).to.be.revertedWith("Not user's NFT");

        await expect (portfolio.removeLiquidity(
            [NATIVE],
            [ether("100"), ether("12121")],
            1
        )).to.be.revertedWith("Not same length");

        expect(await portfolio.removeLiquidity(
            [NATIVE],
            [ether("100")],
            1
        ));
        // expect (await provider.getBalance(portfolio.address)).to.equal(ether("7.715287744000000000"));
        // let comissionETH_1 = await portfolio.getBalanceFee(NATIVE);
        // expect(await comissionETH_1).to.equal(ether("7.715287744000000000"));

        // await expect (portfolio.removeLiquidity(
        //     [NATIVE],
        //     [ether("100")],
        //     1
        // )).to.be.reverted;

        let before_getPriceDataUSDT_1_0 = await nft.getPriceData(1, usdt.address, 0);
        console.log(`getPriceData USDT: ${before_getPriceDataUSDT_1_0}`);
        expect(await before_getPriceDataUSDT_1_0.amount).to.equal(etherUsdt("100"));
        expect(await before_getPriceDataUSDT_1_0.price).to.equal(200008995);

        let before_getPriceDataDAI_1_0 = await nft.getPriceData(1, dai.address, 0);
        console.log(`getPriceData DAI: ${before_getPriceDataDAI_1_0}`);
        expect(await before_getPriceDataDAI_1_0.amount).to.equal(ether("100"));
        expect(await before_getPriceDataDAI_1_0.price).to.equal(priceDAI);

        let before_getPriceDataDAI_1_1 = await nft.getPriceData(1, dai.address, 1);
        console.log(`getPriceData DAI: ${before_getPriceDataDAI_1_1}`);
        expect(await before_getPriceDataDAI_1_1.amount).to.equal(ether("100"));
        expect(await before_getPriceDataDAI_1_1.price).to.equal(priceDAI);

        expect(await dai.balanceOf(owner)).to.equal(ether("300"));
        expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("400"));

        expect(await portfolio.removeLiquidity(
            [usdt.address, dai.address],
            [etherUsdt("150"), ether("150")],
            1
        ));

        expect(await dai.balanceOf(owner)).to.equal(ether("450"));
        expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));

        let getPriceDataUSDT_1_0 = await nft.getPriceData(1, usdt.address, 0);
        console.log(`getPriceData USDT: ${getPriceDataUSDT_1_0}`);
        expect(await getPriceDataUSDT_1_0.amount).to.equal(etherUsdt("0"));
        expect(await getPriceDataUSDT_1_0.price).to.equal(200008995);

        let getPriceDataDAI_1_0 = await nft.getPriceData(1, dai.address, 0);
        console.log(`getPriceData DAI: ${getPriceDataDAI_1_0}`);
        expect(await getPriceDataDAI_1_0.amount).to.equal(ether("0"));
        expect(await getPriceDataDAI_1_0.price).to.equal(priceDAI);

        let getPriceDataDAI_1_1 = await nft.getPriceData(1, dai.address, 1);
        console.log(`getPriceData DAI: ${getPriceDataDAI_1_1}`);
        expect(await getPriceDataDAI_1_1.amount).to.equal(ether("50"));
        expect(await getPriceDataDAI_1_1.price).to.equal(priceDAI);

        expect(await nft.setPortfolioAddress(owner));
        expect(await nft.getPortfolioAddress()).to.equal(owner);
        expect(await nft.mint(owner));
        expect(await nft.mint(owner));
        expect(await nft.setPriceData(2, NATIVE, 0, ether("40"), 100000000));
        expect(await nft.setPriceData(2, dai.address, 0, ether("100"), priceDAI)).to.ok;
        expect(await nft.setPriceData(2, usdt.address, 0, etherUsdt("100"), 80008995)).to.ok;
        expect(await nft.setInfo(
            2,
            [NATIVE, dai.address, usdt.address],
            await getLatestBlockTimestamp()
        ));
        expect(await nft.setPriceData(2, NATIVE, 1, ether("60"), 50000000000));
        expect(await nft.setPriceData(2, dai.address, 1, ether("100"), priceDAI));
        expect(await nft.setInfo(
            2,
            [NATIVE, dai.address],
            await getLatestBlockTimestamp() + 3
        ));

        await impersonatedSigner.sendTransaction({
            to: portfolio.address,
            value: ether("100"),
        });
        expect(await dai.transfer(portfolio.address, ether("200")));
        expect(await usdt.transfer(portfolio.address, etherUsdt("100")));

        expect(await nft.setPortfolioAddress(portfolio.address));
        expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);
        expect(await portfolio.removePortfolio(2)).to.ok;

        expect(await dai.balanceOf(owner)).to.equal(ether("450"));
        // function getBalanceFee(address _token) external view returns(uint256){
        //     return balanceFee[_token];
        // }
        let BalanceFee = await portfolio.getBalanceFee(dai.address);
        expect(await BalanceFee).to.equal(0);
        // expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("498.001701"));
        // let comissionETH_2 = await portfolio.getBalanceFee(NATIVE);
        // expect(await comissionETH_2).to.equal(ether("15.430575488000000000"));
        // expect (await provider.getBalance(portfolio.address)).to.equal(ether("15.430575488000000000"));

        expect(await nft.setPortfolioAddress(owner));
        expect(await nft.getPortfolioAddress()).to.equal(owner);
        await impersonatedSigner.sendTransaction({
            to: portfolio.address,
            value: ether("100"),
        });
        expect(await dai.transfer(portfolio.address, ether("100")));
        expect(await usdt.transfer(portfolio.address, etherUsdt("100")));

        expect(await nft.setPriceData(3, NATIVE, 0, ether("100"), priceETH));
        expect(await nft.setPriceData(3, dai.address, 0, ether("100"), priceDAI)).to.ok;
        expect(await nft.setPriceData(3, usdt.address, 0, etherUsdt("100"), 80008995)).to.ok;
        expect(await nft.setInfo(
            3,
            [NATIVE, dai.address, usdt.address],
            await getLatestBlockTimestamp()
        ));
        expect(await nft.setPortfolioAddress(portfolio.address));
        expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);

        expect(await portfolio.removeLiquidity(
            [NATIVE, dai.address, usdt.address],
            [ether("50"), ether("50"), etherUsdt("50")],
            3
        ));
        expect(await portfolio.removePortfolio(3)).to.ok;
    });

    it("buy premium", async () => {
        DAI = await ethers.getContractFactory("MockERC20");
        dai = await DAI.deploy(500);
        await dai.deployed();

        USDT = await ethers.getContractFactory("MockERC20V1");
        usdt = await USDT.deploy(500);
        await usdt.deployed();

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special address
        );
        await nft.deployed();

        ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
        priceContract = await ChainlinkPriceFeed.deploy();
        await priceContract.deployed();

        UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed");
        twap = await UniswapV3Twap.deploy(FACTORY);
        await twap.deployed();

        Calculator = await ethers.getContractFactory("Calculator");
        calculator = await Calculator.deploy(
          priceContract.address,
          twap.address,
          TOKEN_1,
          10,
          8,
          [dai.address],
          [300],
        );
        await calculator.deployed();

        Portfolio = await ethers.getContractFactory("Portfolio");
        portfolio = await Portfolio.deploy(
          nft.address, // nft address
          dai.address, // payment token
          calculator.address, // calculator
          NATIVE, // native
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // fee keeper
          ether("100"), // cost
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special
        );
        await portfolio.deployed();

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

        expect(await nft.specialAddresses(owner)).to.equal(true);
        expect(await nft.specialAddresses(user1_address)).to.equal(false);
        expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
        await expect (nft.connect(user1).setPortfolioAddress(portfolio.address)).to.be.revertedWith("Not special address");
        expect(await nft.setPortfolioAddress(portfolio.address));
        expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);

        expect(await dai.balanceOf(owner)).to.equal(ether("500"));
        expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
        expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
        expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));

        expect(await nft.balanceOf(owner)).to.equal(0);
        expect(await nft.balanceOf(user1_address)).to.equal(0);
        expect(await nft.balanceOf(user2_address)).to.equal(0);
        expect(await nft.balanceOf(user3_address)).to.equal(0);

        expect(await nft.getStatus(user1_address)).to.equal(false);
        expect(await dai.balanceOf(owner)).to.equal(ether("500"));
        expect(await dai.balanceOf('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')).to.equal(ether("0"));
        expect(await dai.approve(portfolio.address, ether("100")));
        expect(await portfolio.buyPremium());
        expect(await nft.getStatus(owner)).to.equal(true);
        expect(await dai.balanceOf(owner)).to.equal(ether("400"));
        expect(await dai.balanceOf('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')).to.equal(ether("100"));

        await expect (portfolio.buyPremium()).to.be.revertedWith("You alredy get premium status");
    });

    it("withdrawTokens", async () => {
        DAI = await ethers.getContractFactory("MockERC20");
        dai = await DAI.deploy(500);
        await dai.deployed();

        USDT = await ethers.getContractFactory("MockERC20V1");
        usdt = await USDT.deploy(500);
        await usdt.deployed();

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special address
        );
        await nft.deployed();

        ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
        priceContract = await ChainlinkPriceFeed.deploy();
        await priceContract.deployed();

        UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed");
        twap = await UniswapV3Twap.deploy(FACTORY);
        await twap.deployed();

        Calculator = await ethers.getContractFactory("Calculator");
        calculator = await Calculator.deploy(
          priceContract.address,
          twap.address,
          TOKEN_1,
          10,
          8,
          [dai.address],
          [300],
        );
        await calculator.deployed();

        Portfolio = await ethers.getContractFactory("Portfolio");
        portfolio = await Portfolio.deploy(
          nft.address, // nft address
          dai.address, // payment token
          calculator.address, // calculator
          NATIVE, // native
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // fee keeper
          ether("100"), // cost
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special
        );
        await portfolio.deployed();

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

        expect(await nft.specialAddresses(owner)).to.equal(true);
        expect(await nft.specialAddresses(user1_address)).to.equal(false);
        expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
        await expect (nft.connect(user1).setPortfolioAddress(portfolio.address)).to.be.revertedWith("Not special address");
        expect(await nft.setPortfolioAddress(portfolio.address));
        expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);

        expect(await dai.balanceOf(owner)).to.equal(ether("500"));
        expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
        expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
        expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));

        expect(await nft.balanceOf(owner)).to.equal(0);
        expect(await nft.balanceOf(user1_address)).to.equal(0);
        expect(await nft.balanceOf(user2_address)).to.equal(0);
        expect(await nft.balanceOf(user3_address)).to.equal(0);

        expect(await dai.balanceOf(owner)).to.equal(ether("500"));
        expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
        expect(await portfolio.getTokenBalance(usdt.address)).to.equal(0);
        expect(await portfolio.getTokenBalance(dai.address)).to.equal(0);
        expect(await dai.transfer(portfolio.address, ether("120")));
        expect(await usdt.transfer(portfolio.address, etherUsdt("120")));
        expect(await portfolio.getTokenBalance(usdt.address)).to.equal(etherUsdt("120"));
        expect(await portfolio.getTokenBalance(dai.address)).to.equal(ether("120"));

        await expect (portfolio.withdrawTokens(
          [dai.address],
          [ether("0"), ether("1")],
          [0]
        )).to.be.revertedWith("Not same size");
        await expect (portfolio.withdrawTokens(
          [dai.address, usdt.address],
          [ether("0")],
          [0]
        )).to.be.revertedWith("Not same size");
        expect(await portfolio.withdrawTokens(
          [dai.address],
          [ether("0")],
          [0]
        ));
        expect(await portfolio.getTokenBalance(usdt.address)).to.equal(etherUsdt("120"));
        expect(await portfolio.getTokenBalance(dai.address)).to.equal(0);

        expect(await portfolio.withdrawTokens(
          [usdt.address],
          [etherUsdt("130")],
          [0]
        ));

        expect(await portfolio.getTokenBalance(usdt.address)).to.equal(0);
        expect(await portfolio.getTokenBalance(dai.address)).to.equal(0);

        const provider = ethers.provider;
        expect (await provider.getBalance(portfolio.address)).to.equal(0);
        await user1.sendTransaction({
            to: portfolio.address,
            value: ether("100"),
        });
        expect (await provider.getBalance(portfolio.address)).to.equal(ether("100"));

        expect(await portfolio.withdrawTokens(
          [usdt.address],
          [etherUsdt("0")],
          ether("25")
        ));
        expect (await provider.getBalance(portfolio.address)).to.equal(ether("75"));

        expect(await usdt.transfer(portfolio.address, etherUsdt("120")));

        await expect (portfolio.connect(user1).withdrawTokens(
          [usdt.address],
          [etherUsdt("20")],
          ether("25")
        )).to.be.revertedWith("Not special address");

        expect(await portfolio.withdrawTokens(
          [usdt.address],
          [etherUsdt("20")],
          ether("25")
        ));
        expect (await provider.getBalance(portfolio.address)).to.equal(ether("50"));
        expect(await portfolio.getTokenBalance(usdt.address)).to.equal(etherUsdt("100"));
    });

    it("setPaymentToken setAmaze setNativeToken setCost", async () => {
        DAI = await ethers.getContractFactory("MockERC20");
        dai = await DAI.deploy(500);
        await dai.deployed();

        USDT = await ethers.getContractFactory("MockERC20V1");
        usdt = await USDT.deploy(500);
        await usdt.deployed();

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special address
        );
        await nft.deployed();

        ChainlinkPriceFeed = await ethers.getContractFactory("ChainlinkPriceFeed");
        priceContract = await ChainlinkPriceFeed.deploy();
        await priceContract.deployed();

        UniswapV3Twap = await ethers.getContractFactory("UniswapPriceFeed");
        twap = await UniswapV3Twap.deploy(FACTORY);
        await twap.deployed();

        Calculator = await ethers.getContractFactory("Calculator");
        calculator = await Calculator.deploy(
          priceContract.address,
          twap.address,
          TOKEN_1,
          10,
          8,
          [dai.address],
          [300],
        );
        await calculator.deployed();

        Portfolio = await ethers.getContractFactory("Portfolio");
        portfolio = await Portfolio.deploy(
          nft.address, // nft address
          dai.address, // payment token
          calculator.address, // calculator
          NATIVE, // native
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // fee keeper
          ether("100"), // cost
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // special
        );
        await portfolio.deployed();

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

        expect(await nft.specialAddresses(owner)).to.equal(true);
        expect(await nft.specialAddresses(user1_address)).to.equal(false);
        expect(await nft.getPortfolioAddress()).to.equal(ethers.constants.AddressZero);
        await expect (nft.connect(user1).setPortfolioAddress(portfolio.address)).to.be.revertedWith("Not special address");
        expect(await nft.setPortfolioAddress(portfolio.address));
        expect(await nft.getPortfolioAddress()).to.equal(portfolio.address);

        expect(await dai.balanceOf(owner)).to.equal(ether("500"));
        expect(await usdt.balanceOf(owner)).to.equal(etherUsdt("500"));
        expect(await dai.balanceOf(user1_address)).to.equal(ether("0"));
        expect(await usdt.balanceOf(user1_address)).to.equal(etherUsdt("0"));

        expect(await nft.balanceOf(owner)).to.equal(0);
        expect(await nft.balanceOf(user1_address)).to.equal(0);
        expect(await nft.balanceOf(user2_address)).to.equal(0);
        expect(await nft.balanceOf(user3_address)).to.equal(0);

        expect(await portfolio.getPaymentToken()).to.equal(dai.address);
        await expect (portfolio.connect(user1).setPaymentToken(usdt.address)).to.be.revertedWith("Not special address");
        expect(await portfolio.setPaymentToken(usdt.address));
        expect(await portfolio.getPaymentToken()).to.equal(usdt.address);

        NFT1 = await ethers.getContractFactory("NFT");
        nft1 = await NFT1.deploy(
          owner, // special address
        );
        await nft1.deployed();

        expect(await portfolio.getAmaze()).to.equal(nft.address);
        await expect (portfolio.connect(user1).setAmaze(nft1.address)).to.be.revertedWith("Not special address");
        expect(await portfolio.setAmaze(nft1.address));
        expect(await portfolio.getAmaze()).to.equal(nft1.address);

        expect(await portfolio.getNativeToken()).to.equal(NATIVE);
        await expect (portfolio.connect(user1).setNativeToken(usdt.address)).to.be.revertedWith("Not special address");
        expect(await portfolio.setNativeToken(usdt.address));
        expect(await portfolio.getNativeToken()).to.equal(usdt.address);

        expect(await portfolio.getCost()).to.equal(ether("100"));
        await expect (portfolio.connect(user1).setCost(ether("251"))).to.be.revertedWith("Not special address");
        expect(await portfolio.setCost(ether("258")));
        expect(await portfolio.getCost()).to.equal(ether("258"));
    });

});