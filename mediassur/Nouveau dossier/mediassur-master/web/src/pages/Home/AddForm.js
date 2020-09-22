import React, { useState, useEffect } from 'react';

import useMediaQuery  from 'use-media-antd-query';
import { Drawer, Form, Select, Button, Col, Row, Input, Modal, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

import { STATUS_CODE_REST_API, USERS_ROLE } from 'constant';
import { exeRequestFinal, exeRequest } from 'util/APIUtils';

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
    roles : [],
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
      const jPhoto = {photo : state.fileList[0].thumbUrl.split(",")[1]};
      objRequest = Object.assign({}, jPhoto, objRequest);
    }            
    
    setState(state => ({...state, loading: true}))

    exeRequestFinal("/users", "POST", objRequest, function (response) {
      if (response.statusCode == STATUS_CODE_REST_API[1].code) {
        notification.success({
          message: 'Mediassur App',
          description: 'utilisateur enregistré avec succès'
        });

        handleClose(values);

      }else{
        setState(state => ({...state, loading: false}))
        
        const description = response.statusCode == STATUS_CODE_REST_API[3].code ? 
          response.message : "Erreur lors de l'enregistrement de l'utilisateur"

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
        title="Ajouter une attestation"
        width={colSize == "xs" ? 300 : colSize == "sm" ? 400 : 720}
        onClose={() => handleClose()}
        visible={props.visible}
        bodyStyle={{ paddingBottom: 80}}
      >
        {/* <ImgCrop rotate>
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
        </ImgCrop> */}

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
                name="assure"
                label="Assuré"
                rules={[{ required: true, message: 'Veuillez saisir le nom de l\'assuré' }]}
              >
                <Input placeholder="Veuillez saisir le nom de l'assuré" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="marque"
                label="Marques"
              >
                <select className="flex-left" id="marque" style={{width:'100%', height:'32px'}}>
                    <option>Abarth</option>
                    <option>Alfa Romeo</option>
                    <option>Alpine</option>
                    <option>Artega</option>
                    <option>Aston Martin</option>
                    <option>Audi</option>
                    <option>Bentley</option>
                    <option>Bmw</option>
                    <option>Bmw Alpine</option>
                    <option>Cadillac</option>
                    <option>Caterham</option>
                    <option>Chevrolet</option>
                    <option>Chrysler</option>
                    <option>Citroën</option>
                    <option>Cupra</option>
                    <option>Dacia</option>
                    <option>Daihatsu</option>
                    <option>Dodge</option>
                    <option>Donkervoort</option>
                    <option>Ferrari</option>
                    <option>Fiat</option>
                    <option>Ford</option>
                    <option>Genesis</option>
                    <option>Honda</option>
                    <option>Hummer</option>
                    <option>Hyundai</option>
                    <option>Infiniti</option>
                    <option>Isuzu</option>
                    <option>Jaguar</option>
                    <option>Jeep</option>
                    <option>KIA</option>
                    <option>KTM</option>
                    <option>Lada</option>
                    <option>Lamborghini</option>
                    <option>Lancia</option>
                    <option>Land Rover</option>
                    <option>Lexus</option>
                    <option>Lotus</option>
                    <option>Maserati</option>
                    <option>Mazda</option>
                    <option>McLaren</option>
                    <option>Mercedes-Benz</option>
                    <option>MG</option>
                    <option>Mia Electric</option>
                    <option>MINI</option>
                    <option>Mitsubishi</option>
                    <option>Nissan</option>
                    <option>Opel</option>
                    <option>Peugeot</option>
                    <option>Polestar</option>
                    <option>Porsche</option>
                    <option>Renault</option>
                    <option>Rolls-Royce</option>
                    <option>Saab</option>
                    <option>Seat</option>
                    <option>Skoda</option>
                    <option>Smart</option>
                    <option>Ssangyong</option>
                    <option>Subaru</option>
                    <option>Suzuki</option>
                    <option>Tesla</option>
                    <option>Toyota</option>
                    <option>Volkswagen</option>
                    <option>Volvo</option>

                </select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nombre de places"
                name="place"
                rules={[{ required: true, message: 'Veuillez saisir le nombre de places' }]}
                
              >
               <Input placeholder="Veuillez saisir le nombre de places" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="matricule"
                label="Immatriculation"
                rules={[{ required: true, message: 'Veuillez saisir le matricule' }]}
              >
                <Input placeholder="Veuillez saisir le matricule" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="usage"
                label="Usage"
                rules={[{ required: true, message: 'Veuillez selectionner l\'usage' }]}
              >
                <Input placeholder="VVeuillez selectionner l'usage" />
                {/* <Select placeholder="Veuillez selectionner l'usage">
                  {state.roles.map(( m, index) => (
                    <Option key={m.id} value={m.id}>{m.name}</Option>
                  ))}
                </Select> */}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Genre"
                name="genre"
                rules={[{ required: true, message: 'Veuillez saisir le genre' }]}
                
              >
               <Input placeholder="Veuillez saisir le genre" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="annee"
                label="Année"
                // dependencies={['password']}
                // hasFeedback
                rules={[{ required: true, message: 'Veuillez saisir l\'année' }]}
              >
                <Input placeholder="Veuillez saisir l'année" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="cvcu"
                label="CV ou CU"
                rules={[{ required: true, message: 'Veuillez saisir le CV ou CU'}]}
              >
                <Input
                  // style={{ width: '100%' }}
                  
                  placeholder="Veuillez saisir le CV ou CU"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="energie"
                label="Energie"
                rules={[
                  { required: true, message: "Veuillez saisir le type d'energie" },
                ]}
              >
                <Input placeholder="Veuillez saisir le type d'energie" />
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