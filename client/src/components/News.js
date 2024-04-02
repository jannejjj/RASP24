import { React, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import NewsItem from "./NewsItem";
import "../styles/News.css";
import '../App.css';
import Button from "@mui/material/Button";
import CreateNewNewsPostModal from "../modals/CreateNewNewsPostModal";

function News(props) {

  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({});
  const [news, setNews] = useState([{}]);
  const [update, setUpdate] = useState(false);
  const [admin, setAdmin] = useState(props.currentUser.admin);
  const [newPostModal, setNewPostModal] = useState(false);

  const whenChanging = (event) => {
    setNewPost({ ...newPost, [event.target.id]: event.target.value });
  };

  const toggleUpdate = () => { setUpdate(!update); }

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

  const newPostModalOnlick = () => {
    setNewPostModal(true);
  };

  const cancelCreationOnClick = () => {
    setNewPostModal(false);
  };

  const saveNewPostOnClick = async (e) => {
    e.preventDefault();
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
    setNewPostModal(false);
  };

  return (
    <div className="NewsBackground">
      <h1>News</h1>
      <div className="HorizontalSeparator" style={{ width: "50%" }} />
      {admin && (
          <Button color="primary" variant='contained' onClick={newPostModalOnlick} style={{margin: "10px 0 10px 0"}} >Add New Post</Button>
        )}
      {loading && <Typography sx={{ mt: 20 }} variant='h4' align="center">
            Loading...
          </Typography>}

        {props.currentUser.loggedIn
        ?
        !loading && news.map((post, index) => (
          <NewsItem
            currentUser={props.currentUser}
            post={post}
            key={index}
            toggleUpdate={toggleUpdate}
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
    </div>
  )
}

export default News