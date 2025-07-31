import React from "react";
import "./DiamondInfoPage.css";
import diamondVideo from "../../assets/diamond-video.mp4";
import DiamondSvg from "./DiamondSvg";
import DiamondClaritySvg from "./DiamondClaritySvg";

// Գույնի դասակարգումներ
const diamondColors = [
  { colorName: "D (Colorless)", description: "Անգույն, ամենաբարձր որակ", colorCode: "#FFFFFF" },
  { colorName: "E", description: "Շատ քիչ գույն, գրեթե անտեսելի", colorCode: "#F5F5F5" },
  { colorName: "F", description: "Շատ քիչ գույն", colorCode: "#EFEFEF" },
  { colorName: "G", description: "Սպիտակ, փոքրածավալ գույն", colorCode: "#E5E5E5" },
  { colorName: "H", description: "Թեթև դեղնավուն երանգ", colorCode: "#DDD6C5" },
  { colorName: "I", description: "Նկատելի դեղնավուն երանգ", colorCode: "#CFC6B8" },
  { colorName: "J", description: "Բաց դեղնավուն երանգ", colorCode: "#C0B7A6" },
  { colorName: "K-Z", description: "Նման դեղնավուն մինչև գառերանգ", colorCode: "#B0A38C" },
];

// Որակի դասակարգումներ
const diamondQualities = [
  { grade: "FL", description: "Ամբողջապես զերծ ներքին և արտաքին թերություններից (Flawless)" },
  { grade: "IF", description: "Անկյունային ոչ տեսանելի ներքին թերություններ (Internally Flawless)" },
  { grade: "VVS1", description: "Շատ շատ փոքր թերություններ, դժվար տեսանելի փորձառու մասնագետին" },
  { grade: "VVS2", description: "Շատ փոքր թերություններ" },
  { grade: "VS1", description: "Փոքր թերություններ, հեշտ չէ նկատել" },
  { grade: "VS2", description: "Փոքր թերություններ, երևացող են մեծ խոշորիչով" },
  { grade: "SI1", description: "Տարբերելի թերություններ, հեշտությամբ նկատելի խոշորիչով" },
  { grade: "SI2", description: "Տարբերելի թերություններ, կարող են նկատվել նույնիսկ առանց խոշորիչի" },
  { grade: "I1", description: "Ներքին թերություններ, որոնք ազդում են ադամանդի գեղեցկության վրա" },
];

// Տաշվածքի դասակարգումներ
const diamondCuts = [
  { cutName: "Excellent", description: "Լավագույն տաշվածք, որը առավելագույն փայլ ու գեղեցկություն է տալիս ադամանդին։" },
  { cutName: "Very Good", description: "Շատ լավ տաշվածք, գրեթե անտեսանելի տարբերություն է լավագույնից։" },
  { cutName: "Good", description: "Լավ տաշվածք, տեսանելի բայց ընդունելի տարբերություն։" },
  { cutName: "Fair", description: "Միջին տաշվածք, ազդում է ադամանդի փայլի և փայլատության վրա։" },
  { cutName: "Poor", description: "Սահմանափակ տաշվածք, որը բացասական կերպով է անդրադառնում ադամանդի տեսքին։" },
];

const DiamondInfoPage = () => {
  return (
    <div>
      <section className="video-section">
        <video autoPlay muted loop playsInline src={diamondVideo} type="video/mp4">
          Ձեր դիտարկիչը չի աջակցում video tag-ին։
        </video>
        <div className="video-overlay-text">
          <h1>Sole Diamond</h1>
        </div>
      </section>

      <div className="diamond-info-container">
        <section className="info-section">
          {/* Գույնի բաժին */}
          <div className="info-box">
            <h2>Գույնը</h2>
            <p>
              Ադամանդի գույնը չափվում է D-ից մինչև Z աստիճան, որտեղ D-ն ամենանախանձելի անգույնն է, իսկ Z-ն արդեն նկատելի դեղնավուն երանգ ունի։
            </p>
            {diamondColors.map(({ colorName, description, colorCode }) => (
              <div key={colorName} className="color-card">
                <DiamondSvg color={colorCode} />
                <div className="color-name">{colorName}</div>
                <div className="color-description">{description}</div>
              </div>
            ))}
          </div>

          {/* Որակի բաժին */}
          <div className="info-box">
            <h2>Որակը</h2>
            <p>
              Ադամանդի որակը գնահատվում է ներքին և արտաքին թերությունների (կլարիթի) հիման վրա՝ FL-ից մինչև I և այլն։
            </p>
            {diamondQualities.map(({ grade, description }) => (
              <div key={grade} className="clarity-card">
                <DiamondClaritySvg clarity={grade} />
                <div className="clarity-grade">{grade}</div>
                <div className="clarity-description">{description}</div>
              </div>
            ))}
          </div>

          {/* Տաշվածքի բաժին */}
          <div className="info-box">
            <h2>Տաշվածքը (Cut)</h2>
            <p>
              Տաշվածքը որոշում է, թե ինչպես է ադամանդը ճառագայթում լույսը, և այն մեծ ազդեցություն ունի ադամանդի գեղեցկության և փայլի վրա։
            </p>
            {diamondCuts.map(({ cutName, description }) => (
              <div key={cutName} className="cut-card">
                <div className="cut-name">{cutName}</div>
                <div className="cut-description">{description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiamondInfoPage;
