import React, { useEffect, useState } from 'react'
import { fireDb } from '../../../Firebase';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import { useAuth } from '../../Context/AuthContext';
import StoryForm from '../../Components/storyForm/Storyform';
import { useSecondContext } from '../../Context/MyContext';
import BackToHeader from '../../Components/Header/BackToHeader';

export default function UpdateStory() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { storyFolder, storyId } = useParams();
  const [retriveStoryData, setRetriveStoryData] = useState()
  const { setProfilePageStates, setHomePageStates } = useSecondContext()

  useEffect(() => {
    getStoryData()
  }, [])


  const getStoryData = async () => {
    const storySnapShot = await fireDb.child(`story/${storyFolder}/${storyId}`).get();
    if (!storySnapShot.exists() || currentUser.uid !== storySnapShot.val().userID) {
      navigate('/createstory')
      return
    }
    setRetriveStoryData(storySnapShot.val())
  }


  const updateRetriveStory = async (data) => {
    // story last visibility folder
    const { visibility, timeStamp } = retriveStoryData;
    const pastPath = `/story/${storyFolder}/${storyId}`
    const updatedData = { ...retriveStoryData, ...data }

    setProfilePageStates(prev => ({
      ...prev,
      [`is${data.visibility}StoriesFetched`]: false,
      [`${data.visibility}Stories`]: [],
      [`is${visibility}StoriesFetched`]: false,
      [`${visibility}Stories`]: [],
    }))

    if (visibility === 'public' || data.visibility === 'public') {
      // for to update HomePageStories for users
      setHomePageStates(prev => ({
        ...prev,
        hasMore: true,
        'homeStories': []
      }))
    }

    if (data.visibility === 'public') {
      if (timeStamp) {
        await fireDb.child(pastPath).remove()
        await fireDb.child(`story/${data.visibility}/${storyId}`).set(updatedData)
        return
      }

      const currentTimeStamp = -Date.now().toString();
      await fireDb.child(pastPath).remove()
      await fireDb.child(`story/${data.visibility}/${currentTimeStamp}`).set({ 'timeStamp': currentTimeStamp, ...updatedData })
      return
    }

    await fireDb.child(pastPath).remove()
    await fireDb.child(`story/${data.visibility}/${storyId}`).set(updatedData)
  }

  async function submit(data) {
    try {
      updateRetriveStory(data)
      toast.success('Story Updated')
    } catch (error) {
      console.log(error);
      toast.success('!Some Error occured please contact to developer')
    }
  }
  return (
    <>
      <BackToHeader path={'profile'} />
      <StoryForm submit={submit} retriveStoryData={retriveStoryData} />
      <Footer />
    </>
  )
}