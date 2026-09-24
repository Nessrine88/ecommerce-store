"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const DeleteDialog = ({
  id,
  action,
}: {
  id: string;
  action: (
    id: string,
  ) => Promise<{ success: boolean; message: string }>;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const t = useTranslations("DeleteDialog");

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id);

      if (!res.success) {
        toast.error(res.message);
      } else {
        setOpen(false);
        toast.success(res.message);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          size="sm"
          variant="destructive"
          className="ml-2"
        >
          {t("delete")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("confirmTitle")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t("confirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("cancel")}
          </AlertDialogCancel>

          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDeleteClick}
          >
            {isPending ? t("deleting") : t("delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;