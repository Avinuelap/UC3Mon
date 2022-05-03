import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import SelectCharacter from "./Components/SelectCharacter";
import Minter from "./Components/Minter/Minter";
import { NFTCard } from "./Components/Card/Card";
import { PVEARENA_ADDRESS, transformCharacterData } from "./constants";
import pveArena from "./utils/PVEArena.json";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFTs, setCharacterNFTs] = useState([]);

  function addCharacterNFT(newNFT) {
    setCharacterNFTs((prevState) => [...prevState, newNFT]);
    console.log("Added to state: ", newNFT);
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
    } else if (currentAccount && !characterNFTs) {
      return <SelectCharacter setCharacterNFT={setCharacterNFTs} />;
    } else if (currentAccount && characterNFTs) {
      console.log("Number of NFTs detected:", characterNFTs.length);

      return (
        <div>
          <section className="nfts-list">
            {characterNFTs &&
              characterNFTs.map((mon, index) => {
                console.log(`Mapping on NFT number ${index}`);
                return (
                  <NFTCard
                    key={index}
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
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with our smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);
      console.log("Current contract address: ", PVEARENA_ADDRESS);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        PVEARENA_ADDRESS,
        pveArena.abi,
        signer
      );
      const monsOwned = await gameContract.getOwnedMons();
      console.log(`Mons owned: ${monsOwned}`);
      
      // Fetch all initially owned NFTs data
      const allInfo = monsOwned.map((_,i)=>gameContract.getMonInfo(i));
      const res = await Promise.all(allInfo);
      setCharacterNFTs(res.map(data=>transformCharacterData(data)))
    };
    /*
     * We only want to run this if we have a connected wallet
     */
    if (currentAccount) {
      console.log("Running fetchNFTMetadata");
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
        {characterNFTs[0] && (
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
        )}
      </div>
    </div>
  );
};

export default App;
