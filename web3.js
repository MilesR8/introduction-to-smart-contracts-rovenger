const Web3 = require("web3");
const IPFS = require("ipfs-http-client");

const ipfs = IPFS.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const web3 = new Web3("https://your-ethereum-node-url");
const contractABI = []; // ABI generated from your Keeper contract
const contractAddress = "0x..."; // Your deployed Keeper contract address

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

  const { playerAddress, name } = event.returnValues;
  const playerData = {
    name,
    banned: false,
    wins: 0,
    losses: 0,
  };

  const cid = await addToIPFS(playerData);
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
  