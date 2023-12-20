import React from 'react'
import styles from "./Field.module.css"
export default function Textarea({ label, error, register }) {
  return (
    <div className={styles.InputContainer}>
      <textarea rows={3} placeholder='' {...register}></textarea>
      <label>{label}</label>
      {error && <div className={styles.errorMessage}>{error.message}</div>}
    </div>
  )
}
