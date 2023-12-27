import React from 'react'
import StoryForm from '../../Components/storyForm/Storyform';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { fireDb } from '../../../Firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useSecondContext } from '../../Context/MyContext';
import Loginfirst from '../../Components/Loginfirst';

export default function CreateStory() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { setHomePageStates, setProfilePageStates, profilePageStates } = useSecondContext()


  //for get user current Name (and with this set the whole data and no need to fetch again on profile)
  const getUserData = async () => {
    const userSnap = await fireDb.child(`/sage/${currentUser.uid}/userProfileData`).once('value');
    const { name, bio } = userSnap.val();
    setProfilePageStates((prev) => ({
      ...prev,
      sageName: name,
      sageBio: bio,
      fetchedDataID: currentUser.uid,
    }))
  }


  // if profilePageStates doesn't have fetched
  if (!profilePageStates.sageName && currentUser) {
    getUserData()
  }

  const createNewStory = async (data) => {
    const { visibility } = data;

    // Set Today Date
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDateIndian = new Intl.DateTimeFormat('en-IN', options).format(date);
    const parts = formattedDateIndian.split(' ');
    const result = parts.join(',');

    const storyData = { ...data, userID: currentUser.uid, date: result, name: profilePageStates.sageName };


    if (visibility !== 'public') {
      // if visibility feed other than public than no use of timestamp and use random generated key by firebase
      const newStoryRef = await fireDb.child(`/sage/${currentUser.uid}/${visibility}stories`).push(storyData);

      //No need to fetchData in create story just add story at the top of changing feed
      setProfilePageStates(prev => ({
        ...prev,
        [`${visibility}Stories`]: [{ [newStoryRef.key]: storyData }, ...prev[`${visibility}Stories`]]
      }))
      navigate(`/readstory/${currentUser.uid}/${visibility}/${newStoryRef.key}`)
      return
    }

    // if visibility feed is public than create a timeStamp and use it as key
    const timeStamp = -Date.now().toString();
    let pushRef = fireDb.child(`/publicstories/${timeStamp}`)
    await pushRef.set({ ...storyData, timeStamp: timeStamp });

    //Clear existing stories and refresh the public feed to display new content.
    setHomePageStates(prev => ({
      ...prev,
      'homeStories': [],
      hasMore: true,
    }))

    setProfilePageStates(prev => ({
      ...prev,
      [`publicStories`]: [{ [timeStamp]: storyData }, ...prev[`publicStories`]],
    }))

    navigate(`/readstory/public/${timeStamp}`)
    return
  }//For a more detailed explanation, refer to the GitHub documentation.

  async function submit(data) {
    try {
      createNewStory(data)
      toast.success('Story Created')
    } catch (error) {
      toast.error('An Error occurred! please contact to developer.')
    }
  }

  return (
    <>
      <Header />
      {currentUser
        ? <StoryForm submit={submit} />
        : <Loginfirst visit={'Create Story'} />
      }
      <Footer />
    </>
  )
}