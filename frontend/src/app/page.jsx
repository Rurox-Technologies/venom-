"use client"

import ChatBox from "../components/chat/ChatBox"
import Sidebar from "../components/sidebar/Sidebar"
import Navbar from "../components/ui/Navbar"
import ConnectionStatus from "../components/ui/ConnectionStatus"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <ConnectionStatus />
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-2 px-2 py-2">
        <div className="hidden w-56 flex-shrink-0 md:block">
          <Sidebar />
        </div>
        <main className="flex-1">
          <ChatBox />
        </main>
      </div>
    </div>
  )
}
