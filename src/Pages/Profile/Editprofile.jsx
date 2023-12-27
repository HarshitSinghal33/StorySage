import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { fireDb } from '../../../Firebase';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSecondContext } from '../../Context/MyContext';
import Textarea from '../../Components/Input/Textarea';
import BackToHeader from '../../Components/Header/BackToHeader';
import InputField from '../../Components/Input/InputField';

export default function Editprofile() {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { setProfilePageStates, profilePageStates, homePageStates, setHomePageStates } = useSecondContext()
    const [prevValue, setPrevValue] = useState()
    const [changesMake, isChangesMake] = useState(false)
    useEffect(() => {
        getUserProfileData()
    }, [currentUser])



    const handleNameChange = async (name) => {
        try {
            ['public', 'private', 'unlisted'].forEach(async feed => {
                // if data of feeds is already fetched (so we no need to fetch again)
                if (profilePageStates[`is${feed}StoriesFetched`]) {

                    // if feed didn't have stories
                    if (profilePageStates[`${feed}Stories`].length === 0) return;

                    // get the story from global syayes and chnage the name in object
                    const updatedNameData = profilePageStates[`${feed}Stories`].map((story) => {
                        const key = Object.keys(story)[0];
                        story[key].name = name;
                        return story;
                    })

                    setProfilePageStates(prev => ({
                        ...prev,
                        [`${feed}Stories`]: updatedNameData
                    }))

                    if (feed === 'public') {
                        // update there homeStories name
                        const updatedHomeNameData = homePageStates[`homeStories`].map((story) => {
                            if (Object.values(story)[0].userID === currentUser.uid) {
                                const key = Object.keys(story)[0];
                                story[key].name = name;
                                return story;
                            }
                            return story
                        })
                        setHomePageStates(prev => ({
                            ...prev,
                            [`homeStories`]: updatedHomeNameData
                        }))

                        //Update the name in firebase realtime database
                        await fireDb.child(`publicstories`).orderByChild('userID').equalTo(`${currentUser.uid}`).once('value', (snapShot) => {
                            snapShot.forEach((childSnapShot) => {
                                fireDb.child(`publicstories/${childSnapShot.key}`).update({ 'name': name })
                            })
                        })
                        return
                    }

                    // for private and unlisted feed update
                    await fireDb.child(`sage/${currentUser.uid}/${feed}stories`).set(...updatedNameData)
                    return
                } else {
                    // if data is not fetched in profile
                    const snapShot = (feed === "public")
                        ? await fireDb.child(`publicstories`).orderByChild('userID').equalTo(currentUser.uid).once('value')
                        : await fireDb.child(`sage/${currentUser.uid}/${feed}stories`).once('value')

                    let newData = [];
                    if (!snapShot.exists()) {
                        setProfilePageStates(prev => ({
                            ...prev,
                            [`is${feed}StoriesFetched`]: true,
                            isLoading: false
                        }))
                        return
                    }

                    /// set the data into normal format ffor story component
                    Object.entries(snapShot.val()).forEach((value) => {
                        value[1].name = name;
                        newData.push({ [value[0]]: value[1] })
                    });

                    // Update the firebase realtime database
                    if (feed === 'public') {
                        snapShot.forEach( (childSnapShot) => {
                             fireDb.child(`publicstories/${childSnapShot.key}`).update({ 'name': name })
                        })
                    } else {
                        fireDb.child(`sage/${currentUser.uid}/${feed}stories`).set(...newData)
                    }

                    // for feed which have stories (so need to fetch again)
                    setProfilePageStates(prev => ({
                        ...prev,
                        [`${feed}Stories`]: [...newData].reverse(),
                        [`is${feed}StoriesFetched`]: true,
                        isLoading: false
                    }))
                }
            });
        } catch (error) { toast.error('An error occurred!, please contact to developer.')
        }
    }

    const getUserProfileData = async () => {
        // profile doesn't have fetch data (or in case user directly come yo editprofile page)
        if (!profilePageStates.name) {
            const snap = await fireDb.child(`sage/${currentUser.uid}/userProfileData`).get();
            setValue('name', snap.val().name)
            setValue('bio', snap.val().bio)
            setPrevValue(snap.val())
            return
        }

        
        // if data already present
        setValue('name', profilePageStates.name)
        setValue('bio', profilePageStates.bio)
        setPrevValue({
            name: profilePageStates.name,
            bio: profilePageStates.bio
        })
    }

    const schema = yup.object().shape({
        name: yup.string().trim().required('Please enter your name').max(33, '33 is Maximum words limit'),
        bio: yup.string().trim().required("Please write something about yourself").max(150, '150 is Maximum letter limit'),
    })

    const { register, setValue, watch, handleSubmit, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        try {
            if (data.name !== prevValue?.name?.trim()) { 
                // if name value get changed
                handleNameChange(data.name);
            }
            await fireDb.child(`sage/${currentUser.uid}/userProfileData`).update({
                name: data.name,
                bio: data.bio
            })

            toast.success("Edit SuccessFully")
            setProfilePageStates((prev) => ({
                ...prev,
                sageName: data.name,
                sageBio: data.bio,
            })) 
            navigate('/profile')
        } catch (error) {
            console.log(error);
            toast.error("An error occurred! please contact to developer.")
        }
    }

    const watchForm = watch()

    // if changes make than enable the submit button to fill the form (not using isDirt because causing trim problem)
    useEffect(() => {
        if ((watchForm && prevValue) &&
            (watchForm.name.trim() === prevValue.name.trim() && watchForm.bio.trim() === prevValue.bio.trim())
        ) {
            isChangesMake(false)
            return
        }
        isChangesMake(true)
    }, [watchForm])

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
                    <button type='submit' style={{
                        background: changesMake ? '#0171d3' : '#4f4f4f',
                        pointerEvents: changesMake ? '' : 'none',
                        color: changesMake ? 'white' : 'black'
                    }}>Save</button>
                </form>
            </div>
        </>
    )
}