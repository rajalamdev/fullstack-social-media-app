import Navbar from "./Navbar";
import TopNav from "./TopNav";
import { UseAppContext } from "@/context/AppContext";

export default function Layout({children, currentUser, token}){
    const context = UseAppContext();

    return (
    <>
        <header className={`${context.currentPath === "/login" || context.currentPath === "/register" ? "hidden": ""}`}>
            <TopNav currentUser={currentUser} token={token} />
            <Navbar currentUser={currentUser} />
        </header>
        <main>
            <div className="pt-20 pb-[56px]">
                {children}
            </div>
        </main>
    </>
    )
}