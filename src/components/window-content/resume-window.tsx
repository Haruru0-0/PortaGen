"use client"

interface Experience {
  role: string
  company: string
  period: string
  description: string
}

interface ResumeWindowProps {
  data?: {
    experience?: Experience[]
    skills?: string[]
  }
}

export function ResumeWindow({ data }: ResumeWindowProps) {
  const experience = data?.experience || [
    {
      role: "SENIOR DEVELOPER",
      company: "PIXEL CORP",
      period: "2020-2024",
      description: "BUILT AWESOME RETRO WEB APPS",
    },
  ]

  const skills = data?.skills || ["REACT", "NEXT.JS", "TYPESCRIPT", "CSS", "NODE.JS"]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[10px] pixel-text-shadow mb-2">EXPERIENCE</h3>
        <div className="space-y-3">
          {experience.map((exp, index) => (
            <div key={index} className="border-2 border-border p-3 space-y-1">
              <div className="text-[10px] pixel-text-shadow">{exp.role}</div>
              <div className="text-[8px] text-muted-foreground">
                {exp.company} • {exp.period}
              </div>
              <div className="text-[8px]">{exp.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] pixel-text-shadow mb-2">SKILLS</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-primary text-primary-foreground text-[8px] border-2 border-border"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
