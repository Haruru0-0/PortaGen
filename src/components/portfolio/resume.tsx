export default function Resume() {
  return (
    <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
      <section>
        <h3 className="text-lg font-semibold mb-3">Experience</h3>
        <div className="space-y-4">
          <div className="border-l-2 border-primary pl-4">
            <h4 className="font-semibold">Senior Developer</h4>
            <p className="text-sm text-muted-foreground">Tech Company • 2020 - Present</p>
            <p className="text-sm mt-2">Leading development of web applications and mentoring junior developers.</p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h4 className="font-semibold">Full Stack Developer</h4>
            <p className="text-sm text-muted-foreground">Startup Inc • 2018 - 2020</p>
            <p className="text-sm mt-2">Built and maintained multiple client projects using modern technologies.</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Education</h3>
        <div className="border-l-2 border-primary pl-4">
          <h4 className="font-semibold">Computer Science Degree</h4>
          <p className="text-sm text-muted-foreground">University Name • 2014 - 2018</p>
        </div>
      </section>
    </div>
  )
}
