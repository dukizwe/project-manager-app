import { fetchApi } from "../../functions"
import { ADD_AFFECTATIOS_ACTION, APPEND_AFFECTATIONS_ACTION, FINIE_AFFECTATION, SET_AFFECTATION_LOADING, PREPEND_AFFECTATION_ACTION } from "../reducers/affectationsReducer"

export const appendAffectationsAction = (affectations) => {
          return {
                    type: APPEND_AFFECTATIONS_ACTION,
                    payload: affectations
          }
}

export const prependAffectationsAction = (affectations) => {
          return {
                    type: PREPEND_AFFECTATION_ACTION,
                    payload: affectations
          }
}

export const addAffectationsAction = (affectations) => {
          return {
                    type: ADD_AFFECTATIOS_ACTION,
                    payload: affectations
          }
}

export const setAffectationLoadingAction = (bool) => {
          return {
                    type: SET_AFFECTATION_LOADING,
                    payload: bool
          }
}

export const loadAffectations = (collaboId, q, load = true) => async (dispatch) => {
          if(load) {
                    dispatch(setAffectationLoadingAction(true))
          }
          try {
                    let url = '/Afficher_affectation/'+collaboId
                    if(q && q != '') url += `?q=${q}`
                    const fetchedAffectations = await fetchApi(url)
                    dispatch(addAffectationsAction(fetchedAffectations))
          } catch (error) {
                    console.log(error)
          }
          dispatch(setAffectationLoadingAction(false))
}