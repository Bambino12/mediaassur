import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import swal from "sweetalert";
import makeStyles from '@material-ui/styles/makeStyles';
import { Card, Table, Button, Divider, Modal, notification, Input, Tag } from 'antd';
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
        openModalForUpd:false,
        currentModif: {},
        attestationList :[]
        // attestations: currentLot.attestations,
    })

    const classes = useStyles()

    useEffect(() => {
        setState(state => ({
            ...state,
            isLoading: true
        }));
        getSingleLot();
    },
        [])


    function getSingleLot() {
        axios.get(API_BASE_URL  + '/lots/' + localStorage.getItem('lotId'), {
            headers: { Authorization: "Bearer" + localStorage.getItem('token') }
        })
            .then(res => {
                // localStorage.setItem('infolot', JSON.stringify(res.data));
                setState(state => ({ ...state, infolot: res.data }));
                //console.log("infolot ", res.data);
                if (res.data.statusJaune == 1) {
                    console.log('statut de jaune ', res.data.status);
                    setState(state => ({ ...state, impressionStatutJaune: true }))
                }
                if (res.data.statusCedeao == 1) {
                    //console.log('statut de cedeao ', res.data.status);
                    setState(state => ({ ...state, impressionStatutCedeao: true }))
                }

                // console.log("response singleLot ", res.data);
                // console.log("le state ", state);
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

        //attestation
        // API_ROUTE + "/attestations/" + state.lotCourant.id + "/generate/?type=" + type + "&numero=" + numero
        //lot
        //API_ROUTE + "/lots/" + state.lotCourant.id + "/generate/?type=" + type + "&numero=" + numero
        axios.get(API_ROUTE + "/lots/" + localStorage.getItem('lotId') + "/generate/?type=" + type + "&numero=" + state.input)
            .then(res => {
                //console.log('lot courant ', state.lotCourant);
                if (res) {
                    console.log("res printAttestations ========================", res);
                    hideModalCedeao();
                    hideModalJaune();
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

                    });
                    //alert(res)

                }
            })
    };

    function printSingleAttestations(type) {
        if (state.input === "") {
            alert("Veuillez saisir un numero svp !!!");
            return false;
        }



        //attestation
        // API_ROUTE + "/attestations/" + state.lotCourant.id + "/generate/?type=" + type + "&numero=" + numero
        //lot
        //API_ROUTE + "/lots/" + state.lotCourant.id + "/generate/?type=" + type + "&numero=" + numero
        let currentItem = JSON.parse(localStorage.getItem('currentAttestationSelected'));
        //console.log('contenu de currentItem ', currentItem);
        axios.get(API_BASE_URL + "/attestations/" + currentItem.id + "/generate/?type=" + type + "&numero=" + state.input)
            .then(res => {
                //console.log('lot courant ', currentItem.id);
                if (res) {
                    //console.log("res printAttestations ========================", res);
                    //var mod = res.data;
                    //let lien = mod.replace("http://127.0.0.1:8080", "");
                    //console.log("le lien ", lien);
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
                    });
                    //alert(res)

                }
            })
    };


    function handleChange(e) {

        let isNotNull = e.target.value;
        setState(state => ({ ...state, input: isNotNull }));
        //console.log('numero saisi ', state.input);
    }


    const columns = [
        { title: 'Numero jaune', width: 130, key: '1', dataIndex: "numeroJaune" },
        { title: 'Numero cedeao', width: 135, key: '2', dataIndex: "numeroCedeao" },
        { title: 'Assuré', width: 120, key: '3', dataIndex: "assure" },
        { title: 'Marque', width: 120, key: '4', dataIndex: "marque" },
        { title: 'Immatriculation', width: 100, key: '5', dataIndex: "immatriculation" },
        { title: 'Usage', width: 200, key: '6', dataIndex: "usage" },
        { title: 'Genre', width: 200, key: '7', dataIndex: "genre" },
        {
            title: 'Statut',
            key: 'statut',
            width: 250,
            render: (item) => (
                <div>
                    <td>{item.statusCedeao == 0 ? <Tag color="blue">Cedeao non generée  </Tag> : item.statusCedeao == 1 ? <Tag color="green">Cedeao generée</Tag> : <Tag color="red">Cedeao Annulée</Tag>}</td> <td>{item.statusJaune == 0 ? <Tag color="blue">Jaune non generée</Tag> : item.statusJaune == 1 ? <Tag color="green">Jaune generée</Tag> : <Tag color="red">Jaune Annulée</Tag>}</td>
                </div>
            )
        },
        {
            title: 'Action', width: 60, key: '22', dataIndex: "action", fixed: "right",
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
                        // onClick={()=> {selectForUpdate()
                        //     setState(state => ({ ...state, openModalForUpd: true }))
                        // }}
                        onClick={() => {
                            localStorage.setItem("selectForUpdate", JSON.stringify(text));
                            setState(state => ({ ...state, openModalForUpd: true }));
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

    // ============================== FUNCTION FOR UPDATE =======================
    // function onFinish(values){
    //     let objRequest = Object.assign({}, values);
    //     objRequest.status = 1;
    //     let lot={
    //       assure: objRequest.assure,
    //       genre: objRequest.genre,
    //       immatriculation: objRequest.immatriculation,
    //       lotId: objRequest.lot_id,
    //       marque: objRequest.marque,
    //       usage: objRequest.usage,
    //       statusCedeao: 0,
    //       statusJaune: 0,
    //     };
        
    //     console.log('element saisi ', lot);
    //     // console.log('list lots ', state.lots);
    //     axios.post(API_BASE_URL + "/attestations", lot)
    //       .then(response => {
    //           //console.log("Response d'ajout d'attestation", response);
    //           if (response.data){
    //             notification.success({
    //               message: 'Mediassur App',
    //               description: 'Enregistrement effectué avec succès !!!'
    //             }); 
    //             // handleClose();
    //             getAllLots();            
    //           }else
    //           notification.warning({
    //             message: 'Mediassur App',
    //             description: 'Enregistrement echoué !!!'
    //           });  
    //         //   handleCloseModal();
    
    //           // this.hideAssureursModal();
    
    //       })
    //       .catch(error=> {
    //           console.log(error);
    //           notification.warning({
    //                   message: 'Mediassur App',
    //                   description: 'Erreur cote client'
    //                 });
    //      });
    //   }

    function updateAttestation(e) {
        e.preventDefault();
        const warning200 = (message) => {
          message.success('Succès','Modification effectué avec succès !!!');
        };
        const warning = (message) => {
          message.warning('Erreur','Enregistrement echoué !!!');
        };
      
        const warning400 = (message) => {
          message.warning('Erreur coté client !!!');
        };
      
        let newdata = state.currentModif;
      
        console.log(newdata);
        axios.post(API_BASE_URL + '/attestations//updateAttestations',newdata, {
            headers: { Authorization: "Bearer" + localStorage.getItem('token')}
        })
            .then(response => {
                console.log(response);
                if (response){
                  warning200();
                //   this.getAllAssureurs();
      
                }else
                  warning();
                //   this.hideModalUpdAssureurs(false)
            })
            .catch(error=> {
                console.log(error);
                  warning400();
                //   this.hideModalUpdAssureurs(false)
            });
      }

    // modif
    function openModalForUpd(openModalForUpd) {
        if (openModalForUpd) {
            setState(state => ({ ...state, openModalForUpd: false }))
        }
        else {
            setState(state => ({ ...state, openModalForUpd: true }))
        }

    }

    function selectForUpdate (item){
        setState({currentModif: item, openModalForUpd:true}) // Recuperation de la ligne
      }

    function  handleChangeMod (e) {
        let {name, value} = e.target //
        setState(state => {
            const newState = { ...state, currentModif: {...state.currentModif, [name]:value}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
            return newState // Recuperation de la new valeur
        })
      }
    // openModalForUpd(openModalForUpd){
    //     if (openModalForUpd){
    //         setState({openModalForUpd});
    //     }
    //     else{
      
    //         setState({openModalForUpd});
    //     }
    //   }

    function annuleSingleBtnLoader() {
        setState(state => ({ ...state, singleBtnLoad: false }))
    }
    function annuler() {
        setState(state => ({ ...state, singleBtn: false }))
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

    function openLinkCedeao() {
        window.open(localStorage.getItem('lienCedeao'))
    }

    function openLink() {
        window.open(localStorage.getItem('modal'))
    }

    function openLinkJaune() {
        window.open(localStorage.getItem('lienJaune'))
        console.log("localStorage", localStorage.getItem('lienJaune'))
    }
    

    const loader = state.btnLoadAjaune;
    const loaderCedeao = state.btnLoadACedeao;
    const singleLoader = state.singleBtnLoad;
    //const infoLot = parseJSON(localStorage.getItem('infolot'));
    const infoLot = state.infolot;


    function SearchLot(){
        if(state.searchInput === ""){
            return state.singleLot;
        }
        else
        {
        // console.log('singleLot :', state.singleLot);
         let attestations = state.singleLot.filter(function(attestation){
             //console.log('attestion :', attestation);
             return attestation.numeroJaune == state.searchInput || attestation.numeroCedeao == state.searchInput || attestation.marque == state.searchInput || attestation.immatriculation == state.searchInput;
         })
         console.log("attestations: ", attestations);
         return attestations;
         
        }
    }

    // function SearchLot(){
    //     if(state.searchInput === ""){
    //         return state.singleLot;
    //     }
    //     else
    //     {
    //      let attestations = state.singleLot.filter(function(attestations){
    //          return attestations.immatriculation.startsWith(''+state.searchInput+'') || attestations.assure.startsWith(''+state.searchInput+'');
    //      })
    //      console.log("attestations: ", attestations);
    //      return attestations;
    //   //    || lot.assure == state.searchInput || lot.assureur == state.searchInput
    //     }
    // }
  
    function handlesearchInput(e) {
     let inputValue = e.target.value;
     setState(state => ({ ...state, searchInput: inputValue }));
     console.log('numero saisi ', inputValue);
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
                                    <div className="col-4">
                                        <div>
                                            <p> Assureur : <br /><strong>{infoLot.assureur}</strong></p>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div >
                                            <p>
                                                Assuré : <br /><strong>{infoLot.assure}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div >
                                            <p>
                                                Numéro de police : <br /><strong> {infoLot.numeroPolice}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <p>
                                            Date d'effet : <br /><strong>{new Date(infoLot.startDate).toLocaleDateString("fr-FR")}</strong>
                                        </p>
                                    </div>
                                    <div className="col-3">
                                        <div >
                                            <p>
                                                Echéance : <br /><strong>{new Date(infoLot.endDate).toLocaleDateString("fr-FR")}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-5">

                                        <div >
                                            <p>
                                                Statut : <br />{state.impressionStatutCedeao ? (<Tag icon={<CheckCircleOutlined />} color="success">Cedeao génrée</Tag>) : (<Tag color="blue">Cedeao non génrée</Tag>)}&nbsp;{state.impressionStatutJaune ? (<Tag icon={<CheckCircleOutlined />} color="success">Jaune génrée</Tag>) : (<Tag color="blue">Jaune non génrée</Tag>)}

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
                                        <Button className="text-white bg-warning" onClick={openLinkJaune} style={{ marginRight: '10px', borderRadius: "5px" }}>
                                            <UploadOutlined style={{ color: "white" }} />Telecharger Jaune
                                        </Button>
                                    ) : (
                                            <Button className="text-white bg-warning" onClick={showModalJaune} style={{ marginRight: '10px', borderRadius: "5px" }}>
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
                        dataSource={state.singleLot}
                        dataSource={SearchLot()}
                        loading={state.isLoading}
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
                //   onOk={()=>{
                //     printAttestations("jaune");
                //   }}
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
                // onCancel={() => {
                //     hideModalJaune();
                //     annulebtnLoader();
                // }}
            //   okText="Valider"
            //   cancelText="Annuler"
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
                // onCancel={() => {
                //     annulebtnLoaderCedeao();
                //     hideModalCedeao();
                // }}
            //   okText="Valider"
            //   cancelText="Annuler"
            >
                <Input type="text" name='text' placeholder="Entrez un numero" onChange={handleChange} />
            </Modal>

            {/* MODAL D'AJOUT DE NUMERO POUR UNE ATTESTATION */}
            <Modal
                title="Attribution de numero a une attestation"
                visible={state.single}
                //   onOk={()=>{
                //     //printSingleAttestations();
                //   }}
                // onCancel={() => {
                //     hideModalSingleAttestation();
                //     annuleSingleBtnLoader();
                // }}
                //   okText="Valider"
                //   cancelText="Annuler"
                footer={[
                    <div>
                        <Button loading={singleLoader} className="text-white bg-warning" style={{ textAlign: "left" }} onClick={() => { printSingleAttestations("jaune"); activeSingleBtnLoader() }}>Attestation Jaune</Button>
                        <Button loading={singleLoader} className="text-white bg-success" type style={{ textAlign: "right" }} onClick={() => { printSingleAttestations("cedeao"); activeSingleBtnLoader() }}>Attestation CEDEAO</Button>
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
                        <div className="form-row" >
                            <div className="col form-group">
                                <label><strong>Assure</strong></label>
                                <input value={state.currentModif.assure} onChange={handleChangeMod} id="assure" name="assure" type="text" className="form-control form-control-sm" required/>
                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="col form-group">
                                <label><strong>Marque</strong></label>
                                <input value={state.currentModif.marque} onChange={handleChangeMod} id="marque" name="marque" type="text" className="form-control form-control-sm" required/>
                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="col form-group">
                                <label><strong>Immatriculation</strong></label>
                                <input value={state.currentModif.immatriculation} onChange={handleChangeMod} id="immatriculation" name="immatriculation" type="text" className="form-control form-control-sm" required/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label><strong>Usage</strong></label>
                                <input value={state.currentModif.usage} onChange={handleChangeMod} id="usage"  name="usage" type="text" className="form-control form-control-sm" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label><strong>Genre</strong></label>
                                <input value={state.currentModif.genre} onChange={handleChangeMod} id="genre" name="genre" type="text" className="form-control form-control-sm" required />
                            </div>
                        </div>
                    </div>
                    <div className="text-right w-100">
                        <Button onClick={() => { hideModal() }}>
                            Annuler
                        </Button> &nbsp;
                        <Button type="primary" htmlType="submit">
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