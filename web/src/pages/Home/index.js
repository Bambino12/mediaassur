import React, { Fragment, useState, useEffect } from 'react';

import {connect} from "react-redux";
import makeStyles from '@material-ui/styles/makeStyles';
import { Card, Table, Switch, Avatar, Button, Divider, Tag } from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';

import * as Helpers from 'util/Helpers';
import { GET_USERS_FILES_CTR,STATUS_CODE_REST_API, STATUS } from 'constant';
import { getUsers, getUser, toggleState } from 'services/user'
import { handleService } from 'helpers'
import UpdateForm from './UpdateForm'
import AddForm from './AddForm'

import styles from './styles'
import { getLots } from 'services/lot';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(styles)

function UserList(props) {
    const [state, setState] = useState({
        listLot: [], 
        isLoading: true,
        isUpdateDrawerVisible: false,
        isAddDrawerVisible: false,
        currentItem: {},
        lot: JSON.parse(localStorage.getItem("currentLotSelected")),
    })

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
                //console.log("Response get Lot ", list);
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

    // function addStatut(){
    //     for(let i=0; i<=state.lot.length; i++){
    //         if(state.lot[i].status === 0){
    //             console.log('le statut 0', state.lot[i].status);
    //             return<Tag color="blue">Non imprimé</Tag>
            
    //         }
    //         else if(state.lot[i].status === 0 ){
    //             console.log('le statut 1', state.lot[i].status);
    //             return <Tag color="green">Imprimé</Tag>
    //         }
    //         else if(state.lot[i].status = 2){
    //             console.log('le statut 2', state.lot[i].status);
    //             return <Tag color="red">Annulé</Tag>
    //         }
    //     }
    // }
    
    const columns = [
        {
            title: 'N° de police',
            key: 'numeroPolice',
            width: 150,
            render: (text, item) => item.numeroPolice || ""
        },
        {
            title: 'Assureur',
            key: 'assureur',
            width: 200,
            render: (text, item) => item.assureur || ""
        },
        {
            title: 'Assuré',
            key: 'assure',
            render: (text, item) => item.assure || ""
        },
        {
            title: 'Date de debut',
            key: 'startDate',
            width: 300,
            render: (text, item) => item.startDate || ""
            
        },
        {
            title: 'Date de fin ',
            key: 'endDate',
            width: 300,
            render: (text, item) => item.endDate || ""
        },
        {
            title: 'Nb attestation',
            key: 'nbAttestation',
            render: (text, item) => item.nbAttestation || ""
        },
        {
            title: 'Statut',
            key: 'statut',
            width: 280,
            render: (item) => (
                <div>
                   <td>{item.statusCedeao == 0 ? <Tag color="blue">Cedeao non generée  </Tag> : item.statusCedeao == 1 ? <Tag color="green">Cedeao generée</Tag> : <Tag color="red">Cedeao Annulée</Tag>}</td> 
                   <td>{item.statusJaune == 0 ? <Tag color="blue">Jaune non generée</Tag> : item.statusJaune == 1 ? <Tag color="green">Jaune generée</Tag> : <Tag color="red">Jaune Annulée</Tag>}</td>
                    
                </div>
            )
          },
        {
            key: 'actions',
            title:  "Actions",
            fixed: 'right',
            width: 90,
            render: (text, item) => (
                <Fragment>
                    <Link to="/DetailsLot">
                        <EyeOutlined
                            onClick={()=>localStorage.setItem("lotId",item.id)}
                        />
                    </Link>
                    {/* <PrinterOutlined
                        onClick={() => setState(state => ({...state, currentItem: item, isUpdateDrawerVisible: true}))}
                        style={{marginLeft:'10px'}}
                    /> */}
                   
                </Fragment>
            )
        },
    ];

    return (
        <Fragment>
            <Card>
                <div className={classes.titleContainer}>
                    <h2 className={classes.title}>Liste des lots</h2>
                </div>

                <Divider/>
                
                <div style={{overflow: "auto", padding: 5}}>
                    <Table
                        rowKey={record => record.id} 
                        columns={columns} 
                        dataSource={state.listLot}  
                        loading={state.isLoading} 
                        scroll={{x:1600}}
                    />
                </div>
            </Card>

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
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
      hasRole: state.auth.hasRole
    }
}

export default connect(mapStateToProps)(UserList);

  