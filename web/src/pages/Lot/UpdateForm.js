import React, { useState, useEffect } from 'pages/Lot/node_modules/react';

import useMediaQuery  from 'pages/Lot/node_modules/useMediaQuery';
import { Drawer, Form, Select, Button, Col, Row, Input, Modal, Upload, notification } from 'pages/Lot/node_modules/antd';
import ImgCrop from 'pages/Lot/node_modules/antd-img-crop';

import { GET_USERS_FILES_CTR,STATUS_CODE_REST_API, USERS_ROLE } from 'pages/Lot/node_modules/constant';
import { exeRequestFinal, exeRequest } from 'pages/Lot/node_modules/util/APIUtils';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function UpdateForm(props) {
  const {currentItem} = props

  const [state, setState] = useState({
    loading: false,
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [{
      url : GET_USERS_FILES_CTR + currentItem.username + ".png", 
      uid: props.currentItem.id, 
      name: 'image.png',
      status: 'done' 
    }],
    roles: []
  })

  const [form] = Form.useForm();
  
  useEffect(() => {
    setState(state => ({...state, isLoading: true }));
    
    exeRequest("/roles", "GET", null, function(response){
      setState(state => ({
        ...state, 
        isLoading: false,
        roles: response || []
      }));
    }, this)
  }, [])

  function handleClose(user){
    props.close(user);
  }

  function onFinish(values){
    let objRequest = Object.assign({}, values);

    if(state.fileList.length > 0){
      const jPhoto = {photo : state.fileList[0].thumbUrl ? state.fileList[0].thumbUrl.split(",")[1] : ''};
      // const jPhoto = {photo : state.fileList[0].status !== "done" ? state.fileList[0].thumbUrl.split(",")[1] : null};
      objRequest = Object.assign({}, jPhoto, objRequest);
    }            
    
    setState(state => ({...state, loading: true}))

    exeRequestFinal("/users", "PUT", objRequest, function (response) {
      if (response.statusCode === STATUS_CODE_REST_API[1].code) {
        notification.success({
          message: 'Mediassur App',
          description: 'utilisateur enregistré avec succès'
        });

        handleClose(values);

      }else{
        setState(state => ({...state, loading: false}))
        
        const description = response.statusCode === STATUS_CODE_REST_API[3].code ? 
          response.message : "Erreur lors de l'enregistrement de l'utilisateur "

        notification.error({
          message: 'Mediassur App',
          description: description
        });
      }
    }, function (response) {
      setState(state => ({...state, loading:false}))

      notification.error({
        message: 'Mediassur App',
        description: response
      });
    }, this)
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

  return (
    <>
      <Drawer
        title={`${currentItem.name}`}
        width={colSize == "xs" ? 300 : colSize == "sm" ? 400 : 720}
        onClose={() => handleClose()}
        visible={props.visible}
        bodyStyle={{ paddingBottom: 80}}
      >
        <div style={{marginBottom: -50}}>
          <ImgCrop rotate>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={state.fileList}
              onChange={handleImgChange}
              onPreview={handlePreview}
            >
              {state.fileList.length < 1 && 
                <div>
                  <PlusOutlined />
                  <div className="ant-upload-text">Photo</div>
                </div>
              }
            </Upload>
          </ImgCrop>

          <Modal
            visible={state.previewVisible}
            title={state.previewTitle}
            footer={null}
            onCancel={handleCloseModal}
          >
            <img alt="example" style={{ width: '100%' }} src={state.previewImage} />
          </Modal>
        </div>
        
        <Form layout="vertical" hideRequiredMark form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="id" initialValue={currentItem.id}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item name="status" initialValue={currentItem.status}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item name="roleId" initialValue={currentItem.roleId}>
            <Input type="hidden" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: 'Veuillez saisir le code' }]}
                initialValue={currentItem.code}
              >
                <Input placeholder="Veuillez saisir le code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Nom complet"
                rules={[{ required: true, message: 'Veuillez saisir votre nom complet' }]}
                initialValue={currentItem.name}
              >
                <Input placeholder="Veuillez saisir votre nom complet" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Login"
                rules={[{ required: true, message: 'Veuillez saisir le login' }]}
                initialValue={currentItem.username}
              >
                <Input placeholder="Veuillez saisir le login" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: 'Veuillez selectionner le role' }]}
                initialValue={currentItem.roleId}
              >
                <Select placeholder="Veuillez selectionner le role">
                  {state.roles.map(( m, index) => (
                    <Option key={m.id} value={m.id}>{m.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="phone"
                label="Téléphone"
                rules={[{ required: true, message: 'Veuillez saisir le téléphone' }]}
                initialValue={currentItem.phone}
              >
                <Input
                  style={{ width: '100%' }}
                  addonBefore="+225"
                  placeholder="Veuillez saisir le téléphone"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Veuillez saisir l'email" },
                  {type: 'email', message: "Votre email valide"},
                ]}
                initialValue={currentItem.email}
              >
                <Input placeholder="Veuillez saisir l'email" />
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

export default UpdateForm