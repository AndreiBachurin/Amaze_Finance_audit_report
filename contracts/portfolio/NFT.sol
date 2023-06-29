// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../libraries/SpecialAddress.sol";

/// @title NFT investment portfolios contract
/// @notice You can only use this contract to get information about the user's portfolio
contract NFT is ERC721Enumerable, SpecialAddress {

    struct infoPrice {
        uint256 amount; // amount of tokens in decimals
        uint256 price; // price for 1 token 
    }

    mapping(uint256 => mapping(address => mapping(uint256 => infoPrice))) internal balances; // id => address => id timestamp => balance
    mapping(address => bool) internal statuses; // user's address => premium status
    mapping(uint256 => uint256[]) internal info; // _idNFT => timeStamps
    mapping(uint256 => mapping(uint256 => address[])) internal addresses; // idNFT => id stamp => addresses

    address public portfolio; // address of portfolio contract
    uint256 public supplyCounter; // NFT supply

    /// @notice Constructor
    /// @param specialAddress_ address which allows to change portfolio address
    constructor(
        address specialAddress_
    )
    ERC721("Amaze.finance", "Amaze") {
        specialAddresses[msg.sender] = true;
        specialAddresses[specialAddress_] = true;
    }

    /// @notice Only the portfolio contract can change the values of customer portfolios
    modifier onlyPortfolio() {
        require(portfolio == msg.sender, "Not portfolio contract");
        _;
    }

    /// @notice Only in existing portfolios variables can be modified
    /// @param _idNFT NFT id for existence check
    modifier onlyExists(uint256 _idNFT) {
        require (_exists(_idNFT), "NFT not found");
        _;
    }

    /// @notice Сreates a new NFT portfolio
    /// @param _user address of the owner of the new NFT portfolio
    function mint(address _user) external onlyPortfolio {
        supplyCounter += 1;
        _mint(_user, supplyCounter);
    }

    /// @notice Removes the NFT portfolio
    /// @param _idNFT NFT id for remove
    function burn(uint256 _idNFT) external onlyPortfolio {
        _burn(_idNFT);
    }

    /// @notice Gets token addresses by timestamp id and NFT
    /// @param _idNFT NFT id for getting token addresses
    /// @param _idTimeStamp timestamp id for getting token addresses
    /// @return addresses returns the addresses of the tokens in the selected timestamp id
    function getAddresses(
        uint256 _idNFT,
        uint256 _idTimeStamp
    ) public view 
        returns(address[] memory) 
    {
        return addresses[_idNFT][_idTimeStamp];
    }  

    /// @notice Set token addresses by timestamp id and NFT
    /// @param _idNFT NFT id for setting token addresses
    /// @param _idTimeStamp timestamp id for setting token addresses
    /// @param _addresses addresses of tokens to add
    function setAddresses(
        uint256 _idNFT,
        uint256 _idTimeStamp,
        address[] calldata _addresses
    ) external  
        onlyPortfolio
        onlyExists(_idNFT)
    {
        addresses[_idNFT][_idTimeStamp] = _addresses;
    }  

    /// @notice Set amount and price of token by timestamp id, NFT and token address
    /// @param _idNFT NFT id for setting amount and price of token
    /// @param _token token address 
    /// @param _idTimeStamp timestamp id for setting amount and price of token
    /// @param _amount the number of tokens that have been added
    /// @param _price the price of 1 token (1 * 10 ** decimals)
    function setPriceData(
        uint256 _idNFT,
        address _token,
        uint256 _idTimeStamp,
        uint256 _amount,
        uint256 _price
    ) external 
        onlyPortfolio
        onlyExists(_idNFT)
    {
        balances[_idNFT][_token][_idTimeStamp] = infoPrice(_amount, _price);
    }

    /// @notice Set amount of token by timestamp id, NFT and token address
    /// @param _idNFT NFT id for setting amount of token
    /// @param _token token address 
    /// @param _idTimeStamp timestamp id for setting price of token
    /// @param _amount new amount of tokens
    function setAmount(
        uint256 _idNFT,
        address _token,
        uint256 _idTimeStamp,
        uint256 _amount
    ) external 
        onlyPortfolio
        onlyExists(_idNFT)
    {
        balances[_idNFT][_token][_idTimeStamp].amount = _amount;
    }

    /// @notice Gets amount and price of token by timestamp id, NFT and token address
    /// @param _idNFT NFT id for getting amount and price of token
    /// @param _token token address 
    /// @param _idTimeStamp timestamp id for setting price of token
    /// @return infoPrice struct with amount and price
    function getPriceData(
        uint256 _idNFT,
        address _token,
        uint256 _idTimeStamp
    ) external view 
        returns(infoPrice memory)
    {
        return infoPrice(
            balances[_idNFT][_token][_idTimeStamp].amount,
            balances[_idNFT][_token][_idTimeStamp].price
        );
    }

    /// @notice Change of user's premium status
    /// @param _user address of user
    /// @param _type status
    function setStatus(address _user, bool _type) external onlyPortfolio {
        statuses[_user] = _type;
    }

    /// @notice Gets user's premium status
    /// @param _user address of user
    /// @return bool true or false - status 
    function getStatus(address _user) external view returns(bool){
        return statuses[_user];
    }

    /// @notice Set information about a new liquidity addition
    /// @param _idNFT id of NFT portfolio
    /// @param _addresses addresses of tokens that have been added
    /// @param _timeStamp timestamp of new liquidity addition
    function setInfo(
        uint256 _idNFT,
        address[] calldata _addresses,
        uint256 _timeStamp
    ) external 
        onlyPortfolio
        onlyExists(_idNFT)
    {
        addresses[_idNFT][info[_idNFT].length] = _addresses;
        info[_idNFT].push(_timeStamp);
    }

    /// @notice Get all timestamps of added liquidity
    /// @param _idNFT id of NFT portfolio
    /// @return uint256[] array of timestamps
    function getPortfolioTimestamps(uint256 _idNFT) external view returns(uint256[] memory) {
        return info[_idNFT];
    }

    /// @notice Get all periods of added liquidity
    /// @param _idNFT id of NFT portfolio
    /// @return uint256[] array of periods in seconds
    function getPeriods(uint256 _idNFT) external view returns(uint256[] memory) {
        uint256 _size = info[_idNFT].length;
        uint256[] memory _timeStamps = new uint256[](_size);
        for (uint256 i = 0; i < _size;) {
            _timeStamps[i] = block.timestamp - info[_idNFT][i];
            unchecked { i++; }
        }
        return _timeStamps;
    }

    /// @notice Get balance of tokens in this contract
    /// @param _tokenAddress address of token
    /// @return uint256 amount in wei of tokens
    function getTokenBalance(IERC20 _tokenAddress) public view returns (uint256) {
        return _tokenAddress.balanceOf(address(this));
    }

    /// @notice Get portfolio address
    /// @return address portfolio contract address
    function getPortfolioAddress() external view returns(address) {
        return portfolio;
    }

    /// @notice Get amount of NFT portfolios
    /// @return uint256 number of created portfolios
    function supply() public view returns(uint256) {
        return supplyCounter;
    }

    /// @notice Set new portfolio contract address
    /// @param _newPortfolio new portfolio contract address
    function setPortfolioAddress(address _newPortfolio) external _SpecialAddress {
        portfolio = _newPortfolio;
    }

    /// @notice Withdraws funds accidentally sent to this contract
    /// @param _tokenAddress address of token
    /// @param _to recipient address
    /// @param _amount amount to withdraw
    function withdrawTokensERC20(IERC20 _tokenAddress, address _to, uint256 _amount) external _SpecialAddress {
        if (_amount == 0 || _amount > getTokenBalance(_tokenAddress)) {
            _amount = getTokenBalance(_tokenAddress);
        }
        _tokenAddress.transfer(_to, _amount);
    }

    /// @notice Overrides transferFrom function to don't allow user transfer NFT portfolio
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {}

    /// @notice Overrides safeTransferFrom function to don't allow user transfer NFT portfolio
    function safeTransferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {}

    /// @notice Overrides safeTransferFrom function to don't allow user transfer NFT portfolio
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override(ERC721, IERC721) {}

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
