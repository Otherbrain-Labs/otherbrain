import { getServerSession as nextGetServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getServerSession() {
  return await nextGetServerSession(authOptions);
}
