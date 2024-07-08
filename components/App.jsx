import React from "react"
import Dice from "/components/Dice"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

//test
const diceRollSound = new Audio('./dice-roll-sound.mp3')
const clickSound = new Audio('./click-sound.mp3')
const winnerMusic = new Audio('./winner-music.mp3')

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)

    //test
    React.useEffect(() => {
        diceRollSound.preload = 'auto'
        clickSound.preload = 'auto'
    }, [])

    React.useEffect(() => {
        const heldDice = dice.every(held => held.isHeld)
        const allValuesEqual = dice.every((die, _, dice) => die.value === dice[0].value);
        if (heldDice && allValuesEqual) {
            setTenzies(true)
            winnerMusic.play()
        }
    },[dice])

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

            //test
            diceRollSound.currentTime = 0
            diceRollSound.play()

            // const audio = new Audio('./dice-roll-sound.mp3')
            // audio.play()

        } else {
            window.location.reload()
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

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ?
                {...die, isHeld: !die.isHeld} :
                die
        }))

        //test
        clickSound.currentTime = 0
        clickSound.play()

        // const clickSound = new Audio('./click-sound.mp3')
        // clickSound.play()
    }

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button onClick={rollDice}>
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}