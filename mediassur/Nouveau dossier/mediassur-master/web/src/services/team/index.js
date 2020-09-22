import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getUserTeams(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/teams/filter`;

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

export function getAgenceTeams(agenceId){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/agences/${agenceId}/teams`;

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
