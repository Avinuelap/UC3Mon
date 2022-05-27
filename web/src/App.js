import React, { useEffect, useState } from 'react'
import './App.css'
import Minter from './Components/Minter/Minter'
import { NFTCard, EnemyCard } from './Components/Card/Card'
import LoadingIndicator from './Components/LoadingIndicator'
import {
    PVEARENA_ADDRESS,
    transformCharacterData,
    transformEnemyData,
} from './constants'
import pveArena from './utils/PVEArena.json'
import { useFight } from './features/fight/useFight'
import { useArena } from './features/arena/useArena'

const App = () => {
    // State
    const [currentAccount, setCurrentAccount] = useState(null)
    const [characterNFTs, setCharacterNFTs] = useState([])
    const [enemies, setEnemies] = useState([])
    const [selectedNFT, setSelectedNFT] = useState()

    const { contract: arenaContract } = useArena(PVEARENA_ADDRESS, pveArena.abi)
    const { doFight, isMonFighting } = useFight(arenaContract)

    function addCharacterNFT(newNFT) {
        setCharacterNFTs((prevState) => [...prevState, newNFT])
        //console.log("Added to state: ", newNFT);
    }

    function modifySelectedNFT(id) {
        setSelectedNFT(id)
    }

    // Actions
    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                console.log('Make sure you have MetaMask!')
                return
            } else {
                const accounts = await ethereum.request({
                    method: 'eth_accounts',
                })

                if (accounts.length !== 0) {
                    const account = accounts[0]
                    console.log('Found an authorized account:', account)
                    setCurrentAccount(account)
                } else {
                    console.log('No authorized account found')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }



    const startFight = async (enemyId) => {
        if (selectedNFT >= 0) {
            console.log(
                `NFT with id ${selectedNFT} is attacking enemy number ${enemyId}!`
            )
            try {
                await doFight(selectedNFT, enemyId)
            } catch (error) {
                console.log(error)
            }
        } else {
            alert('Select an NFT!')
        }
    }

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
            )
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
                                )
                            })}
                    </section>
                    {isMonFighting && <button>Fighting...</button>}
                    { <button onClick={handleEndFightButton}>
                        End fight of nft 0
                    </button> }
                    <LoadingIndicator></LoadingIndicator>

                    <section className="nfts-list">
                        {characterNFTs &&
                            characterNFTs.map((mon, index) => {
                                //console.log(`Mapping on NFT number ${index}`);
                                return (
                                    <NFTCard
                                        key={index}
                                        selectedNFT={selectedNFT}
                                        selectedNftUpdater={modifySelectedNFT}
                                        id={index}
                                        name={mon.name}
                                        level={mon.level}
                                        exp={mon.exp}
                                        imageURI={mon.imageURI}
                                    />
                                )
                            })}
                    </section>
                    <Minter numOwnedNFTs={characterNFTs.length} stateUpdater={addCharacterNFT} />
                </div>
            )
        }
    }

    ////////////////////////////////////
    
    // TEST. TO BE REMOVED
    async function handleEndFightButton() {
        console.log('Mon fighting: ', isMonFighting)
        // try {
        //     await forceEndFight()
        // } catch (error) {
        //     console.log(error)
        // }
    }
    async function forceEndFight() {
        console.log('Force ending fight')
        await arenaContract.forceEndFight(0)
        console.log('Ended')
    }
    
    ///////////////////////////////////

    const connectWalletAction = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                alert('Get MetaMask!')
                return
            }

            /*
             * Request access to account.
             */
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })

            /*
             * Print out public address once we authorize Metamask.
             */
            console.log('Connected', accounts[0])
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
        }
    }

    /* Initial check for wallet connection */
    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    useEffect(() => {
        if (!arenaContract || !currentAccount) return;
        const fetchEnemyData = async () => {
            console.log('Fetching enemy data')
            if (!arenaContract) return
            const existingEnemies = await arenaContract.getExistingEnemiesIds()
            //console.log(`Existing enemies ids: ${existingEnemies}`)
    
            // Fetch all existing enemies' data
            const allInfo = existingEnemies.map((_, i) =>
                arenaContract.getEnemyInfo(i)
            )
            const res = await Promise.all(allInfo)
            setEnemies(res.map((data) => transformEnemyData(data)))
        }
        fetchEnemyData()
        console.log("Fetched enemies")
    }, [arenaContract, currentAccount])

    /* Initial useEffect for NFT data gathering*/
    useEffect(() => {
        if (!currentAccount) return;
        const fetchNFTMetadata = async () => {
            //console.log("Fetching NFT data");

            const monsOwned = await arenaContract.getOwnedMons()

            // Fetch all initially owned NFTs data
            const allInfo = monsOwned.map((_, i) => arenaContract.getMonInfo(i))
            const res = await Promise.all(allInfo)
            setCharacterNFTs(res.map((data) => transformCharacterData(data)))
        }
        fetchNFTMetadata()
    }, [arenaContract, currentAccount])

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">👾 UC3Mon 👾</p>
                    <p className="sub-text">Go catch em on!</p>
                </div>
                <div className="connect-wallet-container">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default App
