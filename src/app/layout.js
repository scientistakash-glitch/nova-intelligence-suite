import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/shared/Chatbot";
import LeftNav from "@/components/shared/LeftNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: "Nova Intelligence",
  description: "A suite of three AI tools built for Nova's finance teams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body style={{ margin: 0, padding: 0, display: 'flex', minHeight: '100vh', background: 'var(--nova-bg)' }}>
        <LeftNav />
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        <Chatbot />
      </body>
    </html>
  );
}
