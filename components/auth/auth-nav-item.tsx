import { getServerSession } from "next-auth/next";
import { AccountDropdown } from "./account-dropdown";
import NavItem from "../nav-item";

export default async function AuthNavItem() {
  const session = await getServerSession();
  return session?.user ? (
    <AccountDropdown email={session.user.email} />
  ) : (
    <NavItem title="Log in" href="/login" />
  );
}
