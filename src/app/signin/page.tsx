import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberSigninForm from "@/components/MemberSigninForm";

export default async function SigninPage({ searchParams }: { searchParams: { email?: string; redirect?: string } }) {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 480 }}>
        <MemberSigninForm initialEmail={searchParams.email || ""} redirectTo={searchParams.redirect || "/"} />
      </main>
      <Footer />
    </>
  );
}