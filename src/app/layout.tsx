import "./globals.css";
import ToastProvider from "@/components/Toast";

export const metadata = {
  title: "UNAU — Makerere University Chapter",
  description: "United Nations Association of Uganda, Makerere University Chapter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
