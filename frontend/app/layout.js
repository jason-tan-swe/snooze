import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import App from "./components/App";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Snooze",
  description: "Research conducted by Jason Tan regarding Oura Ring and Power Nap Patterns",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <App>
          {children}
        </App>
      </body>
    </html>
  );
}
