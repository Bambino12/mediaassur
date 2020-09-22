import React, { Fragment, useState, useEffect } from 'react';

import {connect} from "react-redux";
import makeStyles from '@material-ui/styles/makeStyles';
import { Card, Table, Spin, Button, Divider, Tag,Tabs, Input  } from 'antd';
import { PlusOutlined, EditOutlined, PrinterOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

import * as Helpers from 'util/Helpers';
import { GET_USERS_FILES_CTR,STATUS_CODE_REST_API, STATUS } from 'constant';
import { getUsers, getUser, toggleState } from 'services/user'
import { handleService } from 'helpers'
import UpdateForm from './UpdateForm'
import AddForm from './AddForm'

import styles from './styles'
import { getLots } from 'services/lot';
import { Link } from 'react-router-dom';
// import { Input } from '@material-ui/core';
import Highlighter from 'react-highlight-words';

const useStyles = makeStyles(styles)

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
      }
    )

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
                console.log("Response get Lot ", list);
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
          title: 'N° de police',
          dataIndex: 'numeroPolice',
          key: 'numpolice',
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
          width: '15%',
        },
        {
          title: 'Date de fin',
          dataIndex: 'endDate',
          key: 'endDate',
          width: '15%',
        },
        {
          title: 'Nb attestation',
          dataIndex: 'nbAttestation',
          key: 'nbAttestation',
          width: '10%'
        },
        {
          title: 'Statut',
          dataIndex: 'statut',
          key: 'statut',
          width: '22%',
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
  
    function SearchLot(){
      if(state.searchInput === ""){
          return state.listLot;
      }
      else
      {
       let lots = state.listLot.filter(function(lot){
           return lot.numeroPolice.startsWith(''+state.searchInput+'') || lot.assure.startsWith(''+state.searchInput+'') || lot.assureur.startsWith(''+state.searchInput+'');
       })
       console.log("lots: ", lots);
       return lots;
    //    || lot.assure == state.searchInput || lot.assureur == state.searchInput
      }
  }

  function handlesearchInput(e) {
   let inputValue = e.target.value;
   setState(state => ({ ...state, searchInput: inputValue }));
   console.log('numero saisi ', inputValue);
   return inputValue;
}
        const { TabPane } = Tabs;
const lot = state.listLot;

    return (
        <Fragment>
            <Tabs>
                <TabPane tab="Lots importés" key="1">
                    <div>
                        <div className="float-right">

                        </div>
                        <Card>
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
                                {/* {lot.filter(lotfiltered => lotfiltered. < 60).map(filteredPerson => (
                    <li>
                      {filteredPerson.name}
                    </li>
                  ))} */}
                                <Table
                                    rowKey={record => record.id}
                                    columns={columns}
                                    dataSource={SearchLot()}
                                    loading={state.isLoading}
                                    scroll={{ x: 1600 }}
                                />
                            </div>
                        </Card>


                    </div>
                </TabPane>
                <TabPane tab="Autres Lots" key="2">
                    <div>
                       
                        <Card>
                            <div className={classes.titleContainer}>
                                <div>
                                    <h2 className={classes.title}>Liste des attestations enregistrées</h2>
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
                        </Card>

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
        </Fragment>

    )
}

const mapStateToProps = (state) => {
    return {
      hasRole: state.auth.hasRole
    }
}

export default connect(mapStateToProps)(UserList);

  