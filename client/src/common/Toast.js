/*
File: Toast.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Description: Defines toast messages
GitHub: https://github.com/jannejjj/RASP24
*/

import {toast} from 'react-toastify';

const showToastMessage = (message) =>
    {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark"
            });
  };
  
const showToastSuccessMessage = (message) =>  {
    toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark"
        });
  };
const toasts = {showToastMessage, showToastSuccessMessage};

export default toasts;