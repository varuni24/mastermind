
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame, updateCurrentRowIdx, updateRowCombination, updateRowValue, updateSecretCombination } from './actions/mastermindActions';
import './App.css';


const App = () => {
  const dispatch = useDispatch()

  const secretCombination = useSelector(state => state.mastermind.secretCombination)
  const colorCodeMap = useSelector(state => state.mastermind.colorCodeMap)
  const rowValues = useSelector(state => state.mastermind.rowValues)
  const currentRowIdx = useSelector(state => state.mastermind.currentRowIdx)
  const gameOver = useSelector(state => state.mastermind.gameOver)
  const newGame = useSelector(state => state.mastermind.newGame)

  const [showPopup, setShowPopup] = useState(false)
  const [guessedCombo, setGuessedCombo] = useState(false)

  const [showRulesPopup, setShowRulesPopup] = useState(false)

  useEffect(() => {
    if (newGame === true)
      generateRandomCombination()
  }, [newGame])

  useEffect(() => {
    if (gameOver === true) setShowPopup(true)
    else setShowPopup(false)
  }, [gameOver])

  const isRowDisabled = (rowIdx) => {
    return rowIdx !== currentRowIdx
  }

  const isEmptyCirclePresent = (value) => {
    return value.includes('0')
  }

  const generateRandomCombination = () => {
    let secretKey = ''
    for (let i = 1; i <= 4; i++) {
      secretKey = secretKey.concat((Math.floor(Math.random() * 6) + 1).toString());
    }
    if (secretCombination === '0000') {
      dispatch(updateSecretCombination(secretKey))
    }
  }

  const setColors = (rowColorIdx, colorNum, currentGuess, rowIdx) => {
    let currentValue = parseInt(colorNum)
    let nextColor = currentValue + 1 > 6 ? 1 : currentValue + 1
    let updatedGuess = currentGuess.substr(0, rowColorIdx) + nextColor.toString() + currentGuess.substr(rowColorIdx + 1);
    dispatch(updateRowCombination(rowIdx, updatedGuess))

  }

  const getColorFromString = (value, rowIdx) => {
    let colors = value.split('').map((idx, key) => {
      let cssClass = `${colorCodeMap[idx]}BG`

      if (isRowDisabled(rowIdx)) {
        return (
          <div
            id='circle'
            className={`${cssClass} disabledCircle marginRightMedium`}
          />
        )
      }
      else {
        return (
          <div
            id='circle'
            className={`${cssClass} marginRightMedium`}
            onClick={() => setColors(key, idx, value, rowIdx)}
          />
        )
      }
    })
    return colors
  }

  const getIndicatorPegs = (row) => {

    let values = []
    for (let i = 1; i <= row.correctColorPlacements; i++) values.push('blackBG')
    for (let j = 1; j <= row.incorrectColorPlacements; j++) values.push('redBG')
    for (let l = 1; l <= 4; l++) {
      if (values[l] === null || values[l] === undefined)
        values.push('')
    }

    return (
      <div className='flexDisplay flexRow flexWrap indicatorPegs alignCenter'>
        <div id='pegCircle' className={`marginRightSmall ${values[0]}`}></div>
        <div id='pegCircle' className={`${values[1]}`}></div>
        <div id='pegCircle' className={`marginRightSmall ${values[2]}`}></div>
        <div id='pegCircle' className={`${values[3]}`}></div>
      </div>
    )
  }

  const generateRow = (row, rowIdx) => {
    let classes = isRowDisabled(rowIdx) ? 'flexRow marginBottomLarge rowDiv' : 'flexRow marginBottomLarge rowDiv borderDiv'
    return (
      <div className={classes}>
        {getColorFromString(row.value, rowIdx)}
        {isRowDisabled(rowIdx) || (!isRowDisabled(rowIdx) && isEmptyCirclePresent(row.value)) ?
          <Button className='marginLeftLarge disabledButton marginRightLarge' >Check!</Button>
          : <Button className='marginLeftLarge enabledButton marginRightLarge' onClick={() => checkCombination(row, rowIdx)}>Check!</Button>
        }
        {getIndicatorPegs(row)}
      </div>
    )
  }

  const convertArrayToMap = (arr) => {
    return new Map(arr.map(function (val, index) { return [index, val] }))
  }

  const checkCombination = (row, rowIdx) => {

    let correctColorAndPlacement = 0
    let correctColorNotPlacement = 0

    let secretItems = secretCombination.split('')
    let secretMap = convertArrayToMap(secretItems)

    let rowGuessItems = row.value.split('')
    let rowGuessMap = convertArrayToMap(rowGuessItems)

    // Exact matches
    for (let [key, value] of rowGuessMap) {
      if (value === secretMap.get(key)) {
        correctColorAndPlacement++;
        rowGuessMap.delete(key);
        secretMap.delete(key);
      }
    }

    // Color exists 
    for (let [key, value] of rowGuessMap) {
      let foundKey = keyOf(secretMap, value);
      if (foundKey !== -1) {
        correctColorNotPlacement++;
        secretMap.delete(foundKey);
      }
    }

    dispatch(updateRowValue(rowIdx, correctColorAndPlacement, correctColorNotPlacement))
    dispatch(updateCurrentRowIdx(rowIdx + 1))

    if (correctColorAndPlacement === 4) {
      setGuessedCombo(true)
      setShowPopup(true)
    } else if (rowIdx === 10) {
      setGuessedCombo(false)
      setShowPopup(true)
    }

  }

  const keyOf = (map, valueToFind) => {
    for (let [key, value] of map) {
      if (valueToFind === value) {
        return key;
      }
    }
    return -1;
  }

  const rowDisplay = (
    <div>
      {Object.keys(rowValues).map(rowIdx => {
        let idx = parseInt(rowIdx.slice(-2)) ? parseInt(rowIdx.slice(-2)) : parseInt(rowIdx.slice(-1))
        return <div>{generateRow(rowValues[rowIdx], idx)}</div>
      })}

    </div>
  )

  const gameOverPopup = (
    <Dialog
      open={showPopup}
      onClose={() => { setShowPopup(false);; dispatch(resetGame()) }}
      maxWidth='xl'
    >
      <DialogTitle id="alert-dialog-title"></DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {guessedCombo ? 'Congratulations! You guessed it right :)' : 'Oops! Try again next time'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setShowPopup(false); dispatch(resetGame()) }} color="primary">
          Play Again!
        </Button>
      </DialogActions>
    </Dialog>
  )

  const rulesPopup = (
    <Dialog
      open={showRulesPopup}
      onClose={() => { setShowRulesPopup(false) }}
      maxWidth='xl'
    >
      <DialogTitle id="alert-dialog-title">Rules</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <ol>
            <li> Try to guess the pattern, in both order and color, within ten turns. </li>
            <li> Click on the circles to set the colors.</li>
            <li> Once you have assigned all the circles in the row to a color, click on the Check button.</li>
            <li> After submitting a row, a small black peg is placed for each code peg from the guess which is correct in both color and position. </li>
            <li> A red peg indicates the existence of a correct color code peg placed in the wrong position.</li>
          </ol>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setShowRulesPopup(false) }} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <div className='flexDisplay flexColumn alignCenter'>
      <br />
      <br />
      <div className='flexRow'>
        <div id='titlecircle' className={`yellowBG centerText`}>M</div>
        <div id='titlecircle' className={`orangeBG centerText`}>A</div>
        <div id='titlecircle' className={`pinkBG centerText`}>S</div>
        <div id='titlecircle' className={`purpleBG centerText`}>T</div>
        <div id='titlecircle' className={`blueBG centerText`}>E</div>
        <div id='titlecircle' className={`greenBG centerText`}>R</div>
        <div id='titlecircle' className={`centerText`}>M</div>
        <div id='titlecircle' className={`centerText`}>I</div>
        <div id='titlecircle' className={`centerText`}>N</div>
        <div id='titlecircle' className={`centerText`}>D</div>
      </div>
      <br />
      <br />

      <Button onClick={() => setShowRulesPopup(true)} className='blueFont'> View Rules </Button>
      {rulesPopup}
      <br />
      <br />
      {rowDisplay}
      {gameOverPopup}
    </div>
  )
}


export default App;
