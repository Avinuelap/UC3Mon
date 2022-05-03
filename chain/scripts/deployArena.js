const main = async () => {
  const pveArenaContractFactory = await hre.ethers.getContractFactory(
    "PVEArena"
  );
  const pveArenaContract = await pveArenaContractFactory.deploy();
  await pveArenaContract.deployed();
  console.log("Contract deployed to:", pveArenaContract.address);

  // Mint UC3Mon NFT
  console.log("*****************************");
  console.log("Minting NFT Vini Junior");
  txn = await pveArenaContract.createUC3Mon("Vini Junior", "QmUGAgB5y3QqiHQEDMX6DCwcsemb896LsuYBxmQ4qbQrjq");
  await txn.wait();

  // Get the value of the NFT's URI.
  let returnedTokenUri = await pveArenaContract.tokenURI(0);
  console.log("Token URI:", returnedTokenUri);

  console.log("Creating enemy Kayn");
  txn = await pveArenaContract.createEnemy("Kayn", "QmNyMSVmEWpVUhcdAVHguE7PaJSJZ7ATWL99wKjNGBFL5S", 30);
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
