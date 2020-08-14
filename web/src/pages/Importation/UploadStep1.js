import React, { Component } from 'react';
import {Input, message, Upload, Table, Card, Spin, Button} from "antd";
import {UploadOutlined,InboxOutlined} from "@ant-design/icons";
import axios from 'axios';
//import * as urlApi from "../urlApi";
import swal from 'sweetalert';
import { API_ROUTE } from 'api/routes';

const api_upload=API_ROUTE+'/files/uploadExcelFile';


const { Dragger } = Upload;

/*const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};*/

/*
{"0":{"createdAt":null,"updatedAt":null,"createdBy":null,"updatedBy":null,"id":null,"lotId":null,"numero":null,
"assure":"Socop ci",
"marque":"BMW",
"immatriculation":"2218 GL 01",
"usage":"Promenade et affaires",
"genre":"Voiture particulière",
"annee":92,
"cvCu":"10.0",

"energie":"ess",

"nbrePlace":5,
"valeurNeuve":25500000,
"valeurVenale":4050000,
"rc":114693,
"defenseRecours":7950,

"recoursAnticipe":15000,
"incendie":10125,
"volAccessoire":0,
"dommage":0,
"assistance":0,
"volVolMainArmee":20250,
"brisGlace":63750,
"total":231768,
"securiteRoutiere":8700,
"primeVehicule":null,
"status":null,
"profession":null}}
 */
const columns = [
    { title: 'Assuré', width: 120, key: '1', dataIndex:"assure"},
    { title: 'Marque', width: 120, key: '2' ,dataIndex:"marque"},
    { title: 'Immatriculation', width: 100, key: '3' ,dataIndex:"immatriculation"},
    { title: 'Usage', width: 200, key: '4' ,dataIndex:"usage"},
    { title: 'Genre', width: 120, key: '5' ,dataIndex:"genre"},
    // { title: 'Année', width: 80, key: '6' ,dataIndex:"annee"},
    // { title: 'CV ou CU', width: 100, key: '7' ,dataIndex:"cvCu"},
    // { title: 'Energie', width: 110, key: '8' ,dataIndex:"energie"},
    // { title: 'Places', width: 80, key: '9' ,dataIndex:"nbrePlace"},
    // { title: 'V. neuf', width: 120, key: '10' ,dataIndex:"valeurNeuve"},
    // { title: 'V. vénale', width: 120, key: '11' ,dataIndex:"valeurVenale"},
    // { title: 'RC', width: 100, key: '12' ,dataIndex:"rc"},
    // { title: 'Def.rec', width: 100, key: '13' ,dataIndex:"defenseRecours"},
    // { title: 'Rec. anticipé', width: 120, key: '14' ,dataIndex:"recoursAnticipe"},
    // { title: 'Incendie', width: 100, key: '15' ,dataIndex:"incendie"},
    // { title: 'Vol. access', width: 120, key: '16' ,dataIndex:"volAccessoire"},
    // { title: 'Dommage', width: 120, key: '17',dataIndex:"dommage"},
    // { title: 'Assistance', width: 120, key: '18',dataIndex:"assistance"},
    // { title: 'V. main armée', width: 120, key: '19',dataIndex:"volVolMainArmee"},
    // { title: 'Bris de glace', width: 120, key: '20',dataIndex:"brisGlace"},
    // { title: 'Total', width: 120, key: '21',dataIndex:"total"},
    // { title: 'Sécurité routière', width: 120, key: '22',dataIndex:"securiteRoutiere"},
];


class UploadStep1 extends Component {
    constructor(props) {
        super(props);
        let data=[]
        try {
            data=this.props.parent.state.fileAttestation.attestations
        }catch (e) {
            console.log(e)
        }
        this.state={
            loading: false,
            datasource:data,
            isLoading: false,
            uploading: false,
            error: null,
            searchedColumn: '',
            spin:true
        };
    }

    FileChangeHandler = (e) => {
        e.preventDefault();

        this.setState({
            uploading: true
        });
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        axios.post(api_upload,formData).then(response=>{
            //console.log(response.data.attestations);
            let listAttestations = response.data.attestations
            // localStorage.setItem('ListFile',response.data.attestations);
            for (var i =0;i <listAttestations.length; i++) {
                //delete listprd[i]["listprdcmd"]; //delete property listprdcmd
                listAttestations[i]["key"]=i; // add property qteprodcmd = 1
            }
            this.setState({
                datasource:listAttestations,
                uploading:false
            });
            response.data.attestations=listAttestations
            try {
                this.props.parent.updateFileAttestation(response.data)
            }catch (e) {
                console.log(e)
            }
            swal({
                title: "Chargement du fichier excel",
                text: "Chargement effectué avec succès",
                icon: "success",
                closeOnClickOutside: false,
            }).then((result) => {
                //if (result.value) {
                //document.location.reload(true);
                // }
            });
            //console.log(response);
        })
            .catch(error => {
                this.setState({
                    datasource:[],
                    uploading:false
                });
                swal({
                    title: "Erreur",
                    text: error.message,
                    icon: "warning",
                    closeOnClickOutside: false,
                })
            });
        /*ApiService.upload(formData)
            .then(res => {
                console.log(res.data);
                alert("File uploaded successfully.")
            })*/
    };

    componentDidMount() {
    }

    validate = ()=>{
        /*this.props.parent.next() */

        if (this.state.datasource.length<1){
            message.error("Aucune ligne d'attestation !");
        }else this.props.parent.next()


    }

    render(){
        let {datasource,uploading} = this.state;
        const   props = {
            name: 'file',
            action: api_upload,
            multiple: false,
            headers: {
                authorization: 'authorization-text',
            },
            /*
                onChange:this.FileChangeHandler
             */

            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);

                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },

        };

        return (
            <div>
                <form className="cadre pt-3 pb-3">
                    <div className=" p-4">
                        <input type={"file"} name={"file"} onChange={this.FileChangeHandler}
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"/>
                    </div>
                </form>
                <div className="w-100 p-4">
                    <div className="w-100 " style={{overflow:"scroll"}}>
                        {uploading?(
                            <Spin/>
                        ):(
                            <Table key={"mexcel"} columns={columns} dataSource={datasource} size="small" />
                        )}
                    </div>
                </div>
                <br/>
                <br/>
                {/* <Button type="primary" style={{float: "right", marginRight: "25px"}} onClick={() => this.validate()}>
                    Suivant
                </Button> */}
                <button type="button" className="float-right btn btn-primary mr-3" onClick={() => this.validate()}>
                    Suivant
                </button>
            </div>
        );
    }
}
export default UploadStep1;
