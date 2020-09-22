import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getUserZones(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/zones/filter`;

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

export function getTeamZones(teamId){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/teams/${teamId}/zones`;

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