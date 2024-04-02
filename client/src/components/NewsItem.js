import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CardMedia } from '@mui/material';
import Button from '@mui/material/Button';
import ConfirmDeletePostModal from '../modals/ConfirmDeletePostModal';

function NewsItem(props) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

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
        } 
      }
    );
    props.toggleUpdate();
  }

  const card = (
    <Box>
      <CardMedia 
        sx={{ width: '60%'}}
      />
      <Typography align='left' variant="h3" color="primary">
        {props.post.title}
      </Typography>
      <Typography align='left' variant="h5" color="primary">
        {props.post.text}
      </Typography>
      {props.currentUser.admin && <Button  sx={{ maxWidth: '110px', maxHeight: '40px', minWidth: '110px', minHeight: '40px'}}  size="medium" variant="contained" onClick={() => setOpenConfirmModal(true)}>Delete</Button>}  
    </Box>
  );

  return (
    <div>
       <Box sx={{width: '60%', margin: 'auto', mb: 1.5 }}>
            <Card variant="outlined">{card}</Card>
        </Box>
        <ConfirmDeletePostModal openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} deletePost={deletePost} />
    </div> 
  )
}

export default NewsItem