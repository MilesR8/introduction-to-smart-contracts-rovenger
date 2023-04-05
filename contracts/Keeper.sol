// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/Treasury.sol";

contract Keeper{

    struct Player{
        string name;
        bool banned;
        //string game;
        uint256 wins;
        uint256 losses;
        bool isInstanced;
    }

    mapping (address => Player) public playerList;
    
    function getPlayer(address _addr) external view returns (Player memory) {
        return playerList[_addr];
    }

    
    function addPlayer(string memory n) external{
        if(playerList[msg.sender].isInstanced == false){
            Player memory x = Player(n, false, 0, 0, true);
            playerList[msg.sender] = x;
        }
    }

    function addWin() external{
        playerList[msg.sender].wins++;
    }

    function addLoss() external{
        playerList[msg.sender].losses++;
    }

    function getWins() external view returns (uint256) {
        return playerList[msg.sender].wins;
    }

    function getLosses() external view returns (uint256) {
        return playerList[msg.sender].losses;
    }

}