import React, { useState, useEffect } from 'react';
import useMediaQuery  from 'use-media-antd-query';
import { Drawer, Form, Select, Button, Col, Row, Input, Modal, Upload, notification, DatePicker } from 'antd';
import { PlusOutlined, SelectOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import moment from 'moment';
import { STATUS_CODE_REST_API, USERS_ROLE } from 'constant';
import { exeRequestFinal, exeRequest } from 'util/APIUtils';
import axios from 'axios';
import {API_BASE_URL} from '../../../constant'
import { getSLot } from 'services/sans lot';
//import { getLot, getLots } from 'services/lot';

const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function AddForm(props) {
  const [state, setState] = useState({
    loading: false,
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    lots : [],
    marque : [],
    listAssureurs: [], 
    listAssures: [],
    date: {
      startValue: new Date().add(1, 'd'),
      endValue: new Date().add(1, 'd'),
      endOpen: false,
    },
    allowClear : false

  })

  const [form] = Form.useForm();
  
  useEffect(() => {
    setState(state => ({...state, isLoading: true }));

    getAllLots();
    getSLot();
    getAssures();
    getAssureurs();
    getMarque();
    //getLots();
 
  }, [])

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

  function getSlot(){
    axios.get(API_BASE_URL  + '/attestations/sans_lot')
      .then(res=>{
        setState(state => ({
          ...state, 
          isLoading: false,
          lots: res.data || []
        }));
      });
  }

  function getAllLots(){
    axios.get(API_BASE_URL  + '/lots')
      .then(res=>{
        setState(state => ({
          ...state, 
          isLoading: false,
          lots: res.data || []
        }));
      });
  }

  function handleClose(user){
    props.close(user);
  }


    function onFinish(values){
    let objRequest = Object.assign({}, values);
    objRequest.status = 1;
    let lot={
      assureur: objRequest.assureur,
      assureurAddress: objRequest.assureurAddress,
      numeroPolice: objRequest.numeroPolice,
      assure: objRequest.assure,
      genre: objRequest.genre,
      immatriculation: objRequest.immatriculation,
      lotId: objRequest.lot_id,
      marque: objRequest.marque,
      usage: objRequest.usage,
      statusCedeao: 0,
      statusJaune: 0,
      startDate: getDate(values.startDate),
      endDate: getDate(values.endDate),
    };
    
    console.log('element saisi ', lot);
    // console.log('list lots ', state.lots);
    axios.post(API_BASE_URL + "/attestations", lot)
      .then(response => {
          //console.log("Response d'ajout d'attestation", response);
          if (response.data){
            notification.success({
              message: 'Mediassur App',
              description: 'Enregistrement effectué avec succès !!!'
            }); 
            handleClose();
            getAllLots();
            getSLot()
            window.location.href="/"          
          }else
          notification.warning({
            message: 'Mediassur App',
            description: 'Enregistrement echoué !!!'
          });  
          handleCloseModal();
          // this.hideAssureursModal();
      })
      .catch(error=> {
          console.log(error);
          notification.warning({
                  message: 'Mediassur App',
                  description: 'Erreur cote client'
                });
     });

    }

  function handleCloseModal(){
    setState(state => ({...state, previewVisible: false }));
  } 

  const handleStartDateOpenChange = open => {
    if (!open) {
      setState(state => ({...state, date: { ...state.date, endOpen: true }}));
    }
  };

  const handleEndDateOpenChange = open => {
    setState(state => ({...state, date: { ...state.date, endOpen: open }}));
  };

  const getDate = (date) => {
    return new Date(date._d).toISOString()
  }

  const initDate = () => {
    const dateFormat = "DD-MM-YYYY"
    return  moment(new Date().add(1, 'd'), dateFormat)
  }


  
  const colSize = useMediaQuery();

  return (
    <>
      <Drawer
        title="Ajouter une attestation"
        width={colSize == "xs" ? 300 : colSize == "sm" ? 400 : 720}
        onClose={() => handleClose()}
        visible={props.visible}
        bodyStyle={{ paddingBottom: 80}}
      >

        {state.previewVisible && (
          <Modal
              visible={state.previewVisible}
              title={state.previewTitle}
              footer={null}
              onCancel={handleCloseModal}
            >
          </Modal>)
        }   
        <Form layout="vertical" hideRequiredMark form={form} name="control-hooks" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="numeroPolice"
                id="numeroPolice"
                label="Numero de police"
                rules={[{ required: true, message: 'Veuillez saisir le numero de police' }]}
              >
                <Input placeholder="Veuillez saisir le numero de police" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assureurAddress"
                id="assureurAddress"
                label="Address"
                rules={[{ required: true, message: 'Veuillez saisir address' }]}
              >
                <Input placeholder="Veuillez saisir l'address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assure"
                id="assure"
                label="Assure"
                rules={[{ required: true, message: 'Veuillez selectionner le nom de l\'assuré' }]}
              >
              
                <Select placeholder="Veuillez selectionner le nom de l'assuré" >
                      {state.listAssures.map(( m, index) => (
                        <Option key={m.name} value={m.name}>{m.name}</Option>
                      ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    id="assureurId"
                    name="assureur"
                    label="Assureur"
                    rules={[{ required: true, message: 'Veuillez saisir votre assureur' }]}
                  >
                     <Select placeholder="Veuillez selectionner votre assureur">
                        {state.listAssureurs.map(( m, index) => (
                          <Option key={m.name} value={m.name}>{m.name}</Option>
                        ))}
                    </Select>
          
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="marque"
                id="marque"
                label="Marques"
                rules={[{ required: true, message: 'Veuillez selectionner une marque' }]}
              >
                  <Select placeholder="Veuillez selectionner la marque">
                      {state.marque.map(( m, index) => (
                        <Option key={m.name} value={m.name}>{m.name}</Option>
                      ))}
                  </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="immatriculation"
                  id="immatriculation"
                  label="Immatriculation"
                  rules={[{ required: true, message: 'Veuillez saisir le matricule' }]}
                >
                  <Input placeholder="Veuillez saisir le matricule" />
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    name="usage"
                    id="usage"
                    label="Usage"
                    rules={[{ required: true, message: 'Veuillez selectionner l\'usage' }]}
                  >
                    <Select placeholder="Veuillez selectionner l'usage">
                      <Option key="Engin mobile de chantier" value="Engin mobile de chantier">Engin mobile de chantier</Option>
                      <Option key="Promenade et Affaires" value="Promenade et Affaires">Promenade et Affaires</Option>
                      <Option key="Transport pour propre compte" value="Transport pour propre compte">Transport pour propre compte</Option>
                      <Option key="Transport privé de marchandises" value="Transport privé de marchandises">Transport privé de marchandises</Option>
                      <Option key="Transport privé de personnel" value="Transport privé de personnel">Transport privé de personnel</Option>
                      <Option key="Transport public de marchandises" value="Transport public de marchandises">Transport public de marchandises</Option>
                      <Option key="Véhicules motorisés à 2 ou 3 roues" value="Véhicules motorisés à 2 ou 3 roues">Véhicules motorisés à 2 ou 3 roues</Option>
                      <Option key="Véhicules spéciaux" value="Véhicules spéciaux">Véhicules spéciaux</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Genre"
                    name="genre"
                    id="genre"
                    rules={[{ required: true, message: 'Veuillez saisir le genre' }]}
                  >
                  <Input placeholder="Veuillez saisir le genre" />
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    name="startDate"
                    id="startDate"
                    label="Date debut"
                    rules={[{ required: true, message: 'Debut periode de marge' }]}
                    htmlFor="startDate"
                    initialValue={initDate()}
                  >
                    <DatePicker
                      style={{width: '100%'}}
                      placeholder="Début"
                      allowClear={false}
                      onOpenChange={handleStartDateOpenChange}
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Date fin"
                    id="endDate"
                    name="endDate"
                    rules={[{ required: true, message: 'Fin periode de marge' }]}
                    htmlFor="endDate"
                    initialValue={initDate()}
                  >
                    <DatePicker
                      style={{width: '100%'}}
                      placeholder="Fin"
                      allowClear={false}
                      onOpenChange={handleEndDateOpenChange}
                    />
                </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >  
            <Button onClick={() => handleClose()} style={{ marginRight: 8 }}>
              Annuler
            </Button>
            <Button
              loading={state.loading} 
              htmlType="submit" type="primary"
            >
              Enregistrer
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
}

export default AddForm
