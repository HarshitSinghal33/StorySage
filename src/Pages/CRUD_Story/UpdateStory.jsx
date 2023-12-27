import React, { useEffect, useState } from 'react'
import { fireDb } from '../../../Firebase';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useSecondContext } from '../../Context/MyContext';
import Footer from '../../Components/Footer/Footer';
import StoryForm from '../../Components/storyForm/Storyform';
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
    try {
      let storySnapShot;
      if (storyFolder === 'public') {
        storySnapShot = await fireDb.child(`publicstories/${storyId}`).get();
      } else {
        storySnapShot = await fireDb.child(`sage/${currentUser.uid}/${storyFolder}stories/${storyId}`).get();
      }

      // for extra protection, if user try to update other story than naviagte him to createStory or if story not exixts or user story key is not found. 
      if (!storySnapShot.exists() || currentUser.uid !== storySnapShot.val().userID) {
        toast.dark('Not found!')
        navigate('/createstory')
        return
      }

      setRetriveStoryData(storySnapShot.val())

    } catch (error) {
      toast.error('An error occurred! please contact to developer.')
    }

  }

  // For more detailed explanation, refer to the GitHub documentation.
  const updateRetriveStory = async (data) => {
    const { visibility: currentFeed } = data
    const { visibility: lastFeed, timeStamp } = retriveStoryData;
    const pastPath = lastFeed === 'public' ? `publicstories/${storyId}` : `sage/${currentUser.uid}/${lastFeed}stories/${storyId}`
    const updatedRetrieveData = { ...retriveStoryData, ...data }

    //Change in same feed
    if (lastFeed === currentFeed) {
      const updatedStoryObject = { [storyId]: updatedRetrieveData };
      await fireDb.child(pastPath).set(updatedRetrieveData);

      //Just Update the lastFeed data of the story lastFeed === 'public' ? `publicstories/${storyId}` : `sage/${currentUser.uid}/${currentFeed}stories/${storyId}`
      setProfilePageStates(prev => ({
        ...prev,
        [`${lastFeed}Stories`]: prev[`${lastFeed}Stories`].map((story) => (
          Object.keys(story)[0] === storyId ? updatedStoryObject : story
        )),
      }))

      //If feed is public than also updated Data in it story
      if (lastFeed === 'public') {
        setHomePageStates(prev => ({
          ...prev,
          [`homeStories`]: prev[`homeStories`].map((story) => (
            Object.keys(story)[0] === storyId ? updatedStoryObject : story
          )),
        }))
      }

      // navigate to the path after changing story ?  : `/ReadStory/${}/${currentFeed}/${storyId}/profile`
      navigate(`/ReadStory/${currentUser.uid}/${currentFeed}/${storyId}/profile`)
      return
    }


    // Refresh current feed to maintain original chronological order, remove story from last Feed.  
    setProfilePageStates(prev => ({
      ...prev,
      [`is${currentFeed}StoriesFetched`]: false,
      [`${currentFeed}Stories`]: [],
      [`${lastFeed}Stories`]: prev[`${lastFeed}Stories`].filter((story) => Object.keys(story)[0] !== storyId),
    }))


    // Current feed is public 
    if (currentFeed === 'public') {
      //Refresh home page stories
      setHomePageStates(prev => ({
        ...prev,
        hasMore: true,
        'homeStories': []
      }))

      // Verify if the story has a timestamp; if it has been made public some time ago, reposition it based on its original chronological order.
      if (timeStamp) {
        await fireDb.child(pastPath).remove()
        await fireDb.child(`publicstories/${timeStamp}`).set(updatedRetrieveData)
        navigate(`/ReadStory/${currentUser.uid}/${currentFeed}/${storyId}/profile`)
        return
      }

      // Create new timeStamp if it made public for first time.
      const currentTimeStamp = -Date.now().toString();
      await fireDb.child(pastPath).remove()
      await fireDb.child(`publicstories/${currentTimeStamp}`).set({ 'timeStamp': currentTimeStamp, ...updatedRetrieveData })
      navigate(`/ReadStory/${currentUser.uid}/${currentFeed}/${storyId}/profile`)
      return
    }

    // if feed is not public than remove it from past feed and set it with updated data  
    await fireDb.child(pastPath).remove()
    await fireDb.child(`sage/${currentUser.uid}/${currentFeed}stories/${storyId}`).set(updatedRetrieveData)
    navigate(`/ReadStory/${currentUser.uid}/${currentFeed}/${storyId}/profile`)
  }

  async function submit(data) {
    try {
      updateRetriveStory(data)
      toast.success('Story Updated')
    } catch (error) {
      toast.error('An Error occured!. Please contact to developer')
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