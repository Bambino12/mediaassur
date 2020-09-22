import {API_ROUTE} from 'api/routes'
import store from 'redux/store'

export function getUsers(){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/users`;

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


export function getUser(id){
  const token = store.getState().auth.token
  const url = `${API_ROUTE}/users/${id}`;

  return (
    fetch(url,{
      method:"GET",
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
  );
}

export function toggleState({id, state}){
  const url = `${API_ROUTE}/users/${id}/activate/${state}`;
  const token = store.getState().auth.token
  
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
