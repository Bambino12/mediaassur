import React, { Component } from 'react';
import { Drawer, DatePicker, Form, Button, Col, Row, Input, Select,notification, InputNumber } from 'antd';
import moment from 'moment';
import { exeRequest } from 'utils/helpers';
import { withRouter } from 'react-router-dom';
import * as Constantes from 'utils/constants';


const { Option } = Select;

class ADrawerForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      btnLoading: false,
      date: {
        startValue: this.props.currentItem ? new Date(this.props.currentItem.startDate) : new Date().add(1, 'd'),
        endValue: this.props.currentItem ? new Date(this.props.currentItem.endDate) : new Date().add(1, 'd'),
        endOpen: false,
      }
    };
  }
  
  disabledStartDate = () => {
    const { getFieldValue } = this.props

    const startDate = getFieldValue("startDate")
    const endDate = getFieldValue("endDate")

    if (!startDate ||!endDate) {
      return false;
    }

    return startDate.valueOf() > endDate.valueOf();
  };

  disabledEndDate = endValue => {
    const { date: { startValue } } = this.state;
    if (!endValue ||!startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };
  
  handleStartDateOpenChange = open => {
    if (!open) {
      this.setState(state => ({ date: { ...state.date, endOpen: true }}));
    }
  };

  handleEndDateOpenChange = open => {
    this.setState(state => ({ date: { ...state.date, endOpen: open }}));
  };

  getDate = (date) => {
    return new Date(date._d).toISOString()
  }

  initDate = (key) => {
    const { currentItem } = this.props
    const dateFormat = "DD-MM-YYYY HH:mm:ss"
    return currentItem ? moment(new Date(currentItem[key]), dateFormat) : moment(new Date().add(1, 'd'), dateFormat)
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { currentItem } = this.props

      if (!err) { 
        let objRequest = {
          ...currentItem,
          ...values,
          multipleUse: values.multipleUse ? true : false,
          status: currentItem ? currentItem.status : 0,
          startDate: this.getDate(values.startDate),
          endDate: this.getDate(values.endDate),
        }

        this.setState({ btnLoading: true })
        
        exeRequest(Constantes.API_URL.COUPONS, (objRequest.id && objRequest.id!== 0 ? "PUT" : "POST") , objRequest, function (response) {

          if (response.statusCode == Constantes.STATUT_API_RESPONSE.SUCCESS) {

            notification.success({
              message: 'MySaham +',
              description: 'coupon enregistré avec succès'
            });

            this.props.toggleDrawer();

            window.location.reload(true);

          }else if(response.statusCode == Constantes.STATUT_API_RESPONSE.ERROR) {
            
            this.setState({
              btnLoading: false
            })

            notification.error({
              message: 'MySaham +',
              description: response.message  
            });

          } else {

            this.setState({
              btnLoading: false
            })

            notification.error({
              message: 'MySaham +',
              description: "Erreur lors de l'enregistrement du coupon "              
            });
          }
        }, null, this)
      }
    });
  }
  
  render() {
    const { currentItem, entities, form: { getFieldDecorator } } = this.props;
    const { date: {endOpen} } = this.state;
    
    console.log("this.props =>", this.props)

    return (
      <div>
       <Drawer
          title={this.props.title}
          width={820}
          background={'#ff676'}
          onClose={this.props.toggleDrawer}
          visible={this.props.visible}
        >
           
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="Code">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: 'Veuillez saisir le code!' }],
                    initialValue : currentItem ? currentItem.code : "",
                  })(
                  <Input 
                    placeholder="Saisissez le code" 
                    minLength={4} maxLength={15} />)}
                </Form.Item>
              </Col>
            </Row>
           
            <Row gutter={24}>
            <Col span={12}>
                <Form.Item label="Titre">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: 'Veuillez saisir le titre!' }],
                    initialValue : currentItem ? currentItem.title : "",  
                  })(
                    <Input 
                    placeholder="Saisissez le titre" 
                    minLength={4} maxLength={40} />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Entité">
                  {getFieldDecorator('entitiesId', {
                    initialValue : currentItem ? currentItem.entitiesId : "",  
                  })(
                    <Select>
                      {entities.map(entry => <Option key={entry.id} id={entry.id} value={entry.id}>{entry.title}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Utilisation multiple">
                  {getFieldDecorator('multipleUse', {
                    initialValue : currentItem && currentItem.multipleUse ? 1 : 0,  
                  })(
                    <Select>
                      <Option value={1}>Oui</Option>
                      <Option value={0}>Non</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Pourcentage">
                   {getFieldDecorator('percent', {
                    initialValue : currentItem ? currentItem.percent : 0,  
                  })(
                  <InputNumber
                    style={{width: '100%'}}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Date">
                {getFieldDecorator('startDate', {
                    initialValue : this.initDate('startDate')  
                  })(<DatePicker
                    style={{width: '100%'}}
                    //disabledDate={this.disabledStartDate}
                    showTime
                    placeholder="Début"
                    allowClear={false}
                    onOpenChange={this.handleStartDateOpenChange}
                  />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Date">
                {getFieldDecorator('endDate', {
                    initialValue : this.initDate('endDate')
                  })(<DatePicker
                    style={{width: '100%'}}
                    //disabledDate={this.disabledEndDate}
                    showTime
                    placeholder="Fin"
                    open={endOpen}
                    onOpenChange={this.handleEndDateOpenChange}
                  />)}
                </Form.Item>
              </Col>
            </Row>
           
          <div
           style={{
            position: 'absolute',
            left: 0,
            bottom: 40,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
          >
            <Button onClick={this.props.toggleDrawer} style={{ marginRight: 8 }}>
              Annuler
            </Button>
            <Button   loading={this.state.btnLoading} htmlType="submit" type="primary">
              Enregistrer
            </Button>
          </div>

          </Form>

        </Drawer>
      </div>
    );
  }


}

const V_Users_Edit = Form.create()(ADrawerForm);

export default withRouter(V_Users_Edit);

//export default ADrawerForm;