import Link from 'next/link'
import Logo from '@/components/shared/logo'
import { User } from 'lucide-react'

// Navigation links
const navLinks = [
   { title: 'Products', href: '/products' },
   { title: 'About', href: '/about' },
   { title: 'Legal', href: '/legal' },
   { title: 'Help', href: 'https://t.me/Smithdshop1' }
]

// Social links – using Lucide icons
const socialLinks = [
   {
      href: '#',
      icon: User,
      ariaLabel: 'X/Twitter'
   },
   {
      href: '#',
      icon: User,
      ariaLabel: 'LinkedIn'
   },
   {
      href: '#',
      icon: User,
      ariaLabel: 'Facebook'
   },
   {
      href: '#',
      icon: User,
      ariaLabel: 'Instagram'
   },
   {
      href: '#',
      icon: User,
      ariaLabel: 'TikTok'
   }
]

export default function Footer() {
   return (
      <footer className='py-16 md:py-32'>
         <div className='mx-auto max-w-5xl px-6'>
            <Link
               href='/'
               aria-label='go home'
               className='mx-auto block size-fit'
            >
               <Logo />
            </Link>

            {/* Navigation links – looped */}
            <div className='my-8 flex flex-wrap justify-center gap-6 text-sm'>
               {navLinks.map((link, index) => (
                  <Link
                     key={index}
                     href={link.href}
                     className='text-muted-foreground hover:text-primary block duration-150'
                  >
                     {link.title}
                  </Link>
               ))}
            </div>

            {/* Social links – looped with Lucide icons */}
            <div className='my-8 flex flex-wrap justify-center gap-6 text-sm'>
               {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                     <Link
                        key={index}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={social.ariaLabel}
                        className='text-muted-foreground hover:text-primary block'
                     >
                        <Icon className='size-6' />
                     </Link>
                  )
               })}
            </div>

            <span className='font-[cursive] text-muted-foreground block text-center text-sm'>
               © {new Date().getFullYear()} SmithShop, All rights reserved
            </span>
         </div>
      </footer>
   )
}
