import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';

function Member({member}) {

  const card = (
    <React.Fragment >
        <CardContent sx={{ border: 'none' }} >
          <Grid container>
            {/* The profile picture area */}
            <Grid item>

            </Grid>
            {/* The memebr info area */}
            <Grid item>
              <Typography align='left' variant="h5" component="div" style={{cursor: "pointer"}}>
                {member.firstname} {member.lastname} <span>- Role</span>
              </Typography>
              <Typography align='left' sx={{ mb: 1.5 }} color="text.secondary" style={{cursor: "pointer"}}>
                {member.email}
              </Typography>
            </Grid>
            {/* The manage button area */}
            <Grid item>
              <Stack direction="row" justifyContent="space-between" spacing={5}>
                  <Button  sx={{ maxWidth: '110px', maxHeight: '40px', minWidth: '110px', minHeight: '40px'}}  size="medium" variant="contained">Manage</Button>
              </Stack>
            </Grid>
          </Grid>
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

export default Member