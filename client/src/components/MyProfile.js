import { React, useState, useEffect } from 'react';
import '../styles/MyProfile.css';
import Button from "@mui/material/Button";
import EditDetailsModal from '../modals/EditDetailsModal';

function EventItem(props)
{

  // These states store the original event data
  const [Firstname, setFirstname] = useState(props.Firstname);
  const [Lastname, setLastname] = useState(props.Lastname);
  const [Phone, setPhone] = useState(props.Phone);
  const [Address, setAddress] = useState(props.Address);
  const [Postalcode, setPostalcode] = useState(props.Postalcode);
  const [City, setCity] = useState(props.City);
  const [Country, setCountry] = useState(props.Country);
  const [Email, setEmail] = useState(props.Email);

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
  const [FirstnameHistory, setFirstnameHistory] = useState(props.Firstname);
  const [LastnameHistory, setLastnameHistory] = useState(props.Lastname);
  const [PhoneHistory, setPhoneHistory] = useState(props.Phone);
  const [AddressHistory, setAddressHistory] = useState(props.Address);
  const [PostalcodeHistory, setPostalcodeHistory] = useState(props.Postalcode);
  const [CityHistory, setCityHistory] = useState(props.City);
  const [CountryHistory, setCountryHistory] = useState(props.Country);
  const [EmailHistory, setEmailHistory] = useState(props.Email);

  const editOnClick = () =>
  {
    setEdit(true);
  }

  const saveEditOnClick = async () =>
  {
    // TODO: Send the edited values to the database to actually save the edit
    try{
      // Send updated data to the server
      const response = await fetch('http://localhost:4000/users/updateProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: `${sessionStorage.getItem("id")}`,
        user: {
          firstname : `${editedFirstname}`,
          lastname: `${editedLastname}`,
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
    }
    else{
      // Handle error response from server
      console.error('Failed to update profile:', response.statusText);
    }
    }
    catch(error){
      // Handle network or other errors
    console.error('Error updating profile:', error.message);
    }


    
  }

  const cancelEditOnClick = () =>
  {
    // Bring back the old event data
    setFirstname(FirstnameHistory);
    setLastname(LastnameHistory);
    setPhone(PhoneHistory);
    setAddress(AddressHistory);
    setPostalcode(PostalcodeHistory);
    setCity(CityHistory);
    setCountry(CountryHistory);
    setEmail(EmailHistory);

    // Also reset the changes to the edited values
    setEditedFirstname(FirstnameHistory);
    setEditedLastname(LastnameHistory);
    setEditedPhone(PhoneHistory);
    setEditedAddress(AddressHistory);
    setEditedPostalcode(PostalcodeHistory);
    setEditedCity(CityHistory);
    setEditedCountry(CountryHistory);
    setEditedEmail(EmailHistory);

    // Close the edit
    setEdit(false);
  }

  const handleFirstnameChange = (event) =>
  {
    setEditedFirstname(event.target.value);
  }

  const handleLastnameChange = (event) =>
  {
    setEditedLastname(event.target.value);
  }

  const handlePhoneChange = (event) =>
  {
    setEditedPhone(event.target.value);
  }

  const handleAddressChange = (event) =>
  {
    setEditedAddress(event.target.value);
  }

  const handlePostalcodeChange = (event) =>
  {
    setEditedPostalcode(event.target.value);
  }

  const handleCityChange = (event) =>
  {
    setEditedCity(event.target.value);
  }

  const handleCountryChange = (event) =>
  {
    setEditedCountry(event.target.value);
  }

  const handleEmailChange = (event) =>
  {
    setEditedEmail(event.target.value);
  }

  return (
    <div className='MyInfo'>
      <img src='https://blogs.lut.fi/newcomers/wp-content/uploads/sites/15/2020/02/talvi-ilma-1-1.jpg' />
      <div>
        <p>Firstname: {Firstname}</p>
        <p>Lastname: {Lastname}</p>
        <p>Phone: {Phone}</p>
        <p>Address: {Address}</p>
        <p>Postalcode: {Postalcode}</p>
        <p>City: {City}</p>
        <p>Country: {Country}</p>
      </div>
      <Button variant='outlined' onClick={editOnClick} >Edit</Button>

    <EditDetailsModal 
      edit={edit} 
      editedEmail={editedEmail} 
      editedCountry={editedCountry}
      editedCity={editedCity}
      editedFirstname={editedFirstname}
      editedLastname={editedLastname}
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



function Home() {
  const [user, setUser ] = useState(null);
  const userId = sessionStorage.getItem('id');

  const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getID');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      sessionStorage.setItem("id",await response.json());
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users/getData/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      setUser (await response.json());
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
    console.log(userId);
    fetchUserData();
  }, []);

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