import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import store from 'redux/store';
import { ThemeProvider } from '@material-ui/styles';

import theme from 'assets/theme';

import * as serviceWorker from 'serviceWorker';

import './assets/scss/index.scss';
import './assets/css/buttons.dataTables.min.css';
//import './assets/css/jquery.dataTables.min.css';
import './assets/css/select.dataTables.min.css';
//import './assets/data/jquery/jquery-3.5.1.js';
// import './assets/data/jquery/jquery.dataTables.min.js';
// import './assets/data/jquery/dataTables.buttons.min.js';
// import './assets/data/jquery/buttons.flash.min.js';
// import './assets/data/jquery/jszip.min.js';
// import './assets/data/jquery/pdfmake.min.js';
// import './assets/data/jquery/vfs_fonts.js';
// import './assets/data/jquery/buttons.html5.min.js';
// import './assets/data/jquery/buttons.print.min.js';
// import './assets/data/jquery/dataTables.select.min.js';

import App from 'App';

const browserHistory = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();