import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getUserAgences(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/agences/filter`;

  return (
    fetch(url,{
      method:"GET",
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
  )
}
