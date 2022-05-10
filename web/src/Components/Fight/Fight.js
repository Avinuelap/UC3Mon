import { useState, useEffect } from "react";
import { SECS_MS } from "../../constants";

export default function Fight(gameContract, monId, enemyId) {
  const [isFighting, setIsFighting] = useState(true);

  const checkResult = async () => {
    let txn = await gameContract.getResult();
    let value = txn._hex;
    return value;
  };

  useEffect(() => {
      const startFight = async () => {
        await gameContract.fight(monId, enemyId);
      }
      console.log("Mounted Fight. Attack!");
      startFight();
      setIsFighting(true);
  }, []);

  /* If user is fighting, check every second for changes on the result */
  useEffect(() => {
    
    const interval = setInterval(() => {
      const periodCheck = async () => {
        if (isFighting) {
          let valueHex = await checkResult();
          let value = parseInt(valueHex, 16);
          console.log("Current result:", value);
          if (value > 0 && value < 2500) {
            console.log(`Result is ${value}. Resolving!`);
            setIsFighting(false);
            await gameContract.fightResult(monId, enemyId);
          }
        }
      };
      periodCheck();
    }, SECS_MS);

    return () => {
        console.log("Unmounted Fight")
        clearInterval(interval);
     } // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  return (<> </>)
}
