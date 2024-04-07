/*
File: MyProfile.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: App.js
Description: My profile page body
GitHub: https://github.com/jannejjj/RASP24
*/

import { React, useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
// Styles CSS
import '../styles/MyProfile.css';
import '../App.css';
import 'react-toastify/dist/ReactToastify.css';
// MUI components
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';
// Modals, components, and commons
import EditDetailsModal from '../modals/EditDetailsModal';
import PayMembershipModal from '../modals/PayMembershipModal';
import EventItem from './EventItem';
import toasts from '../common/Toast';
// Icons
import IconButton from '@mui/material/IconButton';
import { RxCheckCircled } from "react-icons/rx";
import { RxCrossCircled } from "react-icons/rx";

// User info
function ProfileItem(props) {
  // These states store the original member data
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

  const localeStringOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki"
  }
 
  const [payMembership, setPayMembership] = useState(false);
  const [membershipPaid, setmembershipPaid] = useState(props.membershipPaid);
  const [paymentDisabled, setPaymentDisabled] = useState(true);
  const [membershipPrice, setmembershipPrice] = useState(10);
  const [membershipPaidDate, setMembershipPaidDate] = useState(new Date(props.membershipPaidDate).toLocaleString("fi-FI", localeStringOptions));
  const [membershipExpirationDate, setMembershipExpirationDate] = useState(new Date(props.membershipExpirationDate).toLocaleString("fi-FI", localeStringOptions));
  const [nextPaymentAvailable, setNextPaymentAvailable] = useState("");
  const [updateDateThings, setUpdateDateThings] = useState(true);

  const payMembershipOnClick = () => {
    checkMembershipStatus();
    setPayMembership(true);
  };

  const cancelPaymentOnClick = () => {
    setPayMembership(false);
  };


  // Update member when paying the membership fee
  const paymentOnClick = async () => {
    try {
      const dateNow = new Date();
      const oneYearLateDate = new Date(dateNow);
      oneYearLateDate.setFullYear(dateNow.getFullYear() + 1);
      const response = await fetch('/api/pay/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: `${props.currentUser.id}`,
          user: {
            membershipPaid: `${true}`,
            membershipPaidDate: `${dateNow}`,
            membershipExpirationDate: `${oneYearLateDate}`
          }
        })
      });
      if (response.ok) {
        setmembershipPaid(true);
        setMembershipPaidDate(new Date(dateNow).toLocaleString("fi-FI", localeStringOptions));
        setMembershipExpirationDate(new Date(oneYearLateDate).toLocaleString("fi-FI", localeStringOptions));
        toasts.showToastSuccessMessage("Membership payment successful");
        setPaymentDisabled(true);
        setPayMembership(false);

        const expirationDate = new Date(oneYearLateDate);
        const twoWeeksBeforeExpiration = new Date(expirationDate.getTime() - (2 * 7 * 24 * 60 * 60 * 1000));
        setNextPaymentAvailable(twoWeeksBeforeExpiration.toLocaleString("fi-FI", localeStringOptions));

        props.toggleUpdateUser();
      } else {
        console.error('Failed to pay membership fee:', response.statusText);
        toasts.showToastMessage('Failed to pay membership fee:', response.statusText);
      }
    } catch (error) {
      console.error('Error while paying membership fee:', error.message);
      toasts.showToastMessage('Error while paying membership fee:', error.message);
    }
  };

  // membershipPaid is set to false
  const updateMembershipStatus = async () => {
    try {
      const response = await fetch('/api/pay/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: `${props.currentUser.id}`,
          user: {
            membershipPaid: `${false}`,
          }
        })
      });
      if (response.ok) {
        setmembershipPaid(false);
        setPaymentDisabled(false);
        props.toggleUpdateUser();
      } else {
        console.error('Failed to change membership status', response.statusText);
      }
    } catch (error) {
      console.error('Error while changing membership status', error.message);
    }
  }

  const checkMembershipStatus = () =>
  {
    console.log("checkMembershipStatus");
    if(membershipPaid) {
      const currentDate = new Date();
      const expirationDate = new Date(props.membershipExpirationDate);
      const twoWeeksBeforeExpiration = new Date(expirationDate.getTime() - (2 * 7 * 24 * 60 * 60 * 1000));

      if(currentDate > expirationDate) {
        // User has not paid membership fee in time
        console.log("User has not paid membership fee in time");
        updateMembershipStatus();
      } else if(currentDate >= twoWeeksBeforeExpiration) {
        // Current date is later than two weeks before expiration. Payment enabled.
        console.log("Current date is later than two weeks before expiration. Payment enabled.");
        setPaymentDisabled(false);
      } else {
        // Current date is earlier than two weeks before expiration. Payment disabled.
        console.log("Current date is earlier than two weeks before expiration. Payment disabled.");
        setPaymentDisabled(true);
      }    
    } else {
      // Membership has not been paid. Payment enabled.
      console.log("Membership has not been paid. Payment enabled.");
      setPaymentDisabled(false);
    }
  }
  const editOnClick = () => {
    setEdit(true);
  };

  // Update user info
  const saveEditOnClick = async () => {
    const confirmed = window.confirm("Are you sure you want to save the changes?");
    if (confirmed) {
      try {
        // Send updated data to the server
        const response = await fetch('/users/updateProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + props.currentUser.token
          },
          body: JSON.stringify({
            _id: `${props.currentUser.id}`,
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

        const json = await response.json();

        if (json.success) {

          props.setCurrentUser({
            admin: json.admin,
            loggedIn: true,
            token: json.token,
            firstname: json.firstname,
            lastname: json.lastname,
            id: json.id
          });

          localStorage.setItem("AssocEase_Token", json.token);

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

  // Membership
  useEffect(() =>
  {
    const expirationDate = new Date(props.membershipExpirationDate);
    const twoWeeksBeforeExpiration = new Date(expirationDate.getTime() - (2 * 7 * 24 * 60 * 60 * 1000));
    setNextPaymentAvailable(twoWeeksBeforeExpiration.toLocaleString("fi-FI", localeStringOptions));
  }, [])

  return (
    <div className='MyInfo'>
      <img className="MyProfilePicture" src='https://www.paxus.com.au/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOW1nQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--c0b8b8e1c6c0819b6eef4fb97c1b80ff9b77717d/7%20linkedin%20photo%20tipes%20to%20maximise%20your%20impact.png' />
      <div className='MyInfoTextArea'>
        <h2>{firstname} {lastname}</h2>

        <p>{email}</p>
        <p>{phone}</p>
        <p>{address}</p>
        <p>{city}, {postalcode}</p>
        <p>{country}</p>
      </div>

      <Button variant='outlined' onClick={editOnClick} >Edit Information</Button>

      <div className='HorizontalSeparator' style={{maxWidth: "400px"}} />

      <div className='MembershipArea'>
        {membershipPaid ? 
          (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <h3 style={{color: "#2C041C"}}>Membership</h3>
              <Tooltip title={"Paid " + membershipPaidDate}>
                <IconButton>
                  <RxCheckCircled  style={{fontSize: "60px", color: "#2C041C"}}/>
                </IconButton>
              </Tooltip>
              <p className='HintParagraphBig'>Expires {membershipExpirationDate}</p>

              {paymentDisabled ?
              (
                nextPaymentAvailable != "" && <p className='HintParagraphBig'>Next payment available on {nextPaymentAvailable}</p>
              )
              :
              (
                <Button variant='outlined' style={{margin: "10px 0 0 0"}} onClick={payMembershipOnClick}>Renew Membership</Button>
              )
              }
            </div>
          )
          :
          (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <h3 style={{color: "#2C041C"}}>Membership</h3>
              <Tooltip title="Not Active!">
                <IconButton>
                  <RxCrossCircled  style={{fontSize: "60px", color: "#2C041C"}}/>
                </IconButton>
              </Tooltip>
              <Button variant='outlined' style={{margin: "10px 0 0 0"}} onClick={payMembershipOnClick}>Pay Membership</Button>
            </div>
          )
        }
        
        <PayMembershipModal
          payMembership={payMembership}
          cancelPaymentOnClick={cancelPaymentOnClick}
          paymentOnClick={paymentOnClick}
          membershipExpirationDate={membershipExpirationDate}
          paymentDisabled={paymentDisabled}
          localeStringOptions={localeStringOptions}
          price={membershipPrice}
        />
      </div>

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

// My profile body
function MyProfile(props) {
  const [user, setUser ] = useState();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedView, setSelectedView] = useState("Information");
  const [updateEvents, setUpdateEvents] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);

  // These used to navigate between the My Information and My Events divs
  const informationRef = useRef(null);
  const eventsRef = useRef(null);
  const currentRef = useRef(null);

  const toggleUpdateEvents = () => {
    setUpdateEvents(!updateEvents);
  }


  const toggleUpdateUser = () => {
    setUpdateUser(!updateUser);
  }

  // Used to scroll between the My Information and My Events views
  const scrollToRef = (ref) =>
  {
    if (ref.current)
    {
      ref.current.scrollIntoView();
      currentRef.current = ref.current;
    }
  }


  // Handle the navigation onClick between the information and evetn views
  const handleNavOnClick = (value) =>
  {
    setSelectedView(value);
    sessionStorage.setItem('AssocEase_MyProfileSelectedView', value);
  }

  // Get user data
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

  // Get user's events
  const fetchUsersEvents = async () =>
  {
    const response = await fetch('/api/get/events/for/' + props.currentUser.id, {
      method: "GET"
    })
    
    if (response)
    {
      const data = await response.json();
      setEvents(data.events);
    }
  }

  useEffect(() => {
    // Fetches the users personal information
    fetchUserData();

    // Fetches the events the user is currently participating in
    fetchUsersEvents();
    
    // When the user refreshes the page, check which of the views was selected and scroll into that
    const selectedView_stored = sessionStorage.getItem('AssocEase_MyProfileSelectedView');
    if (selectedView_stored)
    {
      setSelectedView(selectedView_stored);
      if (selectedView_stored === "Information")
      {
        scrollToRef(informationRef);
      }
      else
      {
        scrollToRef(eventsRef);
      }
    }

    // when the window is resized the information and events divs can sometimes be a little messed up :).
    // Created a resize listener for the window that recalibrates the scroll of the divs everytime the 
    // window is resized.
    const handleResize = () =>
    {
        if (currentRef.current) 
        {
          currentRef.current.scrollIntoView();
        }
        else if (eventsRef.current)
        {
          eventsRef.current.scrollIntoView();
        }
    }

    window.addEventListener("resize", handleResize);

    return () =>
    {
        window.removeEventListener("resize", handleResize);
    }
  }, [updateEvents, updateUser]);

  return (
    <div className='MyProfileBackground'>
      <h1>My Profile</h1>
      <div className='HorizontalSeparator' style={{maxWidth: "700px", marginBottom: "0"}} />

      <div className='MyProfileNavButtonArea'>
        <div className='MyProfileNavButton' style={selectedView === "Information" ? {"borderColor": "#2C041C"} : {"borderColor": "transparent"}} onClick={() => {handleNavOnClick("Information"); scrollToRef(informationRef)}} >
          <h3>My Information</h3>
        </div>
        <div className='MyProfileNavButton' style={selectedView === "Events" ? {"borderColor": "#2C041C"} : {"borderColor": "transparent"}} onClick={() => {handleNavOnClick("Events"); scrollToRef(eventsRef)}} >
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
                membershipPaid={user.membershipPaid}
                membershipPaidDate={user.membershipPaidDate}
                membershipExpirationDate={user.membershipExpirationDate}
                toggleUpdateUser={toggleUpdateUser}
                currentUser={props.currentUser}
                setCurrentUser={props.setCurrentUser}
              />
            )
          }
        </div>
        {/* This is shwon when the user has selected "My Events" from the top menu. */}
        <div className='MyEventsArea' ref={eventsRef}>
          {loadingEvents ?
            (
              <p className='HintParagraphBig'>Loading...</p>
            )
            :
            (
              <div style={{width: "100%"}}>
                {events.length === 0 ?
                  (
                    <p className='HintParagraphBig' style={{margin: "30px 0 0 0", fontStyle: "italic"}}>You are not participating in any events</p>
                  ) 
                  :
                  (
                    <div style={{width: "100%", display: "flex",flexDirection: "column", alignItems: "center", overflowY: "scroll", overflowX: "hidden", maxHeight: "65vh"}}>
                      {events.map((event, index) => 
                      (
                        <EventItem
                        currentUser={props.currentUser}
                        event={event}
                        key={index}
                        attending={true}
                        toggleUpdateEvents={toggleUpdateEvents}
                        />  
                      ))}
                    </div>
                  ) 
                }
              </div>
            )
          }
        </div>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default MyProfile