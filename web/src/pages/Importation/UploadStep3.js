import React, { Component } from 'react';
import {Input, message, Card, Button, Modal, Table, Drawer, Form, Col, Row, Select, DatePicker} from "antd";
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';
import {Link} from "react-router-dom";
import {EyeOutlined, PrinterOutlined} from "@ant-design/icons";
import { API_ROUTE } from 'api/routes';

const { Option } = Select;

class UploadStep3 extends Component {
    constructor(props) {
        super(props);
        let parentFile={}
        try {
            parentFile=this.props.parent.state.fileAttestation
            //console.log("parentFile===============================",parentFile)
        }catch (e) {
            console.log(e)
        }
        this.state = {
            fileAttestation:parentFile,
            visible: false,
            open: false,
            listAssures: [],
            listAssureurs: [],
        };
    }

    componentDidMount() {
        axios.get(API_ROUTE+'/assures',{
            headers: { Authorization: "Bearer " + localStorage.getItem('token')}
        })
            .then(res=>{
                this.setState({
                    listAssures:res.data
                });


            })
            .catch(error=>{
                console.log(error)
            })

        axios.get(API_ROUTE+'/assureurs',{
            headers: { Authorization: "Bearer " + localStorage.getItem('token')}
        })
            .then(res=>{
                this.setState({
                    listAssureurs:res.data
                });


            })
            .catch(error=>{
                console.log(error)
            })
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };


    handleLot = (e) => {
        this.setState({
            listassur: e.target.value
        })

    };

    changeAssure = (e) => {
        console.log(this.state.listAssures)
        try {
            let currentFileAttestation = this.props.parent.state.fileAttestation
            currentFileAttestation.assureId=e.target.value
            currentFileAttestation.assureName=this.state.listAssures.filter(x=>x.id==e.target.value)[0].name
            this.props.parent.updateFileAttestation(currentFileAttestation)
        }catch (e) {
            console.log(e)
        }

    };

    changeAssureur = (e) => {
        try {
            let currentFileAttestation = this.props.parent.state.fileAttestation
            currentFileAttestation.assureurId=e.target.value
            currentFileAttestation.assureurName=this.state.listAssureurs.filter(x=>x.id==e.target.value)[0].name
            this.props.parent.updateFileAttestation(currentFileAttestation)
        }catch (e) {
            console.log(e)
        }

    };

    showDrawer = () => {
        this.setState({
            open: true,
        });
    };

    onClose = () => {
        this.setState({
            open: false,
        });
    };

    validate = ()=>{
        document.getElementById("msgForm").innerText="" ;
        let assureurId =null,
            assureId =null,
            startDate =null,
            endDate =null,
            numeroPolice =null;
        try {
            assureurId = document.getElementById("assureurId").value ;
            assureId = document.getElementById("assureId").value ;
            startDate = document.getElementById("startDate").value ;
            endDate = document.getElementById("endDate").value ;
            numeroPolice = document.getElementById("numeroPolice").value;
        }catch (e) {
            console.log(e)
        }

        if ((assureurId!=="" && assureurId!==null) && (assureId!=="" && assureId!==null) &&
            (startDate!=="" && startDate!==null) && (endDate!=="" && endDate!==null) &&
            (numeroPolice!=="" && numeroPolice!==null )){

            let currentFileAttestation = this.props.parent.state.fileAttestation

            currentFileAttestation.assureurId=assureurId
            currentFileAttestation.assureId=assureId
            currentFileAttestation.startDate=startDate
            currentFileAttestation.endDate=endDate
            currentFileAttestation.numeroPolice=numeroPolice

            this.props.parent.updateFileAttestation(currentFileAttestation)
            this.props.parent.next()
            /*
            alert(assureurId+"-"+
                assureId+"-"+
                startDate+"-"+
                endDate+"-"+
                numeroPolice)
            */
        }else {
            document.getElementById("msgForm").innerText="Veuillez renseigner tous les champs" ;
        }

    }

    render(){
        let {listAssureurs,listAssures} = this.state
        let currentFileAttestation = this.props.parent.state.fileAttestation

        const data = {
            columns: [
                {
                    label: 'Assurance N°',
                    field: 'numassur',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Assurance',
                    field: 'assurance',
                    sort: 'asc',
                    width: 200
                },

                {
                    label: 'Période',
                    field: 'periode',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Numéroté de',
                    field: 'debutcode',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'A',
                    field: 'fincode',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Details',
                    key: 'detail',
                    fixed: 'right',
                    width: 100,

                },
            ],
            rows: [
                {
                    numassur: 'AUX123412',
                    assurance: 'Sunu Assurances',
                    periode: '13/05/20-13/05/21',
                    debutcode: '612312',
                    fincode: '612415',
                },
                {
                    numassur: 'AUX346576',
                    assurance: 'AXA Assurances',
                    periode: '23/03/20-23/03/21',
                    debutcode: '232312',
                    fincode: '232415',
                },
                {
                    numassur: 'AUX097865',
                    assurance: 'Olivier Assurances',
                    periode: '04/01/20-04/01/21',
                    debutcode: '172312',
                    fincode: '172415',
                },
                {
                    numassur: 'AUX127865',
                    assurance: 'Saham Assurances',
                    periode: '17/01/20-17/01/21',
                    debutcode: '272312',
                    fincode: '272415',
                },
                {
                    numassur: 'AUX065865',
                    assurance: 'Alliance',
                    periode: '15/01/20-15/01/21',
                    debutcode: '245312',
                    fincode: '245415',
                },
                {
                    numassur: 'AUX097865',
                    assurance: 'Olivier Assurances',
                    periode: '04/01/20-04/01/21',
                    debutcode: '172312',
                    fincode: '172415',
                },
                {
                    numassur: 'AUX003865',
                    assurance: 'ASCOMA',
                    periode: '29/04/20-29/04/21',
                    debutcode: '172312',
                    fincode: '172415',
                },
                {
                    numassur: 'AUX546765',
                    assurance: 'Loyale Assurance',
                    periode: '21/04/20-21/04/21',
                    debutcode: '872312',
                    fincode: '872415',
                },
                {
                    numassur: 'AUX098865',
                    assurance: 'BNI',
                    periode: '12/02/20-12/02/21',
                    debutcode: '762312',
                    fincode: '762415',
                },
                {
                    numassur: 'AUX003879',
                    assurance: 'SOMAVIE',
                    periode: '01/05/20-01/05/21',
                    debutcode: '765312',
                    fincode: '765415',
                },
                {
                    numassur: 'AUX098765',
                    assurance: 'SIDAM',
                    periode: '11/04/20-11/04/21',
                    debutcode: '982312',
                    fincode: '892415',
                },

            ]
        };

        return (
            <div>
                <div className="container-fluid p-0 m-0">
                    <div className="row p-0 mt-2">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <Card>

                                <hr/>
                                <form className="pt-1 pb-3">
                                    <button type="button" className="float-right btn btn-primary mr-3" onClick={this.showDrawer}>
                                        Choisir un ancien lot
                                    </button>
                                </form>
                                <form id="formInfoAttestations" className="cadre pt-1 pb-3">
                                    <div className="form-row" style={{width:"100%"}}>
                                        <div className="col form-group">
                                            <label htmlFor="assureurId"><strong>Choisissez une assurance : </strong></label>
                                            <select id="assureurId" name="assureId" className="flex-left form-control form-control-sm" required
                                                value={currentFileAttestation.assureurId}
                                                onChange={this.changeAssureur }
                                            >
                                                <option value="">Veuillez choisir une assurance</option>
                                                    {
                                                        listAssureurs.map((assureur, index) => {
                                                            return <option key={index} value={assureur.id}>{assureur.name}</option>
                                                        })
                                                    }
                                            </select>
                                        </div>
                                        <div className="col form-group">
                                            <label htmlFor="assureId"><strong>Assuré : </strong></label>
                                            <select id="assureId" name="assureurId" className="flex-left form-control form-control-sm" required>
                                                <option value="">Veuillez choisir un assuré :</option>
                                                    {
                                                        listAssures.map((assure, index) => {
                                                            return <option key={index} value={assure.id}>{assure.name}</option>
                                                        })
                                                    }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col form-group">
                                            <label htmlFor="startDate"><strong>Période du : </strong></label>
                                            <input defaultValue={currentFileAttestation.startDate} id="startDate" name="startDate" type="date" className="flex-left form-control form-control-sm" required />
                                        </div>
                                        <div className="col form-group">
                                            <label htmlFor="endDate"><strong>Au :</strong></label>
                                            <input defaultValue={currentFileAttestation.endDate} id="endDate" name="endDate" type="date" className="flex-left form-control form-control-sm" required />
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="usr"><strong>Numéro de police :</strong></label>
                                        <input type="numero" defaultValue={currentFileAttestation.numeroPolice} id="numeroPolice" name="numeroPolice"  placeholder="Entrez un numéro de police" className="flex-left form-control" required/>
                                    </div>
                                    <p className="text-danger" id="msgForm"> </p>
                                </form>
                            </Card>
                            <br/>
                            <div>
                                <Modal
                                    title="Tableau des lots"
                                    visible={this.state.visible}
                                    onOk={this.hideModal}
                                    onCancel={this.hideModal}
                                    okText="Poursuivre"
                                    cancelText="Annuler"
                                >

                                </Modal>

                                <>
                                <Drawer
                                    title="Recherchez un lot existant"
                                    width={720}
                                    onClose={this.onClose}
                                    visible={this.state.open}
                                    bodyStyle={{ paddingBottom: 80 }}
                                    footer={
                                        <div
                                            style={{
                                                textAlign: 'right',
                                            }}
                                        >
                                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                                Annuler
                                            </Button>
                                            <Button onClick={ () =>{
                                                this.onClose();
                                                window.location.href="generation";
                                            }} type="primary">
                                                Valider
                                            </Button>
                                        </div>
                                    }
                                >
                                    <Form layout="vertical" hideRequiredMark>
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
                                    </Form>
                                </Drawer>
                            </>

                            </div>

                        </div>

                        <div className="col-2">

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
export default UploadStep3;
