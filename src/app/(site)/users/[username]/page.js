import User from "@/components/User";
export default async function UserPage({params}) {
    const { username } = await params;

    return(<User username={username} />)
}