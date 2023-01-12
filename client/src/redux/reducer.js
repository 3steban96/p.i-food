let initialState = {
    recipes: [],
    detail: [],
    copyRecipe: [],
    filtre:[]
};
export default function rootReducer(state = initialState, action){
    switch (action.type){
        case "Obt_Rcp":
            return{
                ...state,
                recipes: action.payload
            }
        default:
            return state;
        
    }
}