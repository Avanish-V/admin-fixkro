import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { ImageIcon, Loader2, X } from "lucide-react";
import { uploadFile } from "@/api/files";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label = "Image",
    folder = "general"
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFile(file, folder);
            onChange(url);
            toast({ title: "Success", description: "Image uploaded successfully" });
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to upload image", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Label>{label}</Label>

            <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                    {value ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-[200px] aspect-video rounded-xl overflow-hidden border-2 border-border group bg-secondary/30"
                        >
                            <img
                                src={value}
                                alt="Uploaded preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="w-8 h-8 rounded-full"
                                    onClick={() => onChange("")}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full max-w-[200px] aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 bg-secondary/10 overflow-hidden"
                        >
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-xs text-muted-foreground">Click to upload or drag & drop</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                accept="image/*"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-2">
                    <Input
                        placeholder="Or enter image URL manually"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-secondary/50 flex-1"
                    />
                </div>
            </div>
        </div>
    );
};
