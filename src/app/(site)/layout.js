import Sidebar from "@/components/SideBar";
import { getUserIdFromToken } from "@/lib/getUser";
export default async function MainLayout({children}) {
    const userId = await getUserIdFromToken();

    return (
        <div style={{display: "flex", minHeight: "100vh"}}>
            <Sidebar user={userId} />
            {children}
        </div>
    )
} 