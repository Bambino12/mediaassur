import { notification  } from 'antd';
// import numeral from 'numeral'

import store from 'redux/store'

export function isInCart (article) {
  const state = store.getState()
  const localCartItems = state.localCartItems || []
  let inCart = false

  for(let item of localCartItems){
    if((parseInt(item.id) === parseInt(article.id)) && (parseInt(item.price) === parseInt(article.price))){
      inCart = true
      break;
    }
  }

  return inCart
}

export function handleService (service, serviceValues, successCb, errorCb){
    service(serviceValues)
    .then( (response) => {
        response.json().then(function(response) {
            if(successCb) successCb(response)
        })
    })
    .catch(error => {
        if(error.status === 401) {
            localStorage.removeItem('state')
            window.location="/login"
            return;
        }
        else if(error.status === 403) {
            notification.error({
                message: 'Mediassur App',
                description: "Desolé ! Vous n'êtes pas autorisés a effectuer cette operation ...!!!"
            });
        }else{
            if(errorCb){
                errorCb()
            }else {
                notification.error({
                    message: 'Mediassur App',
                    description: error.message || 'Desolé ! Something went wrong. Please try again!'
                });
            }
        }
    });
}

export const getInitials = (name = '') =>
  name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map(v => v && v[0].toUpperCase())
    .join('');


// load a locale
// numeral.register('locale', 'fr', {
//     delimiters: {
//         thousands: ' ',
//         decimal: ','
//     },
//     abbreviations: {
//         thousand: 'k',
//         million: 'm',
//         billion: 'b',
//         trillion: 't'
//     },
//     ordinal : function (number) {
//         return number === 1 ? 'er' : 'ème';
//     },
//     currency: {
//         symbol: '€'
//     }
// });

// // switch between locales
// numeral.locale('fr');

// export function formatNumber(number){
//     return numeral(number).format('0,0')
// }
    
