import React from "react";
import { FaShareAltSquare } from "react-icons/fa";
import { toast } from "react-toastify";
// share button component will get the story and make it shareable everywhere
const ShareButton = ({ title, url, text }) => {
    const handleShare = async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title,
            text,
            url,
          });
        } else {
          toast.error('Share not supported in that browser');
        }
      } catch (error) { 
        // not toasting error because when just clikc and close it show error on mobile devices
        console.error('Error sharing:', error.message);
      }
    };
  
    return (
      <span className="shareButton" onClick={() => handleShare()} style={{cursor:'pointer'}}><FaShareAltSquare/></span>
    );
  };
  export default ShareButton;