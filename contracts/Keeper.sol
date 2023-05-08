// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/Treasury.sol";
import "contracts/IIPFSClient.sol"; // Import the IIPFSClient interface

contract Keeper{

    event PlayerDataRequest(address playerAddress);
    event PlayerAdded(address playerAddress, string name, string ipfsHash);
    event PlayerNameChanged(address playerAddress, string newName);
    event PlayerBanned(address playerAddress);
    event PlayerWinAdded(address playerAddress);
    event PlayerLossAdded(address playerAddress);

    struct Player{
        string name;
        bool banned;
        //string game;
        uint256 wins;
        uint256 losses;
        bool isInstanced;
    }

    mapping (address => Player) public playerList;
    
    IIPFSClient ipfs;

    constructor(address _ipfsAddress) {
        ipfs = IIPFSClient(_ipfsAddress);
    }

    function getPlayer(address _addr) external view returns (Player memory){
        return playerList[_addr];
    }

    function addPlayer(string memory n) external{
        if(playerList[msg.sender].isInstanced == false){
            Player memory x = Player(n, false, 0, 0, true);
            playerList[msg.sender] = x;
            bytes memory playerData = abi.encode(playerList[msg.sender]);
            bytes32 hash = keccak256(playerData);
            ipfs.add(playerData);
        }
    }

    function changeName(string memory newName) external{
        playerList[msg.sender].name = newName;
        bytes memory playerData = abi.encode(playerList[msg.sender]);
        bytes32 hash = keccak256(playerData);
        ipfs.add(playerData);
    }

    function banPlayer(address add) external{
        playerList[add].banned = true;
        bytes memory playerData = abi.encode(playerList[add]);
        bytes32 hash = keccak256(playerData);
        ipfs.add(playerData);
    }

    function addWin() external{
        playerList[msg.sender].wins++;
        bytes memory playerData = abi.encode(playerList[msg.sender]);
        bytes32 hash = keccak256(playerData);
        ipfs.add(playerData);
    }

    function addLoss() external{
        playerList[msg.sender].losses++;
        bytes memory playerData = abi.encode(playerList[msg.sender]);
        bytes32 hash = keccak256(playerData);
        ipfs.add(playerData);
    }

    function getWins() external view returns (uint256) {
        return playerList[msg.sender].wins;
    }

    function getName() external view returns (string memory) {
        return playerList[msg.sender].name;
    }

    function getLosses() external view returns (uint256) {
        return playerList[msg.sender].losses;
    }

}

// this is a comment test
// The modified contract uses the ipfs-http-client library to interact with the IPFS network. The IPFSHTTPClient contract provides a simple interface to add and retrieve data from IPFS. The addPlayer, changeName, banPlayer, addWin, and addLoss functions have been modified to add the player data to IPFS after updating the playerList mapping.

// When a player is added, the function encodes the Player struct into bytes and adds the data to IPFS. The IPFS hash is not stored in the contract, but the playerList mapping is updated with the new player data.

// When a player's name is changed, the function encodes the updated Player struct into bytes and adds the data to IPFS. The IPFS hash is not stored in the contract, but the playerList mapping is updated with the new player data.

// When a player is banned, wins or losses are added, the function encodes the updated Player struct into bytes and adds