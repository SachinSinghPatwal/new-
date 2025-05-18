/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
// import { ImageItem } from "../lib/types";


export default function GridItem({
  item,
  onClick,
  effectConfig = {},
}) {
  const itemRef = useRef(null);

  const handleClick = () => {
    if (itemRef.current) {
      onClick(item, itemRef.current);
    }
  };

  // Convert effectConfig to data attributes
  const dataAttributes = {};
  Object.entries(effectConfig).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for data attributes
    const dataKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    dataAttributes[`data-${dataKey}`] = value.toString();
  });

  return (
    <figure
      className="grid__item"
      role="img"
      aria-labelledby={`caption-${item.id}`}
      ref={itemRef}
      onClick={handleClick}
      data-id={item.id}
      {...dataAttributes}
    >
      <div
        className="grid__item-image"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      ></div>
      <figcaption className="grid__item-caption" id={`caption-${item.id}`}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </figcaption>
    </figure>
  );
}
