"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/helpers/auth';
import { useFormik, FormikHelpers } from 'formik';
import { registrationSchema } from './registration_schema';

interface FormValues {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [errorMessage, setErrorMessage] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { authenticated } = useAuth();
      if (authenticated) {
        router.push('/profile');
      }
    }
  }, [router]);

  useEffect(() => {
    if (registerSuccess) {
      router.push('/profile');
    }
  }, [registerSuccess]);

  const handleSubmitF = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("success");
        console.log(data);
        localStorage.setItem('token', data.access_token); // Store the token in local storage
        setRegisterSuccess(true); // Set register success to true on successful response
      } else {
        console.log("error");
        console.log(data);
        setErrorMessage(data.detail || 'Registration failed'); // Set error message for registration failure
      }
    } catch (error) {
      console.error('An error occurred during registration', error);
      setErrorMessage('An error occurred during registration');
    } finally {
      formikHelpers.setSubmitting(false); // Set submitting to false once the request is done
    }
  };

  const { values, handleChange, handleSubmit } = useFormik<FormValues>({
    initialValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
    validationSchema: registrationSchema,
    onSubmit: handleSubmitF
  });

  return (
    <div className="w-[100vw] flex justify-center items-center bg-[#f4f4f4]">
      <div className="form max-w-[400px] w-full p-10 bg-[#ffffff] rounded-lg shadow-lg shadow-cyan-500/50">
        <h1 className="form-title text-3xl font-bold mb-[1.5rem] text-[#333333]">Register</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group mb-[1rem]">
            <label htmlFor="username" className="form-label text-xl mb-[0.5rem] text-[#555555]">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              className="form-input h-[40px] w-full text-xl p-[0.5rem] border border-black rounded-md focus:border-blue-500"
              required
            />
          </div>
          <div className="form-group mb-[1rem]">
            <label htmlFor="first_name" className="form-label text-xl mb-[0.5rem] text-[#555555]">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              className="form-input h-[40px] w-full text-xl p-[0.5rem] border border-black rounded-md focus:border-blue-500"
              required
            />
          </div>
          <div className="form-group mb-[1rem]">
            <label htmlFor="last_name" className="form-label text-xl mb-[0.5rem] text-[#555555]">Last Name:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              className="form-input h-[40px] w-full text-xl p-[0.5rem] border border-black rounded-md focus:border-blue-500"
              required
            />
          </div>
          <div className="form-group mb-[1rem]">
            <label htmlFor="email" className="form-label text-xl mb-[0.5rem] text-[#555555]">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="form-input h-[40px] w-full text-xl p-[0.5rem] border border-black rounded-md focus:border-blue-500"
              required
            />
          </div>
          <div className="form-group mb-[1rem]">
            <label htmlFor="password" className="form-label text-xl mb-[0.5rem] text-[#555555]">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="form-input h-[40px] w-full text-xl p-[0.5rem] border border-black rounded-md focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="form-button h-[40px] w-full text-xl border-0 rounded-md bg-[#5fb04b] cursor-pointer transition-color focus:border-green-800">
            Register
          </button>
          {errorMessage && <p className="error-message" style={{ color: "red" }}>{errorMessage}</p>} {/* Render error message */}
        </form>
      </div>
    </div>
  );
}
