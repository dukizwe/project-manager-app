export const ADD_CRA_ACTION = 'ADD_CRA_ACTION'
export const APPEND_CRA_ACTION = 'APPEND_CRA_ACTION'
export const PREPEND_CRA_ACTION = 'PREPEND_CRA_ACTION'
export const CHANGE_OFFSET_ACTION = 'CHANGE_OFFSET_ACTION'
export const SET_CRAS_LOADING = 'SET_CRAS_LOADING'

const initials = {
          cras: [],
          offset: 10,
          loading: true
}
export function craReducer(state = initials, action) {
          switch (action.type) {
                    case ADD_CRA_ACTION:
                              return {...state, cras: action.payload}
                    case APPEND_CRA_ACTION:
                              return {...state, affectations: [...state.cras, ...action.payload]}
                    case PREPEND_CRA_ACTION:
                              const newCras = [action.payload, ...state.cras]
                              return {...state, cras: newCras}
                    case CHANGE_OFFSET_ACTION:
                              return {...state, offset: action.payload}
                    case SET_CRAS_LOADING:
                              return {...state, loading: action.payload}
                    default:
                              return state
          }
}