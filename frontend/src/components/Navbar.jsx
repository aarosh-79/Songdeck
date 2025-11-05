import React from 'react'
import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { auth } from '@/app/api/auth/[...nextauth]/auth'

const NavbarList = [
    {
        id: "1",
        title: "Home",
        redirectTo: "/workspace",
    },
    {
        id: "2",
        title: "Workspace",
        redirectTo: "/createworkspace",
    },
    {
        id: "3",
        title: "Requests",
        redirectTo: "/reqsongs",
    },
    {
        id: "4",
        title: "Queue",
        redirectTo: "/queue",
    },
]

export const Navbar = async () => {
  const session =  await auth()
  console.log(session.user, "this is sesson")
  return (
    <section className='mt-4'>
      <nav className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold '>SongDeck</h2>

        <div className='flex items-center justify-between gap-6'>
          {NavbarList.map(listItem => (
            <Link
              key={`${listItem.id}-${listItem.title}`}
              href={listItem.redirectTo}
              className="text-xl leading-tight tracking-tight font-semibold text-slate-800 hover:text-slate-600"
            >
              {listItem.title}
            </Link>
          ))}
        </div>

        <div className='flex gap-6 items-center justify-center'>
          <Bell className='w-6 h-6'/>
          <Search className='w-6 h-6'/>
          <Avatar className={'w-6 h-6'}>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>{session.user.name}</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </section>
  )
}
