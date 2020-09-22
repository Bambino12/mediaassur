import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getCadreAttestation(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/assures`;

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

export function getCadreAttestation(){
    const token = store.getState().auth.token
    const url = `${API_ROUTE}/assureurs`;
  
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