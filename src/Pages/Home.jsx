import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Story from '../Components/Story/Story';
import Loader from '../Components/Loader/Loader';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import { useSecondContext } from '../Context/MyContext';
import useHomeStories from '../hooks/useHomeStoriesHook';


function Home() {

    const { fetchData } = useHomeStories()
    const { homePageStates } = useSecondContext()
    const { homeStories, hasMore, isLoading } = homePageStates;

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, hasMore]);


    const handleScroll = () => {
        // if get to bottom 
        if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
            if (hasMore && !isLoading) { fetchData() }
        }
    };

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