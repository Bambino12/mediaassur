import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import swal from "sweetalert";
import makeStyles from '@material-ui/styles/makeStyles';
import { Card, Table, Button, Divider, Modal, notification, Input, Tag , message} from 'antd';
import { PlusOutlined, EditOutlined, ExclamationCircleOutlined, PrinterOutlined, SearchOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';

import { exeRequest, exeRequestFinal } from 'util/APIUtils';
import UpdateForm from './UpdateForm'
import AddForm from './AddForm'

import styles from './styles'
import { element } from 'prop-types';
import { API_ROUTE } from 'api/routes';
import { parseJSON } from 'jquery';
import {API_BASE_URL} from '../../constant'

const useStyles = makeStyles(styles);
let pdf_viewer_url = API_BASE_URL.replace("v1", "") + "viewer/web/viewer.html?file=";



function CategoryList(props) {
    const { hasRole } = props

    const [state, setState] = useState({
        open: false,
        isLoading: false,
        isUpdateDrawerVisible: false,
        isAddDrawerVisible: false,
        currentItem: {},
        lot: [],
        input: "",
        infolot: [],
        visible: false,
        currentLot: [],
        lotCourant: {},
        printCode: "",
        cedeaoModalvisible: false,
        single: false,
        modale:false,
        attestations: parseJSON(localStorage.getItem("attestation")),
        btnLoadAjaune: false,
        btnLoadACedeao: false,
        singleBtnLoad: false,
        singleLot: [],
        singlelotId: localStorage.getItem('lotId'),
        impressionStatutCedeao: false,
        impressionStatutJaune: false,
        currentModif: {},
        listAssureurs:[],
        listAssures:[],
        marque:[],
    })

    const classes = useStyles()

    useEffect(() => {
            setState(state => ({
                ...state,
                isLoading: true
            }));
            getSingleLot();
            getMarque();
            getAssures();
            getAssureurs();
        },
        [])


    function getSingleLot() {
        axios.get(API_BASE_URL  + '/lots/' + localStorage.getItem('lotId'), {
            headers: { Authorization: "Bearer" + localStorage.getItem('token') }
        })
            .then(res => {
                setState(state => ({ ...state, infolot: res.data}));
                if (res.data.statusJaune == 1) {
                    setState(state => ({ ...state, impressionStatutJaune: true }))
                }
                if (res.data.statusCedeao == 1) {
                    setState(state => ({ ...state, impressionStatutCedeao: true }))
                }
                setState(state => ({ ...state, singleLot: res.data.attestations, isLoading: false }));
            });
    }

    function handleClose(category) {
        if (category) {
            setState(state => ({ ...state, isLoading: true }));
            exeRequest(`/categories/${category.id}`, "GET", null, function (response) {
                if (response) {
                    setState(state => {
                        let categories = [...state.categories];
                        let index = 0;

                        for (let category of categories) {
                            if (category.id == response.id) break
                            index++
                        }
                        categories[index] = { ...categories[index], ...response }

                        return {
                            ...state, categories,
                            isLoading: false,
                            isUpdateDrawerVisible: false
                        }
                    })
                } else {
                    setState(state => ({ ...state, isLoading: false, isUpdateDrawerVisible: false }))
                }
            }, this)
        } else {
            setState(state => ({ ...state, isUpdateDrawerVisible: false }))
        }
    }

    function handleAddClose(category) {
        if (category) {
            setState(state => ({ ...state, isLoading: true }));

            exeRequest("/categories", "GET", null, function (response) {
                setState(state => ({
                    ...state,
                    categories: (response ? response : []),
                    isLoading: false
                }))
            }, this)
        } else {
            setState(state => ({ ...state, isAddDrawerVisible: false }))
        }
    };


    function printAttestations(type) {
        if (state.input === "") {
            alert("Veuillez saisir un numero svp !!!");
            return false;
        }
        axios.get(API_ROUTE + "/lots/" + localStorage.getItem('lotId') + "/generate/?type=" + type + "&numero=" + state.input)
            .then(res => {
                if (res) {
                    hideModalCedeao();
                    hideModalJaune();
                    getSingleLot();
                    setState(state => ({ ...state, input: "" }))
                    swal({
                        title: "Impression des attestations",
                        text: "Impression effectuée avec succès",
                        icon: "success",
                        closeOnClickOutside: false,
                        button: "Afficher"
                    }).then((result) => {
                        window.open(pdf_viewer_url + res.data);
                        let lien = pdf_viewer_url + res.data;
                        let presence = lien.indexOf('cedeao');
                        if (presence != -1) {
                            localStorage.setItem("lienCedeao", pdf_viewer_url + res.data);
                        } else {
                            localStorage.setItem("lienJaune", pdf_viewer_url + res.data);
                        }
                        getSingleLot();
                        window.location.href="/DetailsLots"

                    });

                }
            })
    };

    function printSingleAttestations(type) {
        if (state.input === "") {
            alert("Veuillez saisir un numero svp !!!");
            return false;
        }
        let currentItem = JSON.parse(localStorage.getItem('currentAttestationSelected'));
        axios.get(API_BASE_URL + "/attestations/" + currentItem.id + "/generate/?type=" + type + "&numero=" + state.input)
            .then(res => {
                if (res) {
                    hideModalSingleAttestation();
                    setState(state => ({ ...state, input: "" }))
                    
                    swal({
                        title: "Impression des attestations",
                        text: "Impression effectuée avec succès",
                        icon: "success",
                        closeOnClickOutside: false,
                        button: "Afficher"
                    }).then((result) => {
                        window.open(pdf_viewer_url + res.data);
                        getSingleLot();
                        window.location.href="/DetailsLots"
                    });

                }
            })
    };


    function handleChange(e) {
        let isNotNull = e.target.value;
        setState(state => ({ ...state, input: isNotNull }));
        console.log('numero saisi ', state.input);
    }


    const columns = [
        { title: 'Numero police', width: "12%", key: '1', dataIndex: "numeroPolice"},
        { title: 'Numero jaune', width: "12%", key: '2', dataIndex: "numeroJaune"},
        { title: 'Numero cedeao', width: "12%", key: '3', dataIndex: "numeroCedeao"},
        { title: 'Assure', width: "12%", key: '4', dataIndex: "assure" },
        { title: 'Assureur', width: "15%", key: '5', dataIndex: "assureur"},
        { title: 'Immatriculation', width: "12%", key: '10', dataIndex: "immatriculation"},
        { title: 'Adresse', width: "22%", key: '5', dataIndex: "assureurAddress"},
        { title: 'Marque', width: "10%", key: '6', dataIndex: "marque"},
        { title: "Date d'Emission", dataIndex: 'startDate', width: '12%', key:"8", render: (item) =>(
            <div>
                {new Date(item).toLocaleDateString("fr-FR")}
            </div>
        ) },
        { title: "Date d'Echeance", dataIndex: 'endDate', key: '9',  width: '12%', render: (item) =>(
            <div>
                {new Date(item).toLocaleDateString("fr-FR")}
            </div>
        )},
        { title: 'Usage', width: "20%", key: '11', dataIndex: "usage" },
        { title: 'Genre', width: "12%", key: '12', dataIndex: "genre" },
        {
            title: 'Statut',
            key: '13',
            width: "22%",
            render: (item) =>(
                <div>
                    <td>{item.statusCedeao == 0 ? <Tag color="blue">Cedeao non generée</Tag> : item.statusCedeao == 1 ? <Tag color="green">Cedeao generée</Tag> : <Tag color="red">Cedeao Annulée</Tag>}</td> <td>{item.statusJaune == 0 ? <Tag color="blue">Jaune non generée</Tag> : item.statusJaune == 1 ? <Tag color="green">Jaune generée</Tag> : <Tag color="red">Jaune Annulée</Tag>}</td>
                </div>
            )
        },
        {
            title: 'Action', width: "7%", key: '14', dataIndex: "action", fixed: "right",
            render: (text, item) => (
                <Fragment>
                    <PrinterOutlined
                        onClick={() => {
                            localStorage.setItem("currentAttestationSelected", JSON.stringify(item));
                            setState(state => ({ ...state, single: true }));
                        }}
                        style={{margin:"5px"}}
                    />
                    <EditOutlined
                        style={{cursor:"pointer"}}
                        onClick={() => {
                            localStorage.setItem("selectForUpdate", JSON.stringify(text));
                            setState(state => ({ ...state, openModalForUpd: true, currentModif:item }));
                        }}
                    />
                </Fragment>
            )
        }
    ];

    function activebtnLoader() {
        if (state.input === "") {
            setState(state => ({ ...state, btnLoadAjaune: false }))
        }
        else {
            setState(state => ({ ...state, btnLoadAjaune: true }))
        }
    }

    function annulebtnLoader() {
        setState(state => ({ ...state, btnLoadAjaune: false }))
    }

    function activebtnLoaderCedeao() {
        if (state.input === "") {
            setState(state => ({ ...state, btnLoadACedeao: false }))
        }
        else {
            setState(state => ({ ...state, btnLoadACedeao: true }))
        }
    }

    function annulebtnLoaderCedeao() {
        setState(state => ({ ...state, btnLoadACedeao: false }))
    }

    function activeSingleBtnLoader() {
        if (state.input === "") {
            setState(state => ({ ...state, singleBtnLoad: false }))
        }
        else {
            setState(state => ({ ...state, singleBtnLoad: true }))
        }
    }

    // modif
    function activeModal() {
        if (state.input === "") {
            setState(state => ({ ...state, modale: false }))
        }
        else {
            setState(state => ({ ...state, modale: true }))
        }
    }

    function annuleSingleBtnLoader() {
        setState(state => ({ ...state, singleBtnLoad: false }))
    }

    function annuler() {
        setState(state => ({ ...state, modale: false }))
    }

    function showModalJaune() {
        setState(state => ({
            ...state,
            visible: true,
        }));
    };

    function hideModalJaune() {
        setState(state => ({
            ...state,
            visible: false,
        }));
    };

    function showModalCedeao() {
        setState(state => ({
            ...state,
            cedeaoModalvisible: true,
        }));
    };

    function hideModalCedeao() {
        setState(state => ({
            ...state,
            cedeaoModalvisible: false,
        }));
    };

    function hideModalSingleAttestation() {
        setState(state => ({
            ...state,
            single: false,
        }));
    };

    function hideModal() {
        setState(state => ({
            ...state,
            openModalForUpd: false,
        }));
    };

    function getISODate(date){
        if(date){
        //var eu_date = '30.01.2010';
        return  date.split('T')[0];
        //return parts[2]+'-'+parts[1]+'-'+parts[0];
        }
    }

    function  handleChangeMod (e) {
        let {name, value} = e.target //
        //console.log("ccccccccc",value)
        setState(state => {
            const newState = { ...state, currentModif: {...state.currentModif, [name]:value}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
            return newState // Recuperation de la new valeur
        })
    }

    // ============================================ Function Update ================================================
    function updateAttestation(e) {
        e.preventDefault();
        const warning200 = () => {
            message.success('Succès','Modification effectué avec succès !!!');
          };
          const warning = () => {
            message.warning('Erreur','Enregistrement echoué !!!');
          };
        
          const warning400 = () => {
            message.warning('Erreur coté client !!!');
          };
       let newdata = state.currentModif;
        axios.put(API_BASE_URL + '/attestations/'+state.currentModif.id,newdata, {
            headers: { "Authorization": "Bearer" + localStorage.getItem('token')}
        })
            .then(response => {
                if (response){
                  warning200()
                  //window.location.href="/DetailsLots"
                  hideModal();
                  getSingleLot()
                  setState(state => {
                    const newdata = { ...state, currentModif: {...state.currentModif.id}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
                    return newdata // Recuperation de la new valeur
                })
                }else
                  warning();
                  hideModal();
            })
            .catch(error=> {
                //console.log(error);
                  warning400();
                  hideModal()
            });
    }

    function openLinkCedeao() {
        window.open(localStorage.getItem('lienCedeao'))
    }

    function openLink() {
        window.open(localStorage.getItem('modal'))
    }

    function openLinkJaune() {
        window.open(localStorage.getItem('lienJaune'))
       // console.log("=======================================>", localStorage.getItem('lienJaune'))
    }
    
    const loader = state.btnLoadAjaune;
    const loaderCedeao = state.btnLoadACedeao;
    const singleLoader = state.singleBtnLoad;
    const infoLot = state.infolot;

    function SearchLot(){
        if(state.searchInput  ==null||state.searchInput ==""){
            return state.singleLot;
        }
        else
        {
         let attestations = state.singleLot.filter(function(attestation){
             return attestation.numeroJaune == state.searchInput || attestation.numeroCedeao == state.searchInput || attestation.marque == state.searchInput || attestation.immatriculation == state.searchInput;
         })
         return attestations;
        }
    }

    function getAssures(){
        axios.get(API_BASE_URL+'/assures',{
         headers: { Authorization: "Bearer " + localStorage.getItem('token')}
     })
     .then(res=>{ 
       setState(state =>({
         ...state,     
          isLoading: false,
           listAssures:res.data|| []
       }));
       });
   } 
 
 
   function getAssureurs(){
     axios.get(API_BASE_URL+'/assureurs',{
     headers: { Authorization: "Bearer " + localStorage.getItem('token')}
     })
     .then(res=>{ 
         setState(state =>({
           ...state,     
            isLoading: false,
             listAssureurs:res.data|| []
         }));
   
 
         });
   }
 
   function getMarque(){
     axios.get(API_BASE_URL  + '/marque')
       .then(res=>{
         setState(state => ({
           ...state, 
           isLoading: false,
           marque: res.data || []
         }));
       });
   }

    function handlesearchInput(e) {
        let inputValue = e.target.value;
        setState(state => ({ ...state, searchInput: inputValue }));
        return inputValue;
    }

  const lot = state.singleLot;


    return (
        <Fragment>
            <Card>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-3">
                                        <div>
                                            <p> Assureur : <br/><strong>{infoLot.assureur}</strong></p>
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <div>
                                            <p>
                                                Assure : <br/><strong>{infoLot.assure}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div>
                                            <p>
                                                Numéro de police : <br/><strong> {infoLot.numeroPolice}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div>
                                            <p>
                                                Adresse : <br/><strong> {infoLot.assureurAddress}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <p>
                                            Date d'effet : <br/><strong>{infoLot.startDate}</strong>
                                        </p>
                                    </div>
                                    <div className="col-3">
                                        <div >
                                            <p>
                                                Echéance : <br/><strong>{infoLot.endDate}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-5">

                                        <div >
                                            <p>
                                                Statut : <br/>{state.impressionStatutCedeao ? (<Tag icon={<CheckCircleOutlined />} color="success">Cedeao génrée</Tag>) : (<Tag color="blue">Cedeao non génrée</Tag>)}&nbsp;{state.impressionStatutJaune ? (<Tag icon={<CheckCircleOutlined />} color="success">Jaune génrée</Tag>) : (<Tag color="blue">Jaune non génrée</Tag>)}

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{ marginTop: "20px" }}>
                                <div style={{ textAlign: "right" }}>
                                    {state.impressionStatutJaune ? (
                                        <Button className="text-white bg-warning" style={{ marginRight: '10px', borderRadius: "5px" }} onClick={openLinkJaune}>
                                            <UploadOutlined style={{ color: "white" }} />Telecharger Jaune
                                        </Button>
                                    ) : (
                                            <Button className="text-white bg-warning" style={{ marginRight: '10px', borderRadius: "5px" }} onClick={showModalJaune}>
                                                <PrinterOutlined style={{ color: "white" }} />Générée Jaune
                                            </Button>
                                        )}

                                    {state.impressionStatutCedeao ? (
                                        <Button style={{ backgroundColor: "#008000", color: "white", marginTop: "15px", borderRadius: "5px" }} onClick={openLinkCedeao} >
                                            <UploadOutlined style={{ color: "white" }} />Telecharger CEDEAO
                                        </Button>
                                    ) : (
                                            <Button style={{ backgroundColor: "#008000", color: "white", marginTop: "15px", borderRadius: "5px" }} onClick={showModalCedeao}>
                                                <PrinterOutlined style={{ color: "white" }} />Générée CEDEAO
                                            </Button>
                                        )}
                                </div>
                                <div style={{width:"97%", float:"right", paddingTop:"20px"}}>
                                    <Input type="text" placeholder="Search" name="seach" onChange={handlesearchInput}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                <div style={{overflow: "auto", padding: 5 }}>
                    <Table
                        rowKey={record => record.id}
                        columns={columns}
                        // dataSource={state.singleLot}
                        dataSource={SearchLot()}
                        loading={state.isLoading}
                        scroll={{ x: 2500 }}
                    />
                </div>

            </Card>

            {state.isUpdateDrawerVisible && (
                <UpdateForm
                    visible={state.isUpdateDrawerVisible}
                    close={handleClose}
                    currentItem={state.currentItem}
                />
            )}

            {state.isAddDrawerVisible && (
                <AddForm
                    visible={state.isAddDrawerVisible}
                    close={handleAddClose}
                />
            )}
            {/* MODAL D'AJOUT DE NUMERO POUR UN LOT JAUNE */}
        
            <Modal
                title="Attribution de numero aux attestations jaunes"
                visible={state.visible}

                footer={[
                    <Button loading={loader} type="danger" onClick={() => {
                        hideModalJaune();
                        annulebtnLoader();
                    }}>Annuler</Button>,
                    <Button type="primary" loading={loader} onClick={() => {
                        activebtnLoader();
                        printAttestations("jaune");
                    }}>Valider</Button>
                ]}

            >
                <Input type="text" name='text' placeholder="Entrez un numero" onChange={handleChange} />
            </Modal>

            {/* MODAL D'AJOUT DE NUMERO POUR UN LOT CEDEAO */}
            <Modal
                title="Attribution de numero aux attestation CEDEAO"
                visible={state.cedeaoModalvisible}

                footer={[
                    <Button loading={loaderCedeao} type="danger" onClick={() => {
                        hideModalCedeao();
                        annulebtnLoaderCedeao();
                    }}>Annuler</Button>,
                    <Button type="primary" loading={loaderCedeao} onClick={() => {
                        printAttestations("cedeao");
                        activebtnLoaderCedeao();
                    }}>Valider</Button>
                ]}
                onCancel={() => {
                    annulebtnLoaderCedeao();
                    hideModalCedeao();
                }}

            >
                <Input type="text" name='text' placeholder="Entrez un numero" onChange={handleChange} />
            </Modal>

            {/* MODAL D'AJOUT DE NUMERO POUR UNE ATTESTATION */}
            <Modal
                title="Attribution de numero a une attestation"
                visible={state.single}

                onCancel={() => {
                    hideModalSingleAttestation();
                    annuleSingleBtnLoader();
                    getSingleLot()
                }}

                footer={[
                    <div>
                        <Button loading={singleLoader} className="text-white bg-warning" style={{ textAlign: "left" }} onClick={() => { printSingleAttestations("jaune"); activeSingleBtnLoader(); getSingleLot()}}>Attestation Jaune</Button>
                        <Button loading={singleLoader} className="text-white bg-success" type style={{ textAlign: "right" }} onClick={() => { printSingleAttestations("cedeao"); activeSingleBtnLoader(); getSingleLot() }}>Attestation CEDEAO</Button>
                    </div>
                ]}
            >
                <Input type="text" name='text' placeholder="Entrez un numero" onChange={handleChange} />

            </Modal>
        
            {/* -===================== */}
            <Modal
                title="Modifier l'attestation"
                // visible={state.modale}
                centered visible={state.openModalForUpd}
                footer={[]}
            >
                <form onSubmit={updateAttestation}>
                    <div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label><strong>Id_Attestation</strong></label><br/>
                                <input value={state.currentModif.id} className="form-control form-control-sm" required/>

                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="col form-group">
                                <label><strong>Assure</strong></label><br/>
                                <select name="assure"
                                    onChange={handleChangeMod} value={state.currentModif.assure}
                                    style={{width:"100%", padding:"5px"}}
                                 >
                                    {state.listAssures.map(( m, index) => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col form-group">
                                <label><strong>Assureur</strong></label><br/>
                                <select style={{width:"100%", padding:"5px"}} name="assureurAddress" value={state.currentModif.assureurAddress} onChange={handleChangeMod}>
                                    {state.listAssureurs.map(( m, index) => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="col form-group">
                                <label><strong>Marque</strong></label><br/>
                                <input value={state.currentModif.marque} onChange={handleChangeMod} id="marqueId" name="marque" type="text" className="form-control form-control-sm" required/>
                            </div>
                            <div className="col form-group">
                                <label><strong>Immatriculation</strong></label>
                                <input value={state.currentModif.immatriculation} onChange={handleChangeMod} id="immatriculation" name="immatriculation" type="text" className="form-control form-control-sm" required/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label htmlFor="startDate"><strong>Date Emission </strong></label>
                        
                                <input id="startDate"  type="date" value={getISODate(state.currentModif.startDate)}  name="startDate" onChange={handleChangeMod} className="flex-left form-control form-control-sm" required />
                            </div>
                            <div className="col form-group">
                                <label htmlFor="endDate"><strong>Date Echeance</strong></label>
                                <input id="endDate" type="date" value={getISODate(state.currentModif.endDate)} id="endDate" name="endDate" onChange={handleChangeMod} className="flex-left form-control form-control-sm" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label><strong>Usage</strong></label>
                                <input value={state.currentModif.usage} onChange={handleChangeMod} id="usage"  name="usage" type="text" className="form-control form-control-sm" required />
                            </div>
                            <div className="col form-group">
                                <label><strong>Genre</strong></label>
                                <input value={state.currentModif.genre} onChange={handleChangeMod} id="genre" name="genre" type="text" className="form-control form-control-sm" required />
                            </div>
                        </div>
                        {/* <div className="form-row">
                            <div className="col form-group">
                                <label><strong>Adresse</strong></label>
                                <input value={state.currentModif.assureurAddress} onChange={handleChangeMod} id="assureurAddress"  name="assureurAddress" type="text" className="form-control form-control-sm" required />
                            </div>
                        </div> */}
                    </div>
                    <div className="text-right w-100">
                        <Button style={{cursor:"pointer"}} onClick={() => { hideModal(false) }} >
                            Annuler
                        </Button> &nbsp;
                        <Button style={{cursor:"pointer"}} type="primary" htmlType="submit" >
                            Modifier
                        </Button>
                    </div>
                </form>
            </Modal>        
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        hasRole: state.auth.hasRole
    }
}

export default connect(mapStateToProps)(CategoryList);