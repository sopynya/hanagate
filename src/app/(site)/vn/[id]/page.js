import VNPage from "@/components/VNPage";
import { getUserIdFromToken } from "@/lib/getUser";
export default async function SelectedVnPage({params}) {
    const userId = await getUserIdFromToken();
    const { id } = await params;
    return(<VNPage user={userId} id={id} />)
}