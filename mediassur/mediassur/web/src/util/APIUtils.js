import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN, CURRENT_USER } from 'constant';
import { notification } from 'antd';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function handleLogout(redirectTo="/", notificationType="success", description="Vous avez été déconnectés avec succès", context) {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(CURRENT_USER);
    /* context.setState({
      currentUser: null,
      isAuthenticated: false
    });*/
    //context.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Mediassur App',
      description: description,
    });

    window.location.href = process.env.PUBLIC_URL + redirectTo;

}


export function exeRequest(relativeUrl, method, data, callBack, context){

    let options = {
        url: API_BASE_URL + relativeUrl,
        method: method
    }

    if(data && data !== {}){
        options = Object.assign({}, {body : JSON.stringify(data)}, options);
    }

    request(options).then(response => {
        callBack.call(context, response);    
    }).catch(error => {
        if(error.status === 401){
            if(context.props.handleLogout)
             context.props.handleLogout('/login', 'error', 'Votre session a expiré, veuillez vous connecter à nouveau ...!!!');    
            else
             handleLogout('/login', 'error', 'Votre session a expiré, veuillez vous connecter à nouveau ...!!!', context);    
        } 
        else if(error.status === 403) {

            notification.error({
                message: 'Mediassur App',
                description: "Vous n'avez pas les autorisations necessaire pour effectuer cette operation ..."
            });      
        } else {
            notification.error({
                message: 'Mediassur App',
                description: error.message || "S'il vous plait ! Quelque chose s'est mal passée. Veuillez réessayer !"
            });      
        }
    });
}

export function exeRequestFinal(relativeUrl, method, data, callBack, callBackError, context){

    let options = {
        url: API_BASE_URL + relativeUrl,
        method: method
    }

    if(data && data !== {}){
        options = Object.assign({}, {body : JSON.stringify(data)}, options);
    }

    request(options).then(response => {
      //console.log("Calling", response)
      if(callBack) callBack.call(context, response);
    }).catch(error => {
        if(error.status === 401) {
            // handleLogout('/login', 'error', 'Votre session a expiré, veuillez vous connecter à nouveau ...!!!', context);
            //this.props.handleLogout('/login', 'error', 'Votre session a expiré, veuillez vous connecter à nouveau ...!!!');
        }
        else if(error.status === 403) {
            notification.error({
                message: 'Mediassur App',
                description: "Desolé ! Vous n'êtes pas autorisés a effectuer cette operation ...!!!"
            });
        } else {
             if(callBackError) callBackError.call(context, error)
             else {
                notification.error({
                    message: 'Mediassur App',
                    description: error.message || 'Desolé ! Something went wrong. Please try again!'
                });
             }

        }

    });
}

export function getClientFiles(clientId) {
   
    return request({
        url: API_BASE_URL +"/clients/" + clientId + "/files",
        method: 'GET'
    });
}


export function getAllUsers() {
   
    return request({
        url: API_BASE_URL +"/users",
        method: 'GET'
    });
}


export function getAllTyeOperations() {
   
    return request({
        url: API_BASE_URL +"/typeOperations",
        method: 'GET'
    });
}



export function getAllOperations(clientId) {
   
    return request({
        url: API_BASE_URL + "/clients/"+ clientId +"/operations",
        method: 'GET'
    });
}

export function getOperation(opId) {
    return request({
        url: API_BASE_URL + "/operations/"+ opId,
        method: 'GET'
    });
}


export function getAllCategories() {
   
    return request({
        url: API_BASE_URL + "/categories",
        method: 'GET'
    });
}


export function getAllClients(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/clients/sort?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getClient(id) {
    
    return request({
        url: API_BASE_URL + "/clients/" +  id,
        method: 'GET'
    });
}

export function getAllRoutes(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/routes/sort?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllZone() {
   /* page = page || 0;
    size = size || POLL_LIST_SIZE;*/

    return request({
        url: API_BASE_URL + "/zones",
        method: 'GET'
    });
}


export function getClientsBySegment(id) {
   
    return request({
        url: API_BASE_URL + "/segments/"+ id +"/clients",
        method: 'GET'
    });
    
}

export function getMdashbord() {
    return request({
        url: API_BASE_URL + "/reportings/mdashbord",
        method: 'GET'
    });
}

export function getSegmentsByZone(id) {
   
    return request({
        url: API_BASE_URL + "/zones/"+ id +"/segments",
        method: 'GET'
    });
    
}

export function getZone(id) {
    return request({
        url: API_BASE_URL + "/zones/" +  id,
        method: 'GET'
    });
}

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}