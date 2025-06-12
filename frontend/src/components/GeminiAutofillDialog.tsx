import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import z from "zod";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getRecipeFromURL } from "@/api/recipes";
import { useMutation } from "@tanstack/react-query";
import type { RecipeInput } from "@/types/recipes";

const invalidDomains = [
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.tiktok.com",
  "tiktok.com",
];

const urlSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL (e.g. https://...)")
    .refine(
      (url) => !invalidDomains.some((domain) => url.includes(domain)),
      "Please submit a non-video web link, I dont want to spend money on AI"
    ),
});

interface GeminiAutofillDialogProps {
  onAutofillSuccess: (data: RecipeInput) => void; // Callback to send data to parent
}

export default function GeminiAutofillDialog({
  onAutofillSuccess,
}: GeminiAutofillDialogProps) {
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const [urlInput, setUrlInput] = useState("");

  const recipeFetchViaURL = useMutation({
    mutationFn: getRecipeFromURL,
    onSuccess: (data) => {
      toast.success("Recipe fetched!");
      onAutofillSuccess(data);
      closeDialogRef.current?.click();
    },
    onError: () => toast.error("Something went wrong. Please try again"),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-[#8beeff] dark:bg-blue-600 hover:bg-[#7ad1ff] cursor-pointer"
        >
          <Sparkles />
          Autofill with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Autofill with Gemini</DialogTitle>
          <DialogDescription>
            Add non-video recipe web link here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="url-1">URL</Label>
          <Input
            value={urlInput}
            form="none"
            placeholder="Any non-video url here..."
            onChange={(e) => setUrlInput(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" ref={closeDialogRef}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              const validateLink = urlSchema.safeParse({
                url: urlInput,
              });
              if (!validateLink.success) {
                toast.warning(validateLink.error.format().url?._errors[0]);
              } else {
                toast.success("Input is a valid URL. Now fetching...");
                recipeFetchViaURL.mutate(urlInput);
              }
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
