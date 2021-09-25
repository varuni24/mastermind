import * as types from './actionTypes'

export const updateSecretCombination = (key) => {
    return ({
        type: types.UPDATE_SECRET_COMBINATION,
        payload: key
    })
}

export const updateRowCombination = (rowNum, combinationGuessed) => {
    return ({
        type: types.UPDATE_ROW_COMBINATION,
        payload: {
            'key': rowNum,
            'guess': combinationGuessed
        }
    })
}

export const updateRowValue = (rowNum, correctColorPlaced, incorrectColorPlaced, incorrectColor) => {
    return ({
        type: types.UPDATE_ROW_VALUES,
        payload: {
            'key': rowNum,
            'correctColorPlaced': correctColorPlaced,
            'incorrectColorPlaced': incorrectColorPlaced
        }
    })
}

export const updateCurrentRowIdx = (rowIdx) => {
    return ({
        type: types.UPDATE_CURRENT_ROW_INDEX,
        payload: rowIdx
    })
}

export const updateGameOver = (b) => {
    return ({
        type: types.UPDATE_GAME_OVER,
        payload: b
    })
}

export const resetGame = () => {
    return ({
        type: types.RESET_GAME,
    })
}