import React from "react";
import { FaShareAltSquare } from "react-icons/fa";
import { toast } from "react-toastify";

// it's style is in App.css

const ShareButton = ({ title, url, text }) => {
    const handleShare = async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title,
            text,
            url,
          });
          console.log('Shared successfully');
        } else {
          toast.error('Share not supported in that browser');
        }
      } catch (error) {
        console.error('Error sharing:', error.message);
      }
    };
  
    return (
      <span className="shareButton" onClick={handleShare}><h1><FaShareAltSquare/></h1></span>
    );
  };
  
  export default ShareButton;