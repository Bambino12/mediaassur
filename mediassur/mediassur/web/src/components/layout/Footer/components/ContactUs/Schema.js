import * as Yup from 'yup';

const regEmail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
const regPhoneNumber = /^[0-9]{8}$/;

const Schema = Yup.object().shape({
  firstName: Yup.string()
    .required('Champ obligatoire'),
  lastName: Yup.string()
    .required('Champ obligatoire'),
  gender: Yup.string()
    .required('Champ obligatoire'),
  email: Yup.string()
    .matches(regEmail, "Format email invalid"),
  mobilePhone: Yup.string()
    .matches(regPhoneNumber, "Numéro de téléphone incorrect")
    .required('Champ obligatoire'),
});

export default Schema
