import React, { Component } from 'react';
import { Tabs, Card, Spin } from 'antd';
import { Table, Button, Modal, Input, message} from 'antd';
//import { api_getAssures, api_addAssures, api_getAssureurs, api_getUser } from '../urlApi';
import axios from "axios";
import Icon, { EditOutlined, DeleteOutlined, PlusOutlined, PrinterOutlined } from '@ant-design/icons';
//import { DataTable } from 'pages/Rapport/DataTable';
import {API_BASE_URL} from '../../constant'
//import DataTable from './DataTable';

class Parametre extends Component {

  state = {
      loading: false,
      visible: false,
      loadings: [],
      open: false,
      marques :false,
      listAssures: [],
      openModalForUpd: false,
      currentAssur: {},
      currentAssureur: {},
      openModal:false,
      isLoad: false,
      AssureursLoad: false,
      listAssureurs: [],
      openModalForUpdAssureurs: false,
      listUser: [],
      userLoad: false,
      openassureModalForDel: false,
      itemSelected: {},
      currentUser: {},
      currentMarque:{},
      listMarque : [],
      visibles: false,
      openModalForUpdAssure:false,
      openModalForUpdAssures:false
  };

 
  componentDidMount() {
    this.getAllAssures();
    this.getAllAssureurs();
    this.getAllUsers();
    this.getAllMarque();
    
}
openModal = (openModal) => {
  this.setState({openModal});
}
getAllAssures(){
  axios.get(API_BASE_URL  + '/assures')
      .then(res=>{
          console.log("response get Assures ", res);
          this.setState({listAssures: res.data, isLoad: true});
      });
}

getAllMarque(){
  axios.get(API_BASE_URL  + '/marque')
      .then(res=>{
          console.log("response get Marque ", res);
          this.setState({listMarque: res.data, isLoad: true});
      });
}

getAllUsers(){
  axios.get(API_BASE_URL  + '/users')
      .then(res=>{
          console.log("response get Utilisateur ", res);
          this.setState({listUser: res.data, isLoad: true});
      });
}

getAllAssureurs(){
  axios.get(API_BASE_URL  + '/assureurs')
    .then(res=>{
        console.log("response get Assureurs ", res);
        this.setState({listAssureurs: res.data, AssureursLoad: true});
    });
}

// Creer un assureur

CreateNewAssurreur = (e) => {
  e.preventDefault();
  const warning200 = () => {
    message.success('Succès','Enregistrement effectué avec succès !!!');
  };

  const warning = () => {
    message.warning('Erreur','Enregistrement echoué !!!');
  };

  const warning400 = () => {
    message.warning('Erreur coté client !!!');
  };
  const data = new FormData(e.target);
  var item = { 
    name:data.get('name'),
    username:data.get('username'),
    email:data.get('email'),
    password:data.get('password'),
  }

  console.log(item)
  
  let pword = document.getElementById("input_pword").value; 
    let confirme_pword = document.getElementById("input_confirme_pword").value;
    if (pword != confirme_pword){
        this.openNotificationWithIcon('error','Erreur','Mot de passe non identique!!!');
        console.log("mp1 " +pword+ "mp2" +confirme_pword);
        return ;
    }

  axios.post(API_BASE_URL  + '/auth/signup',item)
      .then(response => {
          console.log("Response d'ajout User ", response);
          if (response.data){
             warning200();
             this.openModal();
              this.setState({isLoad:true})
              this.getAllUsers();            
          }else
            warning();  
          this.openModal();
      })
      .catch(error=> {
          console.log(error);
          warning400();
      });
};

  selectCurrentItem = (item) =>{
    this.setState({currentItem:item})
    this.showModal(true)
  }

  //  Marque
  
  addMarque = (e) => {
    e.preventDefault(); 
    const warning200 = () => {
      message.success('Succès','Enregistrement effectué avec succès !!!');
    };
    const warning = () => {
      message.warning('Erreur','Enregistrement echoué !!!');
    };
    const warning400 = () => {
      message.warning('Erreur coté client !!!');
    };
    const data = new FormData(e.target);
    var item = { 
        name:data.get('marque'), 
        description:data.get('descriptionMarque'),     
    }
    console.log(item)
    axios.post(API_BASE_URL  + '/marque',item)
        .then(response => {
            console.log("Response de marque", response);
            if (response.data){
               warning200();
               this.hideModal1();
                this.setState({isLoad:true})
                this.getAllMarque();    
            }else
              warning();  
            this.hideModal1();
        })
        .catch(error=> {
            console.log(error);
            warning400();
        });
};

  addAssures = (e) => {
    e.preventDefault(); 
    const warning200 = () => {
      message.success('Succès','Enregistrement effectué avec succès !!!');
    };

    const warning = () => {
      message.warning('Erreur','Enregistrement echoué !!!');
    };

    const warning400 = () => {
      message.warning('Erreur coté client !!!');
    };
    const data = new FormData(e.target);
    var item = { 
        name:data.get('nomAssure'), 
        description:data.get('descriptionAssure'),
  
    }
    console.log(item)
    

    axios.post(API_BASE_URL  + '/assures',item)
        .then(response => {
            console.log("Response d'ajout ", response);
            if (response.data){
               warning200();
               this.hideAssuresModal();
                this.setState({isLoad:true})
                this.getAllAssures();
                
            }else
              warning();  

            this.hideAssuresModal();

        })
        .catch(error=> {
            console.log(error);
            warning400();
        });
};


addAssureurs = (e) => {
  e.preventDefault(); 
  const warning200 = () => {
    message.success('Succès','Enregistrement effectué avec succès !!!');
  };

  const warning = () => {
    message.warning('Erreur','Enregistrement echoué !!!');
  };

  const warning400 = () => {
    message.warning('Erreur coté client !!!');
  };
  const data = new FormData(e.target);
  var item = {  
      name:data.get('nomAssureur'), 
      description:data.get('descriptionAssureur'),
      address: data.get('address'),  
  }
  console.log(item)

  axios.post(API_BASE_URL  + '/assureurs',item)
      .then(response => {
          console.log("Response d'ajout assureur", response);
          if (response.data){
             warning200();
              this.setState({isLoad:false})
              this.getAllAssureurs();
              this.hideAssureursModal();
          }else
            warning();  

          this.hideAssureursModal();

      })
      .catch(error=> {
          console.log(error);
          warning400();
      });
};

//----------------OUVERTURE ET FERMETURE DES MODALES---------------
openAssuresModal = () => {
  this.setState({
      open: true,
  })
};
hideAssuresModal = () => {
    this.setState({
        open: false,
    })
}

  openModalMarque = () => {
  this.setState({
    marques: false,
  })
}

  openAssureursModal = () => {
    this.setState({visible: true});
};

  hideAssureursModal = () => {
    this.setState({visible: false});
};

closeModalForUp = () => {
    this.setState({openModalForUpd: false});
};

openModalUpdAssureurs = () => {
  this.setState({openModalForUpdAssureurs: true});
};

hideModalUpdAssureurs = () => {
  this.setState({openModalForUpdAssureurs: false});
};

openAssuresModal = () => {
  this.setState({
      open: true,
  })
};
hideAssuresModal = () => {
    this.setState({
        open: false,
    })
}

showModal = () => {
this.setState({
  visible: true,
});
};

openModalDeleteAssures = () => {
  this.setState({
      openassureModalForDel: true,
  })
}

closeModalDeleteAssures = () => {
  this.setState({
      openassureModalForDel: false,
  })
}

// FUNCTION UPDATE USER

updateData = e => {
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

  // const data = new FormData(e.target);
  // var data = { 
  //     id:data.ge('id'),
  //     marque:data.get('marque'),
  //     description:data.get('descriptionMarque'),
  // }
  console.log(data)
  let data = this.state.itemSelected
  console.log("Donneee des marques==>",data);
  axios.post(API_BASE_URL +'/users/upd',data, {
      headers: { Authorization: "Bearer" + localStorage.getItem('token')}
  })
      .then(response => {
          console.log(response);
          if (response.data){
            warning200();
            
              // this.openNotificationWithIcon('success','Succès','Modification effectuée avec succès !!!')
          }else
          warning();
              // this.openNotificationWithIcon('error','Erreur','Modification echouée !!!')

          this.openModalForUpd(false)
      })
      .catch(error=> {
          console.log(error);
          warning400();
          this.openModalForUpd(false)
          // this.openNotificationWithIcon('error','Erreur','Erreur coté client !!!')
      });
  }

handleChange = (e)  => {
  let {name, value} = e.target //
  this.setState(state => {
      const newState = { ...state, currentUser: {...state.currentUser, [name]:value}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
      return newState // Recuperation de la new valeur
  })
}

openModalForUpd(openModalForUpd){
  if (openModalForUpd){
      this.setState({openModalForUpd});
  }
  else{

      this.setState({openModalForUpd});
  }
}

selectForUpdate =(item)=>{
  this.setState({currentUser: item, openModalForUpd:true}) // Recuperation de la ligne
}

// FUCTION UPD ASSURER
updateDataAssure = e => {
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
  let newdata = this.state.itemSelected
  console.log(newdata);
  axios.post(API_BASE_URL + '/assure/upd',newdata, {
      headers: { Authorization: "Bearer" + localStorage.getItem('token')}
  })
      .then(response => {
          console.log(response);
          if (response.data){
            warning200();
              // this.openNotificationWithIcon('success','Succès','Modification effectuée avec succès !!!')
          }else
          warning();
              // this.openNotificationWithIcon('error','Erreur','Modification echouée !!!')

          this.openModalForUpdAssure(false)
      })
      .catch(error=> {
          console.log(error);
          warning400()
          this.openModalForUpdAssure(false)
          // this.openNotificationWithIcon('error','Erreur','Erreur coté client !!!')
      });
}
openModalForUpdAssure(openModalForUpdAssure){
  if (this.openModalForUpdAssure){
      this.setState({openModalForUpdAssure});
  }
  else{
      
      this.setState({openModalForUpdAssure});
  }
}

//======== Selectionner les valeurs et modifier dans le input ===
handleChange = (e)  => {
  let {name, value} = e.target //
  this.setState(state => {
      const newState = { ...state, currentAssur: {...state.currentAssur, [name]:value}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
      return newState // Recuperation de la new valeur
  })
}
// Comment la ligne
selectForUpdateAssure =(item)=>{
  this.setState({currentAssur: item, openModalForUpdAssure:true}) // Recuperation de la ligne 
  
}

//========================FUNCTION UPDATE ASSUREUR ===========================================
updateDataAssureurs = e => {
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
  let newdata = this.state.itemSelected
  console.log(newdata);
  axios.post(API_BASE_URL + '/assureur/upd',newdata, {
      headers: { Authorization: "Bearer" + localStorage.getItem('token')}
  })
      .then(response => {
          console.log(response);
          if (response.newdata){
            warning200();
            this.getAllAssureurs();
              // this.openNotificationWithIcon('success','Succès','Modification effectuée avec succès !!!')
          }else
            warning();
                // this.openNotificationWithIcon('error','Erreur','Modification echouée !!!')
            this.openModalForUpdAssures(false)
      })
      .catch(error=> {
          console.log(error);
            warning400();
            this.openModalForUpdAssures(false)
          // this.openNotificationWithIcon('error','Erreur','Erreur coté client !!!')
      });
}
openModalForUpdAssures(openModalForUpdAssures){
  if (openModalForUpdAssures){
      this.setState({openModalForUpdAssures});
  }
  else{
      
      this.setState({openModalForUpdAssures});
  }
}

//======== Selectionner les valeurs et modifier dans le input ===
handleChange = (e)  => {
  let {name, value} = e.target //
  this.setState(state => {
      const newState = { ...state, currentAssureur: {...state.currentAssureur, [name]:value}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
      return newState // Recuperation de la new valeur
  })
}
// Comment la ligne
selectForUpdateAssureurs =(item)=>{
  this.setState({currentAssureur: item, openModalForUpdAssureurs:true}) // Recuperation de la ligne 
  
}

 //========================FUNCTION UPDATE MARQUE ===========================================
 updateDataMarque = e => {
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
  var item = { 
      id:document.getElementById.value('idmarque'),
      marque:document.getElementById.value('marque'),
      description:document.getElementById.value('descriptionMarque')
  }
  // let newdata = this.state.itemSelected
  console.log(item);
  axios.post(API_BASE_URL + '/marque/upd',item, {
      headers: { Authorization: "Bearer" + localStorage.getItem('token')}
  })
      .then(response => {
          console.log(response);
          if (response.data){
            warning200();
            // this.getAllMarque();
              // this.openNotificationWithIcon('success','Succès','Modification effectuée avec succès !!!')
          }else
              // this.openNotificationWithIcon('error','Erreur','Modification echouée !!!')
            warning();
          this.openModalForUpdMarque(false)
      })
      .catch(error=> {
          console.log(error);
          warning400();
          // this.openNotificationWithIcon('error','Erreur','Erreur coté client !!!')
      });
}
openModalForUpdMarque(openModalForUpdMarque){
  if (openModalForUpdMarque){
      this.setState({openModalForUpdMarque});
  }
  else{
      this.setState({openModalForUpdMarque});
  }

}

//======== Selectionner les valeurs et modifier dans le input ===
handleChange = (e)  => {
  let {name, value} = e.target //
  this.setState(state => {
      const newState = { ...state, currentMarque: {...state.currentMarque, [name]:value}} // Ici je demande a me ramener les anciennes valeurs pour pouvoir l'ecrasser par la nouvelle valeur
      return newState // Recuperation de la new valeur
  })
}
// Comment la ligne
selectForUpdateMarque =(item)=>{
  this.setState({currentMarque: item, openModalForUpdMarque:true}) // Recuperation de la ligne 
  
}

//  MARQUE

  showModal1 = () => {
    this.setState({
      visibles: true,
    });
  };

  hideModal1 = () => {
    this.setState({
      visibles: false,
    });
  };

    render(){
      
      const {currentAssur, isLoad, AssureursLoad, listAssureurs, currentAssureur, itemSelected} = this.state;
        const { TabPane } = Tabs;

  
        return (
            <div className="container-fluid pl-4 m-0 text-left" style={{backgroundColor:"white"}}>

            <Tabs>
                <TabPane tab="Profil utilisateur" key="1">
                <div>
                      <div className="float-right">
                        <Button type="primary" onClick={this.openModal}>
                            <PlusOutlined style={{color:"white"}}/> Ajouter
                        </Button><br></br><br></br>
                      </div>

                      {isLoad?(
                      <table className='table table-striped' width='100%'>
                      
                        <thead>
                          <tr>
                            <th>IDENTIFIANT</th>
                            <th>NOM PRENOM</th>
                            <th>EMAIL</th>
                            {/* <th>ACTION</th> */}
                          </tr>
                        </thead>
                        <tbody>
                            {this.state.listUser.map((list, index)=>
                                    <tr key={index}>
                                      <td>{list.username}</td>
                                      <td>{list.name}</td>
                                      <td>{list.email}</td>
                                      {/* <td>
                                        <i class='far fa-edit' onClick={() =>this.selectForUpdate(list)}></i>
                                      </td> */}
                                    </tr>
                                    )}
                        </tbody>
                      </table>
                      ):(
                        <Spin/>
                      )
                      }
                  
                </div>
                </TabPane>
                <TabPane tab="Assurés" key="2">
                  <div>
                    <div className="float-right">
                        <Button type="primary" onClick={this.openAssuresModal}>
                          <PlusOutlined style={{color:"white"}}/> Ajouter
                        </Button><br></br><br></br>
                    </div>

                    {isLoad?(
                    <table className='table table-striped' width='100%'>
                   <thead>
                      <tr>
                        <th>IDENTIFIANT</th>
                        <th>DESCRIPTION</th>
                        {/* <th>ACTION</th> */}
                      </tr>
                    </thead>
                   <tbody>
                      {this.state.listAssures.map((list, index)=>
                              <tr key={index}>
                                <td>{list.name}</td>
                                <td>{list.description}</td>
                                {/* <td>
                                  <i class='far fa-edit' onClick={()=>this.selectForUpdateAssure(list)}></i>
                                </td> */}
                              </tr>
                              )}
                   </tbody>
                    </table>
                    ):(
                      <Spin/>
                    )}
                   
                   {/* {isLoad?(<Table dataSource={dataSource} columns={columns}/>):(<Spin/>)} */}
              
                  </div>
                </TabPane>
                <TabPane tab="Assureurs" key="3">
                    <div className='container-fluid p-0 m-0'>
                      <div>
                        <div className="float-right">
                          <Button type="primary" onClick={this.openAssureursModal}>
                              <PlusOutlined style={{color:"white"}}/> Ajouter
                          </Button><br></br><br/>
                        </div>
                          
                      {AssureursLoad?(
                          <table className='table table-striped'>
                            <thead>
                              <tr>
                                <th>NOM PRENOM</th>
                                <th>DESCRIPTION</th>
                                <th>ADRESSE</th>
                                {/* <th>ACTION</th> */}
                              </tr>
                            </thead>
                            <tbody>
                                {this.state.listAssureurs.map((assureurs, index)=>
                                  <tr key={index}>
                                    <td>{assureurs.name}</td>
                                    <td>{assureurs.description}</td>
                                    <td>{assureurs.address}</td>
                                    {/* <td>
                                        <i class='far fa-edit' onClick={()=>this.selectForUpdateAssureurs(assureurs)}></i>
                                    </td>                           */}
                                  </tr>
                                  )}
                            </tbody>
                            </table>
                              ):(
                                <Spin/>
                              )}

                       {/* {AssureursLoad?(<Table dataSource={dataSourceAssureurs} columns={columnsAssureurs} scroll={{ x:1300}}/>):(<Spin/>)} */}
                      </div>
                    </div>
                </TabPane>
                <TabPane tab="Marque" key="4">
                  <div>
                    <div className="float-right">
                        <Button type="primary" onClick={this.showModal1}>
                          <PlusOutlined style={{color:"white"}}/> Ajouter
                        </Button><br></br><br></br>
                    </div>
                    {isLoad?(
                    <table className='table table-striped' width='100%'>
                      <thead>
                          <tr>
                            <th>NOM</th>
                            <th>DESCRIPTION</th>
                            {/* <th>ACTION</th> */}
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.listMarque.map((marque, index)=>
                                  <tr key={index}>
                                    <td>{marque.name}</td>
                                    <td>{marque.description}</td>
                                    {/* <td>
                                        <i class='far fa-edit' onClick={()=>this.selectForUpdateMarque(marque)}></i>
                                    </td> */}
                                  </tr>
                                  )}
                      </tbody>
                    </table>
                    ):(
                      <Spin/>
                    )}
                   
                   {/* {isLoad?(<Table dataSource={dataSource} columns={columns}/>):(<Spin/>)} */}
              
                  </div>
                </TabPane>
                <br/>
            </Tabs>
              {/* ==================== MODAL AJOUT ==================== */}
                <Modal title="Ajout d'un nouvel Assuré !" centered visible={this.state.open}
                       onOk={this.hideAssuresModal}
                       onCancel={this.hideAssuresModal}
                       footer={[ ]}>
                           
                    <form onSubmit={this.addAssures}>
                      <div>
                          <div className="form-row">
                              <div className=" col-md-6">
                                  <label className="text-secondary mt-1" style={{float: "left", marginBottom: "-1px"}}><strong>NOM :</strong></label><br/>
                                  <Input type="text" placeholder="Nom de l'assuré" name="nomAssure" className="form-control form-control-sm flex-right"/>
                              </div><br/>
                              <div className=" col-md-6">
                                  <label className="text-secondary mt-1" style={{float: "left", marginBottom: "-1px"}}><strong>DESCRIPTION :</strong></label><br/>
                                  <Input type="text" placeholder="Description" name="descriptionAssure" className="form-control form-control-sm flex-right" style={{width: '100%'}}/>
                              </div><br/>
                          </div>
                      </div><br></br><br></br>
                        <div className="text-right w-100">
                            <Button onClick={this.hideAssuresModal}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit">
                                Ajouter
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* ==================== MODAL AJOUT ASSUREUR ==================== */}
                <Modal title="Ajout d'un nouvel Assureur !" centered visible={this.state.visible}
                       onOk={this.hideAssureursModal}
                       onCancel={this.hideAssureursModal}
                       footer={[ ]}>
                           
                    <form onSubmit={this.addAssureurs}>
                      <div>
                          <div className="form-row">
                              
                                  <label className="text-secondary mt-1" style={{float: "left", marginBottom: "-1px"}}><strong>NOM PRENOM :</strong></label><br/>
                                  <Input type="text" placeholder="Nom de l'assureur" name="nomAssureur" className="form-control form-control-sm flex-right" style={{width: '100%'}}/>
                              <br/><br/><br/>
                                  <label className="text-secondary mt-1" style={{float: "left", marginBottom: "-1px"}}><strong>DESCRIPTION :</strong></label><br/>
                                  <Input type="text" placeholder="Description" name="descriptionAssureur" className="form-control form-control-sm flex-right" style={{width: '100%'}}/>
                              <br/><br/><br/>
                                  <label className="text-secondary mt-1" style={{float: "left", marginBottom: "-1px"}}><strong>ADRESSE :</strong></label><br/>
                                  <Input type="text" placeholder="Adresse" name="address" className="form-control form-control-sm flex-right" style={{width: '100%'}}/>
                              <br/>
                          </div>
                      </div><br></br><br></br>
                        <div className="text-right w-100">
                            <Button onClick={this.hideAssureursModal}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit" >
                                Ajouter
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* ==================== MODAL FOR ADD USER==================== */}
                <Modal title="Nouvel enregistrement assuré !" centered visible={this.state.openModal}
                       onOk={()=> this.openModal(false)}
                       onCancel={()=> this.openModal(false)}
                       footer={[ ]}>
                    <form onSubmit={this.CreateNewAssurreur}>
                        <div className="container">
                            <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong> IDENTIFIANT : </strong></label>
                                    <input value={this.state.currentUser.username} name="username" type="text" placeholder="Entrez l'identifiant" className="form-control form-control-sm" required/>
                                </div>
                            </div>
                            <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong>NOM PRENOM(S) : </strong></label>
                                    <input value={this.state.currentUser.name} name="name" type="text" placeholder="Saisissez le nom" className="form-control form-control-sm" required/>
                                </div>
                            </div>
                            <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong> EMAIL : </strong></label>
                                    <input value={this.state.currentUser.email} name="email" type="email" placeholder="monemail@gmail.com" className="form-control form-control-sm"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col form-group">
                                    <label><strong> MOT DE PASSE : </strong></label>
                                    <input id="input_pword" name="anpassword" type="password" placeholder="Entrez le mot de passe" className="form-control form-control-sm" required/>
                                </div>
                                <div className="col form-group">
                                    <label><strong> CONFIRMER MOT DE PASSE : </strong></label>
                                    <input id="input_confirme_pword" name="password" type="password" placeholder="Confirmez le mot de passe" className="form-control form-control-sm" required/>
                                </div>
                            </div>
                        </div>
                        <div className="text-right w-100">
                            <Button onClick={()=> this.openModal(false)}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit">
                                Ajouter
                            </Button>
                        </div>
                    </form>
                </Modal>
                  
                {/* ======================= ADD MARQUE ========================== */}             
                <Modal title="Ajout de Marque !" centered 
                      //  visible={this.state.open}
                       onOk={this.hideModal1}
                       onCancel={this.hideModal1}
                       footer={[ ]}
                       visible={this.state.visibles}
                       >
                           
                    <form onSubmit={this.addMarque}>
                      <div>
                          <div className="form-row">
                              <div className=" col-md-6">
                                  <label className="text-secondary mt-1" style={{float: "left", marginBottom: "-1px"}}><strong>NOM :</strong></label><br/>
                                  <Input type="text" placeholder="Saisissez la marque" name="marque" className="form-control form-control-sm flex-right"/>
                              </div><br/>
                              <div className=" col-md-6">
                                  <label className="text-secondary mt-1" style={{float: "left", marginBottom: "-1px"}}><strong>DESCRIPTION :</strong></label><br/>
                                  <Input type="text" placeholder="Description" name="descriptionMarque" className="form-control form-control-sm flex-right" style={{width: '100%'}}/>
                              </div><br/>
                          </div>
                      </div><br></br><br></br>
                        <div className="text-right w-100">
                            <Button onClick={this.hideModal1}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit">
                                Ajouter
                            </Button>
                        </div>
                    </form>
                </Modal>
                {/* ==================MODAL UPDATE==================== */}

                {/* ============ UPDATE USER=================== */}

                <Modal title="Update User!" centered visible={this.state.openModalForUpd}
                       onOk={()=> this.openModalForUpd(false)}
                       onCancel={()=> this.openModalForUpd(false)}
                       footer={[ ]}>
                    <form onSubmit={this.updateData}>

                    <div className="containeraa text-left">
                            {/* <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong> IDENTIFIANT : </strong></label>
                                    <input name="username" type="text" value={this.state.currentUser.username} onChange={this.handleChange} className="form-control form-control-sm" required/>
                                </div>
                            </div> */}
                            <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong> NOM PRENOM : </strong></label>
                                    <input name="name" type="text" value={this.state.currentUser.name} onChange={this.handleChange} className="form-control form-control-sm" required/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col form-group">
                                    <label><strong> EMAIL : </strong></label>
                                    <input  name="email" value={this.state.currentUser.email} onChange={this.handleChange} type="email" className="form-control form-control-sm" required />
                                </div>
                            </div>
                            {/* <div className="form-row">
                                <div className="col form-group">
                                    <label><strong> ANCIEN MOT DE PASSE : </strong></label>
                                    <input id="input_pword" name="ancienpword" value={this.state.currentUser.ancienpword} onChange={this.handleChange} type="password" className="form-control form-control-sm" required />
                                </div>
                            </div> */}
                            <div className="form-row">
                                <div className="col form-group">
                                    <label><strong>NOUVEAU MOT DE PASSE : </strong></label>
                                    <input id="input_pword" name="pword" value={this.state.currentUser.pword} onChange={this.handleChange} type="password" className="form-control form-control-sm" required />
                                </div>
                                <div className="col form-group">
                                    <label><strong> CONFIRMER MOT DE PASSE : </strong></label>
                                    <input id="input_confirme_pword" name="pword2" value={this.state.currentUser.pword2} onChange={this.handleChange} type="password" className="form-control form-control-sm" required />
                                </div>
                            </div>
                        </div>
                        <div className="text-right w-100">
                            <Button onClick={()=> this.openModalForUpd(false)}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit">
                                Modifier
                            </Button>
                        </div>
                    </form>
                </Modal>
        

                {/* =============== UPD USERER =====================*/}

                <Modal title="Update Assure!" centered visible={this.state.openModalForUpdAssure}
                       onOk={()=> this.openModalForUpdAssure(false)}
                       onCancel={()=> this.openModalForUpdAssure(false)}
                       footer={[ ]}>
                    <form onSubmit={this.updateDataAssure}>
                        <div className="containeraa text-left">
                            <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong> IDENTIFIANT : </strong></label>
                                    <input name="name" value={this.state.currentAssur.name} onChange={this.handleChange} type="text" className="form-control form-control-sm" required />
                                </div>
                            </div>
                            <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong> DESCRIPTION : </strong></label>
                                    <input name="description" type="text" value={this.state.currentAssur.description} onChange={this.handleChange} className="form-control form-control-sm" required />
                                </div>
                            </div>
                        </div>
                        <div className="text-right w-100">
                            <Button onClick={()=> this.openModalForUpdAssure(false)}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit">
                                Modifier
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* ====== UPD ASSUUREUR */}

                <Modal title="Update Assureur!" centered visible={this.state.openModalForUpdAssures}
                       onOk={()=> this.openModalForUpdAssures(false)}
                       onCancel={()=> this.openModalForUpdAssures(false)}
                       footer={[ ]}>
                    <form onSubmit={this.updateDataAssureurs}>
                        <div className="containeraa text-left">
                            <div className="form-row" >
                                <div className="col form-group">
                                    <label><strong> IDENTIFIANT : </strong></label>
                                    <input name="name" value={this.state.currentAssureur.name} onChange={this.handleChange} type="text" className="form-control form-control-sm" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col form-group">
                                    <label><strong> DESCRIPTION : </strong></label>
                                    <input name="description" value={this.state.currentAssureur.description} onChange={this.handleChange} type="text" className="form-control form-control-sm" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col form-group">
                                    <label><strong> ADRESSE : </strong></label>
                                    <input name="address" value={this.state.currentAssureur.address} onChange={this.handleChange} type="text" className="form-control form-control-sm" required />
                                </div>
                            </div>
                        </div>
                        <div className="text-right w-100">
                            <Button onClick={()=> this.openModalForUpdAssures(false)}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit">
                                Modifier
                            </Button>
                        </div>
                    </form>
                </Modal>
        
                {/* ======================== UPD MARQUES ================ */}
                
                <Modal title="Update Marque!" centered visible={this.state.openModalForUpdMarque}
                       onOk={()=> this.openModalForUpdMarque(false)}
                       onCancel={()=> this.openModalForUpdMarque(false)}
                       footer={[ ]}>
                    <form onSubmit={this.updateDataMarque}>
                        <div className="containeraa text-left">
                            <div className="form-row" >
                                <div className="col form-group">
                                  {/* <input disabled="true" id="idmarque" value={this.state.currentMarque.id}></input> */}
                                    <label><strong> IDENTIFIANT : </strong></label>
                                    
                                    <input id="name" name="name" value={this.state.currentMarque.name} onChange={this.handleChange} type="text" className="form-control form-control-sm" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col form-group">
                                    <label><strong> DESCRIPTION : </strong></label>
                                    <input id="description" name="description" value={this.state.currentMarque.description} onChange={this.handleChange} type="text" className="form-control form-control-sm" required />
                                </div>
                            </div>
                        </div>
                        <div className="text-right w-100">
                            <Button onClick={()=> this.openModalForUpdMarque(false)}>
                                Annuler
                            </Button> &nbsp;
                            <Button type="primary" htmlType="submit">
                                Modifier
                            </Button>
                        </div>
                    </form>
                </Modal>
        </div>
        );
        }
    }
  


export default Parametre;
