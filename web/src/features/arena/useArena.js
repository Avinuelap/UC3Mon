import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useArena(contractAddress, contractAbi) {
    const [contract, setContract] = useState(null)
    useEffect(()=> {
        if(!contractAddress || !contractAbi) return;
        console.log("Initializing game contract")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(
            contractAddress,
            contractAbi,
          signer
        );
        setContract(gameContract)
    }, [contractAddress, contractAbi])

    return {contract}
} 