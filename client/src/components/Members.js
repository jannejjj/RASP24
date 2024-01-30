import {useState, useEffect} from 'react';
import Member from './Member';
import Typography from "@mui/material/Typography";

function Members() {

  const [members, setMembers] = useState([{}]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    async function fetchMembers() {
        let url = '/api/members';
        let response = await fetch(url);
        let dataJson = await response.json();
        if (mounted) {
            setMembers(dataJson);
            setLoading(false);
        }
    }
    fetchMembers();
    return () => {
        mounted = false;
    };
  }, [])

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