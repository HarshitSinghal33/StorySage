import React, { useState } from 'react'
import { IoEyeSharp } from "react-icons/io5";
import { IoIosEyeOff } from "react-icons/io";
import styles from './Field.module.css'
export default function InputField({ error, register, label, handleChange, type, name, value, checked }) {
  const [isPasswordSee, setIsPasswordSee] = useState(false)

  // is type is password or text that we got from prop name 'type'
  const [isEyeType, setIsEyeType] = useState(type)

  const handleEyeChange = (passwordSee) => {
    setIsPasswordSee(passwordSee);
    setIsEyeType(() => {
      if (passwordSee) {
        return 'text'
      }
      return 'password'
    })
  }

  return (
    <div className={styles.InputContainer}>
      <input
        type={type === 'password' ? isEyeType : type}
        id={name}
        placeholder=''
        value={value}
        name={name}
        defaultChecked={checked}
        onChange={handleChange}
        {...register}
      />

      <label>{label}</label>
      {type === 'password' &&
        <span>
          {isPasswordSee
            ? <IoIosEyeOff className='eye-icon' onClick={() => handleEyeChange(!isPasswordSee)} />
            : <IoEyeSharp className='eye-icon' onClick={() => handleEyeChange(!isPasswordSee)} />}
        </span>
      }

      {error && <div className={styles.errorMessage}>{error.message}</div>}
    </div>
  )
}