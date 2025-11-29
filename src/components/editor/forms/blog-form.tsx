import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedSection } from "@/components/portfolio/animated-section"
import type { BlogData } from "@/lib/types"

interface BlogFormProps {
    initialData: BlogData
    onChange: (data: BlogData) => void
}

export function BlogForm({ initialData, onChange }: BlogFormProps) {
    const [data, setData] = useState<BlogData>(initialData)

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const updateData = (newData: BlogData) => {
        setData(newData)
        onChange(newData)
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pixel-text">
            <AnimatedSection variant="fadeIn" duration={0.6} className="text-center">
                <h1 className="text-3xl font-bold mb-2 pixel-title">Blog Configuration</h1>
                <p className="opacity-80">Manage your blog source and settings</p>
            </AnimatedSection>

            <AnimatedSection variant="scale" delay={0.1} duration={0.7}>
                <Card className="pixel-card border-0">
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label>Blog Source</Label>
                            <Select
                                value={data.source || "hashnode"}
                                onValueChange={(value: any) => updateData({ ...data, source: value })}
                            >
                                <SelectTrigger className="w-full rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)] focus:ring-0 focus:border-[var(--cute-highlight)]">
                                    <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-2 border-[var(--cute-text)]">
                                    <SelectItem value="hashnode">Hashnode</SelectItem>
                                    <SelectItem value="devto" disabled>Dev.to (Coming Soon)</SelectItem>
                                    <SelectItem value="medium" disabled>Medium (Coming Soon)</SelectItem>
                                    <SelectItem value="custom" disabled>Custom RSS (Coming Soon)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Currently only Hashnode is supported.
                            </p>
                        </div>

                        {(!data.source || data.source === 'hashnode') && (
                            <div className="space-y-2">
                                <Label>Hashnode Username</Label>
                                <Input
                                    value={data.username || ""}
                                    onChange={(e) => updateData({ ...data, username: e.target.value })}
                                    placeholder="e.g. johndoe"
                                    className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter your Hashnode username to fetch your latest posts.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </AnimatedSection>
        </div>
    )
}
