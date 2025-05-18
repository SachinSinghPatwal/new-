/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Panel.tsx
import React from "react";

const Panel = ({
  isOpen,
  content,
  panelRef,
  panelImgRef,
  panelContentRef,
  handleClosePanel,
}) => {
  if (!isOpen || !content) return null;

  return (
    <figure
      className={`panel ${isOpen ? "panel--visible" : ""}`}
      role="img"
      aria-labelledby="caption"
      ref={panelRef}
    >
      <div
        className="panel__img"
        style={{ backgroundImage: content.imgURL }}
        ref={panelImgRef}
      ></div>
      <figcaption className="panel__content" id="caption" ref={panelContentRef}>
        <h3>{content.title}</h3>
        <p>{content.desc}</p>
        <button
          type="button"
          className="panel__close"
          aria-label="Close preview"
          onClick={() => handleClosePanel()}
        >
          Close
        </button>
      </figcaption>
    </figure>
  );
};

export default Panel;
