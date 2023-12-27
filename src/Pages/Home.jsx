import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fireDb } from '../../Firebase';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSecondContext } from '../Context/MyContext';
import Story from '../Components/Story/Story';
import Loader from '../Components/Loader/Loader';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';


function Home() {
    const [isLoading,setIsLoading] = useState(false)
    const { homePageStates, setHomePageStates } = useSecondContext();
    const { homeStories, hasMore } = homePageStates;
    const chunk = 9;

    // for when app open and nothing in homestories
    useEffect(() => {
        homeStories.length === 0 && fetchData()
    }, [])
    

    // fetch data on scroll when user get to bottom
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, hasMore]);

    const handleScroll = () => {  
        if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
            hasMore && !isLoading && fetchData() 
        }
    };

    const fetchData = async () => {
        setIsLoading(true)

        // To get the last Time Stamp to fetch Data next list of Data
        const lastTimeStamp = homeStories.length !== 0 ? Object.keys(homeStories[homeStories.length - 1]) : null;

        let query = lastTimeStamp
            ? fireDb.child('publicstories').orderByKey().endBefore(`${lastTimeStamp[0]}`).limitToLast(chunk)
            : fireDb.child('publicstories').orderByKey().limitToLast(chunk);

        try {
            query.once('value', (snapshot) => {
                let newData = [];
                if (!snapshot.exists()) {
                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        hasMore: false,
                        isLoading: false,
                    }))
                    return
                }

                Object.entries(snapshot.val()).forEach((value) => {
                    newData.push({ [value[0]]: value[1] })
                });

                // if lastfetched story and curretn fetched story keys are same means all data got fetched
                if (homeStories.length !== 0 && Object.keys(homeStories[homeStories.length - 1])[0] === Object.keys(newData[0])[0]) {
                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        hasMore: false,
                        isLoading: false,
                    }))
                    setIsLoading(false)
                    return
                }
                setTimeout(() => {
                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        homeStories: [...prevstates.homeStories, ...[...newData].reverse()]
                    }))

                    if (newData.length < chunk) {// if data.length is less than chuks means all data fetched
                        setHomePageStates(prevstates => ({
                            ...prevstates,
                            hasMore: false,
                        }))
                        setIsLoading(false)
                        return
                    }

                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        hasMore: true,
                    }))
                    setIsLoading(false)
                }, 150)


            });
        } catch (error) {
            toast.error("An error occurred!, Please contact to developer.");
            setIsLoading(false)
        }
    }

    return (
        <>
            <Header />
            {(homeStories.length === 0 && isLoading)
                ? <Loader />
                : <>
                    <Story stories={homeStories} isLoading={isLoading} />
                    {(!isLoading && !hasMore) &&
                        <h1>
                            <Link to='/CreateStory' className='homeBottomShareStory'>
                                <FaPlus className='icon' />
                                <span>Share Your Story</span>
                            </Link >
                        </h1>
                    }
                </>
            }
            <Footer />
        </>
    )
}
export default Home