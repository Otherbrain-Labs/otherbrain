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
};

export default function LabelSample({
  humanFeedback,
  suggestedTags,
}: LabelSampleProps) {
  const updateFeedback = update.bind(null, humanFeedback.id);
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex justify-end w-full">
          <Button className="bg-green-600 px-3">Label my sample</Button>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>Label sample #{humanFeedback.numId}</SheetHeader>
        Adding more info about your sample makes it more useful.
        <form className="mt-4" action={updateFeedback}>
          <table className="table-auto border-separate border-spacing-2 text-xs">
            <tbody>
              <tr>
                <td align="right" valign="top">
                  <div className="font-bold italic row-auto">Quality</div>
                </td>
                <td align="left" valign="top">
                  <StarRater
                    defaultValue={humanFeedback.quality || undefined}
                  />
                </td>
              </tr>
              <tr>
                <td align="right" valign="top">
                  <div className="font-bold italic row-auto">Tags</div>
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
                  <div className="font-bold italic row-auto">NSFW?</div>
                </td>
                <td align="left" valign="top">
                  <Checkbox id="checkbox-1" name="checkbox-1" />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-row-reverse">
            <Button
              className="mt-2"
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
