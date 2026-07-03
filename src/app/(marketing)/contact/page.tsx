import type { Metadata } from 'next'
import { Mail, Phone, Clock, Send, HelpCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ContactForm } from './contact-form'   // ✅ imports the new form

export const metadata: Metadata = {
  title: 'Contact Us | SmithShop',
  description:
    'Reach SmithShop support for help with orders, top‑ups, or account issues. We reply within 24 hours.',
  keywords: [
    'contact',
    'support',
    'help',
    'game topup help',
    'customer service',
    'smithshop contact',
  ],
}

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@smithshop.com',
    link: 'mailto:support@smithshop.com',
    description: "We'll respond within 24 hours.",
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+251968783613',
    link: 'tel:+251968783613',
    description: 'Mon–Fri, 9 AM – 6 PM EST',
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: '24/7 Live Chat',
    link: 'https://t.me/Ethiosmith',
    description: 'Available for urgent inquiries',
  },
]

const faqs = [
  {
    question: 'How long does it take to receive my top-up?',
    answer:
      'Most top-ups are delivered instantly within seconds after payment confirmation. In rare cases, it may take up to 5 minutes.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept Chapa payment (telebirr,  cbe ...).',
  },
  {
    question: 'Is my personal information secure?',
    answer:
      'Yes, we use enterprise-grade SSL encryption and never store your payment details. Your privacy is our priority.',
  },
  {
    question: 'Can I cancel or refund my order?',
    answer:
      'Refunds are handled on a case-by-case basis. Please contact our support team within 24 hours of purchase.',
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 md:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <HelpCircle className="size-4 text-primary" />
              <span>We're Here to Help</span>
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Have a question about your order, a top-up, or just want to say hello?
              Our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CONTACT INFO CARDS ===== */}
      <section className="container mx-auto -mt-8 px-4 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item, index) => {
            const Icon = item.icon
            return (
              <a
                key={index}
                href={item.link}
                className="group flex flex-col items-center rounded-xl bg-background p-6 text-center shadow-md transition hover:shadow-lg hover:ring-2 hover:ring-primary/20"
              >
                <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm font-medium text-primary">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </a>
            )
          })}
        </div>
      </section>

      {/* ===== CONTACT FORM + SIDE INFO ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Send Us a Message
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Fill in the form below and we'll get back to you within 24
                  hours.
                </p>
                <Separator className="mt-4 w-16" />
              </div>
              <ContactForm />
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border bg-muted/30 p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <HelpCircle className="size-5 text-primary" />
                    Quick Answers
                  </h3>
                  <ul className="space-y-3 text-sm">
                    {faqs.map((faq, index) => (
                      <li key={index}>
                        <details className="group">
                          <summary className="cursor-pointer font-medium text-foreground hover:text-primary">
                            {faq.question}
                          </summary>
                          <p className="mt-1 pl-3 text-muted-foreground">
                            {faq.answer}
                          </p>
                        </details>
                        {index < faqs.length - 1 && (
                          <Separator className="mt-3" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border bg-primary/5 p-6 text-center">
                  <p className="text-sm font-medium">
                    Prefer instant help?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Our live chat is available 24/7.
                  </p>
                  <button
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"

                  >
                    <Send className="size-4" />
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}