import React, { Fragment, useState, useEffect } from 'react';

import {connect} from "react-redux";
import makeStyles from '@material-ui/styles/makeStyles';
import { Card, Table, Switch, Avatar, Button, Divider, Tag } from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';

import * as Helpers from 'util/Helpers';
import { GET_USERS_FILES_CTR,STATUS_CODE_REST_API, STATUS } from 'constant';
import { getUsers, getUser, toggleState } from 'services/user'
import { handleService } from 'helpers'
// import UpdateForm from './UpdateForm'
import AddForm from './AddForm';
import {API_BASE_URL} from '../../constant';

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
        currentItem: {}
    })

    const classes = useStyles()
    
    useEffect(() => {
        handleService(getLots, null, 
            (response) => {
                //console.log("Response get Lot ", response.content.attestations.length);
                let list = response.content;
                for (var i =0;i <list.length; i++) {
                    list[i]["key"]=i; // add property key = 1
                    list[i]["nbAttestation"]=list[i]["attestations"].length;
                }
                //console.log("Response get Lot ", list)
                setState(state => ({
                    ...state,
                    listLot: response ? response.content : [],
                    isLoading: false,
                    
                }))
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
    
    const columns = [
        {
            title: 'N° de police',
            key: 'numeroPolice',
            render: (text, item) => item.numeroPolice || ""
        },
        {
            title: 'Assureur',
            key: 'assureur',
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
            title: 'Nombre d\'attestation',
            key: 'nbAttestation',
            render: (text, item) => item.nbAttestation || ""
        },
        {
          title: 'Statut',
          key: 'statut',
          width: 280,
          render: (item) =>(
                <div>
                   <td>{item.statusCedeao == 0 ? <Tag color="blue">Cedeao non generée</Tag> : item.statusCedeao == 1 ? <Tag color="green">Cedeao generée</Tag> : <Tag color="red">Cedeao Annulée</Tag>}</td> 
                   <td>{item.statusJaune == 0 ? <Tag color="blue">Jaune non generée</Tag> : item.statusJaune == 1 ? <Tag color="green">Jaune generée</Tag> : <Tag color="red">Jaune Annulée</Tag>}</td>  
                </div>
          )
        },
        {
            key: 'actions',
            title:  "Actions",
            fixed: 'right',
            width: 90,
            render: (item) => (
                <Fragment>
                    <Link to="/DetailsLot">
                        <EyeOutlined
                            // onClick={()=>localStorage.setItem("currentLotSelected",JSON.stringify(item))}
                            onClick={()=>localStorage.setItem("lotId",item.id)}

                        />
                    </Link>
                </Fragment>
            )
        },
    ];

    return (
        <Fragment>
            <Card>
                <div className={classes.titleContainer}>
                    <h2 className={classes.title}>Liste des lots</h2>
                    <Link to="/Importation">
                        <Button 
                            type="primary" 
                            className={classes.button}  
                        >
                            <PlusOutlined /> Importer un lot
                        </Button>
                    </Link>
                </div>

                <Divider/>
                
                <div style={{overflow: "auto", padding: 5}}>
                    <Table
                        rowKey={record => record.id} 
                        columns={columns} 
                        dataSource={state.listLot}  
                        loading={state.isLoading} 
                        scroll={{x:1500}}
                    />
                </div>
            </Card>

            {state.isAddDrawerVisible && (
                <AddForm
                    visible={state.isAddDraw56erVisible} 
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

  