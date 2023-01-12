import axios from 'axios';

export const obtRecipes = () =>{
    return async (dispatch) =>{
        let pedidoApi= await axios.get("http://localhost:3001/getAll");
        console.log(pedidoApi.data);
        dispatch({ type:"Obt_Rcp", payload:pedidoApi.data})
    };
};

export const createRecipe = () =>{
    return async (dispatch) =>{ };
};