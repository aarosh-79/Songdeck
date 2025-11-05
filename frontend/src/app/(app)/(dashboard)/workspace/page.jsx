

import { Navbar } from "@/components/Navbar";
import JoinWorkspace from "@/appPages/JoinWorkspace";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

export default async function Home() {
  return (
    <div> 
      <JoinWorkspace/>
    </div>
  );
}
