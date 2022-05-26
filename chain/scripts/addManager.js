const main = async () => {
    const TokenContract = await hre.ethers.getContractFactory(
      "UC3MCoin"
    );
    const deployedTokenContract = await TokenContract.attach(
        "0x9BfdF9186B1Faaa3eBf1FfDBEe2d2c0B100D0D9D" //Deployed token address
    );

    await deployedTokenContract.addManager(
        "0x4f1Ab9c7Fb8ecc5e2B28fb9F60cAF18B64E26e19" //Arena address
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