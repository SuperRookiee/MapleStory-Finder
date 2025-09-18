import { useRouter } from "next/navigation"
import { Box, Ellipsis, Images, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslations } from "@/providers/LanguageProvider"

const CharacterMenu = () => {
    const router = useRouter()
    const t = useTranslations()

    const getFigure = () => {
        router.push("/figure");
    }

    const getStarforce = () => {
        router.push("/starforce");
    }

    const getCube = () => {
        router.push("/cube");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="bg-muted px-2 py-1 rounded-md flex justify-center items-center hover:cursor-pointer">
                    <Ellipsis size={20} />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
                {/* Starforce */}
                <DropdownMenuItem onClick={getStarforce} className="flex gap-2 hover:cursor-pointer">
                    <Star size={14} />
                    <span>{t("character.banner.starforce")}</span>
                </DropdownMenuItem>

                {/* Cube */}
                <DropdownMenuItem onClick={getCube} className="flex gap-2 hover:cursor-pointer">
                    <Box size={14} />
                    <span>{t("character.banner.cube")}</span>
                </DropdownMenuItem>

                {/* Figure */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuItem onClick={getFigure} className="flex gap-2 hover:cursor-pointer">
                            <Images size={14} />
                            <span className='text-muted-foreground'>{t("character.banner.figure")}</span>
                        </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={4}>
                        {t("character.banner.figureTooltip")}
                    </TooltipContent>
                </Tooltip>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CharacterMenu