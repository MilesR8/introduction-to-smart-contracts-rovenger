const Web3 = require("web3");
const IPFS = require("ipfs-http-client");

const ipfs = IPFS.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const web3 = new Web3("https://goerli.infura.io/v3/");
const contractABI = [
	{
		"inputs": [],
		"name": "addLoss",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "n",
				"type": "string"
			}
		],
		"name": "addPlayer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "addWin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "add",
				"type": "address"
			}
		],
		"name": "banPlayer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newName",
				"type": "string"
			}
		],
		"name": "changeName",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_ipfsAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getLosses",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getPlayer",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "banned",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "wins",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "losses",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isInstanced",
						"type": "bool"
					}
				],
				"internalType": "struct Keeper.Player",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWins",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerList",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "banned",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "wins",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "losses",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isInstanced",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // ABI generated from your Keeper contract
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Your deployed Keeper contract address

const keeperContract = new web3.eth.Contract(contractABI, contractAddress);

// Helper functions
async function addToIPFS(data) {
  const { cid } = await ipfs.add(JSON.stringify(data));
  return cid.toString();
}

async function getFromIPFS(cid) {
  const stream = ipfs.cat(cid);
  let data = "";

  for await (const chunk of stream) {
    data += chunk.toString();
  }

  return JSON.parse(data);
}

// Event listeners
keeperContract.events.PlayerDataRequest({}, async (error, event) => {
  if (error) {
    console.error(`Error in PlayerDataRequest event: ${error}`);
    return;
  }

  const { playerAddress } = event.returnValues;
  // Retrieve player data from IPFS and perform the necessary action.
  const cid = "Qm..."; // Replace with the CID for the player's data
  const playerData = await getFromIPFS(cid);
  console.log(`Player data for ${playerAddress}: ${JSON.stringify(playerData)}`);
});

keeperContract.events.PlayerAdded({}, async (error, event) => {
  if (error) {
    console.error(`Error in PlayerAdded event: ${error}`);
    return;
  }

  const { playerAddress, name, ipfsHash } = event.returnValues;
  const playerData = {
    name,
    banned: false,
    wins: 0,
    losses: 0,
  };

  const cid = await addToIPFS(playerData);
  // Call the addPlayer function with the generated IPFS hash.
  await keeperContract.methods.addPlayer(name, cid).send({ from: playerAddress });
  console.log(`Player data for ${playerAddress} added to IPFS with CID: ${cid}`);
});


keeperContract.events.PlayerNameChanged({}, async (error, event) => {
  if (error) {
    console.error(`Error in PlayerNameChanged event: ${error}`);
    return;
  }

  const { playerAddress, newName } = event.returnValues;
  const cid = "Qm..."; // Replace with the existing CID for the player's data
  const playerData = await getFromIPFS(cid);

  playerData.name = newName;
  const newCid = await addToIPFS(playerData);
  console.log(`Player data for ${playerAddress} updated with new name and CID: ${newCid}`);
});

keeperContract.events.PlayerBanned({}, async (error, event) => {
  if (error) {
    console.error(`Error in PlayerBanned event: ${error}`);
    return;
  }

  const { playerAddress } = event.returnValues;
  const cid = "Qm..."; // Replace with the existing CID for the player's data
  const playerData = await getFromIPFS(cid);

  playerData.banned = true;
  const newCid = await addToIPFS(playerData);
  console.log(`Player data for ${playerAddress} updated with ban status and CID: ${newCid}`);
});

keeperContract.events.PlayerWinAdded({}, async (error, event) => {
    if (error) {
      console.error(`Error in PlayerWinAdded event: ${error}`);
      return;
    }
  
    const { playerAddress } = event.returnValues;
    const cid = "Qm..."; // Replace with the existing CID for the player's data
    const playerData = await getFromIPFS(cid);
  
    playerData.wins++;
    const newCid = await addToIPFS(playerData);
    console.log(`Player data for ${playerAddress} updated with new win and CID: ${newCid}`);
  });
  
  keeperContract.events.PlayerLossAdded({}, async (error, event) => {
    if (error) {
      console.error(`Error in PlayerLossAdded event: ${error}`);
      return;
    }
  
    const { playerAddress } = event.returnValues;
    const cid = "Qm..."; // Replace with the existing CID for the player's data
    const playerData = await getFromIPFS(cid);
  
    playerData.losses++;
    const newCid = await addToIPFS(playerData);
    console.log(`Player data for ${playerAddress} updated with new loss and CID: ${newCid}`);
  });
  