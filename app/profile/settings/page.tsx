import { getUserById } from "@/app/admin/users/actions";
import { auth } from "@/auth";
import ProfileSettings from "@/components/profile/profile-settings";
import { redirect } from "next/navigation";
import { Toaster } from "sonner"

export default async function Page() {
    const session = await auth();
    if (!session?.user?.id) {
      redirect('/sign-in'); 
    }
    const user = await getUserById(session?.user?.id);
    const hasAccount = !!user?.accounts.length
  return (
    <>
      <ProfileSettings hasAccount={hasAccount}/>
      <Toaster />
    </>
  )
}
