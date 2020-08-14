import { 
  SIGN_IN, 
  LOG_OUT, 
 } from "./actionTypes";

export function signIn (token, user){
  return dispatch => {
    dispatch({
      type: SIGN_IN,
      token, 
      user
    })
  }
} 

export function logout (){
  return dispatch => {
    dispatch({
      type: LOG_OUT
    })
  }
} 



