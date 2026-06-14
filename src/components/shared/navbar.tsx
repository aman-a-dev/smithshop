import CardNav from '@/components/registries/card-nav'

export default function NavBar() {
   const items = [
      {
         label: 'Products',
         links: [
            { label: 'Gaming', ariaLabel: 'Gaming', url: '/products' },
            { label: 'Level up', ariaLabel: 'levelup', url: '/products' },
            {
               label: 'Social media',
               ariaLabel: 'Social media',
               url: '/products'
            }
         ]
      },
      {
         label: 'Contact',
         links: [
            {
               label: 'Telegram support',
               ariaLabel: 'Telegram support',
               url: 'https://t.me/Smithdshop1'
            },
            {
               label: 'Telegram Channel',
               ariaLabel: 'Telegram Channel',
               url: 'https://t.me/Ethiosmith'
            },
            { label: 'Telegram Group', ariaLabel: 'Telegram Group', url: '/' }
         ]
      },
      {
         label: 'More',
         links: [
            { label: 'Company', ariaLabel: 'About Company', url: '/about' },
            { label: 'Login', ariaLabel: 'Login', url: '/auth' },
            { label: 'Register', ariaLabel: 'Create account', url: '/auth' }
         ]
      }
   ]

   return <CardNav items={items} />
}
