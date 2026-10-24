import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/server";
import { sql } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function MainLayout({children} : LayoutProps<"/">) {

    const { data: session } = await auth.getSession();

    let username: string | null = null;
    if (session?.user?.id) {
        const rows = await sql`
            SELECT username FROM public.profiles
            WHERE "userId" = ${session.user.id}::uuid
            LIMIT 1
        `;
        username = rows[0]?.username ?? null;
    }

    return(
        <div id="mainl">
            <Sidebar isLogged={!!session?.user} username={username}/>
            <div id="mainl-content">
                {children}
            </div>
        </div>
    )
}