import {useState, useEffect} from 'react';
import Member from './Member';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Button from "@mui/material/Button";
import GetMemberEmailsModal from '../modals/GetMemberEmailsModal';
import { ToastContainer, toast } from 'react-toastify';
import "../styles/Members.css";
import '../App.css';

function Members(props) {

  const [members, setMembers] = useState([{}]);
  const [displayMembers, setDisplayMembers] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [getEmailsModal, setGetEmailsModal] = useState(false);
  const [separator, setSeparator] = useState("");

  const toggleUpdate = () => { setUpdate(!update); }

  const showToastSuccessMessage = (message) =>  {
    toast.success(message, {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark"
        });
  }

  const onChangeSearch = (event) => {
    setDisplayMembers(members.filter(member => (member.firstname + " " + member.lastname).toLowerCase().includes(event.target.value.toLowerCase().trim())));
  }

  const getEmailsModalOnclick = () => {
    setGetEmailsModal(true);
  };

  const getEmailsCancelOnClick = () => {
    setGetEmailsModal(false);
  };

  const getEmailsOnClick = (e) => {
    e.preventDefault();
    var allEmails = "";
    members.forEach(function(member) {
      allEmails = allEmails + member.email + separator;
    })
    navigator.clipboard.writeText(allEmails);
    showToastSuccessMessage("All emails copied to clipboard");
    setGetEmailsModal(false);
  };

  const handleSeparatorChange = (event) => {
    setSeparator(event.target.value);
  };

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
              const index = dataJson.findIndex(member => member._id === props.currentUser.id);
              if(index !== -1) {
                dataJson.unshift(dataJson.splice(index, 1)[0]);
              }
              setMembers(dataJson)
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
      <div>
        <h1>Members</h1>
      </div>
      <div className="MembersTop">
        <Button color="primary" variant='contained' style={{margin: "2px 0 3px 0"}} onClick={getEmailsModalOnclick}>Get member emails</Button>
        <TextField 
        id="search-term" 
        label="Search" 
        variant="outlined"
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
      {!loading && members && [...displayMembers].map((member) => (
          <Member key={member._id} member={member} currentUser={props.currentUser} toggleUpdate={toggleUpdate}/>
      ))}
      {!members?.length>0 &&
        <Typography sx={{ mt: 20 }} variant='h4' align="center">No members.</Typography>
      }
      {!displayMembers?.length>0 &&
        <Typography sx={{ mt: 20 }} variant='h4' align="center">No results.</Typography>
      }
      <GetMemberEmailsModal
        getEmailsModal={getEmailsModal}
        getEmailsCancelOnClick={getEmailsCancelOnClick}
        getEmailsOnClick={getEmailsOnClick}
        handleSeparatorChange={handleSeparatorChange}
      />
      <ToastContainer />
    </div>
  )
}

export default Members