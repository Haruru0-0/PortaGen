export default function AboutMe() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <img
          src="/placeholder.svg?height=100&width=100"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-primary"
        />
        <div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-muted-foreground">Full Stack Developer</p>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold mb-2">About Me</h3>
          <p className="text-sm leading-relaxed">
            I'm a passionate developer with expertise in building modern web applications. I love creating beautiful,
            functional, and user-friendly experiences.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"].map((skill) => (
              <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
