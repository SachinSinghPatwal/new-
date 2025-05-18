/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef } from "react";
// import { ImageItem } from "../lib/types";
import GridItem from "./grid-item";

const Grid = forwardRef(({ items, onItemClick, effectConfig = {} }, ref) => {
  return (
    <div className="grid" ref={ref}>
      {items.map((item) => (
        <GridItem
          key={item.id}
          item={item}
          onClick={onItemClick}
          effectConfig={effectConfig}
        />
      ))}
    </div>
  );
});

Grid.displayName = "Grid";

export default Grid;
