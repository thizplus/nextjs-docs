"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { useCreateFolder } from "../hooks";

const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ Folder")
    .max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
  description: z.string().max(500, "คำอธิบายต้องไม่เกิน 500 ตัวอักษร").optional(),
  isPublic: z.boolean(),
});

type CreateFolderForm = {
  name: string;
  description?: string;
  isPublic: boolean;
};

interface CreateFolderDialogProps {
  trigger: React.ReactNode;
}

export function CreateFolderDialog({ trigger }: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const createFolder = useCreateFolder();

  const form = useForm<CreateFolderForm>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
    },
  });

  const onSubmit = async (data: CreateFolderForm) => {
    try {
      await createFolder.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        isPublic: data.isPublic,
      });
      toast.success("สร้าง Folder สำเร็จ");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถสร้าง Folder ได้"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>สร้าง Folder ใหม่</DialogTitle>
          <DialogDescription>
            สร้าง Folder เพื่อจัดเก็บสถานที่ท่องเที่ยวที่คุณสนใจ
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ Folder *</FormLabel>
                  <FormControl>
                    <Input placeholder="เช่น ทริปเชียงใหม่" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>คำอธิบาย</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="รายละเอียดเพิ่มเติม..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>เปิดเป็นสาธารณะ</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      ผู้อื่นสามารถดู Folder นี้ได้
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={createFolder.isPending}>
                {createFolder.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                สร้าง Folder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
