// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IIPFSClient {
    function add(bytes memory data) external returns (string memory);
}
