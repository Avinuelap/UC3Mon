const main = async () => {
  const pveArenaContractFactory = await hre.ethers.getContractFactory("PVEArena");
  const pveArenaContract = await pveArenaContractFactory.deploy();
  await pveArenaContract.deployed();
  console.log("Contract deployed to:", pveArenaContract.address);

  let txn;

  // Create enemy
  console.log("Creating enemy Lionel Messi");
  txn = await pveArenaContract.createEnemy("Lionel Messi", 50);
  await txn.wait();

  // Mint UC3Mon NFT
  console.log("*****************************");
  console.log("Minting NFT El Bicho");
  txn = await pveArenaContract.createUC3Mon("El Bicho");
  await txn.wait();

  // Get the value of the NFT's URI.
  let returnedTokenUri = await pveArenaContract.tokenURI(0);
  console.log("Token URI:", returnedTokenUri);


  // // Ok until we get here
  // console.log("*****************************");
  // console.log("Fighting!");
  // // TODO: Problema con las direcciones. Normal, si estoy corriendo en local duh
  // txn = await pveArenaContract.fight(0, 0);
  // await txn.wait();

  console.log("Done!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
