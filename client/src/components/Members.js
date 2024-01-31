import {useState, useEffect} from 'react';
import Member from './Member';
import Typography from "@mui/material/Typography";

function Members() {

  const [members, setMembers] = useState([{}]);
  const [loading, setLoading] = useState(true);
  /* User is authrorized based on if there is a token in the sessionStorage or not */
  const [authorized, setAuthorized] = useState();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    async function fetchMembers() {
        let url = '/api/members';
        if(sessionStorage.getItem('token')) {
          setAuthorized(true);
          let response = await fetch(url, {headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('token')
          }});
          let dataJson = await response.json();
          if (mounted) {
              setMembers(dataJson);
              setLoading(false);
          }
        } else {
          setLoading(false);
          setAuthorized(false);
        }  
    }
    fetchMembers();
    return () => {
        mounted = false;
    };
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
  
  /* If the user is not authorized, they will be shown this */
  if (!authorized) {
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