import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "HelpHub AI",
  description: "Find help faster. Become help that matters.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="max-w-[1200px] mx-auto px-6">
            <Navbar />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
