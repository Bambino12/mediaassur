const initialSnackbar = {open: false, message: 'Erreur !', variant: 'error'}

export const initialState = {
  isLoading: false,
  snackbar: {...initialSnackbar}
};

export const initialValues = {
  firstName: '', 
  lastName: '',
  mobilePhone: '', 
  email: '', 
  gender: '', 
  description: '', 
  isWhatsapp: false
}
