// Base price item (used by diamonds, UC, stars, coins, robux, cp, followers, etc.)
interface PriceAmountItem {
   amount: number
   price: number
}

// Level-up products have a different shape
interface LevelUpItem {
   level: number
   diamonds: number
   price: number
}

// Membership items
interface MembershipItem {
   name: string
   price: number
}

// Premium duration items (Telegram)
interface PremiumItem {
   duration: string
   price: number
}

// Union type for all possible product items in the "items" array
export type ProductItem = PriceAmountItem | LevelUpItem | MembershipItem | PremiumItem

// A product group inside a category
interface ProductGroup {
   type: string // e.g. 'diamond', 'level-up', 'membership', 'premium', etc.
   items: ProductItem[]
}

// A single game/social media category
interface Category {
   id: string
   name: string
   slug: string
   products: ProductGroup[]
}

// The whole list
export interface ProductsList {
   categories: Category[]
}

export const productsList: ProductsList = {
   categories: [
      {
         id: 'free-fire',
         name: 'Free Fire',
         slug: 'free-fire',
         products: [
            {
               type: 'diamond',
               items: [
                  { amount: 110, price: 185 },
                  { amount: 221, price: 375 },
                  { amount: 330, price: 580 },
                  { amount: 530, price: 940 },
                  { amount: 1100, price: 1860 },
                  { amount: 2200, price: 3600 },
                  { amount: 5000, price: 9070 },
                  { amount: 6160, price: 10880 }
               ]
            },
            {
               type: 'level-up',
               items: [
                  { level: 6, diamonds: 120, price: 90 },
                  { level: 10, diamonds: 200, price: 150 },
                  { level: 15, diamonds: 200, price: 160 },
                  { level: 20, diamonds: 200, price: 165 },
                  { level: 25, diamonds: 200, price: 170 },
                  { level: 30, diamonds: 350, price: 350 }
               ]
            },
            {
               type: 'membership',
               items: [
                  { name: 'Weekly', price: 450 },
                  { name: 'Monthly', price: 1950 },
                  { name: 'Super Monthly', price: 2500 },
                  { name: 'Booyah Pass', price: 300 }
               ]
            }
         ]
      },
      {
         id: 'pubg-mobile',
         name: 'PUBG Mobile',
         slug: 'pubg-mobile',
         products: [
            {
               type: 'uc',
               items: [
                  { amount: 60, price: 185 },
                  { amount: 120, price: 378 },
                  { amount: 180, price: 560 },
                  { amount: 200, price: 620 },
                  { amount: 240, price: 710 },
                  { amount: 325, price: 870 },
                  { amount: 355, price: 980 },
                  { amount: 365, price: 1030 },
                  { amount: 385, price: 1060 },
                  { amount: 415, price: 1180 },
                  { amount: 445, price: 1270 },
                  { amount: 475, price: 1360 },
                  { amount: 505, price: 1410 },
                  { amount: 535, price: 1485 },
                  { amount: 660, price: 1720 },
                  { amount: 720, price: 1859 },
                  { amount: 780, price: 2060 },
                  { amount: 810, price: 2200 },
                  { amount: 1000, price: 2800 },
                  { amount: 1105, price: 3000 }
               ]
            }
         ]
      },
      {
         id: 'telegram',
         name: 'Telegram',
         slug: 'telegram',
         products: [
            {
               type: 'stars',
               items: [
                  { amount: 50, price: 185 },
                  { amount: 100, price: 370 },
                  { amount: 150, price: 460 },
                  { amount: 250, price: 760 },
                  { amount: 350, price: 1160 },
                  { amount: 500, price: 1520 },
                  { amount: 750, price: 2270 },
                  { amount: 1000, price: 3030 }
               ]
            },
            {
               type: 'premium',
               items: [
                  { duration: '1 Month', price: 680 },
                  { duration: '3 Months', price: 2300 },
                  { duration: '6 Months', price: 3000 },
                  { duration: '12 Months', price: 4800 }
               ]
            }
         ]
      },
      {
         id: 'efootball',
         name: 'eFootball',
         slug: 'efootball',
         products: [
            {
               type: 'coins',
               items: [
                  { amount: 130, price: 350 },
                  { amount: 300, price: 690 },
                  { amount: 550, price: 1090 },
                  { amount: 750, price: 1470 },
                  { amount: 1040, price: 1870 },
                  { amount: 2130, price: 3550 },
                  { amount: 3250, price: 5200 },
                  { amount: 5700, price: 8150 }
               ]
            }
         ]
      },
      {
         id: 'tiktok',
         name: 'TikTok',
         slug: 'tiktok',
         products: [
            {
               type: 'coins',
               items: [
                  { amount: 30, price: 160 },
                  { amount: 50, price: 190 },
                  { amount: 60, price: 240 },
                  { amount: 100, price: 340 },
                  { amount: 200, price: 560 },
                  { amount: 300, price: 760 },
                  { amount: 500, price: 1320 },
                  { amount: 700, price: 2000 },
                  { amount: 1000, price: 2820 },
                  { amount: 2000, price: 5100 },
                  { amount: 3000, price: 6550 }
               ]
            }
         ]
      },
      {
         id: 'instagram',
         name: 'Instagram',
         slug: 'instagram',
         products: [
            {
               type: 'followers',
               items: [
                  { amount: 300, price: 150 },
                  { amount: 400, price: 200 },
                  { amount: 500, price: 250 },
                  { amount: 600, price: 300 },
                  { amount: 1000, price: 480 },
                  { amount: 1300, price: 630 },
                  { amount: 1700, price: 830 },
                  { amount: 2000, price: 900 }
               ]
            }
         ]
      },
      {
         id: 'blood-strike',
         name: 'Blood Strike',
         slug: 'blood-strike',
         products: [
            {
               type: 'diamonds',
               items: [
                  { amount: 105, price: 200 },
                  { amount: 320, price: 600 },
                  { amount: 540, price: 900 },
                  { amount: 1100, price: 1500 },
                  { amount: 2260, price: 3400 },
                  { amount: 5800, price: 7700 }
               ]
            }
         ]
      },
      {
         id: 'call-of-duty',
         name: 'Call of Duty',
         slug: 'call-of-duty',
         products: [
            {
               type: 'cp',
               items: [
                  { amount: 80, price: 240 },
                  { amount: 420, price: 900 },
                  { amount: 880, price: 1750 },
                  { amount: 5040, price: 7000 },
                  { amount: 10020, price: 13900 }
               ]
            }
         ]
      },
      {
         id: 'roblox',
         name: 'Roblox',
         slug: 'roblox',
         products: [
            {
               type: 'robux',
               items: [
                  { amount: 500, price: 1160 },
                  { amount: 1000, price: 2100 },
                  { amount: 2000, price: 4000 },
                  { amount: 5250, price: 10000 }
               ]
            }
         ]
      }
   ]
}
