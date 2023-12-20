import React, { useEffect } from 'react'
import StoryForm from '../../Components/storyForm/Storyform';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { fireDb } from '../../../Firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useSecondContext } from '../../Context/MyContext';

export default function CreateStory() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { setHomePageStates, setProfilePageStates } = useSecondContext()

  const createNewStory = async (data) => {
    const { visibility } = data;
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDateIndian = new Intl.DateTimeFormat('en-IN', options).format(date);
    const parts = formattedDateIndian.split(' ');
    const result = parts.join(',');


    const storyData = { ...data, userID: currentUser.uid, date: result, name: currentUser.displayName};
    if (visibility === 'public') {

      const timeStamp = -Date.now().toString();
      let pushRef = fireDb.child(`/story/${visibility}/${timeStamp}`)
      await pushRef.set({...storyData,timeStamp: timeStamp});
      setHomePageStates(prev => ({
        ...prev,
        'homeStories': [],
        hasMore:true,
      }))

      setProfilePageStates(prev => ({
        ...prev,
        [`${visibility}Stories`]: [],
        [`is${visibility}StoriesFetched`]:false,
      }))
      navigate(`/readstory/${visibility}/${timeStamp}`)
      return
    }
    

    const newStoryRef = await fireDb.child(`/story/${visibility}`).push(storyData);

    setProfilePageStates(prev => ({
      ...prev,
      [`${visibility}Stories`]: [{ [newStoryRef.key]: storyData }, ...prev[`${visibility}Stories`]]
    }))

    navigate(`/readstory/${visibility}/${newStoryRef.key}`)
  }


  async function submit(data) {
    try {
      createNewStory(data)
      toast.success('Story Created')
    } catch (error) {
      toast.success('!Some Error occured please contact to developer')
    }
  }

  return (
    <>
      <Header />
      <StoryForm submit={submit} />
      <Footer />
    </>
  )
}