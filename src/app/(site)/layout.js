import Sidebar from "@/components/SideBar"
export default function MainLayout({children}) {
    return (
        <div style={{display: "flex", minHeight: "100vh"}}>
            <Sidebar />
            {children}
        </div>
    )
} 