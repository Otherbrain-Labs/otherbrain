"use client";

import { transparentize } from "color2k";
import { StylesConfig } from "react-select";
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
        theme={(theme) => ({
          ...theme,
          // borderRadius: 0,
          // colors: {
          //   ...theme.colors,
          //   primary25: "gray",
          //   primary: "black",
          // },
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
