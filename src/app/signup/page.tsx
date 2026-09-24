import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";
import { getMemberSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const member = await getMemberSession();
  if (member) redirect("/");

  return (
    <>
      <Header />
      <main style={{ maxWidth: 640 }}>
        <SignupForm />
      </main>
      <Footer />
    </>
  );
}
