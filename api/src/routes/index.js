const { Router } = require('express');
const axios = require("axios");
const e = require('express');
require('dotenv').config();
const { APIKEY } = process.env;
const {Recipe, TypeOfDiet} = require("../db.js");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);



router.get("/getAll", async (req,res) =>{
    const  apiDataFood = await axios.get(`https://api.spoonacular.com/recipes/complexSearch/?apiKey=${APIKEY}&addRecipeInformation=true&number=100`);
//     //https://api.spoonacular.com/recipes/complexSearch/?apiKey=fe8bd4d6626f46828d02af6feccc38db&addRecipeInformation=true&number=100
    
    const apiMapData = apiDataFood.data.results.map(rec =>{
        const obj = {
            id:rec.id,
            name: rec.title,
            summaryDish: rec.summary,
            levelHealthyFood: rec.healthScore,
            stepByStep: rec.analyzedInstructions
            .map(r => r.steps.map(s=>s.step))
            .flat(1)
            .join(""),
            image: rec.image,
            diet: rec.diets
        };
        return obj;
    });    
    const db = await Recipe.findAll({include: [{model: TypeOfDiet}]});
    const suma = [...apiMapData, ...db];
    res.json(suma);
});
// // // RUTA: GET /recipes?name="..."


  router.get('/recipes', async (req, res) => {
    try {// obtenemos el nombre de la receta desde el query parameter
      const name = req.query.name;
      // realizamos la solicitud a la API utilizando Axios y enviando el parámetro de búsqueda como un objeto de consultas
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          apiKey: APIKEY,
          addRecipeInformation: true,
          number: 100,
          query: name,
        },
      });
      // obtenemos los resultados de la búsqueda de la respuesta de la API
      const recipes = response.data.results;
      // si no encontramos ninguna receta, enviamos un mensaje de error
      if (!recipes.length) {
        return res.status(404).json({ error: 'No se han encontrado recetas con ese nombre' });
      }
      // si encontramos al menos una receta, las enviamos como respuesta
      return res.json(recipes);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ha ocurrido un error al obtener las recetas' });
    }
  });
  
// // // RUTA POST /recipes:
router.post("/create",async(req,res)=>{
    
    const { name, summaryDish, levelHealthyFood, stepByStep, image, create} = req.body;
    try{
        const formNewRecipe ={name, summaryDish, levelHealthyFood, stepByStep, image, create} 
        const newRecipe = await Recipe.create(formNewRecipe)



        res.send(newRecipe);

    }catch{
        res.status(400).json({msg:"Faltan Datos"});
    }
});

// Ruta Get /recipes/:id

router.get('/recipes/:id', async (req, res) => {
  try {
    
    const  apiDataFood = await axios.get(`https://api.spoonacular.com/recipes/complexSearch/?apiKey=${APIKEY}&addRecipeInformation=true&number=100`);
//     //https://api.spoonacular.com/recipes/complexSearch/?apiKey=fe8bd4d6626f46828d02af6feccc38db&addRecipeInformation=true&number=100
    





























    //DB
    // obtenemos el id de la receta desde la ruta
    const id = req.params.id;
    // buscamos la receta en la base de datos
    const recipe = await Recipe.findByPk(id);
    // si no encontramos la receta, enviamos un mensaje de error
    if (!recipe) {
      return res.status(404).json({ error: 'No se ha encontrado la receta solicitada' });
    }

    // obtenemos los tipos de dieta asociados a la receta
    // const diets = await recipe.getDiets();

    // Enviamos la receta y los tipos de dieta como respuesta
    return res.json({
      recipe: recipe,
      // diets: diets
    });
    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al obtener la receta' });
  }
});


module.exports = router;
