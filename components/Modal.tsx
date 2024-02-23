import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Modal = {
    isOpen: boolean
    onClose: () => void
}

export default function Modal({ isOpen, onClose }: Modal) {
    const router = useRouter()
    const modalOverlayRef = useRef<any>(null);
    const [input, setInput] = useState()
    const [isOTPSent, setIsOTPSent] = useState(false)
    const [otp, setOTP] = useState("")
    const handleChange = (e: any) => {
        setInput(e.target.value)
    }
    const handleOTPChange = (e: any) => {
        setOTP(e.target.value)
    }
    const handleSendOTP = async (e: any) => {
        e.preventDefault()
        if(!input){
            toast.error("Email is required!", {
                position: toast.POSITION.TOP_RIGHT
              });
            return;
        }
        setIsOTPSent(true);
        const res = await axios.post('/api/sendOTP', {emailOTP: input});
    }
    const handleOTPLogin = async(e:any) => {
        e.preventDefault()
        if(!otp){
            toast.error("OTP is required!", {
                position: toast.POSITION.TOP_RIGHT
              });
            return;
        }
        const res = await axios.post('/api/otpLogin', {input, otp})
        if(res.data.status === 200)
        router.push('/')
    }
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (modalOverlayRef.current && !modalOverlayRef.current?.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return (
        <div
            id="crud-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow p-8 border border-black" ref={modalOverlayRef}>
                    {/* Modal header */}
                    <div className="flex items-center justify-between py-4 rounded-t border-gray-600">

                        <h3 className="text-lg font-semibold text-gray-900 ">
                            {isOTPSent ? "Enter your OTP" : "Login with Email OTP"}
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            data-modal-toggle="crud-modal"
                            onClick={onClose}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/* Modal body */}
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                            {isOTPSent ?
                                <input
                                    type="text"
                                    name='otp'
                                    className=" border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-black dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={handleOTPChange}
                                /> :
                                <>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name='emailOTP'
                                        id="email"
                                        className=" border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-black dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@email.com"
                                        onChange={handleChange}
                                        required
                                    /></>}
                        </div>
                    </div>
                    {isOTPSent ? <button
                        className="text-white hover:text-black border border-black bg-black hover:bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
                        onClick={handleOTPLogin}
                    >
                        Confirm
                    </button> :
                    <button
                        className="text-white hover:text-black border border-black bg-black hover:bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
                        onClick={handleSendOTP}
                    >
                        Send OTP
                    </button>
}
                </div>
            </div>
        </div>


    )
}
