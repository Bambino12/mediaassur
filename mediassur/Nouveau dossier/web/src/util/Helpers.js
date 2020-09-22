import {notification} from 'antd';

export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return monthNames[monthIndex] + ' ' + year;
}


export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug", 
    "Sep", "Oct", "Nov", "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}

export function validURL(str) {
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/; 
  if(!pattern.test(str)) {
    //alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}

export function changePage(e, that){
  e.preventDefault();   
  console.log(e);
  var target = null;
  if(e.currentTarget){
    target = e.currentTarget;
  }else{
    target = e.target;
  }
 
  if(target.getAttribute("data-url")){
    let urlGo =  target.getAttribute("data-url"); 
    console.log(urlGo)
    console.log(that.props);
    that.props.history.push(urlGo);

  }else{

    notification.error({
        message: 'Mediassur App',
        description: 'Fonctionnalité non disponible'
    }); 

  }
}

export function RegroupItem (data, field) {
  var fieldValue = null;
  const groups = data.reduce((groups, item) => {
      fieldValue = item[field];
  if (!groups[fieldValue]) {
      groups[fieldValue] = [];
  }
  groups[fieldValue].push(item);
  return groups;
}, {});

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((fieldValue) => {
      return {
          fieldValue,
          items : groups[fieldValue]
      };
});

  return groupArrays;
}

export function sMillier(nbre){
  if(!nbre){
  return 0;
  }
  return new Intl.NumberFormat("fr-FR").format(nbre);
}

export function userAuthorizationChecker(role){
  let user = getUserInfo();
  let userRole = user && user.role;
  //Helpers.HLocalStorage(Constantes.WSO2_CONFIG.WSO2_RESPONSE, "role")
  if(!userRole) return false;

  return userRole === role ? true : false;

}


export function getUserInfo(){
  return JSON.parse(localStorage.getItem("currentUser"))
}


export function getRoleName(role){
  try{
    switch(role){
      case "ROLE_CO" : 
      return "Controleur"
      break  
      default :
      return role.split("_")[1]
      break;
    }
  }catch(e){
    console.log(e);
    return ""
  }
}