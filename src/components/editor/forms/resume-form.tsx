import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Settings2, X, Download } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import type { ResumeData, EducationItem, ExperienceItem, SkillCategory } from "@/lib/types"

interface ResumeFormProps {
    initialData: ResumeData
    onChange: (data: ResumeData) => void
}

export function ResumeForm({ initialData, onChange }: ResumeFormProps) {
    const [data, setData] = useState<ResumeData>(initialData)

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const updateData = (newData: ResumeData) => {
        setData(newData)
        onChange(newData)
    }

    // Education Management
    const addEducation = () => {
        const newItem: EducationItem = {
            degree: "New Degree",
            institution: "Institution Name",
            year: "2024",
            description: ""
        }
        updateData({ ...data, education: [...(data.education || []), newItem] })
    }

    const updateEducation = (index: number, field: keyof EducationItem, value: any) => {
        const newItems = [...(data.education || [])]
        newItems[index] = { ...newItems[index], [field]: value }
        updateData({ ...data, education: newItems })
    }

    const removeEducation = (index: number) => {
        const newItems = (data.education || []).filter((_, i) => i !== index)
        updateData({ ...data, education: newItems })
    }

    // Experience Management
    const addExperience = () => {
        const newItem: ExperienceItem = {
            role: "New Role",
            company: "Company Name",
            period: "Present",
            achievements: ["Achievement 1"]
        }
        updateData({ ...data, experience: [...(data.experience || []), newItem] })
    }

    const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
        const newItems = [...(data.experience || [])]
        newItems[index] = { ...newItems[index], [field]: value }
        updateData({ ...data, experience: newItems })
    }

    const removeExperience = (index: number) => {
        const newItems = (data.experience || []).filter((_, i) => i !== index)
        updateData({ ...data, experience: newItems })
    }

    const addAchievement = (expIndex: number, achievement: string) => {
        if (!achievement.trim()) return
        const exp = (data.experience || [])[expIndex]
        const newAchievements = [...(exp.achievements || []), achievement]
        updateExperience(expIndex, "achievements", newAchievements)
    }

    const removeAchievement = (expIndex: number, achievementIndex: number) => {
        const exp = (data.experience || [])[expIndex]
        const newAchievements = (exp.achievements || []).filter((_, i) => i !== achievementIndex)
        updateExperience(expIndex, "achievements", newAchievements)
    }

    // Leadership Management (Similar to Experience)
    const addLeadership = () => {
        const newItem: ExperienceItem = {
            role: "New Role",
            company: "Organization",
            period: "Present",
            achievements: ["Achievement 1"]
        }
        updateData({ ...data, leadership: [...(data.leadership || []), newItem] })
    }

    const updateLeadership = (index: number, field: keyof ExperienceItem, value: any) => {
        const newItems = [...(data.leadership || [])]
        newItems[index] = { ...newItems[index], [field]: value }
        updateData({ ...data, leadership: newItems })
    }

    const removeLeadership = (index: number) => {
        const newItems = (data.leadership || []).filter((_, i) => i !== index)
        updateData({ ...data, leadership: newItems })
    }

    const addLeadershipAchievement = (leadIndex: number, achievement: string) => {
        if (!achievement.trim()) return
        const lead = (data.leadership || [])[leadIndex]
        const newAchievements = [...(lead.achievements || []), achievement]
        updateLeadership(leadIndex, "achievements", newAchievements)
    }

    const removeLeadershipAchievement = (leadIndex: number, achievementIndex: number) => {
        const lead = (data.leadership || [])[leadIndex]
        const newAchievements = (lead.achievements || []).filter((_, i) => i !== achievementIndex)
        updateLeadership(leadIndex, "achievements", newAchievements)
    }

    // Skills Management
    const addSkillCategory = () => {
        const newCategory: SkillCategory = {
            name: "New Category",
            icon: "⚡",
            skills: ["Skill 1"]
        }
        updateData({ ...data, skills: [...(data.skills || []), newCategory] })
    }

    const updateSkillCategory = (index: number, field: keyof SkillCategory, value: any) => {
        const newCategories = [...(data.skills || [])]
        newCategories[index] = { ...newCategories[index], [field]: value }
        updateData({ ...data, skills: newCategories })
    }

    const removeSkillCategory = (index: number) => {
        const newCategories = (data.skills || []).filter((_, i) => i !== index)
        updateData({ ...data, skills: newCategories })
    }

    const addSkillToCategory = (catIndex: number, skill: string) => {
        if (!skill.trim()) return
        const category = (data.skills || [])[catIndex]
        const newSkills = [...(category.skills || []), skill.trim()]
        updateSkillCategory(catIndex, "skills", newSkills)
    }

    const removeSkillFromCategory = (catIndex: number, skillIndex: number) => {
        const category = (data.skills || [])[catIndex]
        const newSkills = (category.skills || []).filter((_, i) => i !== skillIndex)
        updateSkillCategory(catIndex, "skills", newSkills)
    }

    // Interests Management
    const addInterest = (interest: string) => {
        if (!interest.trim()) return
        updateData({ ...data, interests: [...(data.interests || []), interest.trim()] })
    }

    const removeInterest = (index: number) => {
        const newInterests = (data.interests || []).filter((_, i) => i !== index)
        updateData({ ...data, interests: newInterests })
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pixel-text relative">
            {/* Header */}
            <AnimatedSection variant="fadeIn" duration={0.6}>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold pixel-title">Resume</h1>
                    <Button variant="outline" size="sm" className="border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)] opacity-50 cursor-not-allowed">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </AnimatedSection>

            {/* Education Section */}
            <AnimatedSection variant="stagger" delay={0.1} staggerChildren={0.15} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block">Education</h2>
                    <Button variant="ghost" size="sm" onClick={addEducation} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="space-y-4">
                    {(data.education || []).map((edu, index) => (
                        <AnimatedItem key={index}>
                            <Card className="pixel-card border-0 relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button variant="ghost" size="sm" onClick={() => removeEducation(index)} className="h-6 w-6 p-0 text-red-500">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                        <div className="w-full">
                                            <Input
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                                className="font-bold text-lg pixel-text border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                                placeholder="Degree"
                                            />
                                            <Input
                                                value={edu.institution}
                                                onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                                className="opacity-70 border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                                placeholder="Institution"
                                            />
                                        </div>
                                        <Input
                                            value={edu.year}
                                            onChange={(e) => updateEducation(index, "year", e.target.value)}
                                            className="mt-1 sm:mt-0 pixel-badge w-24 text-center border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                            placeholder="Year"
                                        />
                                    </div>
                                    <Textarea
                                        value={edu.description}
                                        onChange={(e) => updateEducation(index, "description", e.target.value)}
                                        className="text-sm opacity-70 border-none bg-transparent shadow-none focus-visible:ring-0 resize-none p-0 min-h-[40px]"
                                        placeholder="Description (optional)"
                                    />
                                </CardContent>
                            </Card>
                        </AnimatedItem>
                    ))}
                </div>
            </AnimatedSection>

            {/* Work Experience Section */}
            <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.15} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block">Work Experience</h2>
                    <Button variant="ghost" size="sm" onClick={addExperience} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="space-y-4">
                    {(data.experience || []).map((exp, index) => (
                        <AnimatedItem key={index}>
                            <Card className="pixel-card border-0 relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button variant="ghost" size="sm" onClick={() => removeExperience(index)} className="h-6 w-6 p-0 text-red-500">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                        <div className="w-full">
                                            <Input
                                                value={exp.role}
                                                onChange={(e) => updateExperience(index, "role", e.target.value)}
                                                className="font-bold text-lg pixel-text border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                                placeholder="Role"
                                            />
                                            <Input
                                                value={exp.company}
                                                onChange={(e) => updateExperience(index, "company", e.target.value)}
                                                className="opacity-70 border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                                placeholder="Company"
                                            />
                                        </div>
                                        <Input
                                            value={exp.period}
                                            onChange={(e) => updateExperience(index, "period", e.target.value)}
                                            className="mt-1 sm:mt-0 pixel-badge w-32 text-center border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                            placeholder="Period"
                                        />
                                    </div>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        {exp.achievements.map((achievement, i) => (
                                            <li key={i} className="text-sm opacity-70 flex items-start group/li">
                                                <span className="flex-1">{achievement}</span>
                                                <button onClick={() => removeAchievement(index, i)} className="opacity-0 group-hover/li:opacity-100 text-red-500 ml-2">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </li>
                                        ))}
                                        <li className="list-none mt-2">
                                            <Input
                                                placeholder="Add achievement..."
                                                className="text-sm h-6 border-dashed border-2 px-1"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        addAchievement(index, (e.target as HTMLInputElement).value)
                                                            ; (e.target as HTMLInputElement).value = ''
                                                    }
                                                }}
                                            />
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </AnimatedItem>
                    ))}
                </div>
            </AnimatedSection>

            {/* Leadership Experience Section */}
            <AnimatedSection variant="stagger" delay={0.25} staggerChildren={0.15} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block">Leadership Experience</h2>
                    <Button variant="ghost" size="sm" onClick={addLeadership} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="space-y-4">
                    {(data.leadership || []).map((lead, index) => (
                        <AnimatedItem key={index}>
                            <Card className="pixel-card border-0 relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button variant="ghost" size="sm" onClick={() => removeLeadership(index)} className="h-6 w-6 p-0 text-red-500">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                        <div className="w-full">
                                            <Input
                                                value={lead.role}
                                                onChange={(e) => updateLeadership(index, "role", e.target.value)}
                                                className="font-bold text-lg pixel-text border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                                placeholder="Role"
                                            />
                                            <Input
                                                value={lead.company}
                                                onChange={(e) => updateLeadership(index, "company", e.target.value)}
                                                className="opacity-70 border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                                placeholder="Company"
                                            />
                                        </div>
                                        <Input
                                            value={lead.period}
                                            onChange={(e) => updateLeadership(index, "period", e.target.value)}
                                            className="mt-1 sm:mt-0 pixel-badge w-32 text-center border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                            placeholder="Period"
                                        />
                                    </div>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        {lead.achievements.map((achievement, i) => (
                                            <li key={i} className="text-sm opacity-70 flex items-start group/li">
                                                <span className="flex-1">{achievement}</span>
                                                <button onClick={() => removeLeadershipAchievement(index, i)} className="opacity-0 group-hover/li:opacity-100 text-red-500 ml-2">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </li>
                                        ))}
                                        <li className="list-none mt-2">
                                            <Input
                                                placeholder="Add achievement..."
                                                className="text-sm h-6 border-dashed border-2 px-1"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        addLeadershipAchievement(index, (e.target as HTMLInputElement).value)
                                                            ; (e.target as HTMLInputElement).value = ''
                                                    }
                                                }}
                                            />
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </AnimatedItem>
                    ))}
                </div>
            </AnimatedSection>

            {/* Skills Section */}
            <AnimatedSection variant="stagger" delay={0.3} staggerChildren={0.1} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block">Skills</h2>
                    <Button variant="ghost" size="sm" onClick={addSkillCategory} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                    {(data.skills || []).map((category, index) => (
                        <AnimatedItem key={index}>
                            <Card className="h-full pixel-card border-0 relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button variant="ghost" size="sm" onClick={() => removeSkillCategory(index)} className="h-6 w-6 p-0 text-red-500">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Input
                                            value={category.icon}
                                            onChange={(e) => updateSkillCategory(index, "icon", e.target.value)}
                                            className="text-2xl w-10 h-10 p-0 text-center border-none bg-transparent shadow-none focus-visible:ring-0"
                                        />
                                        <Input
                                            value={category.name}
                                            onChange={(e) => updateSkillCategory(index, "name", e.target.value)}
                                            className="text-xl font-bold pixel-text border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map((skill, i) => (
                                            <Badge key={i} variant="secondary" className="text-sm py-1 pixel-badge hover:bg-[var(--cute-highlight)] gap-1 pr-1">
                                                {skill}
                                                <button onClick={() => removeSkillFromCategory(index, i)} className="hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        <Input
                                            placeholder="Add skill..."
                                            className="w-24 h-7 text-xs border-dashed border-2 px-1"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    addSkillToCategory(index, (e.target as HTMLInputElement).value)
                                                        ; (e.target as HTMLInputElement).value = ''
                                                }
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedItem>
                    ))}
                </div>
            </AnimatedSection>

            {/* Interests Section */}
            <AnimatedSection variant="slideUp" delay={0.4} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <h2 className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Interests</h2>
                <Card className="pixel-card border-0">
                    <CardContent className="pt-6">
                        <ul className="space-y-2">
                            {(data.interests || []).map((interest, index) => (
                                <li key={index} className="flex items-center group/li">
                                    <div className="mr-2 h-2 w-2 rounded-none bg-[var(--cute-text)]"></div>
                                    <span className="pixel-text flex-1">{interest}</span>
                                    <button onClick={() => removeInterest(index)} className="opacity-0 group-hover/li:opacity-100 text-red-500">
                                        <X className="w-3 h-3" />
                                    </button>
                                </li>
                            ))}
                            <li className="flex items-center">
                                <div className="mr-2 h-2 w-2 rounded-none bg-[var(--cute-text)] opacity-50"></div>
                                <Input
                                    placeholder="Add interest..."
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addInterest((e.target as HTMLInputElement).value)
                                                ; (e.target as HTMLInputElement).value = ''
                                        }
                                    }}
                                />
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </AnimatedSection>
        </div>
    )
}
