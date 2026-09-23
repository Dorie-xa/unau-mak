import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
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
