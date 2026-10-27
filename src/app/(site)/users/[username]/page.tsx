import Profile from "@/components/Profile";
import { useParams } from "next/navigation";

export default async function ProfilePage() {
    const {username} = useParams();

    return (<Profile param={`${username}`} />);
}