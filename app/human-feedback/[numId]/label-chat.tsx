"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HumanFeedback } from "./page";
import { Button } from "@/components/ui/button";
import TagPicker from "@/components/ui/tag-picker";
import { Checkbox } from "@/components/ui/checkbox";
import StarRater from "@/components/ui/star-rater";
import { update } from "./actions";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type LabelChatProps = {
  humanFeedback: HumanFeedback;
  suggestedTags: string[];
  children: React.ReactNode;
};

export default function LabelChat({
  humanFeedback,
  suggestedTags,
  children,
}: LabelChatProps) {
  const [canLabel, setCanLabel] = useState(false);
  const updateFeedback = update.bind(null, humanFeedback.id);
  const [open, setOpen] = useState(false);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(true);

  useEffect(() => {
    // check for cookie matching `edit-key-${numId}`
    // if it's there, set canLabel to true and setOpen to true if "label" is in searchParams

    const labelKey = `edit-key-${humanFeedback.numId}=`;
    // check for it iin cookie
    const cookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(labelKey));
    if (!cookie) {
      return;
    }

    if (humanFeedback.tags.length === 0 && shouldAutoOpen) {
      setOpen(true);
    }
    setCanLabel(true);
    setShouldAutoOpen(false);
  }, [humanFeedback.numId, humanFeedback.tags.length, shouldAutoOpen]);

  if (!canLabel) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center space-x-3">
            Next, label your chat
          </div>
        </DialogHeader>
        <DialogDescription className="text-xs">
          Thanks for contributing to Otherbrain HF, a free human feedback
          dataset for training open LLMs. It’s growing every day with
          contributions like yours. Please label your chat to make it more
          useful for training future models.
        </DialogDescription>
        <form className="mt-2" action={updateFeedback}>
          <table className="table-auto border-separate border-spacing-y-3 border-spacing-x-2 text-xs">
            <tbody>
              <tr>
                <td align="right" valign="top">
                  <div className="font-semibold row-auto">Quality</div>
                </td>
                <td align="left" valign="top">
                  <StarRater
                    defaultValue={humanFeedback.quality || undefined}
                    descriptions={[
                      "horrible",
                      "bad",
                      "useful",
                      "good",
                      "impressive",
                    ]}
                  />
                </td>
              </tr>
              <tr>
                <td align="right" valign="top">
                  <div className="font-semibold row-auto">Tags</div>
                </td>
                <td align="left" valign="top" className="w-full">
                  <TagPicker
                    suggestedTags={suggestedTags}
                    defaultValue={humanFeedback.tags.map((tag) => tag.name)}
                  />
                </td>
              </tr>
              <tr>
                <td align="right" valign="top">
                  <label htmlFor="nsfw" className="font-semibold row-auto">
                    NSFW
                  </label>
                </td>
                <td align="left" valign="top">
                  <div>
                    <Checkbox
                      id="nsfw"
                      name="nsfw"
                      defaultChecked={!!humanFeedback.nsfw}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-row-reverse">
            <Button
              className="mt-4"
              type="submit"
              onClick={() => setOpen(false)}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
