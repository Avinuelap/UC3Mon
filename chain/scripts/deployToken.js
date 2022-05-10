const main = async () => {
    const UC3MCoinFactory = await hre.ethers.getContractFactory(
      "UC3MCoin"
    );
    const UC3MCoinContract = await UC3MCoinFactory.deploy();
    await UC3MCoinContract.deployed();
    console.log("Token contract deployed to:", UC3MCoinContract.address);

    const isDevManager = await UC3MCoinContract.isManager();
    console.log("Is dev address manager?", isDevManager);
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