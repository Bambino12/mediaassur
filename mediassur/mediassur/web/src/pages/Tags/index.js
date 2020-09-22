import React, { Component } from 'react';

import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-select/js/dataTables.select';
import 'jquery-datatables-checkboxes/js/dataTables.checkboxes';
import makeStyles from '@material-ui/styles/makeStyles';
import styles from './styles';
import { Card, Table, Switch, Avatar, Button, Divider, Tag, Input } from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'jquery-datatables-checkboxes/js/dataTables.checkboxes';
import { MDBDataTable } from 'mdbreact';
import { Option, Select } from 'antd';
import { API_BASE_URL } from '../../constant';
const useStyles = makeStyles(styles);
const $ = require('jquery');
$.DataTable = require('datatables.net');

class Reporting extends Component {
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
        attestationsToutes :[],
    };

    componentDidMount() {
        this.getAllAssures();
        this.getAllAssureurs();
        this.getAttestation();
    }

    datatableRows(){
        $('#example').DataTable({
            destroy:true,
            data: this.afficheTableau(),
            columns: [
                { data: "id" },
                { data: "numeroJaune" },
                { data: "numeroCedeao" },
                { data: "assure" },
                { data: "marque" },
                { data: "immatriculation" },
                { data: "usage" },
                { data: "genre" }



            ],

            "oLanguage": {
                "sLengthMenu": "_MENU_ Enregistrements",
                "sSearch": "<span className='add-on'><i className='fa fa-search'></i></span>Recherche",
                "sZeroRecords": "Aucun résultat",
                "sInfo": "Affichage de _START_ à _END_ sur _TOTAL_  enregistrements",
                "sInfoEmpty": "Affichage de 0 à 0 sur 0 Enregistrements",
                "oPaginate": {
                    "sNext": 'Suivant',
                    "sPrevious": 'Précèdent',
                },
                "select": {
                    "rows": {
                        "_": " %d ligne sélectionnée(s)",
                        "1": "1 ligne sélectionnée"
                    }
                }
            },
            "aLengthMenu": [
                [10, 50, 100, -1],
                [10, 50, 100, " Tous"]
            ],

            dom: 'Bfrtip',

            /* "pagingType": "scrolling", */
          
                buttons: [
                    {
                        style: {
                            float: "right"
                         },
                        extend: 'excelHtml5',
                        className: 'btn btn-success',
                        text: 'Exporter sous Excel'

                    }
                ],
           
            'select': {
                'style': 'multi'
            },
            columnDefs: [{
                'className': 'select-checkbox',
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
            }]
        });

    /* FIN */
    }

    getAllAssureurs = () => {
        axios.get(API_BASE_URL + '/assureurs')
            .then(res => {
                this.setState({ listAssureurs: res.data, AssureursLoad: true });
            });
    }


    getAllAssures = () => {
        axios.get(API_BASE_URL + '/assures')
            .then(res => {
                this.setState(({ listAssures: res.data, isLoad: true }));
            });
    }

    getAttestation = () => {
        axios.get(API_BASE_URL + '/attestations')
            .then(res => {
                this.setState(({ listAttestation: res.data, attestationLoad: false }));
                
                let attestationsImprimes = res.data.filter(function (attestation) {
                    return attestation.statusJaune === 1 || attestation.statusCedeao === 1;
                })

                let attestationsNonImprimes = res.data.filter(function (attestation) {
                    return attestation.statusCedeao === 0 || attestation.statusJaune === 0;
                })

                let attestationsAnnules = res.data.filter(function (attestation) {
                    return attestation.statusCedeao === 2 || attestation.statusJaune === 2;
                })

                this.setState({
                    
                    imprimes: attestationsImprimes,
                    nonImprimes: attestationsNonImprimes,
                    annules: attestationsAnnules,
                })
            });

    }

    handleChange = (e) => {
        let { name, value } = e.target //
        this.setState(state => {
            const newState = { ...state, currentValue: { ...state.currentValue, [name]: value } } // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
            return newState // Recuperation de la new valeur
        })
    }

    onFinish = () => {
        let element = document.getElementById('select').value;
        this.setState({ input: element })
    };

    afficheTableau = () => {

        if (this.state.input === "1") {
            return this.state.imprimes
        }
        else if (this.state.input === "0") {
            return this.state.nonImprimes
        }
        else if(this.state.input === "2"){
            return this.state.annules
        }else{
            return this.state.listAttestation
        }
            
            
    }


    render() {


        this.datatableRows()
        const { Option } = Select;

        return (
            <div className="container-fluid pl-4 m-0 text-left" style={{backgroundColor: "white" }}>
                <br />
                <div className="text-right">
                </div>
                <hr />
                <div>

                </div>
                
                <div>  
                    <select name="selectData" id="select" onChange={this.onFinish} style={{
                        borderRadius: "4px", borderColor: "rgba(220, 220, 220, 0.7)", height: '30px',
                        fontSize: "13px",float:"right", appearance: "none",
                    }}>
                        <option value="default">Affichage des attestations</option> 
                        <option value="1">Attestations imprimees</option>
                        <option value="0">Attestations non imprimees</option>
                        <option value="2">Attestations annulees</option>
                    </select>
               
                    <table className="display table table-hover" id="example">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Numero Jaune</th>
                                <th>Numero cedeao</th>
                                <th>Assuré</th>
                                <th>Marque</th>
                                <th>Immatriculation</th>
                                <th>Usage</th>
                                <th>Genre</th>
                            </tr>
                        </thead>
                    </table>
                </div>


            </div>
        )
    }
   
}

export default Reporting;