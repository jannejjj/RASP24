import { React, useState, useEffect } from 'react';
import '../styles/MyProfile.css';
import Button from "@mui/material/Button";
import EditDetailsModal from '../modals/EditDetailsModal';

function EventItem(props) {
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
      <img src='https://blogs.lut.fi/newcomers/wp-content/uploads/sites/15/2020/02/talvi-ilma-1-1.jpg' />
      <div>
        <p>Name: {firstname}{lastname}</p>
        <p>Phone: {phone}</p>
        <p>Email: {email}</p>
        <p>Address: {address}</p>
        <p>City: {city}, {postalcode}</p>
        <p>Country: {country}</p>
      </div>
      <Button variant='outlined' onClick={editOnClick} >Edit</Button>

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




function Home({ currentUser, setCurrentUser }) {
  const [user, setUser ] = useState(null);

  /*const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getID');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      localStorage.setItem("id",await response.json());
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };*/

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/users/getData/${currentUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      setUser (await response.json());
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    //fetchUserId();
    fetchUserData();
  }, [currentUser.id]);

  return (
    <div className='HomePageBackground'>
    <h1>My Profile</h1>
    <div className='Background'>
        {user ? (
            <EventItem
                Firstname={user.firstname}
                Lastname={user.lastname}
                Phone={user.phone}
                Address={user.address}
                Postalcode={user.postalcode}
                City={user.city}
                Country={user.country}
                Email={user.email}
            />
        ) : (
            <p>user is false</p>
        )}
    </div>
</div>


  )
}

export default Home