import Router from "next/router";
import { useState } from "react";
import { verifyToken } from "../api/auth/authToken"
import nookies from "nookies"
import Head from "next/head";

export async function getServerSideProps(ctx){  
  const verify = await verifyToken(ctx)

  const reqMe = await fetch(`${process.env.PUBLIC_API_URL}/api/users/me`, {
    headers: {
      "Authorization": "Bearer " + verify
    }
  })

  const resMe = await reqMe.json();

  return {
      props: {
          token: verify,
          me: resMe
      }
  }
}

export default function Account({token, me}) {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState()

  async function changePassword(e){
    e.preventDefault();
    const reqChangePassword = await fetch(`${process.env.PUBLIC_API_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "currentPassword": oldPassword,
        "password": newPassword,
        "passwordConfirmation": confirmNewPassword 
      })
    })

    const resChangePassword = await reqChangePassword.json();
    nookies.set(null, "token", resChangePassword.jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
    })

    setOldPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    Router.replace("/")
  }

  return (
    <>
    <Head>
        <title>Settings | Password</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
    <div className="max-w-[390px] px-4 bg-bg-primary mx-auto fixed z-30 top-0 right-0 left-0 bottom-0">
      <form onSubmit={changePassword} className="relative h-full max-w-[390px] sm:max-w-[600px] mx-auto pt-20">
        <div className="py-4">
            <input autoComplete="off" type="password" className="w-[100%] block h-8 rounded mt-1 outline-none self-center bg-bg-primary ring-1 ring-border-secondary px-4 focus:w-full transition-all duration-300 focus:ring-2 focus:ring-header-primary" name="name" onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} placeholder="Old password" required />
        </div>
        <div className="py-4">
            <input autoComplete="off" type="password" className="w-[100%] block h-8 rounded mt-1 outline-none self-center bg-bg-primary ring-1 ring-border-secondary px-4 focus:w-full transition-all duration-300 focus:ring-2 focus:ring-header-primary" name="name" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder="New password" required />
        </div>
        <div className="py-4">
            <input autoComplete="off" type="password" className="w-[100%] block h-8 rounded mt-1 outline-none self-center bg-bg-primary ring-1 ring-border-secondary px-4 focus:w-full transition-all duration-300 focus:ring-2 focus:ring-header-primary" name="name" onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} placeholder="Re-type new password" required />
        </div>
        <button className="mt-3 px-4 py-1 bg-header-primary rounded text-sm">Change</button>
      </form>
    </div>
    </>
  )
}
