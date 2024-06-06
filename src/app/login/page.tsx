"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/helpers/auth';
import { useFormik, FormikHelpers } from 'formik';
import { loginSchema } from './login_schema';

interface FormValues {
    username: string;
    password: string;
}

export default function Login() {

    const [errorMessage, setErrorMessage] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

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
        if (loginSuccess) {
            router.push('/profile');
        }
    }, [loginSuccess]);

    const handleSubmitF = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) { // Check the response status code
                console.log("success");
                console.log(data);
                localStorage.setItem('token', data.access_token); // Store the token in local storage
                setLoginSuccess(true); // Set login success to true on successful response
            } else {
                console.log("error");
                console.log(data);
                setErrorMessage(data.message || 'Invalid username or password'); // Set error message for invalid credentials
            }
        } catch (error) {
            console.error('An error occurred during login', error);
            setErrorMessage('An error occurred during login');
        } finally {
            formikHelpers.setSubmitting(false); // Set submitting to false once the request is done
        }
    };

    const { values, handleChange, handleSubmit } = useFormik<FormValues>({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: loginSchema,
        onSubmit: handleSubmitF
    });



    return (
        <div className="w-[100vw] flex justify-center items-center min-h-[75vh] bg-[#f4f4f4]">
            <div className="form max-w-[400px] w-full p-20 bg-[#ffffff] rounded-lg shadow-lg shadow-cyan-500/50">
                <h1 className="form-title text-3xl font-bold mb-[1.5rem] text-[#333333]">Login</h1>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group mb-[1.5rem]">
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
                    <div className="form-group mb-[1.5rem]">
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
                        Log In
                    </button>
                    {errorMessage && <p className="error-message" style={{ color: "red" }}>{errorMessage}</p>} {/* Render error message */}
                </form>
            </div>
        </div>
    );
}
