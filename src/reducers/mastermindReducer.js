import * as types from '../actions/actionTypes'

const initialState = {
    currentRowIdx: 1,
    colorCodeMap:{
        '0': 'white',
        '1': 'yellow',
        '2': 'orange',
        '3': 'pink',
        '4': 'purple',
        '5': 'blue',
        '6': 'green'
    },
    secretCombination: '0000',
    rowValues: {
        row1:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row2:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row3:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row4:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row5:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row6:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row7:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row8:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row9:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
        row10:{
            value:'0000',
            correctColorPlacements:0,
            incorrectColorPlacements:0
        },
    },
    gameOver: false,
    newGame: true

}

export default function mastermindReducer(state = initialState, action) {
    switch (action.type) {
        case types.UPDATE_SECRET_COMBINATION:
            return{
                ...state,
                secretCombination: action.payload,
                newGame: false
            }
        case types.UPDATE_ROW_COMBINATION:
            let updatedRowValue = `row${action.payload.key}`
            return {
                ...state,
                rowValues: {
                    ...state.rowValues,
                    [`row${action.payload.key}`]: {
                        ...state.rowValues[updatedRowValue],
                        value: action.payload.guess
                    }
                }
            }
        case types.UPDATE_ROW_VALUES:
            let updatedRowIdx = `row${action.payload.key}`
            return {
                ...state,
                rowValues: {
                    ...state.rowValues,
                    [`row${action.payload.key}`]: {
                        ...state.rowValues[updatedRowIdx],
                        correctColorPlacements: action.payload.correctColorPlaced,
                        incorrectColorPlacements: action.payload.incorrectColorPlaced
                    }
                }
            }

        case types.UPDATE_CURRENT_ROW_INDEX:
            return {
                ...state,
                currentRowIdx: action.payload
            }
        case types.UPDATE_GAME_OVER:
            return{
                ...state,
                gameOver: action.payload
            }
        case types.RESET_GAME:
            return initialState
        default:
            return state
    }
}