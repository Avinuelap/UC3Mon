import "./Card.css"

export function NFTCard(props) {
    return (
        <div className="nft-card">
            <img 
                src={`https://cloudflare-ipfs.com/ipfs/${props.imageURI}`}
                alt="IPFS code is broken">
            </img>
            <div className="nft-stats-container">
                <h3>{props.name}</h3>
                <p>Level: {props.level}</p>
                <p>Exp: {props.exp} / 100</p>
                <button className="attackButton">Attack!</button>
            </div>

        </div>
    )
}

export function EnemyCard(props) {
    return (
     <div className="enemy-card">
         {/* TODO: add enemies! */}
         <img 
                src={`https://cloudflare-ipfs.com/ipfs/${props.imageURI}`}
                alt="IPFS code is broken">
            </img>
            <div className="nft-stats-container">
                <h3>{props.name}</h3>
                <p>Level: {props.level}</p>
                <p>Exp: {props.exp} / 100</p>
                <button className="attackButton">Attack!</button>
            </div>
     </div>
    );
}
