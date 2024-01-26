import {useState, useEffect} from 'react';
import Member from './Member';

function Members() {

  const [members, setMembers] = useState([{
    "_id": null,
    "email": null,
    "password": null,
    "admin": null
  }]);
  
  useEffect(() => {
    let mounted = true;
    async function fetchMembers() {
        let url = '/api/members';
        let response = await fetch(url);
        let dataJson = await response.json();
        if (mounted) {
            setMembers(dataJson);
        }
    }
    fetchMembers();
    return () => {
        mounted = false;
    };
  }, [])

  return (
    <div>
      <h1>Members</h1>
        {[...members].map((member) => (
            <Member key={member._id} member={member}/>
        ))}
      {!members?.length>0 && "No members."}
    </div>
  )
}

export default Members