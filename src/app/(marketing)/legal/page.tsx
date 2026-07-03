import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function LegalPage() {
  return (
    <Tabs defaultValue="los" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="los">Terms of use</TabsTrigger>
        <TabsTrigger value="pp">Privacy Policy</TabsTrigger>
      </TabsList>
      <TabsContent value="los">
        <Card>
          <CardHeader>
            <CardTitle>Terms</CardTitle>
            <CardDescription>

            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            ### Terms of Service
            **Last Updated: July 2026**

            Welcome to SmithShop. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.

            #### 1. Eligibility & Account Registration
            * **Authentication:** To access certain features and purchase top-ups, you must authenticate using Google OAuth or Telegram OAuth via our secure Better-Auth system.
            * **Account Security:** You are responsible for maintaining the security of your third-party accounts (Google/Telegram). SmithShop is not liable for unauthorized access resulting from your failure to secure these accounts.
            * **Age Restrictions:** If you are under the age of majority in your jurisdiction, you must have permission from a parent or legal guardian to use this site.

            #### 2. Digital Goods & Top-Up Purchases
            * **Accuracy of Information:** When purchasing game credits or social media top-ups, you must provide the correct Player ID, User ID, or Account details. SmithShop is **not responsible** for top-ups sent to the wrong account due to user error.
            * **Delivery:** Most digital deliveries are fulfilled instantly or within a few minutes. In case of technical delays, please contact support before attempting a chargeback.

            #### 3. Refunds & Chargebacks
            * **No Refunds:** Due to the instant nature of digital goods, all completed top-up transactions are **final and non-refundable**.
            * **Fraud Prevention:** Any fraudulent chargebacks or unauthorized disputes will result in the immediate and permanent termination of your account, and your details may be reported to gaming publishers or legal authorities.

            #### 4. Limitation of Liability
            SmithShop provides services on an "as-is" basis. We do not guarantee that third-party game servers or social media platforms will accept the credits if their respective platforms are experiencing downtime or have changed their policies.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pp">
        <Card>
          <CardHeader>
            <CardTitle>Policy</CardTitle>
            <CardDescription>
              Track performance and user engagement metrics. Monitor trends and
              identify growth opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            ### Privacy Policy
            **Last Updated: July 2026**

            At SmithShop, we value your privacy. This policy outlines how we collect, use, and protect your information when you use our top-up platform.

            #### 1. Information We Collect
            Because we use **Better-Auth** with Google and Telegram OAuth, we do not collect or store your passwords. We only collect:
            * **Authentication Data:** Your public name, email address (from Google), user ID, and profile picture provided by Google/Telegram OAuth.
            * **Transaction Data:** Your Player ID/User ID for the specific game or platform you are topping up, alongside payment history (excluding raw credit card details, which are handled securely by our payment processors).
            * **Technical Data:** IP addresses, browser types, and basic device metrics to prevent fraud and ensure platform stability.

            #### 2. How We Use Your Information
            We use the collected data solely to:
            * Authenticate your identity and secure your account.
            * Process and deliver your digital top-ups.
            * Provide customer support and resolve order discrepancies.
            * Monitor and detect fraudulent or malicious activity.

            #### 3. Data Sharing & Third Parties
            * **Game/Platform Publishers:** We share your provided Player ID/User ID with the game or social media network API to fulfill your top-up.
            * **Payment Gateways:** Your transaction details are shared securely with authorized payment processors.
            * We **never** sell, rent, or trade your personal information to third-party advertisers.

            #### 4. Data Security & Your Rights
            Your session and authentication data are securely managed by Better-Auth using industry-standard encryption techniques. You have the right to request the deletion of your SmithShop account data at any time by reaching out to our support team.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs >
  )
}


export const metadata: Metadata = {
  title: "Legal Information | SmithShop",
  description:
    "Read SmithShop's terms of service, privacy policy, and refund guidelines for all digital purchases.",
  keywords: ["legal", "terms", "privacy policy", "refund policy", "digital goods"],
};