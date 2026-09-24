"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { memberLogoutAction } from "@/actions/memberAuthActions";

export default function MemberAccountHeader({ name }: { name: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await memberLogoutAction();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="member-account-header">
      <Image src="/admin-avatar.svg" alt="Member profile avatar" width={32} height={32} className="member-account-avatar" />
      <div><strong>{name}</strong><span>Chapter member</span></div>
      <button type="button" className="member-signout" onClick={handleSignOut}>Sign out</button>
    </div>
  );
}