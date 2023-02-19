import { aDayAgo } from "@/utils/aDayAgo";
import Image from "next/image"
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faEllipsisVertical, faTrash, faLink, faTriangleExclamation, faXmark, faL } from '@fortawesome/free-solid-svg-icons'
import { faComment, faBookmark } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import Comments from "./Comments";
import { UseAppContext } from "@/context/AppContext";
import { useRouter } from "next/router";
import SkeletonLoading from "./SkeletonLoading";

export default function Posts({data: {postsApi, token, currentUser}}) {
    const context = UseAppContext()
    const userId = Number(currentUser.id);
    const likeCount = useRef([])
    const likeElements = useRef([])
    const [posts, setPosts] = useState(postsApi);
    const infoPost = useRef([]);
    const confirm = useRef([]);
    const filterButton = [{text: "For You", name: "foryou"}, {text: "Following", name: "following"}]
    const router = useRouter()

    useEffect(() => {
        if(router.query.profile === currentUser.username) return setPosts(postsApi)
    })

    async function filterHandler(e){
        context.setPostsLoading(true)
        if(e.target.name === "foryou"){
            e.target.nextSibling.classList.remove("after:right-0")
            e.target.classList.add("after:right-0")
            setPosts(postsApi)
            context.setPostsLoading(false)
        } else {
            context.setPostsLoading(true)
            e.target.previousSibling.classList.remove("after:right-0")
            e.target.classList.add("after:right-0")

            const reqFollowing = await fetch(`${process.env.PUBLIC_API_URL}/api/users/${currentUser.id}?populate=following`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            const resFollowing = await reqFollowing.json();

            const filterFollowing = posts.filter(post => {
                return resFollowing.following.find(following => {
                    return following.id === post.attributes.user.data.id
                })
            })

            setPosts(filterFollowing)
            context.setPostsLoading(false)
          }
    }

    const [currentPostId, setCurentPostId] = useState()
    const [currentI, setCurrentI] = useState()

    async function dislikeHandler(e, post, likeElement){
        const liked = []
    
        const decrementLike = Number(post.attributes.likedBy.data.length) - 1;
        const dislike = post.attributes.likedBy.data.filter(user => {
            return user.id !== userId
        })
    
        dislike.map(user => {
            liked.push(user.id)
        })
    
        post.attributes.likedBy.data = dislike;
        likeElement.textContent = decrementLike

        likeElements.current.map(element => {
            if(element?.id == post.id){
                element?.classList.remove("text-red-500")
            }
        })
        
        await fetch(`${process.env.PUBLIC_API_URL}/api/posts/${post.id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                "data": {
                    "likedBy": liked
                }
            })
        })        
    }
    
    async function likeHandler(e, post, likeElement){
        const liked = []           
        const incrementLiked = Number(post.attributes.likedBy.data.length) + 1;
        
        post.attributes.likedBy.data.map(user => {
            liked.push(user.id)
        })
        liked.push(userId)

        likeElement.textContent = incrementLiked
        likeElements.current.map(element => {
            if(element?.id == post.id){
                element?.classList.add("text-red-500")
            }
        })
    
        post.attributes.likedBy.data = [...post.attributes.likedBy.data, {id: userId}];
    
        await fetch(`${process.env.PUBLIC_API_URL}/api/posts/${post.id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                "data": {
                "likedBy": liked
            }
            })
        })
    }

    function likeDislikeHandler(e, post, i){
        const currentCountLikeElement = likeCount.current[i]
        if(post.attributes.likedBy.data.some(user => user.id === userId)){
            return dislikeHandler(e, post, currentCountLikeElement)
        }else {
            return likeHandler(e, post, currentCountLikeElement)
        }
   }

   function commentHandler(e, post, i){
    setCurentPostId(post.id)
    setCurrentI(i)
    context.getHighestId();

    context.commentElement.current?.map(element => {
        if(element?.id == post.id){
            element?.classList.add("bottom-0")
            element?.classList.remove("-bottom-full")
        } else{
            element?.classList.add("-bottom-full")
            element?.classList.remove("bottom-0")
        }
    })
   }

   function infoPostHandler(postId){
        infoPost.current.map(info => {
            if(info?.id == postId) {
                info?.classList.add("bottom-0")
                info?.classList.remove("-bottom-full")
            } else{
                info?.classList.add("-bottom-full")
                info?.classList.remove("bottom-0")
            }
        })
   }

   function infoCloseHandler(postId){
        infoPost.current.map(info => {
            if(info?.id == postId) {
                info?.classList.add("-bottom-full")
                info?.classList.remove("bottom-0")
            } 
        })
   }

   function deletePostHandler(postId){
        deletePopup(postId)
   }

   function deletePopup(postId){
        confirm.current.map(conf => {
            if(conf?.id == postId) {
                conf?.classList.add("opacity-1", "z-50")
                conf?.classList.remove("opacity-0", "-z-50")
                conf?.firstChild.classList.remove("scale-0")
                conf?.firstChild.classList.add("scale-1")
            } else{
                conf?.classList.add("opacity-0", "-z-50")
                conf?.classList.remove("opacity-1", "z-50")
                conf?.firstChild.classList.add("scale-0")
                conf?.firstChild.classList.remove("scale-1")
            }
        })
   }

   function closePopup(postId){
        confirm.current.map(conf => {
            if(conf?.id == postId) {
                conf?.classList.add("opacity-0", "-z-50")
                conf?.classList.remove("opacity-1", "z-50")
                conf?.firstChild.classList.add("scale-0")
                conf?.firstChild.classList.remove("scale-1")
            }
        })
   }

   async function deleteConfirm(postId){
        const filteredPosts = posts.filter(post => {
            return post?.id !== postId
        })

        setPosts(filteredPosts)

        await fetch(`${process.env.PUBLIC_API_URL}/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
   }

  return (
    <>
        {context.currentPath === "/" && (
        <div className="flex justify-around border-b border-border-primary pt-2 pb-4 max-w-[390px] mx-auto">
            {filterButton.map(button => {
                return <button key={button.name} name={button.name} onClick={filterHandler} className={`px-4 relative after:absolute after:h-[3px] after:rounded-full after:bg-header-primary after:-bottom-4 after:left-0 ${button.name === "foryou" ? "after:right-0" : ""}`}>{button.text}</button>
            })}
        </div>
        )}
        {!posts.length ? (
            <div className="text-center border border-dashed border-border-secondary w-max mx-auto px-4 py-2 rounded text-sm text-text-third mt-24">no posts yet : /</div>
        ): (
            context.postsLoading ? (
                <SkeletonLoading count={posts.length} />
            ): (
                posts.map((post, i) => {
                    return (
                        <div key={post.id} className="max-w-[390px] mx-auto h-[100%] flex justify-center">
                            <div className="w-[390px] border border-border-primary text-text-secondary">
                                <div className="flex px-3 py-3 gap-3 items-start">
                                    <div className="relative z-10 w-[40px] h-[40px]">
                                        <Link href={`/${post.attributes.user.data.attributes.username}`} className="w-[40px] h-[40px] block">
                                            <Image alt="user" src={post.attributes.user.data?.attributes.image.data ? post.attributes.user.data.attributes.image.data.attributes.url : "/profile-default.png"} fill className="rounded-full object-cover" />
                                        </Link>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/${post.attributes.user.data.attributes.username}`}>
                                                <p className="text-text-primary text-sm font-semibold">{post.attributes.user.data.attributes.name}</p>
                                            </Link>
                                            <Link href={`/${post.attributes.user.data.attributes.username}`}>
                                                <p className="text-text-third text-sm">@{post.attributes.user.data.attributes.username}</p>
                                            </Link>
                                            <p className="ml-[6px] text-xs text-text-third relative before:absolute before:top-[8px] before:block before:bg-text-third before:w-[2px] before:h-[2px] before:rounded-full before:-left-[6px]">{aDayAgo(post?.attributes.createdAt)}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary">{post.attributes.caption}</p>
                                    </div>
                                    <div className="text-right flex-1">
                                        <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => infoPostHandler(post.id)} className="cursor-pointer px-2 py-1" />
                                        <div id={post.id} ref={element => infoPost.current[i] = element} className="fixed -bottom-full transition-all z-50 bg-bg-primary duration-300 border border-border-primary max-w-[400px] sm:max-w-[500px] left-0 right-0 mx-auto overflow-auto h-[20%] rounded-t-xl">
                                            <div className="flex text-center items-center justify-evenly h-full relative">
                                                <div className="absolute right-6 top-4 cursor-pointer hover:bg-slate-600/20 px-[10px] py-[4px] rounded-lg" onClick={() => infoCloseHandler(post.id)}>
                                                    <FontAwesomeIcon icon={faXmark} size="lg" />
                                                </div>
                                                <div className={`${post.attributes.user.data.attributes.username === currentUser.username ? "" : "hidden"} cursor-pointer hover:-translate-y-1 transition-all`} onClick={() => deletePostHandler(post.id)}>
                                                    <FontAwesomeIcon icon={faTrash} size="xl" className="text-red-500" />
                                                    <p className="text-text-third text-sm mt-1">Delete</p>
                                                </div>
                                                <div className="cursor-not-allowed hover:-translate-y-1 transition-all">
                                                    <FontAwesomeIcon icon={faLink} size="xl" />
                                                    <p className="text-text-third text-sm mt-1">Link (not available)</p>
                                                </div>
                                                <div className="cursor-not-allowed hover:-translate-y-1 transition-all relative">
                                                    <FontAwesomeIcon icon={faBookmark} size="xl" />
                                                    <p className="text-text-third text-sm mt-1">Save (not available)</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div id={post.id} className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center backdrop-blur-md opacity-0 flex -z-50" ref={element => confirm.current[i] = element}>
                                            <div className="bg-bg-primary opacity-1 max-w-md w-[90%] flex flex-col justify-center items-center px-4 py-12 rounded-lg gap-6 shadow-2xl relative scale-0 transition-all">
                                                <div className="absolute right-6 top-4 cursor-pointer hover:bg-slate-600/20 px-[10px] py-[4px] rounded-lg" onClick={() => closePopup(post.id)}>
                                                    <FontAwesomeIcon icon={faXmark} size="lg" />
                                                </div>
                                                <FontAwesomeIcon icon={faTriangleExclamation} size="3x" />
                                                <p className="text-center">Are you sure want to delete this post?</p>
                                                <div className="text-sm flex flex-wrap justify-center gap-3">
                                                    <button className="bg-red-500 px-7 py-2 rounded-full bg-button-primary active:scale-105 transition-transform cursor-pointer duration-75" onClick={() => deleteConfirm(post.id)}>Yes, i'm sure</button>
                                                    <button className="border px-4 py-2 border-border-primary rounded-full active:scale-105 transition-transform cursor-pointer duration-75" onClick={() => closePopup(post.id)}>No, cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                <div className="w-full relative aspect-square">
                                    <Image alt="post image" src={`${post.attributes.image?.data?.attributes.url}`} fill className="object-cover" /> 
                                </div>
                                </div>
                                <div className="px-3 py-4 w-max flex gap-6">
                                    <div className="flex gap-2 items-start">
                                        <FontAwesomeIcon id={post.id} ref={element => likeElements.current[i] = element} icon={faHeart} size={"lg"} className={`${post.attributes.likedBy.data.some(user => user.id === userId) ? "text-red-500" : ""} hover:cursor-pointer`} onClick={(e) => likeDislikeHandler(e, post, i)} />
                                        <div ref={element => likeCount.current[i] = element} className="text-xs">{post.attributes.likedBy.data.length}</div>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                        <FontAwesomeIcon icon={faComment} className="cursor-pointer" size={"lg"} onClick={(e) => commentHandler(e, post, i)} />
                                    </div>
                                </div>
                            </div>
                            <div ref={element => context.commentElement.current[i] = element} id={post.id} className="fixed -bottom-full transition-all z-50 bg-bg-primary duration-300 border border-border-primary max-w-full sm:max-w-[800px] left-0 right-0 mx-auto h-full overflow-auto sm:h-[60%] sm:rounded-t-xl">
                                <div className="flex w-full">
                                    <div className="max-w-[390px] hidden sm:block">
                                        <div className="sticky top-0">
                                            <div className="w-[390px] relative aspect-square">
                                                <Image alt="post image" src={`${post.attributes.image?.data?.attributes.url}`} fill className="object-cover" /> 
                                            </div>
                                        </div>
                                    </div>
                                    <Comments data={{post, token, currentUser, currentI, postsApi}} />
                                </div>
                            </div>
                        </div>
                    )
                })
            )
        )}

    </>
  )
}
