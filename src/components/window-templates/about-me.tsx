import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AboutMeData } from "@/lib/types";

export default function AboutMe({ windowWidth, data }: { windowWidth?: number, data?: AboutMeData }) {
  const testimonials = data?.testimonials || [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechCorp",
      content:
        "One of the most talented developers I've worked with. Their attention to detail and problem-solving skills are exceptional.",
      avatar: "/avatars/avatar-1.jpg",
    }
  ];

  const hobbies = data?.hobbies || [
    {
      name: "Coding",
      icon: "💻",
      description: "Building side projects and learning new technologies",
    }
  ];

  const skills = data?.skills || ["Web Development", "Web Design", "React", "Node.js", "UI/UX"];

  const getCarouselItemBasis = () => {
    if (!windowWidth) return "basis-full"; // Default to 1 item if width is not available
    if (windowWidth < 640) {
      return "basis-full"; // 1 item per page
    } else if (windowWidth < 1024) {
      return "basis-1/2"; // 2 items per page
    } else {
      return "basis-1/3"; // 3 items per page
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pixel-text">
      <AnimatedSection variant="scale" duration={0.7} className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-[var(--cute-text)] rounded-none">
          <AvatarImage src={data?.profileImage || "/profile-photo.jpg"} alt="Profile" />
          <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">AK</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2 pixel-title">
          {data?.title || "Ahmad Kanaan"}
        </h1>
        <p className="mb-4 opacity-80">
          {data?.subtitle || "Full-Stack Developer with 4 years of experience"}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">{skill}</Badge>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="slideUp" delay={0.1}>
        <h2 className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">About Me</h2>
        <p className="mb-4 leading-relaxed whitespace-pre-wrap">
          {data?.description || "I'm a passionate full-stack developer..."}
        </p>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1}>
        <h2 className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">
          Testimonials
        </h2>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-[calc(100%-96px)] mx-auto"
        >
          {" "}
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className={
                  !windowWidth
                    ? "basis-full"
                    : windowWidth < 640
                      ? "basis-full"
                      : windowWidth < 1024
                        ? "basis-1/2"
                        : "basis-1/3"
                }
              >
                <div className="p-1 h-full">
                  <Card className="h-full pixel-card">
                    <CardContent className="pt-6 flex-grow flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="shrink-0 border-2 border-[var(--cute-text)] rounded-none w-10 h-10">
                          <AvatarImage
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                          />
                          <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium pixel-text truncate">
                            {testimonial.name}
                          </p>
                          <p className="text-sm opacity-70 truncate">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="italic flex-grow opacity-90">
                        "{testimonial.content}"
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
          <CarouselNext className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
        </Carousel>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.3} staggerChildren={0.1}>
        <h2 className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">
          Hobbies & Interests
        </h2>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          }}
        >
          {hobbies.map((hobby, index) => (
            <AnimatedItem key={index}>
              <Card className="h-full pixel-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-2">{hobby.icon}</div>
                  <h3 className="font-bold mb-1 pixel-text">
                    {hobby.name}
                  </h3>
                  <p className="text-sm opacity-70">
                    {hobby.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
