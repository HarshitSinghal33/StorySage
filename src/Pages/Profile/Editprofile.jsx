import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from '../../Components/Input/InputField';
import { fireDb } from '../../../Firebase';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Textarea from '../../Components/Input/Textarea';
import BackToHeader from '../../Components/Header/BackToHeader';
import { toast } from 'react-toastify';

export default function Editprofile() {
    const { currentUser } = useAuth()
    const [prevValue, setPrevValue] = useState()
    const [changesMake, isChangesMake] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        getUserProfileData()
    }, [])

    const getUserProfileData = async () => {
        const snap = await fireDb.child(`Sage/${currentUser.uid}`).get();
        setPrevValue(snap.val())
        setValue('name', snap.val().name)
        setValue('bio', snap.val().bio)
    }


    const schema = yup.object().shape({
        name: yup.string().trim().required('Please enter your name'),
        bio: yup.string().trim().required("Please write something about yourself"),
    })

    const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        try {
            await fireDb.child(`Sage/${currentUser.uid}`).set({
                name: data.name,
                bio: data.bio
            })
            toast.success("Edit SuccessFully")
            navigate('/profile')

        } catch (error) {
            console.log('sorry some error occurred',error);
            toast.error("Some error! please contact to developer.")
        }
    }
    const watchForm = watch()

    // if changes make than enable the submit button to fill the form
    useEffect(() => {
        if((watchForm && prevValue) && (watchForm?.name?.trim() === prevValue?.name?.trim() && watchForm?.bio.trim() === prevValue?.bio?.trim())){
            isChangesMake(false)
            return
        }
        isChangesMake(true)
    },[watchForm])
    return (
        <>
            <BackToHeader path={'profile'} />
            <div className='editProfileContainer'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label={'Name'}
                        register={register('name')}
                        error={errors.name}
                        type={'text'}
                        name={'namefield'}
                    />
                    <br />
                    <Textarea label={'Bio'} register={register('bio')} error={errors.bio} />
                    <button type='submit' style={{ background: changesMake ? '#0171d3' : '#4f4f4f', pointerEvents: changesMake ? '' : 'none' }}>Save</button>
                </form>
            </div>
        </>
    )
}