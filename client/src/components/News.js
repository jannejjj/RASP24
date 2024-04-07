/*
File: News.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: App.js
Description: News page body
GitHub: https://github.com/jannejjj/RASP24
*/

import { React, useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
// MUI components
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// Styles CSS
import "../styles/News.css";
import '../App.css';
// Modals, components, and commons
import NewsItem from "./NewsItem";
import CreateNewNewsPostModal from "../modals/CreateNewNewsPostModal";
import toast from "../common/Toast";

/* Page that contains news. Admins can create news by pressing the 'add new post' button. */

function News(props) {
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({});
  const [news, setNews] = useState([{}]);
  const [update, setUpdate] = useState(false);
  const [admin, setAdmin] = useState(props.currentUser.admin);
  /* True/False for opening the new post creation modal */
  const [newPostModal, setNewPostModal] = useState(false);

  /* Updating the textfield information when creating a new post */
  const whenChanging = (event) => {
    setNewPost({ ...newPost, [event.target.id]: event.target.value });
  };

  /* when used, fetches the news posts from the backend */
  const toggleUpdate = () => { setUpdate(!update); }

  /* Fetches news from the backend */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    async function fetchNews() {
        let url = '/api/news';
        let response = await fetch(url, {headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token 
        }});
        let dataJson = await response.json();
        if (mounted) {
            setNews(dataJson);
            console.log(dataJson);
            setLoading(false);
        }
      }
    // Only for users that have logged in
    if (props.currentUser.loggedIn)
    {
      fetchNews();
      return () => {
          mounted = false;
      };
    }
    setLoading(false);
  }, [update])

  /* Opens the new post creation modal */
  const newPostModalOnlick = () => {
    setNewPostModal(true);
  };

  /* Closes the new post creation modal */
  const cancelCreationOnClick = () => {
    setNewPostModal(false);
  };

  /* Saves the new news post to the backend */
  const saveNewPostOnClick = async (e) => {
    e.preventDefault();
    newPost.creator = props.currentUser.firstname + " " + props.currentUser.lastname;
    newPost.creatorId = props.currentUser.id;
    await fetch("/api/news", {
      method: "POST",
      headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
      },
      body: JSON.stringify(newPost),
      mode: "cors"
      })
      .then(response => response.json())
      .then(data => {
          console.log(data)
      })
    toggleUpdate();
    toast.showToastSuccessMessage("New post created.");
    setNewPostModal(false);
  };

  return (
    <div className="NewsBackground">
      <h1>News</h1>
      <div className="HorizontalSeparator" style={{ width: "50%" }} />
      {admin && (
          <Button color="primary" variant='contained' onClick={newPostModalOnlick} style={{margin: "10px 0 10px 0"}} >Add New Post</Button>
        )}
      {loading && <Typography sx={{ mt: 20 }} variant='h4' align="center">Loading...</Typography>}
      {props.currentUser.loggedIn
      ?
      !loading && news.slice().reverse().map((post, index) => (
        <NewsItem
          currentUser={props.currentUser}
          post={post}
          key={index}
          toggleUpdate={toggleUpdate}
          showToastMessage={toast.showToastMessage}
          showToastSuccessMessage={toast.showToastSuccessMessage}
        />
      ))
      :
      <Typography sx={{ mt: 20 }} variant='h4' align="center">
        Please log in to see news.</Typography>
      }

      <Typography sx={{ mt: 20 }} variant='h4' align="center">{!news?.length>0 && "No news."}</Typography>

      <CreateNewNewsPostModal
        newPostModal={newPostModal}
        cancelCreationOnClick={cancelCreationOnClick}
        saveNewPostOnClick={saveNewPostOnClick}
        whenChanging={whenChanging}
      />
      <ToastContainer />
    </div>
  )
}

export default News