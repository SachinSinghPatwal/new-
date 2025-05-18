"use client";

import { forwardRef } from "react";
// import { ImageItem } from "../lib/types";

const Panel = forwardRef(({ onClose, item }, ref) => {
  return (
    <figure className="panel" role="img" aria-labelledby="caption" ref={ref}>
      <div
        className="panel__img"
        style={{
          backgroundImage: item ? `url(${item?.imageUrl})` : "none",
        }}
      ></div>
      <figcaption className="panel__content" id="caption">
        <h3>{item?.title || ""}</h3>
        <p>
          {item?.description ||
            "Beneath the soft static of this lies a fragmented recollection of motion—faded pulses echoing through time-warped layers of light and silence. A stillness wrapped in artifact."}
        </p>
        <button
          type="button"
          className="panel__close"
          aria-label="Close preview"
          onClick={onClose}
        >
          Close
        </button>
      </figcaption>
    </figure>
  );
});

Panel.displayName = "Panel";

export default Panel;
