"use client";

import { useCallback } from "react";
import { maintenanceStore } from "@/stores/maintenanceStore";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "@/providers/LanguageProvider";

export const MaintenanceDialog = () => {
    const { isOpen, message, close } = maintenanceStore();
    const t = useTranslations();

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                close();
            }
        },
        [close],
    );

    if (!isOpen) {
        return null;
    }

    const description = message ?? t("common.maintenanceDialog.description");
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("common.maintenanceDialog.title")}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={close}>{t("common.maintenanceDialog.confirm")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
