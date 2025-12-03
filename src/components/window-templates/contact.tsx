import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, Link as LinkIcon } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { useAppSound } from "@/contexts/sound-context"
import emailjs from '@emailjs/browser'
import type { ContactData } from "@/lib/types"

const ICON_MAP: Record<string, any> = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  custom: LinkIcon,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter
}

interface ContactProps {
  data?: ContactData
  windowWidth?: number
}

export default function Contact({ data, windowWidth }: ContactProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { playSuccessSound, playErrorSound, playClickSound } = useAppSound()

  const title = data?.title || "Get In Touch"
  const description = data?.description || "Have a question or want to work together? Drop me a message!"
  const showForm = data?.showForm !== false

  const defaultContactInfo = [
    {
      type: "email",
      label: "Email",
      value: "ahmad.w.kanaan@gmail.com",
      link: "mailto:ahmad.w.kanaan@gmail.com",
    },
    {
      type: "phone",
      label: "Phone",
      value: "+961 81 849 055",
      link: "tel:+96181849055",
    },
    {
      type: "location",
      label: "Location",
      value: "Beirut, Lebanon",
      link: "https://maps.google.com/?q=Beirut,+Lebanon",
    },
  ]

  const contactInfo = data?.contactInfo || defaultContactInfo
  const socialLinks = data?.socialLinks || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const serviceId = data?.formConfig?.serviceId || 'service_gu9vlg7'
      const templateId = data?.formConfig?.templateId || 'template_rfakvho'
      const publicKey = data?.formConfig?.publicKey || '684VFv9sBjrGrc0-P'

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formState.name,
          from_email: formState.email,
          subject: formState.subject,
          message: formState.message,
        },
        publicKey
      )

      setIsSubmitted(true)
      playSuccessSound()
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      console.error("Failed to send email:", err)
      setError("Failed to send message. Please try again later.")
      playErrorSound()
    } finally {
      setIsSubmitting(false)
    }
  }

  const isMultiColumn = windowWidth ? windowWidth >= 750 : false;

  const getIcon = (type: string) => {
    const Icon = ICON_MAP[type.toLowerCase()] || LinkIcon
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pixel-text">
      <AnimatedSection variant="scale" duration={0.7} className="text-center">
        <h1 className="text-3xl font-bold mb-2 pixel-title">{title}</h1>
        <p className="opacity-80">{description}</p>
      </AnimatedSection>

      <div className={`grid ${isMultiColumn && showForm ? 'grid-cols-3' : 'grid-cols-1'} gap-8`}>
        <AnimatedSection variant="slideRight" delay={0.1} className={`${isMultiColumn && showForm ? 'col-span-1' : ''} space-y-6`}>
          {contactInfo.map((info, index) => (
            <AnimatedItem key={index}>
              <Card className="hover:shadow-md transition-shadow border-0 pixel-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-[var(--cute-highlight)] p-3 rounded-none shrink-0 border-2 border-[var(--cute-text)] text-[var(--cute-text)]">
                    {getIcon(info.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium pixel-text">{info.label || info.type}</h3>
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm opacity-70 hover:text-[var(--cute-text)] truncate block"
                      onClick={playClickSound}
                    >
                      {info.value}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </AnimatedItem>
          ))}

          {socialLinks.length > 0 && (
            <div className="pt-4">
              <h3 className="font-medium mb-3 pixel-title">Connect on Social Media</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[var(--cute-highlight)] hover:bg-[var(--cute-highlight)]/80 p-2 rounded-none border-2 border-[var(--cute-text)] text-[var(--cute-text)] transition-colors"
                    aria-label={social.platform}
                    onClick={playClickSound}
                  >
                    {getIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </AnimatedSection>

        {showForm && (
          <AnimatedSection variant="slideLeft" delay={0.2} className={isMultiColumn ? 'col-span-2' : ''}>
            <Card className="border-0 pixel-card">
              <CardContent className="p-6">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 text-green-800 p-3 rounded-full inline-flex mb-4 border-2 border-green-800">
                      <Send className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 pixel-title">Message Sent!</h3>
                    <p className="opacity-80">
                      Thank you for reaching out. I'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-100 text-red-800 p-3 rounded-none border-2 border-red-800">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="pixel-text">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="pixel-text">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="pixel-text">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Project Inquiry"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="pixel-text">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project or inquiry..."
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        required
                        className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-none border-2 border-[var(--cute-text)] bg-[var(--cute-text)] text-white hover:bg-[var(--cute-text)]/90"
                      disabled={isSubmitting}
                      onClick={playClickSound}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        )}
      </div>

      <AnimatedSection variant="fadeIn" delay={0.4} threshold={0.2}>
        <div className="mt-8 rounded-none overflow-hidden h-64 border-2 border-[var(--cute-text)]">
          <iframe
            title="Map"
            src={data?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1652813309840!5m2!1sen!2sus"}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </AnimatedSection>
    </div>
  )
}