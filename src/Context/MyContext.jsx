// SecondContext.jsx
import React, { createContext, useContext, useState } from 'react';
const SecondContext = createContext();

export const SecondProvider = ({ children }) => {
  const [homePageStates, setHomePageStates] = useState({
    homeStories: [],
    hasMore: true,
    isLoading: false
  })

  const [profilePageStates, setProfilePageStates] = useState({
    sageName:'',
    sageBio:'',
    fetchedDataID:'',// to get the track of which id data is fetched
    publicStories: [],
    privateStories: [],
    unlistedStories: [],
    ispublicStoriesFetched: false,
    isprivateStoriesFetched: false,
    isunlistedStoriesFetched: false,
    currentFolder: 'public',
    isLoading: false
  })

  const [deleteStory, setDeleteStory] = useState({
    storyFolder: '',
    storyID: '',
    showDeleteBox: false,
    isStoryDelete: false
  })

  const [userProfileData,setUserProfileData] = useState()

  return (
    <SecondContext.Provider value={{ deleteStory, setDeleteStory, homePageStates, setHomePageStates, profilePageStates, setProfilePageStates , userProfileData,setUserProfileData}}>
      {children}
    </SecondContext.Provider>
  );
};

export const useSecondContext = () => {
  return useContext(SecondContext);
};
