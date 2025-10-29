import { Mail, Phone, MapPin } from "lucide-react"

export default function Contact() {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">hello@example.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">San Francisco, CA</p>
          </div>
        </div>
      </div>

      <form className="space-y-3 pt-4 border-t">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        />
        <textarea
          placeholder="Your Message"
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
