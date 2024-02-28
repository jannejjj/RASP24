import { React, useState, useEffect, useRef } from 'react';
import '../styles/MyProfile.css';
import '../App.css';
import Button from "@mui/material/Button";
import EditDetailsModal from '../modals/EditDetailsModal';

function ProfileItem(props) {
  // These states store the original event data
  const [firstname, setFirstname] = useState(props.Firstname);
  const [lastname, setLastname] = useState(props.Lastname);
  const [phone, setPhone] = useState(props.Phone);
  const [address, setAddress] = useState(props.Address);
  const [postalcode, setPostalcode] = useState(props.Postalcode);
  const [city, setCity] = useState(props.City);
  const [country, setCountry] = useState(props.Country);
  const [email, setEmail] = useState(props.Email);

  // These states store the data that is edited
  const [edit, setEdit] = useState(false);
  const [editedFirstname, setEditedFirstname] = useState(props.Firstname);
  const [editedLastname, setEditedLastname] = useState(props.Lastname);
  const [editedPhone, setEditedPhone] = useState(props.Phone);
  const [editedAddress, setEditedAddress] = useState(props.Address);
  const [editedPostalcode, setEditedPostalcode] = useState(props.Postalcode);
  const [editedCity, setEditedCity] = useState(props.City);
  const [editedCountry, setEditedCountry] = useState(props.Country);
  const [editedEmail, setEditedEmail] = useState(props.Email);

  // Save the history so that the editing can be cancelled
  const [firstnameHistory, setFirstnameHistory] = useState(props.Firstname);
  const [lastnameHistory, setLastnameHistory] = useState(props.Lastname);
  const [phoneHistory, setPhoneHistory] = useState(props.Phone);
  const [addressHistory, setAddressHistory] = useState(props.Address);
  const [postalcodeHistory, setPostalcodeHistory] = useState(props.Postalcode);
  const [cityHistory, setCityHistory] = useState(props.City);
  const [countryHistory, setCountryHistory] = useState(props.Country);
  const [emailHistory, setEmailHistory] = useState(props.Email);

  const editOnClick = () => {
    setEdit(true);
  };

  const saveEditOnClick = async () => {
    const confirmed = window.confirm("Are you sure you want to save the changes?");
    if (confirmed) {
      try {
        // Send updated data to the server
        const response = await fetch('/users/updateProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: `${sessionStorage.getItem("id")}`,
            user: {
              phone: `${editedPhone}`,
              address: `${editedAddress}`,
              postalcode: `${editedPostalcode}`,
              city: `${editedCity}`,
              country: `${editedCountry}`,
              email: `${editedEmail}`
            }
          })
        });

        if (response.ok) {

          // Update the history
          setFirstnameHistory(editedFirstname);
          setLastnameHistory(editedLastname);
          setPhoneHistory(editedPhone);
          setAddressHistory(editedAddress);
          setPostalcodeHistory(editedPostalcode);
          setCityHistory(editedCity);
          setCountryHistory(editedCountry);
          setEmailHistory(editedEmail);

          // Update the actual values
          setFirstname(editedFirstname);
          setLastname(editedLastname);
          setPhone(editedPhone);
          setAddress(editedAddress);
          setPostalcode(editedPostalcode);
          setCity(editedCity);
          setCountry(editedCountry);
          setEmail(editedEmail);

          // Close the edit
          setEdit(false);
        } else {
          // Handle error response from server
          console.error('Failed to update profile:', response.statusText);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error updating profile:', error.message);
      }
    }

  };

  const cancelEditOnClick = () => {
    // Bring back the old event data
    setFirstname(firstnameHistory);
    setLastname(lastnameHistory);
    setPhone(phoneHistory);
    setAddress(addressHistory);
    setPostalcode(postalcodeHistory);
    setCity(cityHistory);
    setCountry(countryHistory);
    setEmail(emailHistory);

    // Also reset the changes to the edited values
    setEditedFirstname(firstnameHistory);
    setEditedLastname(lastnameHistory);
    setEditedPhone(phoneHistory);
    setEditedAddress(addressHistory);
    setEditedPostalcode(postalcodeHistory);
    setEditedCity(cityHistory);
    setEditedCountry(countryHistory);
    setEditedEmail(emailHistory);

    // Close the edit
    setEdit(false);
  };

  const handleFirstnameChange = (event) => {
    setEditedFirstname(event.target.value);
  };

  const handleLastnameChange = (event) => {
    setEditedLastname(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setEditedPhone(event.target.value);
  };

  const handleAddressChange = (event) => {
    setEditedAddress(event.target.value);
  };

  const handlePostalcodeChange = (event) => {
    setEditedPostalcode(event.target.value);
  };

  const handleCityChange = (event) => {
    setEditedCity(event.target.value);
  };

  const handleCountryChange = (event) => {
    setEditedCountry(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEditedEmail(event.target.value);
  };

  return (
    <div className='MyInfo'>
      <img src='https://www.paxus.com.au/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOW1nQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--c0b8b8e1c6c0819b6eef4fb97c1b80ff9b77717d/7%20linkedin%20photo%20tipes%20to%20maximise%20your%20impact.png' />
      <div className='MyInfoTextArea'>
        <h2>{firstname} {lastname}</h2>

        <p>{email}</p>
        <p>{phone}</p>
        <p>{address}</p>
        <p>{city}, {postalcode}</p>
        <p>{country}</p>
      </div>
      <Button variant='outlined' onClick={editOnClick} >Edit Information</Button>

      <EditDetailsModal 
        edit={edit} 
        editedEmail={editedEmail} 
        editedCountry={editedCountry}
        editedCity={editedCity}
        editedPhone={editedPhone}
        editedAddress={editedAddress}
        editedPostalcode={editedPostalcode}
        handleFirstnameChange={handleFirstnameChange}
        handleLastnameChange={handleLastnameChange}
        handlePhoneChange={handlePhoneChange}
        handleAddressChange={handleAddressChange}
        handlePostalcodeChange={handlePostalcodeChange}
        handleCityChange={handleCityChange}
        handleCountryChange={handleCountryChange}
        handleEmailChange={handleEmailChange}
        cancelEditOnClick={cancelEditOnClick}
        saveEditOnClick={saveEditOnClick}
      />
    </div>
  )
}

function MyProfile(props) {
  const [user, setUser ] = useState(null);
  const [selectedView, setSelectedView] = useState("Information");

  // These used to navigate between the My Information and My Events divs
  const informationRef = useRef(null);
  const eventsRef = useRef(null);
  const currentRef = useRef(null);

  const scrollToRef = (ref) =>
  {
    if (ref.current)
    {
      ref.current.scrollIntoView();
      currentRef.current = ref.current;
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/users/getData/${props.currentUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      setUser (await response.json());
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className='MyProfileBackground'>
      <h1>My Profile</h1>
      <div className='HorizontalSeparator' style={{maxWidth: "700px", marginBottom: "0"}} />

      <div className='MyProfileNavButtonArea'>
        <div className='MyProfileNavButton' style={selectedView === "Information" ? {"borderColor": "#2C041C"} : {"borderColor": "transparent"}} onClick={() => {setSelectedView("Information"); scrollToRef(informationRef)}} >
          <h3>My Information</h3>
        </div>
        <div className='MyProfileNavButton' style={selectedView === "Events" ? {"borderColor": "#2C041C"} : {"borderColor": "transparent"}} onClick={() => {setSelectedView("Events"); scrollToRef(eventsRef)}} >
          <h3>My Events</h3>
        </div>
      </div>

      <div className='Background'>
        {/* This is shwon when the user has selected "My Information" from the top menu. */}
        <div className='MyInformationArea' ref={informationRef} >
          {user &&
            (
              <ProfileItem
                Firstname={user.firstname}
                Lastname={user.lastname}
                Phone={user.phone}
                Address={user.address}
                Postalcode={user.postalcode}
                City={user.city}
                Country={user.country}
                Email={user.email}
              />
            )
          }
        </div>
        {/* This is shwon when the user has selected "My Events" from the top menu. */}
        <div className='MyEventsArea' ref={eventsRef}>
          
        </div>
      </div>
    </div>
  )
}

export default MyProfile