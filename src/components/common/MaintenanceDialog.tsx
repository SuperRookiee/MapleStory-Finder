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

export const MaintenanceDialog = () => {
    const { isOpen, message, close } = maintenanceStore();

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                close();
            }
        },
        [close],
    );

    if (!message && !isOpen) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>점검 안내</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={close}>확인</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
