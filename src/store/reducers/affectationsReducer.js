export const ADD_AFFECTATIOS_ACTION = 'ADD_AFFECTATIOS_ACTION'
export const APPEND_AFFECTATIONS_ACTION = 'APPEND_AFFECTATIONS_ACTION'
export const PREPEND_AFFECTATION_ACTION = 'PREPEND_AFFECTATION_ACTION'
export const CHANGE_OFFSET_ACTION = 'CHANGE_OFFSET_ACTION'
export const FINIE_AFFECTATION = 'FINIE_AFFECTATION'
export const SET_AFFECTATION_LOADING = 'SET_AFFECTATION_LOADING'

const initials = {
          affectations: [],
          offset: 10,
          loading: true
}
export function affectationsReducer(state = initials, action) {
          switch (action.type) {
                    case ADD_AFFECTATIOS_ACTION:
                              return {...state, affectations: action.payload}
                    case APPEND_AFFECTATIONS_ACTION:
                              return {...state, affectations: [...state.affectations, ...action.payload]}
                    case PREPEND_AFFECTATION_ACTION:
                              return {...state, affectations: [action.payload, ...state.affectations]}
                    case CHANGE_OFFSET_ACTION:
                              return {...state, offset: action.payload}
                    case SET_AFFECTATION_LOADING:
                              return {...state, loading: action.payload}
                    default:
                              return state
          }
}