import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Component } from 'react';

const { SubMenu } = Menu;

class Sider extends Component {
  // submenu keys of first level
  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

  state = {
    openKeys: ['sub1'],
    currentItem: {},
    isAddDrawerVisible: false,
  };

 history = useHistory()

 handleClick = (data)=>{
    history.push(URLS[data.key])
}

 handleAddClose =()=>{
    this.setState(state => ({...state, isAddDrawerVisible: false}))
}

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  
  render() {
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
            mode="inline"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            style={{ width: 256 }}
        >
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>Navigation One</span>
            </span>
          }
        >
          <Menu.Item key="1">Option 1</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
      </Menu>
        {/* <Menu
            onClick={handleClick}
            style={{ width: "100%"}}
            mode="inline"
            // openkeys={state.openkeys}
            // onOpenChange= {onOpenChange}
        >
            <SubMenu key="attestation" icon={<CreditCardOutlined />} title="Attestations">
                <Menu.Item key="newAttestation" onClick={() => setState(state => ({...state, isAddDrawerVisible: true}))}>Nouvelle attestation</Menu.Item>
                <Menu.Item key="importation">Importer un document</Menu.Item>
            </SubMenu>

            <SubMenu key="lot" icon={<FolderOpenOutlined />} title="Lot d'attestations">
                <Menu.Item key="lot">Liste des lots</Menu.Item>
            </SubMenu>

            <SubMenu key="reporting" icon={<FundViewOutlined />} title="Reporting">
                <Menu.Item key="Reporting">Historique des attestations</Menu.Item>
            </SubMenu>

            <SubMenu key="setting" icon={<SettingOutlined />} title="Paramètres">
                <Menu.Item key="parametre">Acceder aux parametres</Menu.Item>
            </SubMenu>
        </Menu> */}
        {state.isAddDrawerVisible && (
            <AddForm
                visible={state.isAddDrawerVisible} 
                close={handleAddClose}
            />
        )}
    </div>
      
    );
  }
}

export default Sider;