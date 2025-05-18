// components/GridItem.tsx
import React from "react";

const GridItem = ({ id, title, model, image, onClick, effectParams = {} }) => {
  // Convert effectParams to data attributes
  const dataAttributes = Object.entries(effectParams).reduce(
    (acc, [key, value]) => {
      const dataKey = `data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      return { ...acc, [dataKey]: value };
    },
    {}
  );

  return (
    <figure
      className="grid__item"
      role="img"
      aria-labelledby={`caption${id}`}
      onClick={onClick}
      data-id={id}
      data-title={title}
      data-model={model}
      data-image={image}
      {...dataAttributes}
    >
      <div
        className="grid__item-image"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <figcaption className="grid__item-caption" id={`caption${id}`}>
        <h3>{title}</h3>
        <p>{model}</p>
      </figcaption>
    </figure>
  );
};

export default GridItem;
