import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox"

// Formik
import { Formik } from 'formik';

//Schema
import Schema from './Schema'

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter,
  CustomSnackbars as Snackbar
} from 'components';

// styles 
import styles from './styles'

import {initialValues} from './variables'
import useForm from "./useForm";
import { CustomersToolbar } from "./components";

function AddCustomer(props) {
  const {classes, history} = props
  const { state, onSubmit, closeSnackbar } = useForm(history)

  function displaySnackbar(){
    if(state.snackbar.open){
      return(
        <Snackbar
          open = {state.snackbar.open}
          message =  {state.snackbar.message}
          variant = {state.snackbar.variant}
          onClose = {closeSnackbar}
          autoHideDuration = {true}
        />
      )
    }
  }

  return (
    <div>
    <Formik
      initialValues={{...initialValues}}
      validationSchema={Schema}
      onSubmit={values => onSubmit(values)}
    >
      {({ errors, touched, isValid, handleSubmit, handleChange, handleBlur, values, setFieldValue }) => (
        <Portlet>
          <PortletHeader>
            <PortletLabel
              title="Envoyer nous un message"
            />
          </PortletHeader>
          <PortletContent>
            <form className={classes.form}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    required
                    className={classes.textField}
                    error={errors.lastName && touched.lastName ? true : false}
                    helperText={errors.lastName && touched.lastName ? errors.lastName : ''}
                    name='lastName'
                    label="Nom"
                    value= {values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    required
                    className={classes.textField}
                    error={errors.firstName && touched.firstName ? true : false}
                    helperText={errors.firstName && touched.firstName ? errors.firstName : ''}
                    name='firstName'
                    label="Prénom"
                    value= {values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type='text'
                    required
                    className={classes.textField}
                    error={errors.mobilePhone && touched.mobilePhone ? true : false}
                    helperText={errors.mobilePhone && touched.mobilePhone ? errors.mobilePhone : ''}
                    name='mobilePhone'
                    label="Téléphone"
                    value= {values.mobilePhone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  />
		  
                  <Checkbox
                    checked={values.isWhatsapp}
                    onChange={e => {
                      const value = e.target.checked
                      setFieldValue('isWhatsapp', value)
                    }}
                    // value="isWarshap"
                    color="primary"
                    inputProps={{
                    'aria-label': 'secondary checkbox',
                    }}
                  />

                  C'est un numéro whatsapp ?
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type='email'
                    className={classes.textField}
                    error={errors.email && touched.email ? true : false}
                    helperText={errors.email && touched.email ? errors.email : ''}
                    name='email'
                    label="Email"
                    value= {values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    multiline
                    rowsMax={4}
                    className={classes.textField}
                    name='description'
                    label="Message"
                    value= {values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </form>
          </PortletContent>
          <PortletFooter className={classes.portletFooter}>
            {state.isLoading ? (
              <CircularProgress className={classes.progress} />
            ) : (
            <Button
              color="primary"
              variant="outlined"
              disabled={!isValid}
              onClick={handleSubmit}
            >
              Envoyer
            </Button>
            )}
          </PortletFooter>
        </Portlet>
     )}
    </Formik>
    {displaySnackbar()}
    </div>
  );
}

export default withStyles(styles)(AddCustomer);
