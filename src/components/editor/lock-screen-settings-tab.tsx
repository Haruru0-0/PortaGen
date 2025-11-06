import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelButton } from "@/components/pixel-button"
import { Switch } from "@/components/ui/switch";
import { useLockScreenContext } from "@/contexts/lockScreenContext";
import { useEditorContext } from "@/contexts/editorContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
    enabled: z.boolean().default(true),
    password: z.string().optional().transform(v => v ?? ""),
    hint: z.string().optional().transform(v => v ?? ""),
}).refine((val) => !val.enabled || (val.password ?? "").length > 0, {
    message: "Password is required when lock screen is enabled",
    path: ["password"],
})

export function LockScreenSettingsTab() {
    const { data, updatePass, getLockScreenData } = useLockScreenContext()
    const { currentPortfolioId } = useEditorContext()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { enabled: true, password: "", hint: "" },
    })

    useEffect(() => {
        if (currentPortfolioId) void getLockScreenData(currentPortfolioId)
        if (data) {
            form.reset({ enabled: !!data.enabled, password: data.password || "", hint: data.hint || "" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPortfolioId, data])

    const onSubmit = async (values: z.infer<typeof schema>) => {
        await updatePass(currentPortfolioId, )
    }

    return (
        <PixelCard>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <h3 className="text-sm pixel-text-shadow">LOCK SCREEN SETTINGS</h3>

                    <FormField
                        control={form.control}
                        name="enabled"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between p-3 border-2 border-border bg-muted">
                                    <span className="text-[10px]">ENABLE LOCK SCREEN</span>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PASSWORD</FormLabel>
                                <FormControl>
                                    <PixelInput type="password" placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="hint"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PASSWORD HINT</FormLabel>
                                <FormControl>
                                    <PixelInput placeholder="Enter hint" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-2">
                        <PixelButton type="submit" className="w-full text-[10px]">SAVE</PixelButton>
                    </div>
                </form>
            </Form>
        </PixelCard>
    )
}
