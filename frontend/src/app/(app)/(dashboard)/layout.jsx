import { Navbar } from '@/components/Navbar';
import React from 'react'
export default async function RootLayout({ children }) {
    
    return (
        <div className='px-40'>
            <Navbar/>
          {children}
        </div>
    );
}