import React, { useEffect, useState } from 'react';
import { fireDb } from '../../../Firebase';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { useSecondContext } from '../../Context/MyContext';
import Loader from '../../Components/Loader/Loader';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Story from '../../Components/Story/Story';
import Loginfirst from '../../Components/Loginfirst';
import ShareButton from '../../Components/ShareButton';
import BackToHeader from '../../Components/Header/BackToHeader';
import './Profile.css';

export default function Profile() {
  const { sageID } = useParams();
  const [isSageOnHisProfile, setIsSageOnHisProfile] = useState(false);
  const [isUserNotLoggedOrInLinkID, setIsUserNotLoggedOrInLinkID] = useState(false)
  const { currentUser, logout } = useAuth();
  const { profilePageStates, setProfilePageStates } = useSecondContext();
  const { currentFolder, isLoading, sageName, sageBio, fetchedDataID } = profilePageStates;
  const [folder, setFolder] = useState('public')

  // call handleuser if sageID or currentUser chnages
  useEffect(() => {
    handleUserProfile();
  }, [sageID, currentUser]);


  const handleUserProfile = async () => {
    // check is sageID or current user present to if not than show loginfirst
    if (!sageID && !currentUser) {
      setIsUserNotLoggedOrInLinkID(true)
      return
    } else {
      setIsUserNotLoggedOrInLinkID(false)
    }

    // check that user is on his profile or another one.
    setIsSageOnHisProfile(!sageID && currentUser || currentUser?.uid === sageID);

    // if fetchedData is not equal to user than fetch the new user data
    if ((sageID && fetchedDataID !== sageID) || (!sageID && fetchedDataID !== currentUser.uid)) {
      handleUserData();
    }
  };

  const handleUserData = async () => {
    try {
      const userSnap = sageID
        ? await fireDb.child(`/sage/${sageID}/userProfileData`).once('value')
        : await fireDb.child(`/sage/${currentUser.uid}/userProfileData`).once('value');


      // in case of user not found
      if (!userSnap.exists()) {
        setIsSageOnHisProfile('notFound');
        return;
      }
      const { name, bio } = userSnap.val();

      //if user Changes than clear everything
      setProfilePageStates((prev) => ({
        ...prev,
        sageName: name,
        sageBio: bio,
        fetchedDataID: sageID ? sageID : currentUser.uid,
        ispublicStoriesFetched: false,
        publicStories: [],
        isprivateStoriesFetched: false,
        privateStories: [],
        isunlistedStoriesFetched: false,
        unlistedStories: [],
        currentFolder: 'public'
      }));

      // call fetch data for if sgaeID present than fr it if not than for currentUser
      fetchData(sageID ? sageID : currentUser.uid, 'public');

    } catch (error) {
      toast.error('An error occurred. Please contact the developer.');
    }
  };

  // fetch data of user
  const fetchData = async (sageID, currentFolder) => {
    setProfilePageStates(prev => ({
      ...prev,
      isLoading: true
    }))


    const snapShot = (currentFolder === "public")
      ? await fireDb.child(`publicstories`).orderByChild('userID').equalTo(sageID).once('value')
      : await fireDb.child(`sage/${sageID}/${currentFolder}stories`).once('value')

    let newData = [];
    if (!snapShot.exists()) {
      setProfilePageStates(prev => ({
        ...prev,
        [`is${currentFolder}StoriesFetched`]: true,
        isLoading: false
      }))
      return
    }

    Object.entries(snapShot.val()).forEach((value) => {
      newData.push({ [value[0]]: value[1] })
    });

    setProfilePageStates(prev => ({
      ...prev,
      [`${currentFolder}Stories`]: [...newData].reverse(),
      [`is${currentFolder}StoriesFetched`]: true,
      isLoading: false
    }))
  }

  const handleFolderChange = (folder) => {
    // chnage current folder nad check that the feed data is already fetched or not
    setProfilePageStates((prev) => ({ ...prev, currentFolder: folder }));
    if (!profilePageStates[`is${folder}StoriesFetched`]) {
      fetchData(sageID ? sageID : currentUser?.uid, folder);
    }
  };

  // for everytime user changes the folder
  useEffect(() => {
    handleFolderChange(folder)
  }, [folder])

  if (isUserNotLoggedOrInLinkID) {
    return (
      <>
        <Header />
        <Loginfirst visit={'View Profile'} />
        <Footer />
      </>
    );
  }

  // if user is not found
  if (isSageOnHisProfile === 'notFound') {
    return (
      <>
        <BackToHeader path={''} />
        <h1 className='notFound'>The user you are searching is not Found 🙅</h1>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='UserDataBox'>
        <h1 className='name'>
          <i>Author - {sageName} </i>
          <ShareButton
            url={sageID ? window.location.href : `${window.location.href}/${currentUser?.uid}`}
            title={'Hey check out StorySage'}
            text={`Check out my profile named ${sageName} on StorySage`}
          />
        </h1>

        <div className='bio'>
          <p>
            <i>{sageBio}</i>
          </p>
        </div>

        {isSageOnHisProfile && (
          <div className='SageButton'>
            <Link to={'/editProfile'} className='settingBtn'>
              <div>Edit Profile</div>
            </Link>
            <div className='settingBtn' onClick={logout}>
              Logout
            </div>
          </div>
        )}
      </div>
      {/*if sage on his profile than show feed or folder changing header*/}
      {isSageOnHisProfile && (
        <div className='storypathBox'>
          {['public', 'private', 'unlisted'].map((folder) => (
            <div
              key={folder}
              className={`storypathButton ${currentFolder === folder && 'Active'}`}
              onClick={() => setFolder(folder)}
            >
              {folder}
            </div>
          ))}
        </div>
      )}


      {isLoading ? (
        <Loader />
      ) : profilePageStates[`${currentFolder}Stories`].length !== 0 ? (
        <Story stories={profilePageStates[`${currentFolder}Stories`]} isLoading={isLoading} isSage={isSageOnHisProfile} />
      ) : (
        <div className='notFoundMessage'>
          <h1>No story found</h1>
        </div>
      )}

      <Footer />
    </>
  );
}