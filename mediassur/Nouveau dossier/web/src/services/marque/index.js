import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getMarque(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/marque`;

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
