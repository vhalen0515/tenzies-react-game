import React from "react"

export default function Dice(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <div className="dice-face" onClick={() => props.holdDice(props.id)} style={styles}>
            <h2 className="dice-number">{props.value}</h2>
        </div>
    )
}