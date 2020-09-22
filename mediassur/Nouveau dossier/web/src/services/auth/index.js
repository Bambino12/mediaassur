// api routes
import {API_ROUTE} from 'api/routes'

export function signInUser(data){
  const url = `${API_ROUTE}/auth/signin`;
  return (
    fetch(url, {
      method:"POST",
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json",
      },
      body:JSON.stringify(data)
    })
    .then(response => (
      response.json().then(json => {
        if(!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
    ))
  )
}

export function passwordEmail(data){
  const url = `${API_ROUTE}/auth/reset/admin`;

  return (
    fetch(url, {
      method:"POST",
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json",
      },
      body:JSON.stringify(data)
    })
  )
}

export function passwordReset(data){
  const url = `${API_ROUTE}/auth/reset/password/admin`;
  return (
    fetch(url, {
      method:"POST",
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json",
      },
      body:JSON.stringify(data)
    })
  );
}
