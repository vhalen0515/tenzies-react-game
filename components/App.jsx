import React from "react"
import Dice from "/components/Dice"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

import diceRollSound from "/public/dice-roll-sound.mp3"
import clickSound from "/public/click-sound.mp3"
import winnerMusic from "/public/winner-music.mp3"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)

    React.useEffect(() => {
        const heldDice = dice.every(held => held.isHeld)
        const allValuesEqual = dice.every((die, _, dice) => die.value === dice[0].value);
        if (heldDice && allValuesEqual) {
            setTenzies(true)
            playAudio(winnerMusic)
        }
    },[dice])

      // Preload audio files
  React.useEffect(() => {
    const sounds = [diceRollSound, clickSound, winnerMusic]
    sounds.forEach((sound) => {
      const audio = new Audio(sound)
      audio.load()
    })
  }, [])

  function playAudio(audioFile) {
    const audio = new Audio(audioFile);
    audio.play();
    audio.addEventListener("ended", () => audio.remove());
}

    function generateNewDice() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDiceArray = []
        for (let i = 0; i < 10; i++) {
            newDiceArray.push(generateNewDice())
        }
        return newDiceArray
    }

    function rollDice() {
        if (!tenzies) {
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ? die : generateNewDice()
            }))
            playAudio(diceRollSound)
    
        // } else {
        //     window.location.reload()
            // setTenzies(false)
            // setDice(allNewDice())
        }
    }

    const diceElements = dice.map(die => (
            <Dice 
                key={die.id}
                id={die.id}
                value={die.value}
                isHeld={die.isHeld}
                holdDice={holdDice}
            />
    ))

    function handleNewGame(){
        setTenzies(false)
        setDice(allNewDice())
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ?
                {...die, isHeld: !die.isHeld} :
                die
        }))
        playAudio(clickSound)
    }

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button onClick={tenzies ? handleNewGame : rollDice}>
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}