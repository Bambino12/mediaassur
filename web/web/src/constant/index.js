export const  SITES_STATUS_COLORS = {
    "0": "f6a600",
    "-1": "fe1514",
    "1": "45cc4e"
}

export const  SCORES_STATUS_TEXTS = {
    "0": "A l'heure",
    "-1": "En retard",
    "1": "En avence"
}

export const URLS = {
    "accueil" : "/",
    "importation": "/importation",
    "lot" : "/liste/lot",
    "parametre": "/parametre",
    "rapport" : "/rapport",
    "teams": "/equipes",
    "zones": "/zones",
    "controllers" : "/controleurs",
    "agencies-head": "/chefs-agence",
    "teams-head": "/chefs-equipe",
    "users": "/utilisateurs",
    "admins": "/admins",
    "categories": "/categories",
    "Reporting": "/Reporting",
}

//export const API_BASE_URL = 'http://localhost:8081/api';
export const API_BASE_URL = 'http://192.168.1.100:8080/v1';
// export const API_BASE_URL = 'http://app.diginfactory.com:8081/api';
export const ACCESS_TOKEN = 'accessToken';

export const CURRENT_USER = 'currentUser';


export const GET_CLIENT_FILES_CTR = API_BASE_URL + "/files/get/clients/";
export const GET_USERS_FILES_CTR = API_BASE_URL + "/files/get/users/";


export const POLL_LIST_SIZE = 200;
export const MAX_CHOICES = 6;
export const POLL_QUESTION_MAX_LENGTH = 140;
export const POLL_CHOICE_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;

export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;

export const PASSWORD_MAX_LENGTH = 20;

export const GOOGLE_API_KEY = "AIzaSyAFYHmNIwY1kAwnOiUvCnYQUYzLfLtVga0";

export const USERS_ROLE = {
    ROLE_ADMIN : "ROLE_ADMIN",
    ROLE_CA : "ROLE_CA",
    ROLE_CE : "ROLE_CE",
    ROLE_ACJ : "ROLE_ACJ",
    ROLE_CONTROLLER : "ROLE_CONTROLLER"         
}

export const TYPE_OPERATION = {
    "0" : {Lib : "Client(s) enrolé(s)", Id: 0},
    "1" : {Lib : "Client(s) validé(s)", Id: 1}, 
    "2" : {Lib : "All Client(s)", Id: 2}    
}

export const CLIENT_TYPE = {
    "1" : {Lib : "PME", Id: 1},
    "2" : {Lib : "TPE", Id:2}
}


export const STATUS_CODE_REST_API = {
    1 : {code : 10 , message : ""},
    2 : {code : 20 , message : ""},
    3 : {code : 22 , message : ""}
 }
 
 export const STATUS = {
     0 : {value : 0 , message : ""},
     1 : {value : 1 , message : ""}
  }
