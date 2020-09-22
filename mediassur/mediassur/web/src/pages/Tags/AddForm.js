import React, { useState } from 'react';

import useMediaQuery  from 'use-media-antd-query';
import { Drawer, Form, Button, Col, Row, Input, notification } from 'antd';

import { STATUS_CODE_REST_API } from 'constant';
import { exeRequest } from 'util/APIUtils';


function AddForm(props) {
  const [state, setState] = useState({
    loading: false,
  })

  const [form] = Form.useForm();

  function handleClose(zone){
    props.close(zone);
  }

  function onFinish(values){
    setState(state => ({...state, loading: true}))

    exeRequest("/tags", "POST", values, function (response) {
      if (response.statusCode == STATUS_CODE_REST_API[1].code) {
        notification.success({
          message: 'Mediassur App',
          description: 'Tag enregistré avec succès'
        });

        handleClose(values);

      }else{
        setState(state => ({...state, loading: false}))
        
        const description = response.statusCode == STATUS_CODE_REST_API[3].code ? 
          response.message : "Erreur lors de l'enregistrement du tag"

        notification.error({
          message: 'Mediassur App',
          description: description
        });
      }
    }, this)
  }

  const colSize = useMediaQuery();

  return (
    <>
      <Drawer
        title="Ajouter un tag"
        width={colSize == "xs" ? 300 : colSize == "sm" ? 400 : 720}
        onClose={() => handleClose()}
        visible={props.visible}
        bodyStyle={{ paddingBottom: 80}}
      >
        <Form layout="vertical" hideRequiredMark form={form} name="control-hooks" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: 'Veuillez saisir le code' }]}
              >
                <Input placeholder="Veuillez saisir le code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="libelle"
                label="Libellé"
                rules={[{ required: true, message: 'Veuillez saisir le libellé' }]}
              >
                <Input placeholder="Veuillez saisir le libellé" />
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