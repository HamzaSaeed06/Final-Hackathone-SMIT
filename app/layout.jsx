import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HelpHub AI",
  description: "Find help faster. Become help that matters.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="max-w-[1280px] mx-auto px-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
