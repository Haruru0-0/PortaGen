"use client"

import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelButton } from "@/components/pixel-button"
import { Switch } from "@/components/ui/switch";
import { useLockScreenContext } from "@/contexts/lockScreenContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {useParams} from "next/navigation";

const schema = z.object({
    enabled: z.boolean().default(true),
    password: z.string().optional().transform(v => v ?? ""),
}).refine((val) => !val.enabled || (val.password ?? "").length > 0, {
    message: "Password is required when lock screen is enabled",
    path: ["password"],
})

export function LockScreenSettingsTab() {
    const { data, updatePass, getLockScreenData, loading, fetching } = useLockScreenContext()
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)

    const form = useForm<z.input<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { enabled: true, password: "" },
    })

    useEffect(() => {
        if (currentPortfolioId) void getLockScreenData(currentPortfolioId)
    }, [currentPortfolioId, getLockScreenData])

    useEffect(() => {
        if (data) {
            form.reset({ enabled: !!data.enabled, password: data.password || "" })
        }
    }, [data, form])

    const onSubmit = async (values: z.input<typeof schema>) => {
        await updatePass(currentPortfolioId, values)
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
                                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                    {form.watch("enabled") && <FormField
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
                    />}

                    <div className="pt-2">
                        <PixelButton type="submit" className="w-full text-[10px]" disabled={loading}>
                            {loading ? 'SAVING…' : 'SAVE'}
                        </PixelButton>
                    </div>
                </form>
            </Form>
        </PixelCard>
    )
}
