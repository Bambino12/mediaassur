import React, { useState, useEffect }  from 'react';

import {connect} from "react-redux";

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid'
import PeopleIcon from '@material-ui/icons/People'
import ScoreIcon from '@material-ui/icons/Score'
import ReportIcon from '@material-ui/icons/Report'

import Routes from 'Routes';
import {Topbar, Footer, Dashbord} from 'components/layout'
import {logo} from 'assets/img/public'
import { Widget } from 'components/common';
import { CreditCardOutlined, FolderOpenOutlined, FundViewOutlined, PrinterOutlined } from '@ant-design/icons';
import { handleService } from 'helpers';
import { getLots } from 'services/lot';
import axios from 'axios';
import {API_BASE_URL} from 'constant'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'rgb(241, 241, 241)'
  },
  content: {
    marginTop: theme.spacing(16),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2)
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: 'center'
  },
  logo: {
    width: 169,
    [theme.breakpoints.up('sm')]: {
      width: "100%"
    }
  },
  breadcrumb: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: 30
    }
  },
  button: {
    height: 25,
     background: "rgb(241, 76, 76)"
  },
  item: {
    height: '100%'
  },
  icon: {
    color: theme.palette.common.white,
    fontSize: '2rem',
    height: '2rem',
    width: '2rem'
  },
}));

function App(props) {
  const classes = useStyles();

  const[state, setState] = useState({
    listLot: [],
    listAttestation: [],
    lotImprime: null,
    attestationImprime: null,
  })

  useEffect(() => {
    handleService(getLots, null, 
        (response) => {
            //console.log("Response get Lot ", response.content.attestations.length);
            let list = response.content;
            // for (var i =0;i <list.length; i++) {
            //     list[i]["key"]=i; // add property key = 1
            //     list[i]["nbAttestation"]=list[i]["attestations"].length;
            // }
            let lot = null;
            for(let i=0; i<response.content.length; i++){
              if(response.content[i].statusCedeao == 1 || response.content[i].statusJaune == 1){
                  lot += 1;
              }
            }
            // console.log('nombre d attestations imprime ', lot);
            // console.log("Response get Lot ", list)
            setState(state => ({
                ...state,
                listLot: response ? response.content : [],
                isLoading: false,
                lotImprime: lot,
            }))
        },
        () => {setState(state => ({...state, isLoading: false,}))}
    );
    

    getAttestation();

}, [])

  
  function getAttestation(){
    axios.get(API_BASE_URL  + '/attestations')
        .then(res=>{
            //console.log("response get attestation ", res.data);
            let attest = null;
            for(let i=0; i<res.data.length; i++){
              if(res.data[i].statusCedeao == 1 || res.data[i].statusJaune == 1){
                  attest += 1;
              }
            }
            //console.log('nombre d attestations imprime ', attest);
            setState(state=>({...state, listAttestation: res.data, attestationLoad: false, attestationImprime: attest}));
        });
  }  

  const { isAuthenticated } = props

  const children2 = (
    <Grid
        container
        spacing={2}
      >
      <Grid
        item
        md={3}
        sm={6}
        xs={12}
      >
        <Widget 
          className={classes.item} 
          label="Attestations"
          total={state.listAttestation.length}
          icon={<CreditCardOutlined className={classes.icon}/>}
        />
      </Grid>

      <Grid
        item
        md={3}
        sm={6}
        xs={12}
      >
        <Widget 
          className={classes.item} 
          label="Lots d'attestation"
          total={state.listLot.length}
          icon={<FolderOpenOutlined className={classes.icon}/>}
        />
      </Grid>

      <Grid
        item
        md={3}
        sm={6}
        xs={12}
      >
        <Widget 
          className={classes.item} 
          label="Attestation imprimees"
          total={state.attestationImprime}
          icon={<PrinterOutlined className={classes.icon}/>}
        />
      </Grid>

      <Grid
        item
        md={3}
        sm={6}
        xs={12}
      >
        <Widget 
          className={classes.item} 
          label="Lots imprimés"
          total={state.lotImprime}
          icon={<ReportIcon className={classes.icon}/>}
        />
      </Grid>
    </Grid>
  )

  if(!isAuthenticated) return <Routes/>

  return (
    <div className={classes.root}>
      <Topbar/>
      <div maxWidth="lg" className={classes.content}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={2} className={classes.logoContainer}>
                <img
                  alt=''
                  className={classes.logo}
                  height={87}
                  src={logo}
                />
              </Grid>
              
              <Grid item xs={12} md={10}>
                {children2}
              </Grid> 
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={2}>
                <Dashbord/>
              </Grid>
              
              <Grid item xs={12} md={10}>
                <Routes />
              </Grid> 
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Footer/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

export default connect(mapStateToProps)(App);
