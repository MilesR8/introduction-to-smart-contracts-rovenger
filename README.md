Miles Rovenger
Liam Propst
Katherine Monroy



README:

# Smart Contract for Crowdfunding and Game Win Tracking

This project is a smart contract for crowdfunding and game win tracking. The contract will hold individual transactions representing each win and loss in the game, and will store hashes created from the transactions on the chain to minimize the amount of data stored. Individuals can see their transactions and corresponding hashes on their end, and the immutable nature of the hashes on the chain prevents shady transactions or failures. The contract can be useful for keeping track of the number of wins and losses over time, and can be used by gaming companies to track player progress.

## Motivation and Background

The motivation behind this project is to provide a transparent and secure way for individuals to track their progress in a game, as well as to provide a platform for crowdfunding. By storing hashes of transactions on the chain, the contract reduces the amount of data stored and provides an immutable record of wins and losses. With information stored publicly on the chain, individuals can identify patterns or prevent unethical practices.

## References

This project builds upon learning the building blocks of smart contracts, blockchain, and game development. Relevant references include:

- chatGPT 
- Jeff

## Instructions

To run the code, you will need to have a compatible smart contract platform installed. Thecode is written in Solidity, so you will need a Solidity compiler such as Remix or Truffle to compile and deploy the contract. Once you have a compiler installed, follow these steps:

1. Clone the repository to your local machine.
2. Open the file containing the smart contract code in your Solidity compiler.
3. Compile the code to generate the contract's bytecode and ABI.
4. Deploy the contract to your chosen blockchain network.
5. Interact with the contract using its functions to add transactions representing wins and losses in the game.

## Documentation

The smart contract code implements the functions necessary for adding transactions representing wins and losses in the game, as well as for storing and retrieving hashes of the transactions on the chain. The code has been tested and works as intended.

## Future Work

There are several directions that could be taken with this project in the future. For example, the contract could be expanded to include additional functionality such as leaderboards or rewards for players with the highest number of wins. Additionally, the contract could be modified to allow for different types of games or crowdfunding campaigns. Finally, the contract could be optimized for gas usage to reduce the cost of transactions for users. 

## License ( IDK HOW TO DO A LICENCE BUT I THINK ITD BE LIKE THIS)

This project is licensed under the MIT License. See the LICENSE file for more information. 

## Video

Please find the video of the project here: https://drive.google.com/file/d/18qz7-ALdymmoPSFr8DMkgvZG7Tbt1poj/view?usp=sharing
