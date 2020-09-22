import React, { Component } from 'react';
import {Button, Spin, Table} from "antd";
import axios from "axios";
import swal from "sweetalert";
import { API_ROUTE } from 'api/routes';


class UploadStepResume extends Component {
    constructor(props) {
        super(props);
        let parentFile={}
        try {
            parentFile=this.props.parent.state.fileAttestation
        }catch (e) {
        }
        this.state={
            fileAttestation:parentFile,
        };
    }

    componentDidMount() {

    }

    validate = ()=>{
        let data = this.props.parent.state.fileAttestation
        axios.post(API_ROUTE+'/lots',data ).then(response=>{
            if(response.data.statusCode===10){
                swal({
                    title: "Enregistrement effectué ",
                    text: "Lot crée avec succès",
                    icon: "success",
                    closeOnClickOutside: false,
                }).then(x =>(
                    window.location.href="/accueil"
                ))
            }else {
                swal({
                    title: "Enregistrement echoué ",
                    text: response.data.message,
                    icon: "warning",
                    closeOnClickOutside: false,
                })
            }

        })
            .catch(error => {

                swal({
                    title: "Erreur",
                    text: error.message,
                    icon: "warning",
                    closeOnClickOutside: false,
                })
            });

    }
    render(){
        const columns = [
            { title: 'Assuré', width: 120, key: '1', dataIndex:"assure"},
            { title: 'Marque', width: 120, key: '2' ,dataIndex:"marque"},
            { title: 'Immatriculation', width: 100, key: '3' ,dataIndex:"immatriculation"},
            { title: 'Usage', width: 200, key: '4' ,dataIndex:"usage"},
            { title: 'Genre', width: 120, key: '5' ,dataIndex:"genre"},
            { title: 'Année', width: 80, key: '6' ,dataIndex:"annee"},
            { title: 'CV ou CU', width: 100, key: '7' ,dataIndex:"cvCu"},
            { title: 'Energie', width: 110, key: '8' ,dataIndex:"energie"},
            { title: 'Places', width: 80, key: '9' ,dataIndex:"nbrePlace"},
            { title: 'V. neuf', width: 120, key: '10' ,dataIndex:"valeurNeuve"},
            { title: 'V. vénale', width: 120, key: '11' ,dataIndex:"valeurVenale"},
            { title: 'RC', width: 100, key: '12' ,dataIndex:"rc"},
            { title: 'Def.rec', width: 100, key: '13' ,dataIndex:"defenseRecours"},
            { title: 'Rec. anticipé', width: 120, key: '14' ,dataIndex:"recoursAnticipe"},
            { title: 'Incendie', width: 100, key: '15' ,dataIndex:"incendie"},
            { title: 'Vol. access', width: 120, key: '16' ,dataIndex:"volAccessoire"},
            { title: 'Dommage', width: 120, key: '17',dataIndex:"dommage"},
            { title: 'Assistance', width: 120, key: '18',dataIndex:"assistance"},
            { title: 'V. main armée', width: 120, key: '19',dataIndex:"volVolMainArmee"},
            { title: 'Bris de glace', width: 120, key: '20',dataIndex:"brisGlace"},
            { title: 'Total', width: 120, key: '21',dataIndex:"total"},
            { title: 'Sécurité routière', width: 120, key: '22',dataIndex:"securiteRoutiere"},
        ];
        let currentFileAttestation = this.state.fileAttestation
        return (
            <div>
                <div className="container-fluid p-0 m-0">
                    <div className="row p-0 mt-2">
                        <div className="col-12">
                            <div className="w-100 p-4 ">
                                <div className="row p-0 ">
                                    <div className="col-4">
                                        <h6 style={{float:"left"}}>
                                            Assureur : <strong>{currentFileAttestation.assureurName}</strong>
                                        </h6>
                                    </div>
                                    <div className="col-4">
                                        <h6 style={{float:"left"}}>
                                            Assuré : <strong>{currentFileAttestation.assureName}</strong>
                                        </h6>
                                    </div>
                                    <div className="col-4">
                                        <h6 style={{float:"left"}}>
                                            Numéro de police : <strong> {currentFileAttestation.numeroPolice}</strong>
                                        </h6>
                                    </div>
                                    <div className="col-4">
                                        <h6 style={{float:"left"}}>
                                            Date d'effet : <strong>{currentFileAttestation.startDate}</strong>
                                        </h6>
                                    </div>
                                    <div className="col-4">
                                        <h6 style={{float:"left"}}>
                                            Echéance : <strong>{currentFileAttestation.endDate}</strong>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 p-4">
                                <div className="w-100 " style={{overflow:"scroll"}}>
                                    {/* <Table key={"mexcel"} columns={columns} dataSource={currentFileAttestation.attestations} size="small" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>
                        <button type="button" className="float-left btn btn-light ml-3" onClick={() => this.props.parent.prev()}>
                            Precedent
                        </button>
                        <button type="button" className="float-right btn btn-primary mr-3" onClick={() => this.validate()}>
                            Suivant
                        </button>
                    </p>
                </div>

            </div>
        );
    }
}
export default UploadStepResume;
