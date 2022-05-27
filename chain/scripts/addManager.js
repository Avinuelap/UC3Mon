const main = async () => {
    const TokenContract = await hre.ethers.getContractFactory(
      "UC3MCoin"
    );
    const deployedTokenContract = await TokenContract.attach(
        "0x9BfdF9186B1Faaa3eBf1FfDBEe2d2c0B100D0D9D" //Deployed token address
    );

    await deployedTokenContract.addManager(
        "0x131e4c58c1F110515ffF442069806F0FC6713889" //Arena address
    );
    console.log("Added manager");
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