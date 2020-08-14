import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getZoneClients(zoneId){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/zones/${zoneId}/clients`;

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

export function getTeamClients(teamId){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/clients/teams/${teamId}`;

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

export function getAgenceClients(agenceId){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/clients/agences/${agenceId}`;

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