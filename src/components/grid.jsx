// components/Grid.tsx
import React from "react";
import { useGridAnimation } from "../hooks/useGridAnimation";
import Heading from "./heading";
import Panel from "./panel";
import GridItem from "./grid-item";

// Demo data for the first section (Shane Weber)
const data1 = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  title:
    [
      "Drift",
      "Veil",
      "Ember",
      "Gleam",
      "Bloom",
      "Whisper",
      "Trace",
      "Flicker",
      "Grain",
      "Pulse",
      "Mist",
      "Shard",
      "Vapor",
      "Glow",
      "Flux",
      "Spire",
    ][i] +
    ` — ${
      [
        "A04",
        "K18",
        "M45",
        "S12",
        "J29",
        "V87",
        "Z05",
        "Q62",
        "H71",
        "B90",
        "L36",
        "Y22",
        "X79",
        "F13",
        "N48",
        "C65",
      ][i]
    }`,
  model: `Model: ${
    [
      "Amelia Hart",
      "Irina Volkova",
      "Charlotte Byrne",
      "Anastasia Morozova",
      "Eva Ramirez",
      "Milana Petrova",
      "Sofia Carter",
      "Alina Kuznetsova",
      "Isabella Novak",
      "Daria Sokolova",
      "Victoria Fields",
      "Natalia Popova & Emily Stone",
      "Yulia Orlova",
      "Camila Ford",
      "Sofia Mikhailova",
      "Ava Bennett",
    ][i]
  }`,
  image: `/assets/img${i + 1}.webp`,
}));

// Demo data for the second section (Manika Jorge)
const data2 = Array.from({ length: 16 }, (_, i) => ({
  id: i + 17,
  title:
    [
      "Driftwood",
      "Fold",
      "Shroud",
      "Ripple",
      "Fray",
      "Wane",
      "Tide",
      "Rift",
      "Spool",
      "Glitch",
      "Slip",
      "Husk",
      "Blur",
      "Fracture",
      "Mote",
      "Aura",
    ][i] +
    ` — ${
      [
        "W50",
        "T81",
        "E26",
        "P34",
        "U07",
        "R52",
        "S33",
        "G08",
        "H94",
        "M70",
        "F02",
        "C15",
        "V86",
        "A63",
        "Y39",
        "K21",
      ][i]
    }`,
  model: `Model: ${
    [
      "Valeria Smirnova",
      "Emma Chase",
      "Marina Belova",
      "Chloe Martin",
      "Alexandra Dmitrieva",
      "Isabella Moore",
      "Ksenia Egorova",
      "Mia Anderson",
      "Anna Mikhailova",
      "Emily Brown",
      "Ekaterina Ivanova",
      "Olivia Reed",
      "Sofia Lebedeva",
      "Harper Gray",
      "Elizaveta Petrova",
      "Lily Cooper",
    ][i]
  }`,
  image: `/assets/img${i + 17}.webp`,
  effectParams: {
    steps: 8,
    rotationRange: 7,
    stepInterval: 0.05,
    moverPauseBeforeExit: 0.25,
    moverEnterEase: "sine.in",
    moverExitEase: "power2",
    panelRevealEase: "power2",
  },
}));

// Demo data for the third section (Angela Wong)
const data3 = Array.from({ length: 16 }, (_, i) => ({
  id: i + 33,
  title:
    [
      "Whorl",
      "Flicker",
      "Gleam",
      "Shard",
      "Trace",
      "Crush",
      "Veil",
      "Clasp",
      "Flint",
      "Spire",
      "Plume",
      "Hollow",
      "Brume",
      "Crave",
      "Quiver",
      "Fathom",
    ][i] +
    ` — ${
      [
        "B45",
        "D17",
        "Z58",
        "J03",
        "Q29",
        "W92",
        "X16",
        "S84",
        "T66",
        "E49",
        "N22",
        "B75",
        "K10",
        "F37",
        "R19",
        "L52",
      ][i]
    }`,
  model: `Model: ${
    [
      "Anastasia Volkova",
      "Sophia White",
      "Polina Sokolova",
      "Ava Mitchell",
      "Maria Ivanenko",
      "Ella Foster",
      "Yulia Morozova",
      "Charlotte Hayes",
      "Viktoria Kuznetsova",
      "Amelia Parker",
      "Daria Smirnova",
      "Zoe Adams",
      "Anastasiya Orlova",
      "Mia Bennett",
      "Natalia Volkova",
      "Isabella Young",
    ][i]
  }`,
  image: `/assets/img${(i % 16) + 1}.webp`,
  effectParams: {
    steps: 10,
    stepDuration: 0.3,
    pathMotion: "sine",
    sineAmplitude: 300,
    clipPathDirection: "left-right",
    autoAdjustHorizontalClipPath: true,
    stepInterval: 0.07,
    moverPauseBeforeExit: 0.3,
    moverEnterEase: "sine",
    moverExitEase: "power4",
    panelRevealEase: "power4",
    panelRevealDurationFactor: 4,
  },
}));

// Demo data for the fourth section (Kaito Nakamo)
const data4 = Array.from({ length: 16 }, (_, i) => ({
  id: i + 49,
  title:
    [
      "Pulse",
      "Fade",
      "Wisp",
      "Fragment",
      "Spiral",
      "Trace",
      "Flare",
      "Chasm",
      "Bloom",
      "Shard",
      "Mist",
      "Crush",
      "Ripple",
      "Gossamer",
      "Floe",
      "Shiver",
    ][i] +
    ` — ${
      [
        "D61",
        "P42",
        "T14",
        "G77",
        "Y24",
        "Z85",
        "C11",
        "R05",
        "N38",
        "W20",
        "S12",
        "E31",
        "F68",
        "A07",
        "K96",
        "V44",
      ][i]
    }`,
  model: `Model: ${
    [
      "Sofia Makarova",
      "Scarlett James",
      "Ekaterina Romanova",
      "Aria Robinson",
      "Daria Petrova",
      "Chloe Evans",
      "Sofia Orlova",
      "Grace Walker",
      "Yana Melnikova",
      "Mila Scott",
      "Natalia Ivanova",
      "Ava Thompson",
      "Anastasia Novikova",
      "Madison Brooks",
      "Ekaterina Smirnova",
      "Emily Robinson",
    ][i]
  }`,
  image: `/assets/img${(i % 16) + 16}.webp`,
  effectParams: {
    steps: 4,
    clipPathDirection: "bottom-top",
    stepDuration: 0.25,
    stepInterval: 0.06,
    moverPauseBeforeExit: 0.2,
    moverEnterEase: "sine.in",
    moverExitEase: "expo",
    panelRevealEase: "expo",
    panelRevealDurationFactor: 4,
    moverBlendMode: "hard-light",
  },
}));

const Grid = () => {
  const {
    isPanelOpen,
    panelContent,
    gridRef,
    panelRef,
    panelImgRef,
    panelContentRef,
    onGridItemClick,
    handleClosePanel,
  } = useGridAnimation();

  const handleItemClick = (e) => {
    onGridItemClick(e.currentTarget);

    console.log("Item clicked:", e.currentTarget);

    console.log(isPanelOpen);
  };

  return (
    <main>
      {/* First section - Shane Weber */}
      <Heading
        title="Shane Weber"
        meta="effect 01: straight linear paths, smooth easing, clean timing, minimal rotation."
      />
      <div className="grid" ref={gridRef}>
        {data1.map((item) => (
          <GridItem
            key={item.id}
            id={item.id}
            title={item.title}
            model={item.model}
            image={item.image}
            onClick={handleItemClick}
          />
        ))}
      </div>

      {/* Second section - Manika Jorge */}
      <Heading
        title="Manika Jorge"
        meta="effect 02: Adjusts mover count, rotation, timing, and animation feel."
      />
      <div className="grid">
        {data2.map((item) => (
          <GridItem
            key={item.id}
            id={item.id}
            title={item.title}
            model={item.model}
            image={item.image}
            onClick={handleItemClick}
            effectParams={item.effectParams}
          />
        ))}
      </div>

      {/* Third section - Angela Wong */}
      <Heading
        title="Angela Wong"
        meta="effect 03: Big arcs, smooth start, powerful snap, slow reveal."
      />
      <div className="grid">
        {data3.map((item) => (
          <GridItem
            key={item.id}
            id={item.id}
            title={item.title}
            model={item.model}
            image={item.image}
            onClick={handleItemClick}
            effectParams={item.effectParams}
          />
        ))}
      </div>

      {/* Fourth section - Kaito Nakamo */}
      <Heading
        title="Kaito Nakamo"
        meta="effect 04: Quick upward motion with bold blending and smooth slow reveal."
      />
      <div className="grid">
        {data4.map((item) => (
          <GridItem
            key={item.id}
            id={item.id}
            title={item.title}
            model={item.model}
            image={item.image}
            onClick={handleItemClick}
            effectParams={item.effectParams}
          />
        ))}
      </div>

      <Panel
        isOpen={isPanelOpen}
        content={panelContent}
        panelRef={panelRef}
        panelImgRef={panelImgRef}
        panelContentRef={panelContentRef}
        handleClosePanel={handleClosePanel}
      />
    </main>
  );
};

export default Grid;
