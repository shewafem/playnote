import { auth } from "@/auth";
import ProfileSettings from "@/components/profile/profile-settings";
import { redirect } from "next/navigation";
import { Toaster } from "sonner"

export default async function Page() {
    const session = await auth();
    if (!session?.user?.id) {
      redirect('/sign-in'); 
    }
  return (
    <>
      <ProfileSettings/>
      <Toaster />
    </>
  )
}
