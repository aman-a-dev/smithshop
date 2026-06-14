import CardNav from '@/components/registries/card-nav'

export default function NavBar() {
   const items = [
      {
         label: 'Products',
         links: [
            { label: 'Gaming', ariaLabel: 'Gaming', url: '/products'  },
            { label: 'Level up', ariaLabel: 'levelup', url: '/products' },
            {
               label: 'Social media',
               ariaLabel: 'Social media',
               url: '/products' 
            }
         ]
      },
      {
         label: 'About',
         links: [
            { label: 'Company', ariaLabel: 'About Company', url: '/' },
            { label: 'Careers', ariaLabel: 'About Careers', url: '/' }
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
      }
   ]

   return <CardNav items={items} />
}
