"use client";

import { Button } from "@/components/ui/button";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface LanguageToggleProps {
    className?: string;
}

const LanguageToggle = ({ className }: LanguageToggleProps) => {
    const { language, toggleLanguage } = useLanguage();
    const t = useTranslations();
    const labelKey =
        language === "en" ? "common.languageToggle.short.en" : "common.languageToggle.short.ko";
    const label = t(labelKey);

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label={t("common.languageToggle.ariaLabel")}
            className={cn("hover:bg-transparent", className)}
        >
            <span className="text-sm font-semibold tracking-wide">{label}</span>
        </Button>
    );
};

export default LanguageToggle;
