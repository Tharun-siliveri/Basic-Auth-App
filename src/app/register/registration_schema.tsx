import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required')
});
