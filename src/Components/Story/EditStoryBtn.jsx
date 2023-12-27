import React, { useEffect, useState, useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import DeleteModal from "../Modal/DeleteModal";
import styles from './Story.module.css'
// This component is when the user in their profile.

//here folder will get the feed or folder of story and it's id
export default function EditStoryBtn({ folder, storyID }) {
    const [isShowBtn, setShownBtn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const editBtnref = useRef()

    useEffect(() => {// click out the edit button it will close the editButton
        const handleClickOutside = (event) => {
            if (editBtnref.current && !editBtnref.current.contains(event.target)) {
                setShownBtn(false)
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])
    
    return (
        <span ref={editBtnref}>
            <HiOutlineDotsVertical className={styles.editDotStoryBtn} onClick={() => setShownBtn(prev => !prev)} />

            {isShowBtn &&
                <div className={styles.SageButton}>
                    <Link to={`/updatestory/${folder}/${storyID}`} className={styles.settingBtn}><p>Edit</p></Link>
                    <button onClick={() => setIsModalOpen(true)} className={styles.settingBtn}>Delete</button>
                    {isModalOpen && <DeleteModal onClose={() => setIsModalOpen(false)} folder={folder} storyID={storyID}/>}
                </div>
            }
        </span>
    )
} 