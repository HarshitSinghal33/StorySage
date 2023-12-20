import React from 'react'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth } from '../../Context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Googlesignup from '../../Components/FormComps/Googlesignup';
import InputField from '../../Components/Input/InputField';
import './form.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').trim().required("email is required"),
    password: yup.string().required('Password is required').min(6, 'Password must contain 6 Digits'),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    try {
      login(data.email, data.password)
      toast.success('Successfully Logged In');
      navigate('/profile')
    } catch (error) {
      toast.error(`Some error occured while logged In`)
    }
  }


  return (
    <section className='container'>
      <div className="form login">
        <div className="form-content">
          <header className='formHeader'>Login</header>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="form-link">
              <Link to={'/Changepassword'} id="forgot-pass">Forgot password?</Link>
            </div>
            <div className="field button-field">
              <button type='submit'>Login</button>
            </div>
          </form>

          <div className="form-link">
            <span>Don't have an account?
              <Link to={'/signup'} className="link signup-link">Signup</Link>
            </span>
          </div>
        </div>

        <div className="line"></div>
        <Googlesignup/>
      </div>
    </section>
  )
}