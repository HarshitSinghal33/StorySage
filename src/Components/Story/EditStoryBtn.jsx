import React, { useEffect, useState, useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSecondContext } from "../../Context/MyContext";
import { Link } from "react-router-dom";

export default function EditStoryBtn({ folder, storyID }) {
    const [isShowBtn, setShownBtn] = useState(false)
    const { setDeleteStory } = useSecondContext()
    const dotsRef = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dotsRef.current && !dotsRef.current.contains(event.target)) {
                setShownBtn(false)
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const handleDeleteStory = (storyFolder, storyID) => {
        setDeleteStory(prev => ({
            ...prev,
            storyID: storyID,
            storyFolder: storyFolder,
            showDeleteBox: true
        }))
    }


    const handleEditStoryBtn = () => {
        setShownBtn(prev => !prev)
    }

    return (
        <span ref={dotsRef}>
            <HiOutlineDotsVertical className="dot" onClick={() => handleEditStoryBtn()} style={{ position: 'absolute', top: '18px', right: '18px', border: '1px solid white', borderRadius: '50%', height: '33px', width: '33px', padding: '6px' }} />
            {isShowBtn &&
                <div className='SageButton'>
                    <Link to={`/updatestory/${folder}/${storyID}`} className='settingBtn'><p>Edit</p></Link>
                    <Link className='settingBtn' onClick={() => handleDeleteStory(folder, storyID)}> 
                    {/* this will setDeleteStory and DeleteBox will apper and than delete BOx habdle the delete story functionality */}
                        <p>Delete</p>
                    </Link>
                </div>
            }
        </span>
    )
}