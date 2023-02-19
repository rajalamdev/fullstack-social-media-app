import Router, { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faGear} from "@fortawesome/free-solid-svg-icons";
import { UseAppContext } from "@/context/AppContext";

export default function TopNav({currentUser, token}) {  
  const context = UseAppContext();
  
  const navLinks = [
    {name: "Home", href: "/"}, {name: "Create Post", href: "/posts/create"}, {name: "Settings", href: "/settings"}, 
    {name: "Notification", href: "/notification"}
  ]  

  const [current, setCurrent] = useState()
  const [currentPath, setCurrentPath] = useState()
  const topNav = useRef()
  const [search, setSearch] = useState();
  const router = useRouter()

  useEffect(() => {
    if(search == "") {
      context.setSearchUsersApi([])
      context.setSearchPostsApi([])
    }

    const req = async () => {
        if(search != ""){
            if(context.userFilterButton){
            context.setUsersLoading(true)
            const reqSearch = await fetch(`${process.env.PUBLIC_API_URL}/api/users?populate=*&filters[$or][0][name][$startsWith]=${search}&filters[$or][1][username][$startsWith]=${search}`, {
              headers: {
                "Authorization": "Bearer " + token
              }
            })
      
            const resSearch = await reqSearch.json()
            
            context.setSearchUsersApi(() => resSearch)
            context.setUsersLoading(false)
          } else {
            context.setPostsLoading(true)
            const reqSearchPosts = await fetch(`${process.env.PUBLIC_API_URL}/api/posts?populate[user][populate]=image&populate[likedBy]=*&populate[image]=*&filters[$or][0][caption][$startsWith]=${search}&populate[comments][populate][user][populate][0]=image&populate[comments][populate][replies][populate][user][populate][0]=image&filters[$or][1][user][username][$startsWith]=${search}`, {
              headers: {
                  "Authorization": "Bearer " + token
              }
            })
      
            const resSearchPosts = await reqSearchPosts.json()
            
            context.setSearchPostsApi(resSearchPosts.data)
              context.setPostsLoading(false)
          }
    
        }
      }
      req()
  }, [search, context.userFilterButton])

  useEffect(() => {
    setCurrentPath(Router.pathname)
    window.addEventListener("scroll", () => {
      const top = window.scrollY;
      const navOffset = topNav?.current?.offsetTop

      if(top >= navOffset){
        topNav?.current?.classList.remove("absolute", "top-2", "py-[20px]")        
        topNav?.current?.classList.add("fixed", "bg-nav-primary", "backdrop-blur-md", "top-0", "py-4", "border-b")
      }
      
      if(top == 0){
        topNav?.current?.classList.remove("fixed", "bg-nav-primary", "backdrop-blur-md", "top-0", "py-4", "border-b")
        topNav?.current?.classList.add("absolute", "top-2", "py-[20px]")
      }
    })

    navLinks.map((nav) => {
        if(Router.query.profile) return setCurrent("@" + router.query.profile)

        Router.pathname === nav.href && setCurrent(nav.name)
    })
  })

  function settingHandler(){
    Router.push("/settings")
  }

  function setSearchHandler(value){
    setTimeout(() => {
        setSearch(value)
    })
  }

  return (
    <>
        <div ref={topNav} className="left-0 transition-all z-40 duration-200 right-0 py-[20px] absolute top-2 border-border-primary">
            <div className={`max-w-[390px] sm:max-w-[500px] mx-auto flex ${currentPath?.includes("settings") ? "" : "justify-between"} gap-8 items-center px-4`}>
              <FontAwesomeIcon className="cursor-pointer" onClick={() => Router.back()} icon={faChevronLeft} size="lg" />
              {currentPath === "/search" ? (
               <form className="flex flex-col gap-6 mx-auto max-w-[500px] text-sm w-[80%]">
                    <input  autoComplete="off" type="text" className="w-[90%] block mx-auto h-8 rounded-full mt-1 outline-none self-center bg-bg-primary ring-1 ring-border-secondary px-4 focus:w-full transition-all duration-300 focus:ring-2 focus:ring-header-primary" name="name" onChange={(e) => setSearchHandler(e.target.value)} placeholder="Search..."></input>
              </form>
              ): (
                <h1 className="text-xl font-medium">{current}</h1>
                )}
              {!currentPath?.includes("settings") && (
                <FontAwesomeIcon onClick={settingHandler} icon={faGear} size="lg" className="cursor-pointer" />
              )}
            </div>
        </div>
    </>
  )
}
