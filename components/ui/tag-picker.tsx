"use client";

import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { transparentize } from "color2k";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownIndicatorProps,
  StylesConfig,
  MultiValueRemoveProps,
  components,
  ClearIndicatorProps,
} from "react-select";
import CreatableSelect from "react-select/creatable";

type TagPickerProps = {
  suggestedTags: string[];
  defaultValue: string[];
};

const styles: StylesConfig<unknown, true> = {
  menuList(base) {
    return {
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    };
  },
};

function ClearIndicator(props: ClearIndicatorProps<unknown>) {
  return (
    <components.ClearIndicator {...props}>
      <Cross1Icon className="w-4 h-3" />
    </components.ClearIndicator>
  );
}

function MultiValueRemove(props: MultiValueRemoveProps<unknown>) {
  return (
    <components.MultiValueRemove {...props}>
      <Cross2Icon className="w-2.5 h-2.5" />
    </components.MultiValueRemove>
  );
}

function DropdownIndicator(props: DropdownIndicatorProps) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDownIcon className="w-4 h-4" />
    </components.DropdownIndicator>
  );
}

export default function TagPicker({
  suggestedTags,
  defaultValue,
}: TagPickerProps) {
  console.log("def", defaultValue);
  return (
    <div className="w-full text-muted-foreground">
      <CreatableSelect
        closeMenuOnSelect={false}
        className="w-full"
        defaultValue={defaultValue.map((tag) => ({ value: tag, label: tag }))}
        isMulti
        options={suggestedTags.map((tag) => ({ value: tag, label: tag }))}
        name="tags"
        components={{ DropdownIndicator, MultiValueRemove, ClearIndicator }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary: "hsl(var(--accent-foreground))",
            // primary75: "var(--destructive-foreground)",
            // primary50: "var(--destructive-foreground)",
            primary25: "#ccc",
          },
          // spacing: {
          //   ...theme.spacing,
          //   baseUnit: 4,
          //   controlHeight: 10,
          //   menuGutter: 0,
          // },
        })}
        styles={styles}
      />
    </div>
  );
}
