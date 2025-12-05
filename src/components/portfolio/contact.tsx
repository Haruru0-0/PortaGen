import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { useAppSound } from "@/contexts/sound-context"
import emailjs from '@emailjs/browser'
import { ContactData, ContactInfoItem, SocialLink } from "@/lib/types"

export default function Contact({ windowWidth, data }: { windowWidth?: number; data?: ContactData }) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Use form config from data or fall back to hardcoded values
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

  // Helper function to get link for contact type
  const getLinkForType = (type: string, value: string): string => {
    switch (type) {
      case 'email': return `mailto:${value}`;
      case 'phone': return `tel:${value.replace(/\s+/g, '')}`;
      case 'location': return `https://maps.google.com/?q=${encodeURIComponent(value)}`;
      default: return value;
    }
  };

  // Helper function to extract platform from URL
  const getPlatformFromUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      if (domain.includes('linkedin.com')) return 'linkedin';
      if (domain.includes('github.com')) return 'github';
      if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
      return 'custom';
    } catch {
      return 'custom';
    }
  };

  // Use data from props or provide defaults
  const contactInfo = data?.contactInfo?.map((item: ContactInfoItem, index: number) => {
    // Map contact info items to the expected format
    const icons: Record<string, React.ReactNode> = {
      email: <Mail className="h-5 w-5" />,
      phone: <Phone className="h-5 w-5" />,
      location: <MapPin className="h-5 w-5" />,
      custom: <Mail className="h-5 w-5" />, // Default icon for custom
    };

    return {
      icon: icons[item.type] || icons.custom,
      title: item.label || item.type.charAt(0).toUpperCase() + item.type.slice(1),
      value: item.value,
      link: item.link || getLinkForType(item.type, item.value),
    };
  }) || [
      {
        icon: <Mail className="h-5 w-5" />,
        title: "Email",
        value: data?.email || "ahmad.w.kanaan@gmail.com",
        link: data?.email ? `mailto:${data.email}` : "mailto:ahmad.w.kanaan@gmail.com",
      },
      {
        icon: <Phone className="h-5 w-5" />,
        title: "Phone",
        value: data?.phone || "+961 81 849 055",
        link: data?.phone ? `tel:${data.phone.replace(/\s+/g, '')}` : "tel:+96181849055",
      },
      {
        icon: <MapPin className="h-5 w-5" />,
        title: "Location",
        value: data?.location || "Beirut, Lebanon",
        link: data?.location ? `https://maps.google.com/?q=${encodeURIComponent(data.location)}` : "https://maps.google.com/?q=San+Francisco,+CA",
      },
    ];

  const socialLinks = data?.socialLinks?.map((social: SocialLink, index: number) => {
    // Map social links to the expected format with icons
    const socialIcons: Record<string, React.ReactNode> = {
      linkedin: <Linkedin className="h-5 w-5" />,
      github: <Github className="h-5 w-5" />,
      twitter: <Twitter className="h-5 w-5" />,
      // Add more social platforms as needed
    };

    const platform = social.platform?.toLowerCase() || getPlatformFromUrl(social.url);

    return {
      icon: socialIcons[platform] || <Linkedin className="h-5 w-5" />,
      name: social.name || social.platform || "Social",
      url: social.url,
    };
  }) || [
      {
        icon: <Linkedin className="h-5 w-5" />,
        name: "LinkedIn",
        url: "https://linkedin.com/in/username",
      },
      {
        icon: <Github className="h-5 w-5" />,
        name: "GitHub",
        url: "https://github.com/username",
      },
      {
        icon: <Twitter className="h-5 w-5" />,
        name: "Twitter",
        url: "https://twitter.com/username",
      },
    ];

  const isMultiColumn = windowWidth ? windowWidth >= 750 : false;


  return (
    <div className="space-y-8 max-w-5xl mx-auto pixel-text">
      <AnimatedSection variant="scale" duration={0.7} className="text-center">
        <h1 className="text-3xl font-bold mb-2 pixel-title">{data?.title || "Get In Touch"}</h1>
        <p className="opacity-80">{data?.description || "Have a question or want to work together? Drop me a message!"}</p>
      </AnimatedSection>

      <div className={`grid ${isMultiColumn ? 'grid-cols-3' : 'grid-cols-1'} gap-8`}>
        <AnimatedSection variant="slideRight" delay={0.1} className={`${isMultiColumn ? 'col-span-1' : ''} space-y-6`}>
          {contactInfo.map((info: any, index: number) => (
            <AnimatedItem key={index}>
              <Card className="hover:shadow-md transition-shadow border-0 pixel-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-[var(--cute-highlight)] p-3 rounded-none shrink-0 border-2 border-[var(--cute-text)] text-[var(--cute-text)]">{info.icon}</div>
                  <div className="min-w-0">
                    <h3 className="font-medium pixel-text">{info.title}</h3>
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

          <div className="pt-4">
            <h3 className="font-medium mb-3 pixel-title">Connect on Social Media</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social: any, index: number) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--cute-highlight)] hover:bg-[var(--cute-highlight)]/80 p-2 rounded-none border-2 border-[var(--cute-text)] text-[var(--cute-text)] transition-colors"
                  aria-label={social.name}
                  onClick={playClickSound}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </AnimatedSection>

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
              ) : data?.showForm !== false ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="opacity-80">
                    {data?.showForm === false ? "Contact form is disabled for this portfolio." : "Thank you for your interest!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {data?.mapUrl && (
        <AnimatedSection variant="fadeIn" delay={0.4} threshold={.2}>
          <div className="mt-8 rounded-none overflow-hidden h-64 border-2 border-[var(--cute-text)]">
            <iframe
              title="Map"
              src={data.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}