import { useState } from "react"
import Image from "next/image"
import { UseAppContext } from "@/context/AppContext"

export default function Replies({data: {comment, token, currentUser, i}}){
    const [repliesApi, setRepliesApi] =  useState(comment.attributes.replies?.data)
    const [reply, setReply] = useState()
    const [formReply, setFormReply] = useState()
    const context = UseAppContext()

    async function replyHandler(e){
        e.preventDefault();
        if(reply === "") return

        const currentReply = {
            attributes: {
                replyText: reply,
                createdAt: "2023-02-10T19:55:36.644Z",
                user: {
                    data: {
                        attributes: {
                            username: currentUser.username,
                            image: {
                                data: {
                                    attributes: {
                                        url: currentUser.image ? currentUser.image.url : "/profile-default.png"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        setRepliesApi([...repliesApi, currentReply])

        const reqReply = await fetch(`${process.env.PUBLIC_API_URL}/api/replies`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": {
                    replyText: reply,
                    user: currentUser.id,
                    comments: comment.id
                }
            })
        })

        setReply("")
     }

     function replyFormHanlder(e, replies){
        context.replyFormElement.current.map(reply => {
            if(reply.id == comment.id){
                reply.querySelector("form").classList.remove("hidden")
                reply.querySelector("form").classList.add("block")
                reply.querySelector("input").focus();

                if(e.target.name === "replyToComment"){
                    setReply(`@${comment.attributes.user.data.attributes.username} `)
                } else {
                    setReply(`@${replies.attributes.user.data.attributes.username} `)
                }
                 
            } else {
                reply.querySelector("form").classList.remove("block")
                reply.querySelector("form").classList.add("hidden")
            }
        })
     }

    return (
        <>
            <div className="space-y-4 mt-4">
            {repliesApi.map(reply => {
                return (
                    <div key={reply.id} className="flex gap-2">
                        <div className="relative z-10 w-[30px] h-[30px] rounded-full overflow-hidden">
                            <Image alt="user" src={reply.attributes.user.data.attributes.image.data ? reply.attributes.user.data.attributes.image.data.attributes.url : "/profile-default.png"} fill className="object-cover" />
                        </div>
                        <div>
                            <p>@{reply.attributes.user.data.attributes.username}</p>
                            <p className="text-text-secondary text-sm">{reply.attributes.replyText}</p>
                            <button onClick={() => context.replyFormHandler(reply)} name="replyToReply" className="w-max">Reply</button>
                        </div>
                    </div>
                )
            })}  
            </div>
        </>
    )
}