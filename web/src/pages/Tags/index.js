import React, {Component} from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import styles from './styles';
import { Card, Table, Switch, Avatar, Button, Divider, Tag, Input } from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { Option, Select } from 'antd';
import Form from 'antd/lib/form/Form';
import {API_BASE_URL} from '../../constant'

const useStyles = makeStyles(styles)

class Reporting extends Component{
  state = {
    imprimes: [],
    annules: [],
    nonImprimes: [],
    listAssureurs: [],
    AssureursLoad: false,
    listAssures: [],
    isLoad: false,
    input: null,
    currentValue: {},
  };

  componentDidMount() {
    this.getAllAssures();
    this.getAllAssureurs();
    this.getAttestation();
    
}

  getAllAssureurs = () => {
    axios.get(API_BASE_URL  + '/assureurs')
      .then(res=>{
          //console.log("response get Assureurs ", res);
          
          //console.log('le state ',this.state);
          this.setState({listAssureurs: res.data, AssureursLoad: true});
      });
  }

  
getAllAssures = () => {
    axios.get(API_BASE_URL  + '/assures')
        .then(res=>{
            //console.log("response get Assures ", res);
            this.setState(({listAssures: res.data, isLoad: true}));
        });
  }  
  
  getAttestation = () => {
    axios.get(API_BASE_URL  + '/attestations')
        .then(res=>{
            //console.log("response get attestation ", res.data);
            this.setState(({listAttestation: res.data, attestationLoad: false}));
            let attestationsImprimes = res.data.filter(function(attestation){
                return attestation.statusJaune === 1 || attestation.statusCedeao === 1;
            })

            let attestationsNonImprimes = res.data.filter(function(attestation){
              return attestation.statusCedeao === 0 || attestation.statusJaune ===0 ;
            })

            let attestationsAnnules = res.data.filter(function(attestation){
              return attestation.statusCedeao === 2 || attestation.statusJaune === 2;
            })

            this.setState({
              imprimes: attestationsImprimes, 
              nonImprimes: attestationsNonImprimes,
              annules: attestationsAnnules,
            })
            // console.log('attestations imprimes ', attestationsImprimes);
            // console.log('attestations non imprimes ', attestationsNonImprimes);
            // console.log('attestations annules ', attestationsAnnules)
        });
        
  }  

  handleChange = (e)  => {
    let {name, value} = e.target //
    this.setState(state => {
        const newState = { ...state, currentValue: {...state.currentValue, [name]:value}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
        return newState // Recuperation de la new valeur
    })
}

  onFinish = () => {
   let element = document.getElementById('select').value;
    //console.log('element saisi :', element);
    this.setState({input: element})
    };

afficheTableau = () => {
    if(this.state.input==="1"){
        return this.state.imprimes
    }
    else if(this.state.input==="0"){
        return this.state.nonImprimes
    }
    else 
        return this.state.annules 
} 

    render(){   
      const data = {
        columns: [
            {
                label: 'Numero jaune',
                field: 'numeroJaune',
                sort: 'asc',
                width: 110
            },
            {
                label: 'Numero cedeao',
                field: 'numeroCedeao',
                sort: 'asc',
                width: 115
            },

            {
                label: 'Assuré',
                field: 'assure',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Marque',
                field: 'marque',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Immatriculation',
                field: 'immatriculation',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Usage',
                field: 'usage',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Genre',
                field: 'genre',
                sort: 'asc',
                width: 150
            },
        ],
        rows : this.afficheTableau()

    }; 

    const { Option } = Select;
        return(
            <div className="container-fluid pl-4 m-0 text-left" style={{backgroundColor:"white"}}>
                <br/>
                <div className="text-right">
                    <select name="selectData" id="select" onChange={this.onFinish} style={{
                        borderRadius: "4px", borderColor: "rgba(220, 220, 220, 0.7)", height: '30px',
                        fontSize: "13px", marginLeft: "10px", appearance: "none",
                        }}>
                        {/* <option value="default">Toutes les attestations</option> */}
                        <option value="1">Attestations imprimees</option>
                        <option value="0">Attestations non imprimees</option>
                        <option value="2">Attestations annulees</option>
                    </select>
                </div>
                <hr/>
                <div>
                    <MDBDataTable
                        striped
                        bordered
                        small
                        data={data}
                        size="small"
                        scroll={{ x: 1300 }}
                        scrollX
                    />
                </div>
            </div>
        )
    }
}

export default Reporting;