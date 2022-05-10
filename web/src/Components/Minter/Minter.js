import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { PVEARENA_ADDRESS, transformCharacterData } from "../../constants";
import pveArena from "../../utils/PVEArena.json";
import "./Minter.css";

export default function Minter({ stateUpdater }) {
  const [gameContract, setGameContract] = useState(null);
  const [formData, setFormData] = useState({ name: "", img: "" });

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        PVEARENA_ADDRESS,
        pveArena.abi,
        signer
      );

      /*
       * This is the big difference. Set our gameContract in state.
       */
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  async function fetchNewNft() {
    const monsOwned = await gameContract.getOwnedMons();
    let newMonId = monsOwned.length - 1;
    console.log("Detected new mint! Index is ", newMonId);

    const txn = await gameContract.getMonInfo(newMonId);
    if (txn.name) {
      console.log("Collecting data from new minted NFT");
      stateUpdater(transformCharacterData(txn));
      //console.log(characterNFTs[i]);
    } else {
      console.log("No character NFT found");
    }
  }

  async function mintNewNft() {
    console.log("Minting new NFT");
    gameContract.once("NFTMinted", fetchNewNft);
    console.log(`Minting new nft with name ${formData.name} and image code ${formData.img}`)
    await gameContract.createUC3Mon(
      formData.name,
      formData.img
    );
  }

  function handleFormChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleMintButton() {
    await mintNewNft();
  }
  
  return (
    <div className="mint--container">
      <form className="mint--form">
        <input
          className="mint--form--input1"
          type="text"
          placeholder="Mon Name"
          onChange={handleFormChange}
          name="name"
          value={formData.name}
        />

        <input
          type="text"
          placeholder="Mon Image IPFS code"
          onChange={handleFormChange}
          name="img"
          value={formData.img}
        />

        {/* onClick={mintNewNft} */}
      </form>
      <button className="mint--button" onClick={handleMintButton}>
        MINT NEW NFT
      </button>
    </div>
  );
}
