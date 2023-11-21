"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HumanFeedback } from "./page";
import { Button } from "@/components/ui/button";
import TagPicker from "@/components/ui/tag-picker";
import { Checkbox } from "@/components/ui/checkbox";
import StarRater from "@/components/ui/star-rater";
import { update } from "./actions";
import { useState } from "react";

type LabelSampleProps = {
  humanFeedback: HumanFeedback;
  suggestedTags: string[];
  children: React.ReactNode;
};

export default function LabelSample({
  humanFeedback,
  suggestedTags,
  children,
}: LabelSampleProps) {
  const updateFeedback = update.bind(null, humanFeedback.id);
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>Label sample #{humanFeedback.numId}</SheetHeader>
        This info makes your sample more useful for training future models.
        <form className="mt-4" action={updateFeedback}>
          <table className="table-auto border-separate border-spacing-2 text-xs">
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
                    NSFW?
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
      </SheetContent>
    </Sheet>
  );
}
