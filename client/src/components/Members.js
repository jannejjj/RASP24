import {useState, useEffect} from 'react';
import Member from './Member';
import Typography from "@mui/material/Typography";
import '../App.css';

function Members(props) {

  const [members, setMembers] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function fetchMembers() {
        let url = '/api/members';
        let response = await fetch(url, {headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        }});
        let dataJson = await response.json();
        if (mounted) {
            setMembers(dataJson);
            setLoading(false);
        }
    }

    // Only for users that have logged in
    if (props.currentUser.loggedIn)
    {
      fetchMembers();
      return () => {
          mounted = false;
      };
    }

    setLoading(false);
  }, [])

  /* While fetching data from the backend, the user will be shown this */
  if (loading) {
    return (
        <div>
            <h1>Members</h1>
            <Typography sx={{ mt: 20 }} variant='h4' align="center">
              Loading...
            </Typography>
        </div>
    )
  }
  
  /* If the user is not logged in, they will be shown this */
  if (!props.currentUser.loggedIn) {
    return (
        <div>
            <h1>Members</h1>
            <Typography sx={{ mt: 20 }} variant='h4' align="center">
              Unauthorized.
            </Typography>
        </div>
    )
  }
  
  return (
    <div>
      <h1>Members</h1>
        {[...members].map((member) => (
            <Member key={member._id} member={member}/>
        ))}
      <Typography sx={{ mt: 20 }} variant='h4' align="center">{!members?.length>0 && "No members."}</Typography>
    </div>
  )
}

export default Members