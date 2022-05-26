const main = async () => {
  const pveArenaContractFactory = await hre.ethers.getContractFactory(
    "PVEArena"
  );
  const pveArenaContract = await pveArenaContractFactory.deploy();
  await pveArenaContract.deployed();
  console.log("Contract deployed to:", pveArenaContract.address);

  // // Mint UC3Mon NFT
  // console.log("*****************************");
  // console.log("Minting NFT Vini Junior");
  // txn = await pveArenaContract.createUC3Mon("Vini Junior", "QmUGAgB5y3QqiHQEDMX6DCwcsemb896LsuYBxmQ4qbQrjq");
  // await txn.wait();

  // // Get the value of the NFT's URI.
  // let returnedTokenUri = await pveArenaContract.tokenURI(0);
  // console.log("Token URI:", returnedTokenUri);
  

  
  console.log("Creating enemy");
  txn = await pveArenaContract.createEnemy("Terrible Enemy", "QmYS6bAC3bQ4nf4znqBAPCZWwMSwg9FGa6NEtbuWPRPZwq", 80);
  await txn.wait();
  console.log("Created")

  console.log("Importing token")
  txn = await pveArenaContract.importUC3MToken("0x9BfdF9186B1Faaa3eBf1FfDBEe2d2c0B100D0D9D");
  await txn.wait();


  // existingEnemies = await pveArenaContract.getExistingEnemiesIds();
  // console.log("Existing enemies: ", existingEnemies);

  // for (let i=0; i<existingEnemies.length; i++) {
  //   console.log("Enemy at index ", i, "is: \n");
  //   enemyInfo = await pveArenaContract.getEnemyInfo(i);
  //   console.log(enemyInfo);
  // }
  
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
