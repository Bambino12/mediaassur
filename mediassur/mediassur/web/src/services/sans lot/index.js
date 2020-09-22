import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getSLots(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/attestations/sans_lot`;

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


export function getSLot() {
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/attestations/sans_lot`;

  return (
    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
  )
}
