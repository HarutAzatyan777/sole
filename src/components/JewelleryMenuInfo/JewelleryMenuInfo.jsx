import React from "react";

const styles = {
    img_container: {
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "1.5rem 2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
      backgroundColor: "#a0d8d3",           // նուրբ վարդագոյն ոսկեգույն ֆոն
      borderRadius: "12px",
    },
    title: {
      color: "#005f73",                    // մուգ ոսկեգույն
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "0.75rem",
      fontFamily: "'Georgia', serif",      // նրբագեղ տառատեսակ
    },
    address: {
      fontSize: "1.15rem",
      marginBottom: "1.5rem",
      fontStyle: "italic",
      color: "black",                    // տաք շագանակագույն
    },
    description: {
      fontSize: "1rem",
      lineHeight: "1.6",
      marginBottom: "2rem",
      color: "#005f73",                   // ավելի մեղմ ոսկեգույն երանգ
    },
    techContainer: {
      backgroundColor: "#fff",
      padding: "1rem 1.5rem",
      borderRadius: "10px",
      boxShadow: "0 0 15px rgba(184, 134, 11, 0.25)",  // ոսկեգույն շող
    },
    subtitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#005f73",
      marginBottom: "1rem",
      fontFamily: "'Georgia', serif",
    },
    techList: {
      listStyleType: "disc",
      paddingLeft: "1.5rem",
      fontSize: "1rem",
      color: "#555",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
  };
  

export default function JewelleryMenuInfo() {
  return (
    <div style={styles.img_container}>
      <h1 style={styles.title}>Ոսկյա զարդեր</h1>
      <p style={styles.address}>Հասցե՝ Խորենացի 24, Երևան</p>
      <p style={styles.description}>
        Մեր ոսկյա զարդերը պատրաստված են բարձրորակ նյութերից՝
        ավանդական արհեստավարժությամբ ու ժամանակակից դիզայնով։ Ամեն մի
        զարդ կրում է իր պատմությունը և առանձնահատկությունը՝ համատեղելով
        ժառանգությունը և նորարարությունը։
      </p>

      
    </div>
  );
}
