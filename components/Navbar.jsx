import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHome, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { UseAppContext } from "@/context/AppContext";
import { useRouter } from "next/router";

export default function Navbar({currentUser}) {
  const context = UseAppContext()
  const router = useRouter()

  return (
    !context.currentPath?.includes("settings") && (
      <div className="flex z-30 justify-center w-full items-center border-t border-border-primary fixed bottom-0 left-0 right-0 bg-bg-primary gap-10 py-4">
        <Link href="/" className={`${context.currentPath === "/" ? "active" : ""}`}>
          <FontAwesomeIcon icon={faHome} size="lg" />
        </Link>
        <Link href="/search" className={`${(context.currentPath === "/search" || context.currentPath === "/[profile]") && router.query.profile !== currentUser.username ? "active" : ""}`}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
        </Link>
        <Link href="/posts/create" className={`${context.currentPath === "/posts/create" ? "active" : ""}`}>
          <FontAwesomeIcon icon={faSquarePlus} size="lg" />
        </Link>
        <Link href="/notification" className={`${context.currentPath === "/notification" ? "active" : ""}`}>
          <FontAwesomeIcon icon={faBell} size="lg" />
        </Link>
        <Link href="/[profile]" as={`/${currentUser?.username}`} className={`${context.currentPath === "/[profile]" && router.query.profile === currentUser.username ? "active" : ""}`}>
          <div className="relative w-[30px] h-[30px] overflow-hidden rounded-full">
            <Image alt="user" src={currentUser?.image ? currentUser?.image.url : "/profile-default.png"} fill className="object-cover" />
          </div>
        </Link>
      </div>
    )
  )
}
