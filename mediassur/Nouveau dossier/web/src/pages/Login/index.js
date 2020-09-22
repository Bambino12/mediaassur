import React, { useState } from 'react'
import {connect} from "react-redux";

import makeStyles from '@material-ui/styles/makeStyles';
import { Redirect, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { signInUser } from 'services/auth'
import { signIn } from 'redux/actions'
import { logo } from 'assets/img/public'

import { USERS_ROLE } from 'constant';

import styles from './styles'

const useStyles = makeStyles(styles)

const initialState = {
  isLoading: false,
  alert: {isOpen: false, message: ''}
};

function Login({isAuthenticated, signIn}){
  const [state, setState] = useState(initialState)
  const classes = useStyles()

  const onFinish = values => {
    setState(state => ({...state, isLoading: true }));
    
    signInUser(values)
    .then(response => {
      const statusCode = parseInt(response.statusCode)
      signIn(response?.accessToken, {name: response.name})

      if(statusCode === 10){
       
      }else{
        if(statusCode === 21) {
          setState(state => ({
            ...state, 
            isLoading: false,
            alert: {isOpen: true, message: 'Nom utilisateur ou Mot de passe incorrect. Veuillez réessayer SVP'} 
          }));                 
        }else if(statusCode === 24) {
          setState(state => ({
            ...state, 
            isLoading: false,
            alert: {isOpen: true, message: 'Votre compte a ete desactivé. Veuillez contacter votre superieur'} 
          }));
        }else {
          setState(state => ({
            ...state, 
            isLoading: false,
            alert: {isOpen: true, message: response.message || 'Desolé ! Une erreur inattendue s\'est produite. Veuillez réessayer !'} 
          }));
        }
      }
    }).catch(error => {
      const statusCode = parseInt(error.statusCode)

      if(statusCode === 21) {
        setState(state => ({
          ...state, 
          isLoading: false,
          alert: {isOpen: true, message: 'Nom utilisateur ou Mot de passe incorrect. Veuillez réessayer SVP'} 
        }));
      } else {
        setState(state => ({
          ...state, 
          isLoading: false,
          alert: {isOpen: true, message: error.message || 'Desolé ! Une erreur inattendue s\'est produite. Veuillez réessayer !'} 
        }));                                          
      }
    })
  };

  const location = useLocation()

  const {from} = location.state || {from: {pathname: "/"}};

  if(isAuthenticated){
    return <Redirect to={from}/>;
  } 

  return (
    <div className={classes.root}>
      <Card className={classes.formCard}>

        <div className={classes.logoContainer}>
          <img src={logo} alt="logo" className={classes.logo}/>
        </div>

        <div className={classes.title}>
          MEDIASSUR
        </div>

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="usernameOrEmail" 
            rules={[
              {
                required: true,
                message: 'SVP renseignez votre email ou nom utilisateur!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email ou nom utilsateur" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'SVP renseignez votre mot de passe!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mot de passe"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Mot de passe oublié
            </a>
          </Form.Item>

          <Form.Item className={classes.loginBtn}>
            <Button 
              type="primary" 
              size="large" 
              htmlType="submit" 
              className="login-form-button"
              loading={state.isLoading}
            >
              Connexion
            </Button>
          </Form.Item>
        </Form>

        { state.alert.isOpen && <Alert message={state.alert.message} type="error" showIcon /> }
      </Card>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

export default connect(mapStateToProps, {signIn})(Login)