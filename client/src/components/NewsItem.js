/*
File: NewsItem.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: News.js
Props and Parameters: currentUser("memberSchema"), post("newsPostSchema"), showToastSuccessMessage, toggleUpdate
Description: News box
GitHub: https://github.com/jannejjj/RASP24
*/

import React, { useState } from 'react';
// MUI components
import Button from '@mui/material/Button';
// Modals, components, and commons
import ConfirmDeletePostModal from '../modals/ConfirmDeletePostModal';
// Styles CSS
import "../styles/NewsItem.css";
import "../App.css";
// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

/* Contains a single news post with details and a delete button */

/* Options for displaying the time */
const localeStringOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Helsinki"
}

function NewsItem(props) {
  /* True/False for opening the deletion confirmation modal */
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  /* Deletes the post */
  const deletePost = async () =>
  {
    fetch('/api/delete/post/' + props.post._id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.currentUser.token,
      }
    })
    .then(response => response.json())
    .then(data => 
      {
        if (!data.success) 
        {
          console.log("Error while deleting post!");
          props.showToastMessage("Error while deleting post!");
        } 
      }
    );
    props.showToastSuccessMessage("Post deleted.");    
    props.toggleUpdate();
  }

  return (
    <div className="NewsItemBackground">
      <div className='NewsItemTop'>
        <h2 className='NewsTitle'> {props.post.title}</h2>
        <div className='NewsItemTopDetails'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: '17px' }}/>
            <p style={{ marginLeft: '5px' }}>
              {props.post.creator}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: '17px' }}/>
            <p style={{ marginLeft: '5px' }}>
              {new Date(props.post.lastedited).toLocaleString("fi-FI", localeStringOptions)}
            </p>
          </div>
        </div>
      </div>
      <div className="HorizontalSeparator"/>
      <div className='NewsItemCenter'>
        <p style={{whiteSpace: "pre-wrap"}}>{props.post.text}</p>
      </div>
      <div className='NewsItemBottom'>
        {props.currentUser.admin && <Button className='DeleteNewsButton' variant="contained" onClick={() => setOpenConfirmModal(true)}>Delete</Button>} 
      </div>

      <ConfirmDeletePostModal openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} deletePost={deletePost} />
    </div> 
  )
}

export default NewsItem