import "./globals.css";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ChatProvider } from "../context/ChatContext";
import { SettingsProvider } from "../context/SettingsContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Venom AI Assistant",
  description: "Hybrid personality-driven AI assistant with cloud and local inference",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}>
        <SettingsProvider>
          <ChatProvider>{children}</ChatProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
