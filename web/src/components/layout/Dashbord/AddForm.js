import React, { useState, useEffect } from 'react';

import useMediaQuery  from 'use-media-antd-query';
import { Drawer, Form, Select, Button, Col, Row, Input, Modal, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

import { STATUS_CODE_REST_API, USERS_ROLE } from 'constant';
import { exeRequestFinal, exeRequest } from 'util/APIUtils';
import axios from 'axios';
import {API_BASE_URL} from '../../../constant'

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
  })

  const [form] = Form.useForm();
  
  useEffect(() => {
    setState(state => ({...state, isLoading: true }));

    getAllLots();
 
  }, [])
  useEffect(() => {
    setState(state => ({...state, isLoading: true }));

    getMarque();

  }, [])

  function getMarque(){
    axios.get(API_BASE_URL  + '/marque')
      .then(res=>{
        //console.log('response de marque ', res.data);
        setState(state => ({
          ...state, 
          isLoading: false,
          marque: res.data || []
        }));
      });
  }

  function getAllLots(){
    axios.get(API_BASE_URL  + '/lots')
      .then(res=>{
        //console.log('response de lots ', res);
        //localStorage.setItem('lotsAddForm', JSON.stringify(res.data))
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
      assure: objRequest.assure,
      genre: objRequest.genre,
      immatriculation: objRequest.immatriculation,
      lotId: objRequest.lot_id,
      marque: objRequest.marque,
      usage: objRequest.usage,
      statusCedeao: 0,
      statusJaune: 0,
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

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState(state => ({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    }));
  }

  const handleImgChange = ({ fileList }) => {
    setState(state => ({...state, fileList}));
  }
  
  const colSize = useMediaQuery();
  //const lot = state.lots;

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
            {/* <img alt="example" style={{ width: '100%' }} src={state.previewImage} /> */}
          </Modal>)
        }
        
        <Form layout="vertical" hideRequiredMark form={form} name="control-hooks" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="numeroPolice"
                label="Numero de police"
                rules={[{ required: true, message: 'Veuillez saisir le numero de police' }]}
              >
                <Input placeholder="Veuillez saisir le numero de police" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assure"
                label="Assuré"
                rules={[{ required: true, message: 'Veuillez saisir le nom de l\'assuré' }]}
              >
                <Input placeholder="Veuillez saisir le nom de l'assuré" />
              </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="assureur"
                    label="Assureur"
                    rules={[{ required: true, message: 'Veuillez saisir votre assureur' }]}
                  >
                    {/* <Select placeholder="Veuillez selectionner votre assureur">
                      {state.lots.map(( m, index) => (
                        <Option key={m.id} value={m.id}>{m.assureur}</Option>
                      ))}
                    </Select> */}
                    <Input placeholder="Veuillez saisir votre assureur" />
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="marque"
                label="Marques"
                rules={[{ required: true, message: 'Veuillez selectionner une marque' }]}
              >
                  <Select placeholder="Veuillez selectionner la marque">
                  {/* <Option value="Volvo">Volvo</Option> */}
                      {state.marque.map(( m, index) => (
                        <Option key={m.name} value={m.name}>{m.name}</Option>
                      ))}
                  </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="immatriculation"
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
                    label="Usage"
                    rules={[{ required: true, message: 'Veuillez selectionner l\'usage' }]}
                  >
                    <Input placeholder="Veuillez selectionner l'usage" />
                    {/* <Select placeholder="Veuillez selectionner l'usage">
                      {state.roles.map(( m, index) => (
                        <Option key={m.id} value={m.id}>{m.name}</Option>
                      ))}
                    </Select> */}
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Genre"
                    name="genre"
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
                    label="Date debut"
                    rules={[{ required: true, message: 'Debut periode de marge' }]}
                    htmlFor="startDate"
                  >
                    <Input id="startDate" type="date" placeholder="jj/mm/aaaa" />
                    {/* <Select placeholder="Veuillez selectionner l'usage">
                      {state.roles.map(( m, index) => (
                        <Option key={m.id} value={m.id}>{m.name}</Option>
                      ))}
                    </Select> */}
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Date fin"
                    name="endDate"
                    rules={[{ required: true, message: 'Fin periode de marge' }]}
                    htmlFor="endDate"
                  >
                  <Input id="endDate" type="date" placeholder="jj/mm/aaaa" />
                </Form.Item>
            </Col>
          </Row>
          
          {/* <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="N° police du lot"
                label="N° de police du lot"
                rules={[{ required: true, message: 'Veuillez saisir le n° de police du lot' }]}
              >
                <Input placeholder="Veuillez saisir le n° de police du lot" />
              </Form.Item>
            </Col>
          </Row> */}

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
