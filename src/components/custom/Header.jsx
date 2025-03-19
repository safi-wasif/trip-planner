import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";


function Header() {
  const [openDialog, setopenDialog] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => getUserProfile(tokenResponse),

    onError: (error) => console.log(error),
  });

  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setopenDialog(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(()=>{
    console.log(user);
    
  },[]);
  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
        <img className='w-20' src="/logo.svg" />
        <div>
        {user ?
          <div className='flex items-center gap-3'>
            
            <a href='/my-trips'>
              <Button variant="outline" className="text-black hover:text-blue-500 rounded-full">My trips</Button>
            </a>
            <Popover>
              <PopoverTrigger className='border-none'>
                <img src={user?.picture} className='h-[40px] w-[40px] rounded-full hover:scale-110 hover:border-none' alt="Profile" />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer' onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Log out</h2>
              </PopoverContent>
            </Popover>
          </div> :
          <Button onClick={() => setopenDialog(true)}>Sign In</Button>
        } 
        </div>

        <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <img className="mt-2" src="/logo.svg" />
              <h2 className="font-bold text-lg mt-4">Sign in with google</h2>
              <p>Sign in to the app with Google Authentication securely</p>
              <Button
                className="w-full  mt-5 flex gap-4 items-center"
                
                onClick={login}
              >
                
                <FcGoogle className="h-7 w-7" /> Sign In With Google
                
                
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header