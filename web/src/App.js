import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import Minter from "./Components/Minter/Minter";
import { NFTCard, EnemyCard } from "./Components/Card/Card";
import Fight from "./Components/Fight/Fight";
import {
  PVEARENA_ADDRESS,
  SECS_MS,
  transformCharacterData,
  transformEnemyData
} from "./constants";
import pveArena from "./utils/PVEArena.json";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFTs, setCharacterNFTs] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState();
  const [isFighting, setIsFighting] = useState(false);
  const [isFightingAux, setIsFightingAux] = useState(false); //For periodical result check
  const [canResolveFight, setCanResolveFight] = useState(false);

  function addCharacterNFT(newNFT) {
    setCharacterNFTs((prevState) => [...prevState, newNFT]);
    console.log("Added to state: ", newNFT);
  }

  function modifySelectedNFT(id) {
    setSelectedNFT(id);
  }

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEnemyData = async () => {
    console.log("Fetching enemy data");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      PVEARENA_ADDRESS,
      pveArena.abi,
      signer
    );
    const existingEnemies = await gameContract.getExistingEnemiesIds();
    console.log(`Existing enemies ids: ${existingEnemies}`);

    // Fetch all existing enemies' data
    const allInfo = existingEnemies.map((_, i) => gameContract.getEnemyInfo(i));
    const res = await Promise.all(allInfo);
    setEnemies(res.map((data) => transformEnemyData(data)));
  };

  const startFight = async (enemyId) => {
    if (selectedNFT >= 0) {
      console.log(
        `NFT with id ${selectedNFT} is attacking enemy number ${enemyId}!`
      );
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        PVEARENA_ADDRESS,
        pveArena.abi,
        signer
      );
      console.log("Please mount");
      <Fight
        gameContract={gameContract}
        monId={selectedNFT}
        enemyId={enemyId}
      />
      setIsFighting(true);
    } else {
      alert("Select an NFT!");
    }
  };

  // const checkResult = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const gameContract = new ethers.Contract(
  //     PVEARENA_ADDRESS,
  //     pveArena.abi,
  //     signer
  //   );
  //   let txn = await gameContract.getResult();
  //   let value = txn._hex
  //   return value;
  // }

  // Render Methods
  const renderContent = () => {
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/6b3b56f2081213366ef95547c3560741/37ff12d5532cb031-ee/s1280x1920/46afd1f32b7d549f3989e579fc23023a314e1a84.gifv"
            alt="One Punch Man gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (currentAccount && characterNFTs) {
      return (
        <div>
          <section className="enemies-list">
            {enemies &&
              enemies.map((enemy, index) => {
                //console.log(`Mapping on enemy number ${index}`);
                return (
                  <EnemyCard
                    key={index}
                    index={index}
                    name={enemy.name}
                    chance={enemy.chance}
                    imageURI={enemy.imageURI}
                    numberOfEnemies={enemies.length}
                    attackFunction={startFight}
                    canAttack={selectedNFT >= 0}
                  />
                );
              })}
          </section>

          <section className="nfts-list">
            {characterNFTs &&
              characterNFTs.map((mon, index) => {
                //console.log(`Mapping on NFT number ${index}`);
                return (
                  <NFTCard
                    selectedNFT={selectedNFT}
                    selectedNftUpdater={modifySelectedNFT}
                    key={index}
                    id={index}
                    name={mon.name}
                    level={mon.level}
                    exp={mon.exp}
                    imageURI={mon.imageURI}
                  />
                );
              })}
          </section>
          <Minter stateUpdater={addCharacterNFT} />
        </div>
      );
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  /* Initial check for wallet connection */
  useEffect(() => {
    checkIfWalletIsConnected();
    fetchEnemyData();
  }, []);

  // /* If user is fighting, check every second for changes on the result */
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const periodCheck = async () => {
  //       if (isFightingAux) {
  //         let valueHex = await checkResult();
  //         let value = parseInt(valueHex, 16);
  //         console.log("Current result:", value);
  //         if (value>0 && value<2500) {
  //           console.log(`Result is ${value}. Activating resolve button`);
  //           setCanResolveFight(true);
  //           setIsFighting(false);
  //         }
  //       } 
  //     }
  //   periodCheck();
  //   }, SECS_MS);

  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, []);

  /* Initial useEffect for NFT data gathering*/
  useEffect(() => {
    /*
     * The function we will call that interacts with our smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log("Fetching NFT data");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        PVEARENA_ADDRESS,
        pveArena.abi,
        signer
      );
      const monsOwned = await gameContract.getOwnedMons();

      // Fetch all initially owned NFTs data
      const allInfo = monsOwned.map((_, i) => gameContract.getMonInfo(i));
      const res = await Promise.all(allInfo);
      setCharacterNFTs(res.map((data) => transformCharacterData(data)));
    };
    /*
     * We only want to run this if we have a connected wallet
     */
    if (currentAccount) {
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">👾 UC3Mon 👾</p>
          <p className="sub-text">Go catch em on!</p>
        </div>
        <div className="connect-wallet-container">{renderContent()}</div>
          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built with @${TWITTER_HANDLE}`}</a>
          </div>
      </div>
    </div>
  );
};

export default App;
