import "./Card.css";

export function NFTCard(props) {
  function selectThisCard() {
      props.selectedNftUpdater(props.id);
  }

  return (
    <div
      className="nft-card"
      onClick={selectThisCard}
    >
      <img
        src={`https://cloudflare-ipfs.com/ipfs/${props.imageURI}`}
        alt="IPFS code is broken"
      ></img>
      <div className="nft-stats-container">
        <h3>{props.name}</h3>
        <p>Level: {props.level}</p>
        <p>Exp: {props.exp} / 100</p>
        {props.selectedNFT === props.id && <button className="nftButton"> SELECTED</button>}
      </div>
    </div>
  );
}

export function EnemyCard(props) {

  function attackThisCard() {
    props.attackFunction(props.index)
  }
  return (
    <div className="enemy-card">
      <img
        src={`https://cloudflare-ipfs.com/ipfs/${props.imageURI}`}
        alt="IPFS code is broken"
      ></img>
      <div className="enemy-stats-container">
        <h3>{props.name}</h3>
        <h2 className="enemy-card-chance">Chance: {props.chance}%</h2>
        { props.canAttack &&
        <button className="enemyButton" onClick={attackThisCard}>ATTACK!</button>
        }
        </div>
    </div>
  );
}
