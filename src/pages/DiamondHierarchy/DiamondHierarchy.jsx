import React from "react";
import "./DiamondHierarchy.css";

const DiamondHierarchy = () => {
  return (
    <section className="diamond-section">
      <div className="diamond-container">
        <h1 className="diamond-title">Ադամանդի Հիերարխիա</h1>

        <article className="diamond-article">
          <h2 className="diamond-subtitle">1. Արդյունահանում և մշակում</h2>
          <p>
            Ադամանդի հիերարխիան սկսվում է արդյունահանմամբ, որը հիմնականում կատարվում է Աֆրիկայում, Ռուսաստանում, Կանադայում և Ավստրալիայում։ Արդյունահանված հում ադամանդները ենթարկվում են խիստ մշակումների՝ նախքան շուկա մուտք գործելը։
          </p>
        </article>

        <article className="diamond-article">
          <h2 className="diamond-subtitle">2. Դասակարգում ըստ 4C</h2>
          <p>
            Դրանք գնահատվում են ըստ 4C չափանիշների՝ <strong>Carat</strong> (քաշ), <strong>Cut</strong> (կտրվածք), <strong>Clarity</strong> (մաքրություն) և <strong>Color</strong> (գույն): Այդ հատկանիշները ազդում են ադամանդի արժեքի վրա։
          </p>
        </article>

        <article className="diamond-article">
          <h2 className="diamond-subtitle">3. Վկայագրում և սերտիֆիկացում</h2>
          <p>
            Ադամանդները վկայագրվում են GIA, IGI, HRD և այլ միջազգային հաստատությունների կողմից՝ ապացուցելու իրենց իսկությունը և որակը։
          </p>
        </article>

        <article className="diamond-article">
          <h2 className="diamond-subtitle">4. Վաճառք և մանրածախ շրջանառություն</h2>
          <p>
            Սերտիֆիկացված ադամանդները ներկայացվում են զարդերի խանութներում՝ մատանիների, վզնոցների, ականջօղերի և այլ ձևերով՝ հաճախորդին ներկայացնելով ոչ միայն արժեք, այլ նաև խորհրդանշական նշանակություն։
          </p>
        </article>
      </div>
    </section>
  );
};

export default DiamondHierarchy;
