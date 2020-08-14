import React, {Component} from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import styles from './styles';
import { Card, Table, Switch, Avatar, Button, Divider, Tag, Input } from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { Option, Select } from 'antd';
import Form from 'antd/lib/form/Form';

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
    axios.get('http://localhost:8080/v1/assureurs')
      .then(res=>{
          //console.log("response get Assureurs ", res);
          
          //console.log('le state ',this.state);
          this.setState({listAssureurs: res.data, AssureursLoad: true});
      });
  }

  
getAllAssures = () => {
    axios.get('http://localhost:8080/v1/assures')
        .then(res=>{
            //console.log("response get Assures ", res);
            this.setState(({listAssures: res.data, isLoad: true}));
        });
  }  
  
  getAttestation = () => {
    axios.get('http://localhost:8080/v1/attestations')
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
        // rows: [
        //     {
        //         numassur: 'AUX123412',
        //         assurance: 'Sunu Assurances',
        //         periode: '13/05/20-13/05/21',
        //         debutcode: '612312',
        //         fincode: '612415',
        //     },
        //     {
        //         numassur: 'AUX346576',
        //         assurance: 'AXA Assurances',
        //         periode: '23/03/20-23/03/21',
        //         debutcode: '232312',
        //         fincode: '232415',
        //     },
        //     {
        //         numassur: 'AUX097865',
        //         assurance: 'Olivier Assurances',
        //         periode: '04/01/20-04/01/21',
        //         debutcode: '172312',
        //         fincode: '172415',
        //     },
        //     {
        //         numassur: 'AUX127865',
        //         assurance: 'Saham Assurances',
        //         periode: '17/01/20-17/01/21',
        //         debutcode: '272312',
        //         fincode: '272415',
        //     },
        //     {
        //         numassur: 'AUX065865',
        //         assurance: 'Alliance',
        //         periode: '15/01/20-15/01/21',
        //         debutcode: '245312',
        //         fincode: '245415',
        //     },
        //     {
        //         numassur: 'AUX097865',
        //         assurance: 'Olivier Assurances',
        //         periode: '04/01/20-04/01/21',
        //         debutcode: '172312',
        //         fincode: '172415',
        //     },
        //     {
        //         numassur: 'AUX003865',
        //         assurance: 'ASCOMA',
        //         periode: '29/04/20-29/04/21',
        //         debutcode: '172312',
        //         fincode: '172415',
        //     },
        //     {
        //         numassur: 'AUX546765',
        //         assurance: 'Loyale Assurance',
        //         periode: '21/04/20-21/04/21',
        //         debutcode: '872312',
        //         fincode: '872415',
        //     },
        //     {
        //         numassur: 'AUX098865',
        //         assurance: 'BNI',
        //         periode: '12/02/20-12/02/21',
        //         debutcode: '762312',
        //         fincode: '762415',
        //     },
        //     {
        //         numassur: 'AUX003879',
        //         assurance: 'SOMAVIE',
        //         periode: '01/05/20-01/05/21',
        //         debutcode: '765312',
        //         fincode: '765415',
        //     },
        //     {
        //         numassur: 'AUX098765',
        //         assurance: 'SIDAM',
        //         periode: '11/04/20-11/04/21',
        //         debutcode: '982312',
        //         fincode: '892415',
        //     },

        // ]
    }; 

    const { Option } = Select;
        return(
            <div className="container-fluid pl-4 m-0 text-left" style={{backgroundColor:"white"}}>
                <br/>
                {/* <Form name="control-hooks">
                    <Input.Group compact>
                        <Select defaultValue="Toutes les attestations" name="select"  id="selected" onChange={this.onFinish}>
                            <Option value="imprimes">attestations imprimees</Option>
                            <Option value="nonImprimes">attestations non imprimees</Option>
                        </Select>
                    </Input.Group>
                </Form> */}
                <select name="selectData" id="select" onChange={this.onFinish} style={{
                    borderRadius: "4px", borderColor: "rgba(220, 220, 220, 0.7)", height: '30px',
                    fontSize: "13px", marginLeft: "10px", appearance: "none",
                    }}>
                    {/* <option value="default">Toutes les attestations</option> */}
                    <option value="1">Attestations imprimees</option>
                    <option value="0">Attestations non imprimees</option>
                    <option value="2">Attestations annulees</option>
                </select>
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