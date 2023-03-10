import Head from 'next/head'
import Link from "next/link"
import nookies from 'nookies'
import { useState } from "react"
import Router from "next/router"
import { authToken } from "./api/auth/authToken"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

export async function getServerSideProps(ctx){
    const token = await authToken(ctx);

    return {
        props: {}
    }
}

export default function Login() {
    const [field, setField] = useState({})
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const fieldHandler = (e) => {
        const {name, value} = e.target
        
        setField({
            ...field,
            [name]: value
        })
    }

    const loginHandler = async (e) => {
        setLoading(true)
        e.preventDefault()
        const loginReq = await fetch(`${process.env.PUBLIC_API_URL}/api/auth/local`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(field)
        })

        const loginRes = await loginReq.json()
        
        if (loginRes.jwt){
            e.target.reset()
            nookies.set(null, "token", loginRes.jwt, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            })
            Router.replace("/")
            setMessage("")
        }
        setMessage(loginRes.error?.message)
        setLoading(false)
    }

    return (
        <>
         <Head>
            <title>Login</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        <form onSubmit={loginHandler} className="mx-auto bg-bg-primary flex top-0 bottom-0 left-0 right-0 w-full fixed z-[50] items-center text-text-primary flex-wrap min-h-screen justify-center py-10">
            <div className="flex border-2 border-double border-border-primary rounded-md max-w-full py-5 sm:py-0">
                <div className="flex flex-wrap content-center justify-center rounded-l-md w-[384px] h-[512]">
                    <div className="w-72">
                        <h1 className="text-xl font-semibold">Login</h1>
                        <small className="text-text-third">Welcome! Please enter your details</small>
                        <div className="mb-3 mt-4">
                            <label className="mb-2 block text-xs font-semibold">Email or username</label>
                            <input autoComplete="off" type="text" placeholder="Enter your email or username" className="block w-full bg-bg-primary rounded-md border border-border-secondary focus:border-header-primary focus:outline-none focus:ring-1 focus:ring-header-primary py-1 px-1.5" name="identifier" onChange={fieldHandler} required />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-xs font-semibold">Password</label>
                            <input autoComplete="off" type="password" placeholder="*****" className="block w-full rounded-md border bg-bg-primary border-border-secondary focus:border-header-primary focus:outline-none focus:ring-1 focus:ring-header-primary py-1 px-1.5" name="password" onChange={fieldHandler} required />
                        </div>

                        <div className="mb-3">
                            <p className="text-red-500 text-sm">{message}</p>
                        </div>

                        <div className="mb-3 flex flex-wrap content-center">
                            <a href="#" className="text-xs font-semibold text-header-primary">Forgot password?</a>
                        </div>

                        <div className="mb-3">
                            <button type="submit" className="mb-1.5 block w-full text-center bg-header-primary hover:bg-blue-800 px-2 py-1.5 rounded-md">
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Loading...
                                </>
                            ): (
                                <p>Login</p>
                            )}
                            </button>
                        </div>

                        <div className="text-center">
                        <span className="text-xs text-text-third font-semibold">Don't have an account?</span>
                        <Link href="/register" className="text-xs font-semibold text-header-primary ml-1">Register</Link>
                        </div>
                    </div>
                </div>
                <div className={`sm:flex hidden flex-wrap content-center justify-center rounded-r-md w-[384px] h-[512px] relative`}>
                    <Image className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md" src="https://i.imgur.com/9l1A4OS.jpeg" fill />
                </div>
            </div>
        </form>
        </>
    )
  }
  