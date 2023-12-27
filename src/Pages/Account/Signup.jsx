import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Googlesignup from '../../Components/GoogleLogSignComp/Googlesignup';
import InputField from '../../Components/Input/InputField';
// import { auth } from '../../../Firebase';
// import { fireDb } from '../../../Firebase';

import './form.css'
export default function Signup() {
  // const navigate = useNavigate()
  // const [name, setName] = useState()
  const { signup, currentUser } = useAuth()
  const schema = yup.object().shape({
    username: yup.string().trim().required('Please enter your name').max(33, '33 is Maximum words limit'),
    email: yup.string().email('Invalid email address').trim().required("email is required"),
    password: yup.string().required('Password is required').min(6, 'Password must contain 6 Digits'),
    confirmpassword: yup.string().required('Confirm Your Password').oneOf([yup.ref('password')], 'Passwords must match'),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })


  // useEffect(() => {
  //   const checkEmailVerified = async () => {
  //     try {
  //       // Reload the current user's data
  //       if (auth.currentUser) {
  //         await auth.currentUser.reload();

  //         // Check if the email is verified
  //         if (auth.currentUser.emailVerified && currentUser !== null) {
  //           // navigate('/userdata')
  //           await fireDb.child(`/Sage/${auth.currentUser.uid}`).set({
  //             name: name,
  //             about: `Hey I am sage ${name}`
  //           })
  //           toast.success('Email verified.');
  //         } else {
  //           // console.log('email not found');
  //           // toast.error("Some Error Occurred in Verification")
  //         }
  //       }
  //     } catch (error) {
  //       console.log('Error while checking email verification:', error);
  //     }
  //   };

  //   // Start checking for email verification status

  //   const checkForVerifiedInterval = setInterval(checkEmailVerified, 3000);
  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(checkForVerifiedInterval);
  // }, [currentUser]);

  const onSubmit = async (data) => {
    try {
      await signup(data.username, data.email, data.password)
      toast.success('SuccessFully LoggedIn')
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already registered.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please input correct email');
      } else {
        toast.error('Some error occurred!. please contact to developer or try again later');
      }
    }
  }

  return (
    <section className='container'>
      <div className="form signup">
        <div className="form-content">
          <header className='formHeader'>Signup</header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label={'Name'}
              register={register('username')}
              error={errors.username}
              type={'text'}
              name={'namefield'}
            />
            <InputField
              label={'Email'}
              register={register('email')}
              error={errors.email}
              type={'email'}
              name={'emailfield'}
            />
            <InputField
              label={'Password'}
              register={register('password')}
              error={errors.password}
              type={'password'}
              name={'passwordfield'}
            />
            <InputField
              label={'Confirm Password'}
              register={register('confirmpassword')}
              error={errors.confirmpassword}
              type={'password'}
              name={'confirmpasswordfield'}
            />
            <div className="field button-field">
              <button type='submit'>Signup</button>
            </div>
          </form>

          <div className="form-link">
            <span>Already have an account?
              <Link to={'/Login'} className="link login-link">Login</Link></span>
          </div>
        </div>

        <div className="line"></div>

        <Googlesignup />
      </div>
    </section>
  )
}
