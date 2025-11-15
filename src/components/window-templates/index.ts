import AboutMe from './about-me'
import Blog from './blog'
import Contact from './contact'
import Links from './links'
import Projects from './projects'
import Resume from './resume'

export const WINDOW_TEMPLATES_META = [
  { id: 'about-me', name: 'About Me', component: AboutMe },
  { id: 'projects', name: 'Projects', component: Projects },
  { id: 'contact', name: 'Contact', component: Contact },
  { id: 'resume', name: 'Resume', component: Resume },
  { id: 'blog', name: 'Blog', component: Blog },
  { id: 'links', name: 'Links', component: Links },
]

