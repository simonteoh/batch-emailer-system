"use client"
import Modal from '@/components/Modal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

type Login = {
  email?: string;
  password?: string;
}
export default function Login() {
  const router = useRouter()
  const [input, setInput] = useState<Login>()
  const [isModalOpen, setModalOpen] = useState(false);
  const [hasToken, setHasToken] = useState(true)
  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");
      try {
        if (token) {
          setHasToken(true)
          router.push('/');
        }
        else{
          setHasToken(false)
        }
      } catch (error) {
        router.push('/');
      }
    };

    checkToken();

  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const handleChange = (e: any) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input) {
      toast.error("Invalid Credentials !", {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    try {
      const res = await axios.post('/api/login', input)
      if (res.status === 200)
        router.push('/')
    } catch (error) {
      toast.error("Invalid Credentials !", {
        position: toast.POSITION.TOP_RIGHT
      });

    }



  }
  
  if(!hasToken){

  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url('/army-bg.png')]">
      <ToastContainer />
      <svg className='mb-4' xmlns="http://www.w3.org/2000/svg" width="120" height="21" viewBox="0 0 120 21" fill="none">
        <path d="M32.2006 0.40625L34.5723 20.2376H30.3306L30.1026 16.714H28.5974L28.3694 20.2828H24.082L26.2257 0.451424H32.2006V0.40625ZM29.9657 13.1905C29.7377 10.9318 29.5552 8.17616 29.3272 4.83329C28.9167 8.6279 28.643 11.4287 28.5062 13.1905H29.9657Z" fill="white" />
        <path d="M35.2568 0.40625H39.453C40.5932 0.40625 41.4598 0.496598 42.0527 0.722467C42.6457 0.948337 43.1018 1.26455 43.421 1.67112C43.7403 2.07769 43.9227 2.5746 44.0596 3.16186C44.1508 3.74912 44.242 4.6526 44.242 5.91747V7.67925C44.242 8.94412 44.1508 9.8476 43.9227 10.4349C43.6947 11.0221 43.3298 11.4739 42.7825 11.7901C42.2352 12.1063 41.4598 12.2418 40.5476 12.2418H39.4073V20.2376H35.2568V0.40625ZM39.453 3.79429V8.85377C39.5898 8.85377 39.681 8.85377 39.7722 8.85377C40.1371 8.85377 40.4108 8.71825 40.5476 8.49238C40.6844 8.26651 40.7756 7.7696 40.7756 7.04682V5.42056C40.7756 4.74295 40.6844 4.29121 40.502 4.11051C40.3652 3.92982 40.0003 3.79429 39.453 3.79429Z" fill="white" />
        <path d="M44.9258 0.40625H51.9041V4.38156H49.1219V8.13099H51.7217V11.9256H49.1219V16.3075H52.1778V20.2828H44.9258V0.40625Z" fill="white" />
        <path d="M62.1662 0.40625V4.38156H59.7033V20.2828H55.5528V4.38156H53.0898V0.40625H62.1662Z" fill="white" />
        <path d="M69.6466 0.40625L72.0183 20.2376H67.7766L67.5486 16.6689H66.0434L65.8154 20.2376H61.4824L63.6261 0.40625H69.6466ZM67.4573 13.1905C67.2293 10.9318 67.0468 8.17616 66.8188 4.83329C66.4083 8.6279 66.1346 11.4287 65.9978 13.1905H67.4573Z" fill="white" />
        <path d="M82.2348 0.406502L80.0911 20.2379H73.7513L71.334 0.406502H75.7126C76.2143 5.87255 76.5791 10.4803 76.8072 14.2749C77.0352 10.4351 77.2633 7.04707 77.4913 4.06559L77.765 0.361328H82.2348V0.406502Z" fill="white" />
        <path d="M82.9189 0.40625H89.8973V4.38156H87.1151V8.13099H89.7148V11.9256H87.1151V16.3075H90.1709V20.2828H82.9189V0.40625Z" fill="white" />
        <path d="M91.3564 0.40625H94.3211C96.2823 0.40625 97.605 0.496598 98.3348 0.677294C99.0189 0.857989 99.6119 1.3549 100.022 2.12286C100.478 2.89082 100.661 4.11051 100.661 5.82712C100.661 7.36303 100.524 8.40203 100.205 8.94412C99.8855 9.48621 99.2926 9.80243 98.3804 9.89277C99.2014 10.1638 99.7487 10.48 100.022 10.9318C100.296 11.3383 100.478 11.7449 100.57 12.1063C100.661 12.4677 100.661 13.4615 100.661 15.0426V20.2828H96.784V13.6874C96.784 12.6032 96.7384 11.9708 96.6016 11.6997C96.4648 11.4287 96.0999 11.3383 95.5526 11.3383V20.2828H91.4021V0.40625H91.3564ZM95.507 3.79429V8.22134C95.9631 8.22134 96.2823 8.13099 96.5104 7.99547C96.6928 7.81477 96.784 7.31786 96.784 6.45956V5.37538C96.784 4.74295 96.6928 4.33638 96.5104 4.15569C96.3279 3.92982 96.0087 3.79429 95.507 3.79429Z" fill="white" />
        <path d="M111.106 6.4147H107.229V4.96913C107.229 4.29152 107.183 3.83978 107.092 3.65909C107.001 3.47839 106.818 3.38804 106.59 3.38804C106.317 3.38804 106.134 3.52357 106.043 3.74944C105.906 4.02048 105.861 4.38187 105.861 4.92396C105.861 5.60157 105.952 6.09848 106.089 6.4147C106.225 6.73091 106.636 7.13748 107.274 7.63439C109.144 8.98961 110.285 10.119 110.786 10.9773C111.288 11.8356 111.516 13.2811 111.516 15.2236C111.516 16.624 111.379 17.663 111.106 18.3406C110.832 19.0182 110.33 19.5603 109.555 20.012C108.78 20.4638 107.913 20.6897 106.864 20.6897C105.769 20.6897 104.812 20.4186 103.991 19.9217C103.215 19.3796 102.668 18.7472 102.44 17.934C102.212 17.1209 102.075 15.9916 102.075 14.5008V13.1908H105.952V15.585C105.952 16.3078 105.997 16.8047 106.134 17.0306C106.225 17.2564 106.453 17.3468 106.727 17.3468C107.001 17.3468 107.229 17.2113 107.366 16.9402C107.503 16.6692 107.548 16.2626 107.548 15.7205C107.548 14.546 107.411 13.778 107.183 13.4167C106.91 13.0553 106.271 12.468 105.222 11.6097C104.173 10.7514 103.489 10.1641 103.17 9.75757C102.85 9.39618 102.531 8.85409 102.349 8.17648C102.121 7.49887 102.029 6.64057 102.029 5.55639C102.029 4.02048 102.166 2.9363 102.485 2.21352C102.805 1.49074 103.306 0.948652 103.991 0.587261C104.675 0.180696 105.541 0 106.545 0C107.639 0 108.552 0.22587 109.327 0.632435C110.102 1.08417 110.604 1.62626 110.832 2.2587C111.06 2.9363 111.197 4.02048 111.197 5.60157V6.4147H111.106Z" fill="white" />
        <path d="M112.748 0.40625H119.726V4.38156H116.944V8.13099H119.544V11.9256H116.944V16.3075H120V20.2828H112.748V0.40625Z" fill="white" />
        <path d="M6.7959 0.40625H10.9464C12.2691 0.40625 13.2725 0.541772 13.9111 0.767641C14.5952 1.03868 15.1425 1.5356 15.553 2.30355C15.9635 3.07151 16.1916 4.33638 16.1916 6.05299C16.1916 7.22751 16.0547 8.04064 15.7355 8.49238C15.4618 8.94412 14.8689 9.30551 14.0023 9.53138C14.9601 9.80243 15.5986 10.2542 15.9635 10.8866C16.3284 11.519 16.4652 12.4677 16.4652 13.7777V15.6299C16.4652 16.9851 16.3284 17.9789 16.1003 18.6113C15.8723 19.2438 15.4618 19.6955 14.9145 19.9214C14.3672 20.1473 13.2725 20.2828 11.585 20.2828H6.7959V0.40625ZM10.992 3.79429V8.22134C11.1745 8.22134 11.3113 8.22134 11.4025 8.22134C11.813 8.22134 12.0867 8.08582 12.1779 7.85995C12.2691 7.5889 12.3603 6.91129 12.3603 5.73677C12.3603 5.10434 12.3147 4.69777 12.2235 4.42673C12.1323 4.15569 11.9954 4.02016 11.8586 3.97499C11.6762 3.83947 11.4025 3.83947 10.992 3.79429ZM10.992 11.2932V16.8496C11.585 16.8044 11.9498 16.714 12.1323 16.4882C12.3147 16.2623 12.3603 15.7654 12.3603 14.9974V13.1453C12.3603 12.287 12.2691 11.7901 12.1323 11.6094C11.9954 11.4287 11.585 11.3383 10.992 11.2932Z" fill="white" />
        <path d="M5.06271 20.2835H2.37172C0.77537 16.6696 0 13.3719 0 10.3452C0 7.31858 0.77537 4.02089 2.37172 0.452148H5.06271C4.01368 3.70467 3.51197 7.00237 3.51197 10.3452C3.51197 13.6881 4.01368 16.9858 5.06271 20.2835Z" fill="white" />
        <path d="M22.4856 10.3452C22.4856 13.3719 21.6646 16.7148 20.0682 20.2835H17.4229C18.4263 17.031 18.928 13.6881 18.928 10.3452C18.928 7.00237 18.4263 3.70467 17.4229 0.452148H20.0682C21.7102 3.97571 22.4856 7.31858 22.4856 10.3452Z" fill="white" />
      </svg>
      <div className="block w-[300px] lg:w-[500px] max-w-sm p-6 bg-white border  rounded-lg shadow border-gray-700">
        <form className="max-w-lg mx-auto">
          <div className="mb-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Login</h5>

            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your email
            </label>
            <input
              type="email"
              name='email'
              id="email"
              className=" border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-black dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@email.com"
              onChange={handleChange}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your password
            </label>
            <input
              type="password"
              name='password'
              id="password"
              className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder='******'
              onChange={handleChange}
            />
            <a href='#'><p className='mt-4' onClick={openModal}>Login with OTP</p></a>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
          </div>

          <button
            type="submit"
            className="text-white hover:text-black border border-black bg-black hover:bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  }
}
