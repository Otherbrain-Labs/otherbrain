import { getServerSession } from "next-auth/next";
import SignInButton from "./sign-in-button";
import { AccountDropdown } from "./account-dropdown";

export default async function AuthNavItem() {
  const session = await getServerSession();

  return session?.user ? (
    <AccountDropdown email={session.user.email} />
  ) : (
    <SignInButton />
  );
}
