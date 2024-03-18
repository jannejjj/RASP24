import {useState, useEffect} from 'react';
import Member from './Member';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import "../styles/Members.css";
import '../App.css';

function Members(props) {

  const [members, setMembers] = useState([{}]);
  const [displayMembers, setDisplayMembers] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const toggleUpdate = () => { setUpdate(!update); }

  const onChangeSearch = (event) => {
    setDisplayMembers(members.filter(member => (member.firstname + " " + member.lastname).toLowerCase().includes(event.target.value.toLowerCase().trim())));
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function fetchMembers() {
        let url = '/api/members/';
        let response = await fetch(url, {headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        }});
        let dataJson = await response.json();
        if (mounted) {
            if(dataJson.error) {
              console.log("Error while fetching members: " + dataJson.error);
            } else {
              setMembers(dataJson);
              setDisplayMembers(dataJson);
            }
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
  }, [update])

  /* If the user is not logged in, they will be shown this */
  if (!props.currentUser.loggedIn) {
    return (
        <div>
            <h1>Members</h1>
            <Typography sx={{ mt: 20 }} variant='h4' align="center">
              Please login to view members.
            </Typography>
        </div>
    )
  }
  
  return (
    <div className="MembersBackground">
      <div className="MembersTitle">
        <h1>Members</h1>
          <TextField 
          id="search-term" 
          label="Search" 
          variant="outlined" 
          sx={{ width: 400, ml: 5, mb: 2 }} 
          onChange={onChangeSearch}  
          InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),}} 
          />
      </div>
      {loading && <Typography sx={{ mt: 20 }} variant='h4' align="center">
        Loading...
      </Typography>}
      {!loading && [...displayMembers].map((member) => (
          <Member key={member._id} member={member} currentUser={props.currentUser} toggleUpdate={toggleUpdate}/>
      ))}
      {!members?.length>0 &&
        <Typography sx={{ mt: 20 }} variant='h4' align="center">No members.</Typography>
      }
    </div>
  )
}

export default Members