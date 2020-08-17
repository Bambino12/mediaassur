import React, {Component} from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import styles from './styles';
import { Card, Table, Switch, Avatar, Button, Divider, Tag, Input } from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { Option, Select } from 'antd';
import {API_BASE_URL} from '../../constant'
import Form from 'antd/lib/form/Form';

const useStyles = makeStyles(styles)

class Accueil extends Component{
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
    // this.getAttestation();    
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
  
//   getAttestation = () => {
//     axios.get(API_BASE_URL  + '/attestations')
//         .then(res=>{
//             //console.log("response get attestation ", res.data);
//             this.setState(({listAttestation: res.data, attestationLoad: false}));
//             let attestationsImprimes = res.data.filter(function(attestation){
//                 return attestation.statusJaune === 1 || attestation.statusCedeao === 1;
//             })

//             let attestationsNonImprimes = res.data.filter(function(attestation){
//               return attestation.statusCedeao === 0 || attestation.statusJaune ===0 ;
//             })

//             let attestationsAnnules = res.data.filter(function(attestation){
//               return attestation.statusCedeao === 2 || attestation.statusJaune === 2;
//             })

//             this.setState({
//               imprimes: attestationsImprimes, 
//               nonImprimes: attestationsNonImprimes,
//               annules: attestationsAnnules,
//             })
//             // console.log('attestations imprimes ', attestationsImprimes);
//             // console.log('attestations non imprimes ', attestationsNonImprimes);
//             // console.log('attestations annules ', attestationsAnnules)
//         });
        
//   }  

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
     
} 

    render(){   
      const data = {
        columns: [
            {
                label: 'N° de police',
                field: 'numeroPolice',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Assureur',
                field: 'assureur',
                sort: 'asc',
                width: 200,
                render: (item) => item.assureur || ""
            },

            {
                label: 'Assuré',
                field: 'assure',
                sort: 'asc',
                width: 150,
                render: (item) => item.assure || ""
            },
            {
                label: 'Date de debut',
                field: 'startDate',
                sort: 'asc',
                width: 300,
                render: (item) => item.startDate || ""
            },
            {
                label: 'Date de fin',
                field: 'endDate',
                sort: 'asc',
                width: 300,
                render: (item) => item.endDate || ""
            },
            {
                label: 'Nb attestation',
                field: 'nbAttestation',
                width: 150,
                sort: 'asc',
                render: (item) => item.nbAttestation || ""
            },
            {
                label: 'Statut',
                field: 'statut',
                sort: 'asc',
                width: 200,
                render: (item) => item.statut || ""
            },
            {
                label: 'Action',
                field: 'action',
                sort: 'asc',
                width: 100,
                render: (item) => (
                    <div>
                        <td>{item.statusCedeao == 0 ? <Tag color="blue">Cedeao non generée</Tag> : item.statusCedeao == 1 ? <Tag color="green">Cedeao generée</Tag> : <Tag color="red">Cedeao Annulée</Tag>}</td> 
                        <td>{item.statusJaune == 0 ? <Tag color="blue">Jaune non generée</Tag> : item.statusJaune == 1 ? <Tag color="green">Jaune generée</Tag> : <Tag color="red">Jaune Annulée</Tag>}</td>  
                    </div>
                )
            },
        ],
        rows : this.afficheTableau()

    }; 

    const { Option } = Select;
        return(
            <div className="container-fluid pl-4 m-0 text-left" style={{backgroundColor:"white"}}>
                <br/>
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

export default Accueil;