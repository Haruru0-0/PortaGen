# Contact Component Data Usage

The contact component now supports dynamic data display. Here's how to use it:

## Data Structure

The contact component accepts a `data` prop of type `ContactData`:

```typescript
interface ContactData {
    title?: string;                // Custom title for the contact section
    description?: string;         // Custom description text
    email?: string;               // Email address
    phone?: string;               // Phone number
    location?: string;            // Location information
    contactInfo?: ContactInfoItem[]; // Array of contact information items
    socialLinks?: SocialLink[];   // Array of social media links
    showForm?: boolean;            // Whether to show the contact form (default: true)
    mapUrl?: string;              // URL for the embedded map
    formConfig?: {                // Configuration for the email form
        serviceId: string;
        templateId: string;
        publicKey: string;
    }
}

interface ContactInfoItem {
    type: 'email' | 'phone' | 'location' | 'custom';
    value: string;
    link?: string;                // Optional custom link
    label?: string;               // Optional custom label
}

interface SocialLink {
    platform: string;             // Platform name (e.g., 'linkedin', 'github')
    url: string;                  // URL to the social profile
    name?: string;                // Optional display name
    icon?: string;                // Optional icon name
    color?: string;               // Optional color
}
```

## Example Usage

### Basic Usage (with defaults)
```jsx
<Contact />
```

### Custom Data Example
```jsx
const contactData = {
    title: "Get In Touch",
    description: "Feel free to reach out for collaborations or questions!",
    email: "contact@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    contactInfo: [
        {
            type: 'email',
            value: 'contact@example.com',
            label: 'Work Email'
        },
        {
            type: 'phone',
            value: '+1 234 567 890',
            label: 'Business Phone'
        },
        {
            type: 'location',
            value: 'San Francisco, CA',
            label: 'Office Location'
        }
    ],
    socialLinks: [
        {
            platform: 'linkedin',
            url: 'https://linkedin.com/in/yourprofile',
            name: 'LinkedIn'
        },
        {
            platform: 'github',
            url: 'https://github.com/yourusername',
            name: 'GitHub'
        }
    ],
    showForm: true,
    mapUrl: 'https://maps.google.com/?q=San+Francisco',
    formConfig: {
        serviceId: 'your_emailjs_service_id',
        templateId: 'your_emailjs_template_id',
        publicKey: 'your_emailjs_public_key'
    }
};

<Contact data={contactData} />
```

### Minimal Example (hide form)
```jsx
<Contact data={{
    showForm: false,
    email: "info@example.com",
    socialLinks: [
        {
            platform: 'twitter',
            url: 'https://twitter.com/yourhandle'
        }
    ]
}} />
```

## Data Flow

1. **Database Storage**: Contact data is stored in the `windows` table as JSON in the `content` field
2. **API Retrieval**: The data is fetched via the windows API (`/api/windows/display`)
3. **Component Rendering**: The desktop component passes the window content data to the contact component
4. **Dynamic Display**: The contact component uses the provided data or falls back to defaults

## Supported Contact Types

The component supports these contact info types:
- `email` - Renders with mail icon and mailto link
- `phone` - Renders with phone icon and tel link
- `location` - Renders with map pin icon and maps link
- `custom` - Renders with default icon and custom link

## Supported Social Platforms

The component automatically detects and renders icons for:
- `linkedin` - LinkedIn icon
- `github` - GitHub icon
- `twitter` - Twitter icon
- Custom platforms use a default LinkedIn icon

## Form Configuration

If you want to use a custom EmailJS configuration, provide the `formConfig` object with:
- `serviceId`: Your EmailJS service ID
- `templateId`: Your EmailJS template ID
- `publicKey`: Your EmailJS public key

If not provided, the component uses the default hardcoded values.