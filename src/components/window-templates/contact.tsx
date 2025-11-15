import type React from "react"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { useAppSound } from "@/components/portfolio/sound-context"
// Replaced EmailJS with server-side API call to /api/contact

export default function Contact() {
  const params = useParams<{ id?: string; slug?: string }>()
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
          // include portfolio id or slug when available so API can route to owner
          portfolioId: params?.id ? Number(params.id) : undefined,
          slug: params?.slug ? String(params.slug) : undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to send')

      setIsSubmitted(true)
      playSuccessSound()
      setFormState({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      console.error("Failed to send email:", err)
      setError("Failed to send message. Please try again later.")
      playErrorSound()
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      value: "ahmad.w.kanaan@gmail.com",
      link: "mailto:ahmad.w.kanaan@gmail.com",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      value: "+961 81 849 055",
      link: "tel:+96181849055",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Location",
      value: "Beirut, Lebanon",
      link: "https://maps.google.com/?q=San+Francisco,+CA",
    },
  ]

  const socialLinks = [
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
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <AnimatedSection variant="scale" duration={0.7} className="text-center">
        <h1 className="text-3xl font-bold mb-2">Get In Touch</h1>
        <p className="text-gray-700 dark:text-gray-300">Have a question or want to work together? Drop me a message!</p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatedSection variant="slideRight" delay={0.1} className="md:col-span-1 space-y-6">
          {contactInfo.map((info, index) => (
            <AnimatedItem key={index}>
              <Card className="hover:shadow-md transition-shadow border-0">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">{info.icon}</div>
                  <div className="min-w-0">
                    <h3 className="font-medium">{info.title}</h3>
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary truncate block"
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
            <h3 className="font-medium mb-3">Connect on Social Media</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted hover:bg-muted/80 p-2 rounded-full transition-colors"
                  aria-label={social.name}
                  onClick={playClickSound}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection variant="slideLeft" delay={0.2} className="md:col-span-2">
          <Card className="border-0">
            <CardContent className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-800 p-3 rounded-full inline-flex mb-4">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I&#39;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formState.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Project Inquiry"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or inquiry..."
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
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
      </div>

      <AnimatedSection variant="fadeIn" delay={0.4} threshold={0.2}>
        <div className="mt-8 rounded-xl overflow-hidden h-64">
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1652813309840!5m2!1sen!2sus"
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
