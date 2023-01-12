import React,{ useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import CardRecipe from "./CardRecipe";
import {Link} from "react-router-dom";
import {obtRecipes} from "../../redux/actions.js";


export default function CardsRecipe(){
    let stateRecipes = useSelector((state)=>state.recipes);
    const dispatch = useDispatch()
    useEffect(()=>{dispatch(obtRecipes())
    },[dispatch]);
    
    return(
        <div>
            <div>
                {stateRecipes.length>0 ? stateRecipes.map((rc=>
                <Link key={rc.id} to = {`/details/${rc.id}`}>
                    <CardRecipe name={rc.name}image={rc.image}diet={rc.diet}/>
                </Link>
                )):
                (
                <h3>No hay información</h3>
                )}
               </div>
        </div>
    );
} 

            