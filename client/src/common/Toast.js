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