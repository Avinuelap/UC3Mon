import { useEffect, useState } from 'react'

export const useFight = (gameContract,) => {
    const [monFighting, setMonFighting] = useState(null) //Index of the mon fighting

    const handleResult = (monId, enemyId) => async () => {
        console.log('Detected RNG result!')
        await gameContract.fightResult(monId, enemyId)
        gameContract.once("battleWon", alertVictory)
        gameContract.once("battleLost", alertDefeat)
    }

    function alertVictory () {
        alert("You win!")
        setMonFighting(null)
        gameContract.off("battleLost", alertDefeat)
    }

    function alertDefeat () {
        alert("You lose!")
        setMonFighting(null)
        gameContract.off("battleWin", alertVictory)
    }

    async function doFight(monId, enemyId) {
        try {
            const fight = await gameContract.fight(monId, enemyId)
            await fight.wait()
            setMonFighting(monId)
            alert("If you deny the fightResult transaction you wont be able to finish the fight!")
            gameContract.once('ResultReceived', handleResult(monId, enemyId))
        } catch (error) {
            console.log(error)
        }
        
    }

    return { doFight, monFighting }
}