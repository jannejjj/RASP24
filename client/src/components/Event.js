import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function Event({event}) {
  const card = (
    <React.Fragment >
        <CardContent sx={{ borderRadius: 2, border: '1.5px solid black' }} >
            <Typography align='left' variant="h4" component="div" style={{cursor: "pointer"}}>
              {event.title}
            </Typography>
            <Typography align='left' sx={{ mb: 1.5 }} color="text.secondary" style={{cursor: "pointer"}}>
              {event.description}
            </Typography>
            <Stack direction="row" justifyContent="space-between" spacing={5}>
                <Button  sx={{ maxWidth: '110px', maxHeight: '40px', minWidth: '110px', minHeight: '40px'}}  size="medium" variant="contained">Manage</Button>
            </Stack>
        </CardContent>
    </React.Fragment>
);


  return (
    <div>
        <Box sx={{ border: 0, width: '60%', margin: 'auto', mb: 1.5 }}>
            <Card variant="outlined">{card}</Card>
        </Box>
    </div>
  )
}


export default Event