import React from 'react'
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth } from '../../Context/AuthContext';
import InputField from '../../Components/Input/InputField';
import './form.css'
import { toast } from 'react-toastify';

export default function Changepassword() {
  const { changepassword } = useAuth()
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').trim().required("email is required"),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      await changepassword(data.email)
      toast.success('Email sent successfully.')
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
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
          <header className='formHeader'>Change Password</header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label={'Email'}
              register={register('email')}
              error={errors.email}
              type={'email'}
              name={'emailfield'}
            />
            <div className="field button-field">
              <button type="submit">Send Mail</button>
            </div>
          </form>

          <div className="form-link">
            <span>Already have an account?
              <Link to={'/Login'} className="link login-link">Login</Link></span>
          </div>
        </div>
      </div>
    </section>
  )
}