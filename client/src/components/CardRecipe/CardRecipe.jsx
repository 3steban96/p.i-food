import React from "react";
import styles from "./CardRecipe.module.css";

export default function CardRecipe({name, image, diet}){
    return (
        <div className= {styles.Cardp}>
            <div>
                <h3 className={styles.textC}>
                    {name}
                </h3>
                </div>
                    <img src={image} alt="flag" className={styles.image}/>
                <div>
                <h4>
                    {diet}
                </h4>
                </div>
        </div>
    )
}