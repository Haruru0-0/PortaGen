export interface PortfolioTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  font: string
  taskbarStyleId: string
  menubarStyleId: string
  windowStyleId: string
  musicPlayerStyleId: string
}

export const THEME_PRESETS: PortfolioTheme[] = [
  {
    name: "Retro Gaming",
    colors: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#FBBF24",
      background: "#1a1a2e",
      text: "#ffffff",
    },
    font: "Press Start 2P",
    taskbarStyleId: "pixel",
    menubarStyleId: "pixel",
    windowStyleId: "pixel",
    musicPlayerStyleId: "pixel",
  },
  {
    name: "Neon Nights",
    colors: {
      primary: "#00F5FF",
      secondary: "#FF00FF",
      accent: "#FFFF00",
      background: "#0a0a0a",
      text: "#00F5FF",
    },
    font: "Orbitron",
    taskbarStyleId: "liquid-glass",
    menubarStyleId: "liquid-glass",
    windowStyleId: "liquid-glass",
    musicPlayerStyleId: "liquid-glass",
  },
  {
    name: "Minimal Clean",
    colors: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#ffffff",
      background: "#f5f5f5",
      text: "#000000",
    },
    font: "Inter",
    taskbarStyleId: "liquid-glass",
    menubarStyleId: "liquid-glass",
    windowStyleId: "liquid-glass",
    musicPlayerStyleId: "liquid-glass",
  },
  {
    name: "Glass Effect",
    colors: {
      primary: "#54ACBF",
      secondary: "#A7EBF2",
      accent: "#26658C",
      background: "#023859",
      text: "#ffffff",
    },
    font: "Poppins",
    taskbarStyleId: "liquid-glass",
    menubarStyleId: "liquid-glass",
    windowStyleId: "liquid-glass",
    musicPlayerStyleId: "liquid-glass",
  },
  {
    name: "Neo Brutalism",
    colors: {
      primary: "#000000",
      secondary: "#FFFF00",
      accent: "#FF00FF",
      background: "#ffffff",
      text: "#000000",
    },
    font: "Space Grotesk",
    taskbarStyleId: "pixel",
    menubarStyleId: "pixel",
    windowStyleId: "pixel",
    musicPlayerStyleId: "pixel",
  },
]

export interface WindowTemplate {
  id: string
  name: string
  icon: string
  component: string
  defaultData: any
  fields: TemplateField[]
}

export interface TemplateField {
  id: string
  label: string
  type: "text" | "textarea" | "image" | "url" | "array" | "rich-text"
  placeholder?: string
  required?: boolean
}

export const WINDOW_TEMPLATES: WindowTemplate[] = [
  {
    id: "about",
    name: "About Me",
    icon: "👤",
    component: "AboutMe",
    defaultData: {
      name: "Your Name",
      title: "Your Title",
      bio: "Tell us about yourself...",
      avatar: "",
      skills: [],
      hobbies: [],
    },
    fields: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "title", label: "Title", type: "text", required: true },
      { id: "bio", label: "Bio", type: "textarea", required: true },
      { id: "avatar", label: "Avatar", type: "image" },
      { id: "skills", label: "Skills", type: "array" },
      { id: "hobbies", label: "Hobbies", type: "array" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    icon: "💼",
    component: "Projects",
    defaultData: {
      projects: [
        {
          title: "Project Name",
          description: "Project description",
          image: "",
          link: "",
          tags: [],
        },
      ],
    },
    fields: [
      { id: "title", label: "Project Title", type: "text", required: true },
      { id: "description", label: "Description", type: "textarea", required: true },
      { id: "image", label: "Project Image", type: "image" },
      { id: "link", label: "Project Link", type: "url" },
      { id: "tags", label: "Tags", type: "array" },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    icon: "📧",
    component: "Contact",
    defaultData: {
      email: "your@email.com",
      phone: "",
      location: "",
      socials: {
        twitter: "",
        linkedin: "",
        github: "",
      },
    },
    fields: [
      { id: "email", label: "Email", type: "text", required: true },
      { id: "phone", label: "Phone", type: "text" },
      { id: "location", label: "Location", type: "text" },
      { id: "twitter", label: "Twitter", type: "url" },
      { id: "linkedin", label: "LinkedIn", type: "url" },
      { id: "github", label: "GitHub", type: "url" },
    ],
  },
  {
    id: "resume",
    name: "Resume",
    icon: "📄",
    component: "Resume",
    defaultData: {
      education: [],
      experience: [],
      skills: {},
      certifications: [],
    },
    fields: [
      { id: "school", label: "School", type: "text" },
      { id: "degree", label: "Degree", type: "text" },
      { id: "company", label: "Company", type: "text" },
      { id: "position", label: "Position", type: "text" },
      { id: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    id: "blog",
    name: "Blog",
    icon: "📝",
    component: "Blog",
    defaultData: {
      posts: [],
      categories: [],
    },
    fields: [
      { id: "title", label: "Post Title", type: "text", required: true },
      { id: "content", label: "Content", type: "rich-text", required: true },
      { id: "image", label: "Featured Image", type: "image" },
      { id: "category", label: "Category", type: "text" },
    ],
  },
  {
    id: "links",
    name: "Links",
    icon: "🔗",
    component: "Links",
    defaultData: {
      links: [
        {
          title: "Link Title",
          url: "",
          icon: "",
        },
      ],
    },
    fields: [
      { id: "title", label: "Link Title", type: "text", required: true },
      { id: "url", label: "URL", type: "url", required: true },
      { id: "icon", label: "Icon", type: "image" },
    ],
  },
]
