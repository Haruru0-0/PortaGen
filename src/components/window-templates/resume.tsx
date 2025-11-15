import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"

export default function Resume() {
  const education = [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Lebanese University",
      year: "2018 - 2021",
      description: "Graduated with honors, GPA 3.8/4.0",
    },
  ]

  const experience = [
    {
      role: "Senior Full-Stack Developer",
      company: "Avh",
      period: "June 2021 - Present",
      achievements: [
        "Led the development of a React-based dashboard that increased user engagement by 40%",
        "Implemented CI/CD pipelines that reduced deployment time by 60%",
        "Mentored junior developers and conducted code reviews",
      ],
    },
    {
      role: "Full-Stack Developer",
      company: "Afaq",
      period: "Jan 2021 - June 2021",
      achievements: [
        "Developed and maintained multiple client websites using React and Node.js",
        "Optimized database queries resulting in 30% faster page load times",
        "Collaborated with design team to implement responsive UI components",
      ],
    },
  ]

  // Reorganized skills by category
  const skillCategories = [
    {
      name: "Frontend",
      skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Next.js", "Tailwind CSS", "Redux"],
      icon: "🎨",
    },
    {
      name: "Backend",
      skills: ["Node.js", "Express", "Python", "Django", "RESTful APIs", "GraphQL", "MongoDB", "PostgreSQL"],
      icon: "⚙️",
    },
    {
      name: "DevOps",
      skills: ["Git", "GitHub Actions", "Docker", "AWS", "Vercel", "CI/CD", "Kubernetes", "Terraform"],
      icon: "🚀",
    },
    {
      name: "Design",
      skills: ["Figma", "Adobe XD", "UI/UX", "Responsive Design", "Wireframing", "Prototyping", "Accessibility"],
      icon: "✏️",
    },
  ]

  const certifications = [
    "AWS Certified Developer Associate",
    "Google Cloud Professional Developer",
    "React Advanced Certification",
    "MongoDB Certified Developer",
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <AnimatedSection variant="fadeIn" duration={0.6}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Resume</h1>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.1} staggerChildren={0.15}>
        <h2 className="text-2xl font-bold mb-4">Education</h2>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <AnimatedItem key={index}>
              <Card className="border-0">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                    </div>
                    <Badge variant="outline" className="mt-1 sm:mt-0">
                      {edu.year}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.description}</p>
                </CardContent>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.15}>
        <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <AnimatedItem key={index}>
              <Card className="border-0">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{exp.role}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="mt-1 sm:mt-0">
                      {exp.period}
                    </Badge>
                  </div>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.3} staggerChildren={0.1}>
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          {skillCategories.map((category, index) => (
            <AnimatedItem key={index}>
              <Card className="h-full border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl">{category.icon}</div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="slideUp" delay={0.4}>
        <h2 className="text-2xl font-bold mb-4">Certifications</h2>
        <Card className="border-0">
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {certifications.map((cert, index) => (
                <li key={index} className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  )
}