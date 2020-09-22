import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getLots(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/lots/sort`;

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
