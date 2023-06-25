import { fetchApi } from "../../functions"
import { ADD_CRA_ACTION, APPEND_CRA_ACTION, SET_CRAS_LOADING, PREPEND_CRA_ACTION } from "../reducers/craReducer"

export const appendCrasAction = (cras) => {
          return {
                    type: APPEND_CRA_ACTION,
                    payload: cras
          }
}

export const prependCrasAction = (cras) => {
          return {
                    type: PREPEND_CRA_ACTION,
                    payload: cras
          }
}

export const addCrasAction = (cras) => {
          return {
                    type: ADD_CRA_ACTION,
                    payload: cras
          }
}

export const setCrasLoadingAction = (bool) => {
          return {
                    type: SET_CRAS_LOADING,
                    payload: bool
          }
}

export const loadCrasAction = (collaboId, q, load = true) => async (dispatch) => {
          if(load) {
                    dispatch(setCrasLoadingAction(true))
          }
          try {
                    let url = '/Afficher_cra/'+collaboId
                    if(q && q != '') url += `?q=${q}`
                    const fetchedCras = await fetchApi(url)
                    dispatch(addCrasAction(fetchedCras))
          } catch (error) {
                    console.log(error)
          }
          dispatch(setCrasLoadingAction(false))
}