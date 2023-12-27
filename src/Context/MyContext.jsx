import React, { createContext, useContext, useState, useEffect } from 'react';
const SecondContext = createContext();

export const SecondProvider = ({ children }) => {

  // for all the global home page state
  const [homePageStates, setHomePageStates] = useState({
    homeStories: [],
    hasMore: true, // data got fetched with chunks that why it's needed
  })

  // for all global states of profile page
  const [profilePageStates, setProfilePageStates] = useState({
    sageName: '',
    sageBio: '',
    fetchedDataID: '',// to get the track of which id data is fetched
    publicStories: [],
    privateStories: [],
    unlistedStories: [],
    ispublicStoriesFetched: false,
    isprivateStoriesFetched: false,
    isunlistedStoriesFetched: false,
    currentFolder: 'public',
    isLoading: false
  })

  // for to maintain the the data of create story if user write and not save
  const [createStoryData, setCreateStoryData] = useState({
    title: '',
    storySnap: '',
    story: '',
    visibility: '',
  })

  useEffect(() => {
    setInterval
    const handleBeforeUnload = (event) => {
      if (Object.values(createStoryData).some(value => value.trim() !== '')) {
        const message = 'Are you sure you want to leave? Your unsaved changes in createstory will be lost.';
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <SecondContext.Provider value={{ homePageStates, setHomePageStates, profilePageStates, setProfilePageStates, createStoryData, setCreateStoryData }}>
      {children}
    </SecondContext.Provider>
  );
};

export const useSecondContext = () => {
  return useContext(SecondContext);
};