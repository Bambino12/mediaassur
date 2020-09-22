import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getCadreLots(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/lots`;

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
