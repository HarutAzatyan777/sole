import React from "react";

const defectsByGrade = {
  FL: [], // Flawless - առանց дефեկտների
  IF: [], // Internally Flawless - առանց дефեկտների
  VVS1: [{ cx: 40, cy: 50, r: 2 }, { cx: 85, cy: 65, r: 1.5 }],
  VVS2: [{ cx: 40, cy: 50, r: 2.5 }, { cx: 85, cy: 65, r: 2 }, { cx: 60, cy: 75, r: 1 }],
  VS1: [{ cx: 30, cy: 55, r: 3 }, { cx: 85, cy: 65, r: 2 }, { cx: 60, cy: 75, r: 1.5 }, { cx: 50, cy: 40, r: 1 }],
  VS2: [{ cx: 30, cy: 55, r: 3.5 }, { cx: 85, cy: 65, r: 2.5 }, { cx: 60, cy: 75, r: 2 }, { cx: 50, cy: 40, r: 1.5 }, { cx: 45, cy: 60, r: 1 }],
  SI1: [{ cx: 30, cy: 55, r: 4 }, { cx: 85, cy: 65, r: 3 }, { cx: 60, cy: 75, r: 2.5 }, { cx: 50, cy: 40, r: 2 }, { cx: 45, cy: 60, r: 1.5 }, { cx: 70, cy: 50, r: 1 }],
  SI2: [{ cx: 30, cy: 55, r: 4.5 }, { cx: 85, cy: 65, r: 3.5 }, { cx: 60, cy: 75, r: 3 }, { cx: 50, cy: 40, r: 2.5 }, { cx: 45, cy: 60, r: 2 }, { cx: 70, cy: 50, r: 1.5 }, { cx: 55, cy: 45, r: 1 }],
  I1: [{ cx: 25, cy: 55, r: 5 }, { cx: 90, cy: 65, r: 4 }, { cx: 65, cy: 75, r: 3.5 }, { cx: 55, cy: 40, r: 3 }, { cx: 45, cy: 60, r: 2.5 }, { cx: 75, cy: 50, r: 2 }, { cx: 60, cy: 45, r: 1.5 }, { cx: 50, cy: 60, r: 1 }],
};

const DiamondClaritySvg = ({ clarity = "FL", strokeColor = "#212330", strokeWidth = 1.5 }) => {
  const defects = defectsByGrade[clarity] || [];

  return (
    <svg
      version="1.1"
      id="diamonds"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      xmlSpace="preserve"
      className="clarity-svg"
    >
      <g fill="none" stroke={strokeColor} strokeWidth={strokeWidth}>
        {/* Diamond outline */}
        <path d="M64 125.4 10.9 94.7V33.3L64 2.6l53.1 30.7v61.4z"/>
        <path d="M64 101.6 31.5 82.8V45.2L64 26.4l32.5 18.8v37.6z"/>
        <path d="M64 128 8.6 96V32L64 0l55.4 32v64L64 128zM15.5 94.7l46.2 26.7v-18.5L31.5 85.4l-16 9.3zm50.8 8.2v18.5l46.7-27-15.9-9.3-30.8 17.8zM33.8 81.5 64 98.9l30.2-17.5V46.5L64 29.1 33.8 46.5v35zM13.2 37.9v52.9l16-9.3V46.9l-16-9zm85.6 42.9 16 9.4v-53l-16 9v34.6zM14.9 33.6l16.2 9.1 30.6-17.6V6.6l-46.8 27zm51.4-8.5 30 17.3 16.2-9.1L66.3 6.6v18.5z"/>
      </g>

      {/* Defects (internal flaws) */}
      <g fill={strokeColor}>
        {defects.map(({ cx, cy, r }, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.6} />
        ))}
      </g>
    </svg>
  );
};

export default DiamondClaritySvg;
