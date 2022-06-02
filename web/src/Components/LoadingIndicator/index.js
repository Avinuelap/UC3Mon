import React from 'react'
import './LoadingIndicator.css'

const LoadingIndicator = () => {
    return (
        <div>
            <h3 className="loading-header">Fighting...</h3>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p className="loading-footer"> Remember to accept the fightResult transaction when it pops!</p>
        </div>
    )
}

export default LoadingIndicator
