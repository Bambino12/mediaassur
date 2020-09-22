import React, {useState} from 'react';

import { useHistory } from "react-router-dom";
import { Menu } from 'antd';
import { CloudOutlined, UsergroupAddOutlined, RiseOutlined, SettingOutlined, CarOutlined, CreditCardOutlined, FolderOpenOutlined, FundViewOutlined } from '@ant-design/icons';

import {URLS} from "constant"
import { Link } from '@material-ui/core';
import AddForm from './AddForm';

const { SubMenu } = Menu;

export default function Sider(props) {

    const[state, setState] = useState({
        currentItem: {},
        isAddDrawerVisible: false,
    })
    const history = useHistory()

    function handleClick(data){
        history.push(URLS[data.key])
    }

    function handleAddClose(){
        setState(state => ({...state, isAddDrawerVisible: false}))
    }

    // function activeDrawerAjoutAttestation (e) {
    //     // e.preventDefault();
    //     window.location.href='/';
    //     //alert('Bonour');
    //     setTimeout(function(){ 
    //         localStorage.setItem('isAddDrawerVisible', true);
    //     }, 6000);
        
    // }

    return (
        <div>
            <div style={{
                width: "100%", 
                background: "#0174DF", 
                color: "white", 
                textAlign: "center",
                fontWeight: 700,
                padding: 10,
                fontSize: 17
            }}>
                DASHBOARD
            </div>

            <Menu
                onClick={handleClick}
                style={{ width: "100%" }}
                mode="inline"
            >
                <SubMenu key="attestation" icon={<CreditCardOutlined />} title="Attestations">
                    <Menu.Item key="newAttestation" onClick={() => setState(state => ({...state, isAddDrawerVisible: true}))}>Nouvelle attestation</Menu.Item>
                    <Menu.Item key="importation">Importer un document</Menu.Item>
                </SubMenu>

                <SubMenu key="lot" icon={<FolderOpenOutlined />} title="Lot d'attestations">
                    <Menu.Item key="lot">Liste des lots</Menu.Item>
                    {/* <Menu.Item key="#">Lots non archivés</Menu.Item> */}
                </SubMenu>

                <SubMenu key="reporting" icon={<FundViewOutlined />} title="Reporting">
                    <Menu.Item key="Reporting">Historique des attestations</Menu.Item>
                    {/* <Menu.Item key="lotHistory">Historique des lots</Menu.Item> */}
                </SubMenu>

                <SubMenu key="setting" icon={<SettingOutlined />} title="Paramètres">
                    <Menu.Item key="parametre">Acceder aux parametres</Menu.Item>
                </SubMenu>
            </Menu>
            {state.isAddDrawerVisible && (
                <AddForm
                    visible={state.isAddDrawerVisible} 
                    close={handleAddClose}
                />
            )}
        </div>
    );
}
