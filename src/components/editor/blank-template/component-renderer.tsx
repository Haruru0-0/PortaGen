import { DraggableComponent } from "@/lib/types"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { X, ArrowUp, ArrowDown, Plus, Pencil } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ComponentRendererProps {
    component: DraggableComponent
    isSelected: boolean
    onSelect: () => void
    onDelete: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    onEdit: () => void
    onEditItem: (index: number) => void
}

export function ComponentRenderer({
    component,
    isSelected,
    onSelect,
    onDelete,
    onMoveUp,
    onMoveDown,
    onEdit,
    onEditItem
}: ComponentRendererProps) {
    const renderContent = () => {
        switch (component.type) {
            case "text":
                return (
                    <div style={{
                        color: component.props.color || "inherit",
                        fontSize: component.props.fontSize ? `${component.props.fontSize}px` : "inherit",
                        textAlign: component.props.textAlign || "left",
                        fontWeight: component.props.fontWeight || "normal",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        maxWidth: "100%"
                    }}>
                        {component.props.content || "Double click to edit text"}
                    </div>
                )
            case "image":
                return (
                    <div className="w-full relative aspect-video bg-muted/20 flex items-center justify-center overflow-hidden rounded-md">
                        {component.props.src ? (
                            <img
                                src={component.props.src}
                                alt={component.props.alt || "Image"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-muted-foreground text-xs">No image selected</span>
                        )}
                    </div>
                )
            case "card":
                return (
                    <PixelCard className="w-full p-4">
                        <h4 className="font-bold mb-2">{component.props.title || "Card Title"}</h4>
                        <p className="text-sm text-muted-foreground">{component.props.description || "Card description goes here."}</p>
                    </PixelCard>
                )
            case "carousel":
                const items = component.props.items || []
                const itemsPerSlide = component.props.itemsPerSlide || 3
                const basisClass = itemsPerSlide === 1 ? "basis-full" : itemsPerSlide === 2 ? "basis-1/2" : "basis-1/3"
                const itemCount = Math.max(component.props.count || 3, items.length)

                return (
                    <div className="w-full py-4">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full px-12"
                        >
                            <CarouselContent className="-ml-4">
                                {Array.from({ length: itemCount }).map((_, index) => {
                                    const item = items[index] || {}
                                    return (
                                        <CarouselItem key={index} className={`pl-4 ${basisClass}`}>
                                            <div className="p-1 h-full relative group/item">
                                                <Card className="h-full pixel-card overflow-hidden flex flex-col">
                                                    {item.image && (
                                                        <div className="w-full aspect-video relative overflow-hidden bg-muted border-b-2 border-border">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                                            />
                                                        </div>
                                                    )}
                                                    <CardContent className="pt-6 flex-grow flex flex-col">
                                                        <div className="flex items-start gap-4 mb-4">
                                                            <Avatar className="shrink-0 border-2 border-[var(--cute-text)] rounded-none w-10 h-10">
                                                                <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
                                                                <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                                                                    {(item.name || "?").charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium pixel-text truncate">{item.name || `Slide ${index + 1}`}</p>
                                                                <p className="text-sm opacity-70 truncate">{item.role || "Role"}</p>
                                                            </div>
                                                        </div>
                                                        <p className="italic flex-grow opacity-90 text-sm line-clamp-4 whitespace-pre-wrap">
                                                            {item.content || "Slide content placeholder"}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                                {/* Edit Item Overlay */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onEditItem(index)
                                                        }}
                                                        className="p-2 bg-white border-2 border-foreground hover:bg-muted text-foreground cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
                                                        title="Edit Slide"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    )
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="left-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors" />
                            <CarouselNext className="right-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors" />
                        </Carousel>
                    </div>
                )
            case "card-group":
                const cardItems = component.props.items || []
                const cardCount = Math.max(component.props.count || 3, cardItems.length)

                return (
                    <div className={`grid gap-4 w-full`} style={{
                        gridTemplateColumns: `repeat(${component.props.columns || 3}, minmax(0, 1fr))`
                    }}>
                        {Array.from({ length: cardCount }).map((_, i) => {
                            const item = cardItems[i] || {}
                            return (
                                <div key={i} className="relative group/item">
                                    <PixelCard className="p-4 h-full flex flex-col">
                                        <h4 className="font-bold mb-2">{item.title || `Card ${i + 1}`}</h4>
                                        <p className="text-sm text-muted-foreground flex-grow whitespace-pre-wrap">{item.description || "Card content placeholder"}</p>
                                        {item.image && (
                                            <div className="mt-2 w-full aspect-video rounded-sm overflow-hidden bg-muted">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </PixelCard>
                                    {/* Edit Item Overlay */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onEditItem(i)
                                            }}
                                            className="p-2 bg-white border-2 border-foreground hover:bg-muted text-foreground cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
                                            title="Edit Card"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            case "vertical-separator":
                return (
                    <div className="w-full flex items-center justify-center" style={{ height: component.props.height ? `${component.props.height}px` : "80px" }}>
                        <div className="h-full w-px bg-border" />
                    </div>
                )
            case "button":
                return (
                    <div className={`flex w-full ${component.props.alignment === 'center' ? 'justify-center' : component.props.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <PixelButton variant={component.props.variant || "primary"}>
                            {component.props.label || "Click Me"}
                        </PixelButton>
                    </div>
                )
            case "divider":
                return <hr className="border-border my-2" />
            case "spacer":
                return <div style={{ height: component.props.height ? `${component.props.height}px` : "20px" }} />
            default:
                return <div className="p-2 border border-dashed border-red-500">Unknown Component</div>
        }
    }

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                onSelect()
            }}
            className={`relative group p-2 border-2 transition-all cursor-pointer ${isSelected
                ? "border-primary bg-primary/5"
                : "border-transparent hover:border-primary/50"
                }`}
            style={{
                padding: component.props.padding ? `${component.props.padding}px` : undefined,
                marginBottom: component.props.marginBottom ? `${component.props.marginBottom}px` : undefined,
            }}
        >
            {/* Controls Overlay */}
            {isSelected && (
                <div className="absolute -top-4 right-2 flex items-center bg-white border-2 border-foreground z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onMoveUp()
                        }}
                        className="p-2 cursor-pointer hover:bg-foreground hover:text-background transition-none border-r-2 border-foreground"
                        title="Move Up"
                    >
                        <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onMoveDown()
                        }}
                        className="p-2 cursor-pointer hover:bg-foreground hover:text-background transition-none border-r-2 border-foreground"
                        title="Move Down"
                    >
                        <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit()
                        }}
                        className="p-2 cursor-pointer hover:bg-foreground hover:text-background transition-none border-r-2 border-foreground text-foreground"
                        title="Edit"
                    >
                        <Pencil className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete()
                        }}
                        className="p-2 cursor-pointer hover:bg-red-500 hover:text-white transition-none text-red-500"
                        title="Delete"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            {renderContent()}
        </div>
    )
}
