import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MainWrapper from "@/components/layout/MainWrapper";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Parity | Play with Purpose. Win with Impact.",
  description: "Parity is a subscription-based platform for golf performance tracking and charity impact. Win monthly prizes while supporting your favorite charities.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
          <Navbar />
          <MainWrapper>
            {children}
          </MainWrapper>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
