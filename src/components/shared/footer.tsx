import Link from 'next/link'
import Logo from '@/components/shared/logo'
import {
  IconBrandTelegram,
  IconHeadset,
  IconRobot,
} from '@tabler/icons-react'

// Navigation links
const navLinks = [
  { title: 'Products', href: '/products' },
  { title: 'About', href: '/about' },
  { title: 'Legal', href: '/legal' },
  { title: 'Help', href: 'https://t.me/Smithdshop1' },
]

// Social / Contact links
const socialLinks = [
  {
    href: 'https://t.me/Smithdshop1',
    icon: IconHeadset,
    ariaLabel: 'Telegram Support',
  },
  {
    href: 'https://t.me/Ethiosmith',
    icon: IconBrandTelegram,
    ariaLabel: 'Telegram Channel',
  },
  {
    href: 'https://t.me/smithtopupbot',
    icon: IconRobot,
    ariaLabel: 'Telegram Bot',
  },
]

export default function Footer() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/"
          aria-label="Go home"
          className="mx-auto block w-fit"
        >
          <Logo />
        </Link>

        {/* Navigation */}
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors"
              {...(link.href.startsWith('http')
                ? {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
                : {})}
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Telegram Links */}
        <div className="my-8 flex flex-wrap items-center justify-center gap-6">
          {socialLinks.map((social) => {
            const Icon = social.icon

            return (
              <Link
                key={social.ariaLabel}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon size={26} stroke={1.8} />
              </Link>
            )
          })}
        </div>

        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} SmithShop. All rights reserved.
        </span>
      </div>
    </footer>
  )
}