import React from "react";
import "./GoldInfographic.css";

const GoldInfographic = () => {
  return (
    <div className="gold-infographic">
      <h2 className="gold-title">Ոսկու Փորձաքննության Ինֆոգրաֆիկա</h2>

      <div className="gold-section">
        <h3>1. Ինչպես է որոշվում իրական ոսկին</h3>
        <ul>
          <li>Արտաքին տեսքի վերլուծություն և կշռում</li>
          <li>Մագնիսականության թեստ՝ իրական ոսկին մագնիսական չէ</li>
          <li>Թթվային թեստ՝ կիրառվում է հատուկ լուծույթ՝ փորձը որոշելու համար</li>
          <li>Էլեկտրոնային և ռենտգեն սարքեր՝ ավելի ճշգրիտ չափման համար</li>
        </ul>
      </div>

      <div className="gold-section">
        <h3>2. Ինչ են նշանակում պռոբները</h3>
        <table className="gold-table">
          <thead>
            <tr>
              <th>Պռոբ</th>
              <th>Մաքրություն (%)</th>
              <th>Նկարագրություն</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>375</td>
              <td>37.5%</td>
              <td>Ցածր մաքրություն, համեմատաբար էժան</td>
            </tr>
            <tr>
              <td>585</td>
              <td>58.5%</td>
              <td>Իդեալական հավասարակշռություն գնի և որակի միջև</td>
            </tr>
            <tr>
              <td>750</td>
              <td>75%</td>
              <td>Բարձրորակ ոսկի, հաճախ կիրառվում է զարդերում</td>
            </tr>
            <tr>
              <td>916</td>
              <td>91.6%</td>
              <td>Հարուստ գույն, քիչ ալոյներ</td>
            </tr>
            <tr>
              <td>999</td>
              <td>99.9%</td>
              <td>Մաքուր ոսկի՝ գրեթե առանց խառնուրդների</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="gold-section">
        <h3>3. Ինչպես խուսափել կեղծ ոսկուց</h3>
        <ul>
          <li>Միշտ խնդրեք սերտիֆիկատ կամ փորձաքննության եզրակացություն</li>
          <li>Ցանկալի է գնել հեղինակավոր խանութներից</li>
          <li>Ստուգեք պռոբի նշանը՝ 375, 585, 750 և այլն</li>
          <li>Կասկածելի դեպքում դիմեք փորձագետի՝ զննման համար</li>
        </ul>
      </div>
    </div>
  );
};

export default GoldInfographic;
