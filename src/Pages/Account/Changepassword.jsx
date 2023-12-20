import React from 'react'
import InputField from '../../Components/Input/InputField';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import './form.css'
import { Link } from 'react-router-dom';
export default function Changepassword() {
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').trim().required("email is required"),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    console.log(data);
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