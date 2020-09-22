import React, { Fragment, useState, useEffect } from 'react';

import {connect} from "react-redux";
import makeStyles from '@material-ui/styles/makeStyles';
import { Card, Table, Spin, Button, Divider, Tag,Tabs, Input, Modal, message} from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined, SearchOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';

import * as Helpers from 'util/Helpers';
import { GET_USERS_FILES_CTR,STATUS_CODE_REST_API, STATUS, API_BASE_URL } from 'constant';
import { getUsers, getUser, toggleState } from 'services/user'
import { handleService } from 'helpers'
import UpdateForm from './UpdateForm'
import AddForm from './AddForm'
import styles from './styles'
import { getLot, getLots } from 'services/lot';
import { Link } from 'react-router-dom';
// import { Input } from '@material-ui/core';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import swal from 'sweetalert';
import { API_ROUTE } from 'api/routes';
import { parseJSON } from 'jquery';

const useStyles = makeStyles(styles)
let pdf_viewer_url = API_BASE_URL.replace("v1", "") + "viewer/web/viewer.html?file=";


function UserList(props) {
    const [state, setState] = useState(
      {
      listLot: [],
      isLoading: true,
      isUpdateDrawerVisible: false,
      isAddDrawerVisible: false,
      currentItem: {},
      lot: JSON.parse(localStorage.getItem("currentLotSelected")),
      searchText: '',
      searchedColumn: '',
      searchInput:"",
      dataIndex: "",
      inputValue: '',
      searchedColumn: '',
      currentModif: {},
      attestationsSansLot: {},
      cedeaoModalvisible: false,
      visible: false,
      infolot: [],
      impressionStatutCedeao: false,
      impressionStatutJaune: false,
      singleLot: [],
      btnLoadACedeao : false,
      btnLoadAjaune : false,
      singleBtnLoad:false,
      single : false,
      singleLoader: false,
      singlelotId: localStorage.getItem('lotId'),
      attestations: parseJSON(localStorage.getItem("attestation")),
      listAssures:[],
      listAssureurs:[]
      
      
      }
    )

    useEffect(() => {
        setState(state => ({...state, isLoading: true }));
        getSLots();
        getSingleLot();
        getMarque();
        getAssureurs();
        getAssures();
      }, [])

    const classes = useStyles()
    //console.log("contenu du state ", state);
    useEffect(() => {
        handleService(getLots, null, 
            (response) => {
                //console.log("Response get Lot ", response.content.attestations.length);
                let list = response.content;
                for (var i =0;i <list.length; i++) {
                    list[i]["key"]=i; // add property key = 1
                    list[i]["nbAttestation"]=list[i]["attestations"].length;
                }
                for (var i =0;i <list.length; i++) {
                    if(list[i].status===1){
                        let status = list[i].status;
                        // console.log('le status de l attestion ', i , ' est: ', status);
                        localStorage.setItem('statut', list[i].status);
                        //alert('status = ',  status);
                    } // add property key = 1
                }
                // console.log("Response get Lot ", list);
                localStorage.setItem('list', JSON.stringify(list));
                setState(state => ({
                    ...state,
                    listLot: response ? response.content : [],
                    isLoading: false,
                    lot: response.content,
                    
                }))
                //console.log('listLOT ', state.lot.status);
            },
            () => {setState(state => ({...state, isLoading: false}))}
        );
    }, [])
    
    function getSLots () {
        axios.get(API_BASE_URL  + '/attestations/sans_lot')
          .then(res=>{
            //console.log('response de sans lots ', res.data);
            //localStorage.setItem('lotsAddForm', JSON.stringify(res.data))
            setState(state => ({
              ...state, 
              isLoading: false,
              lots: res.data || []
            }));
          });
          //window.location.href="/"
      }

  function handleChange (e){
      let {name, value} = e.target
      setState(state => {
          const newState = { ...state, searchInput: {...state.searchInput, [name]:value}}
          console.log("Le contenu de searchInput ", newState.searchInput);
          return newState;
      })
   }

    function handleClose(user){
        if(user){
            setState(state => ({...state, isLoading: true }));

            handleService(getUser, user.id, 
                (response) => {
                    if(response){
                        setState(state => {
                            let users = [...state.users];
                            let index = 0;
                            
                            for(let user of users){
                                if(user.id === response.id) break
                                index++
                            }
                
                            users[index] = {...users[index], ...response}
                            
                            return {
                                ...state, users, 
                                isLoading: false,
                                isUpdateDrawerVisible: false
                            }
                        }) 
                    }else{
                        setState(state => ({...state, isLoading: false, isUpdateDrawerVisible: false}))
                    }
                },
                () => setState(state => ({...state, isLoading: false, isUpdateDrawerVisible: false}))
            )
        }else{
            setState(state => ({...state, isUpdateDrawerVisible: false}))
        }
    }

    function handleAddClose(user){
        if(user){
            setState(state => ({...state, isLoading: true }));

            handleService(getUsers, null, 
                (response) => {
                    setState(state => ({
                        ...state,
                        users: (response ? response : []),
                        isLoading: false,
                        isAddDrawerVisible: false
                    }))
                },
                () => {setState(state => ({...state, isAddDrawerVisible: false, isLoading: false}))}
            )
        }else{
            setState(state => ({...state, isAddDrawerVisible: false}))
        }
    }
    // seach
      
    const columns = [
        {
          title: 'Numero police',
          dataIndex: 'numeroPolice',
          key: 'numeroPolice',
          width: '10%',
        },
        {
          title: 'Assureur',
          dataIndex: 'assureur',
          key: 'assureur',
          width: '12%',
        },
        {
          title: 'Assuré',
          dataIndex: 'assure',
          key: 'assure',
          width: '12%',
        },
        {
          title: 'Date de debut',
          dataIndex: 'startDate',
          key: 'startDate',
          width: '10%',
        },
        {
          title: 'Date de fin',
          dataIndex: 'endDate',
          key: 'endDate',
          width: '10%',
        },
        {
          title: 'Nb Attestation',
          dataIndex: 'nbAttestation',
          key: 'nbAttestation',
          width: '10%'
        },
        {
          title: 'Statut',
          dataIndex: 'statut',
          key: 'statut',
          width: '20%',
          render: (SSS , item) => (
              <div>
                 <td>{item.statusCedeao == 0 ? <Tag color="blue">Cedeao non generée</Tag> : item.statusCedeao == 1 ? <Tag color="green">Cedeao generée</Tag> : <Tag color="red">Cedeao Annulée</Tag>}</td> 
                 <td>{item.statusJaune == 0 ? <Tag color="blue">Jaune non generée</Tag> : item.statusJaune == 1 ? <Tag color="green">Jaune generée</Tag> : <Tag color="red">Jaune Annulée</Tag>}</td>  
              </div>
          )
        },
      {
          title:  "Actions",
          key: 'actions',
          fixed: 'right',
          width: '7%',
          render: (item) => (
              <Fragment>
                  <Link to="/DetailsLot">
                      <EyeOutlined
                  onClick={()=>localStorage.setItem("lotId", item.id)}
                         // onClick={()=>localStorage.setItem("lotId",item.id)}
                      />
                  </Link> 
              </Fragment>
          )
      },
      ];

      function handleChang(e) {

        let isNotNull = e.target.value;
        setState(state => ({ ...state, input: isNotNull }));
        //console.log('numero saisi ', state.input);
    }

      const columns1 = [
        { title: 'Numero police', width: "12%", key: '1', dataIndex: "numeroPolice"},
        { title: 'Numero jaune', width: "12%", key: '2', dataIndex: "numeroJaune"},
        { title: 'Numero cedeao', width: "12%", key: '3', dataIndex: "numeroCedeao"},
        { title: 'Assure', width: "12%", key: '4', dataIndex: "assure" },
        { title: 'Assureur', width: "12%", key: '5', dataIndex: "assureur"},
        { title: 'Adresse', width: "15%", key: '6', dataIndex: "assureurAddress"},
        { title: 'Marque', width: "10%", key: '7', dataIndex: "marque"},
        { title: 'Immatriculation', width: "12%", key: '8', dataIndex: "immatriculation" },
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
            render: (item) => (
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
  
    function SearchLot(){
      if(state.searchInput == ""||state.searchInput == null){
          return state.listLot;
      }
      else
      {
       let lots = state.listLot.filter(function(lot){
           return lot.numeroPolice.startsWith(''+state.searchInput+'') || lot.assure.startsWith(''+state.searchInput+'') || lot.assureur.startsWith(''+state.searchInput+'');
       })
       console.log("lots: ", lots);
       return lots;
    }
    }

    
    function SearchLotAttestation(){
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

    function getSingleLot() {
        axios.get(API_BASE_URL  + '/lots/' + localStorage.getItem('lotId'), {
            headers: { Authorization: "Bearer" + localStorage.getItem('token') }
        })
            .then(res => {
                //console.log("localstorage===========" + localStorage.getItem('lotId'))
                setState(state => ({ ...state, infolot: res.data}));
               // window.location.href="/"
                if (res.data.statusJaune == 1) {
                    setState(state => ({ ...state, impressionStatutJaune: true }))
                }
                if (res.data.statusCedeao == 1) {
                    setState(state => ({ ...state, impressionStatutCedeao: true }))
                }else
                {
                    return setState(state => ({...state, infolot: null}))
                }

                setState(state => ({ ...state, singleLot: res.data.attestations, isLoading: false }));
            });
    }

    // ================== formule ======================
    
    
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
                        window.location.href="/"
                    });

                }
            })
        };
    
    function hideModalSingleAttestation() {
        setState(state => ({
            ...state,
            single: false,
        }));
    };

    function activeSingleBtnLoader() {
        if (state.input === "") {
            setState(state => ({ ...state, singleBtnLoad: false }))
        }
        else {
            setState(state => ({ ...state, singleBtnLoad: true }))
        }
    }

    function annuleSingleBtnLoader() {
        setState(state => ({ ...state, singleBtnLoad: false }))
    }
  

    function hideModal() {
        setState(state => ({
            ...state,
            openModalForUpd: false,
        }));
    };

    function  handleChangeMod (e) {
        let {name, value} = e.target //
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
                console.log(response);
                if (response){
                    warning200();
                    //window.location.href="/"
                    getLots();
                    hideModal();
                    setState(state => {
                    const newdata = { ...state, currentModif: {...state.currentModif.id}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
                    return newdata // Recuperation de la new valeur
                })
                }else
                    warning();
                    hideModal();
            })
            .catch(error=> {
                console.log(error);
                    warning400();
                    hideModal()
            });
        }

    function handlesearchInput(e) {
        let inputValue = e.target.value;
        setState(state => ({ ...state, searchInput: inputValue }));
        //    console.log('numero saisi ', inputValue);
        return inputValue;
    }
    const { TabPane } = Tabs;
    const lot = state.listLot;
    const loader = state.btnLoadAjaune;
    const loaderCedeao = state.btnLoadACedeao;
    const singleLoader = state.singleBtnLoad;
    const infoLot = state.infolot;

    function getISODate(date){
        if(date){
        //var eu_date = '30.01.2010';
        return  date.split('T')[0];
        //return parts[2]+'-'+parts[1]+'-'+parts[0];
        }
    }

    function openLinkJaune() {
        window.open(localStorage.getItem('lienJaune'))
       // console.log("=======================================>", localStorage.getItem('lienJaune'))
    }

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

    function openLinkCedeao() {
        window.open(localStorage.getItem('lienCedeao'))
    }

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

    return (
        <Fragment>
            <Card>
                <Tabs>
                    <TabPane tab="Lots importés" key="1">
                        <div>
                            <div className="float-right">
                            </div>          
                                <div className={classes.titleContainer}>
                                    <div>
                                        <h2 className={classes.title}>Liste des lots</h2>
                                    </div>
                                    <div style={{ width: "30%", float: "right" }}>
                                        <Input type="text" placeholder="Search" name="seach" onChange={handlesearchInput} />
                                    </div>
                                </div>

                                <Divider />

                                <div style={{ overflow: "auto", padding: 5 }}>
                                    <Table
                                        rowKey={record => record.id}
                                        columns={columns}
                                        dataSource={SearchLot()}
                                        loading={state.isLoading}
                                        scroll={{ x: 1600 }}
                                    />
                                </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Attestations sans Lots" key="2">
                        <div className="container-fluid">

                                <div className={classes.titleContainer}>

                                </div>
                                <div>
                                    <h2 className={classes.title}>Liste des attestations enregistrées</h2>
                                </div>
                                <Divider />

                                <div style={{ overflow: "auto", padding: 5 }}>
                            
                                    <Table
                                        rowKey={record => record.id}
                                        columns={columns1}
                                        dataSource={state.lots}
                                        //dataSource={SearchLotAttestation}
                                        loading={state.isLoading}
                                        scroll={{ x: 2500 }}
                                    />
                                </div>
                            

                        </div>
                    
                        </TabPane>

                    <br />
                </Tabs>

           

            {state.isUpdateDrawerVisible && (
                <UpdateForm
                    visible={state.isUpdateDrawerVisible} 
                    close={handleClose}
                    currentItem={state.currentItem}
                    hasRole={props.hasRole}
                />
            )}

            {state.isAddDrawerVisible && (
                <AddForm
                    visible={state.isAddDrawerVisible} 
                    close={handleAddClose}
                    hasRole={props.hasRole}
                />
            )}
            </Card>


        {/* -===================== */}

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
            //   okText="Valider"
            //   cancelText="Annuler"
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
            }}
            footer={[
                <div>
                    <Button loading={singleLoader} className="text-white bg-warning" style={{ textAlign: "left" }} onClick={() => { printSingleAttestations("jaune"); activeSingleBtnLoader()}}>Attestation Jaune</Button>
                    <Button loading={singleLoader} className="text-white bg-success" type style={{ textAlign: "right" }} onClick={() => { printSingleAttestations("cedeao"); activeSingleBtnLoader() }}>Attestation CEDEAO</Button>
                </div>
            ]}
        >
            <Input type="text" name='text' placeholder="Entrez un numero" onChange={handleChang} />
        </Modal>

        {/*======================= Modifier une attestation ===========================*/}

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
                                <input value={state.currentModif.id} className="form-control form-control-sm"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label htmlFor="numeroPolice"><strong>Numero police </strong></label>
                                <input type="text"  value={state.currentModif.numeroPolice} id="numeroPoliceId" name="numeroPolice" onChange={handleChangeMod} className="flex-left form-control form-control-sm" />
                            </div>
                            <div className="col form-group">
                                <label htmlFor="assureurAddress"><strong>Adresse</strong></label>
                                <input type="text" value={state.currentModif.assureurAddress} id="assureurAddress" name="assureurAddress" onChange={handleChangeMod} className="flex-left form-control form-control-sm" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label htmlFor="numeroPolice"><strong>Numero jaune </strong></label>
                                <input id="numeroJaune" type="text"  value={state.currentModif.numeroJaune}  name="numeroJaune" onChange={handleChangeMod} className="flex-left form-control form-control-sm"/>
                            </div>
                            <div className="col form-group">
                                <label htmlFor="numeroCedeao"><strong>Numero Cedeao</strong></label>
                                <input id="numeroCedeao" type="text" value={state.currentModif.numeroCedeao} id="numeroCedeao" name="numeroCedeao" onChange={handleChangeMod} className="flex-left form-control form-control-sm"/>
                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="col form-group">
                                <label><strong>Assure</strong></label><br/>
                                <select name="assure" id="assure"
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
                                <select style={{width:"100%", padding:"5px"}} name="assureurAddress" id="assureurAddress" value={state.currentModif.assureurAddress} onChange={handleChangeMod}>
                                    {state.listAssureurs.map(( m, index) => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="col form-group">
                                <label><strong>Marque</strong></label><br/>
                                <input value={state.currentModif.marque} onChange={handleChangeMod} id="marqueId" name="marque" type="text" className="form-control form-control-sm"/>
                            </div>
                            <div className="col form-group">
                                <label><strong>Immatriculation</strong></label>
                                <input value={state.currentModif.immatriculation} onChange={handleChangeMod} id="immatriculation" name="immatriculation" type="text" className="form-control form-control-sm"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col form-group">
                                <label htmlFor="startDate"><strong>Date Emission </strong></label>
                                <input id="startDate" type="date"  value={getISODate(state.currentModif.startDate)}  name="startDate" onChange={handleChangeMod} className="flex-left form-control form-control-sm" required />
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
                    </div>
                    <div className="text-right w-100">
                        <Button style={{cursor:"pointer"}} onClick={() => {hideModal(false)}} >
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

export default connect(mapStateToProps)(UserList);

  