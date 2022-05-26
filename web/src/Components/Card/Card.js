import "./Card.css";

export function NFTCard({selectedNFT, selectedNftUpdater, id, name, level, exp, imageURI}) {
  function selectThisCard() {
      selectedNftUpdater(id);
  }

  return (
    <div
      className="nft-card"
      onClick={selectThisCard}
    >
      <img
        //src={`https://cloudflare-ipfs.com/ipfs/${imageURI}`}
        src={`https://gateway.pinata.cloud/ipfs/${imageURI}`}
        alt="IPFS code is broken"
      ></img>
      <div className="nft-stats-container">
        <h3>{name}</h3>
        <p>Level: {level}</p>
        <p>Exp: {exp} / 100</p>
        {selectedNFT === id && <button className="nftButton"> SELECTED</button>}
      </div>
    </div>
  );
}

export function EnemyCard({index, name, chance, imageURI, numberOfEnemies, attackFunction, canAttack}) {

  function attackThisCard() {
    attackFunction(index)
  }
  return (
    <div className="enemy-card">
      <img
        //src={`https://cloudflare-ipfs.com/ipfs/${imageURI}`}
        src={`https://gateway.pinata.cloud/ipfs/${imageURI}`}
        alt="IPFS code is broken"
      ></img>
      <div className="enemy-stats-container">
        <h3>{name}</h3>
        <h2 className="enemy-card-chance">Chance: {chance}%</h2>
        { canAttack &&
        <button className="enemyButton" onClick={attackThisCard}>ATTACK!</button>
        }
        </div>
    </div>
  );
}
