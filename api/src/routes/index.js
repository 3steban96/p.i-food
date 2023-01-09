const { Router, response } = require('express');
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
router.post("/create", async (req, res) => {
  // Obtenemos los datos del cuerpo de la solicitud
  const { name, summaryDish, levelHealthyFood, stepByStep, image, create, typeOfDiets } = req.body;
  try {
    // Creamos una nueva receta con los datos recibidos
    const formNewRecipe = { name, summaryDish, levelHealthyFood, stepByStep, image, create };
    const newRecipe = await Recipe.create(formNewRecipe);

    // Asociamos la receta con los tipos de dieta especificados
    newRecipe.addTypeOfDiets(typeOfDiets);

    // Buscamos la receta recién creada en la base de datos, incluyendo la información de los tipos de dieta asociados
    const recipe = await Recipe.findByPk(newRecipe.id, {
      include: [{ model: TypeOfDiet }],
    });

    // Enviamos la receta como respuesta
    res.send(recipe);
  } catch {
    // Si ocurre algún error, enviamos un mensaje de error
    res.status(400).json({ msg: "Faltan datos" });
  }
});

       
        


// Ruta Get /recipes/:id
router.get('/recipes/:id', async (req, res) => {
  // obtenemos el ID de la receta desde el parámetro de la ruta
  const id = req.params.id;

  try {
    // buscamos la receta en la base de datos
    const recipe = await Recipe.findByPk(id);
    // si encontramos la receta en la base de datos, la enviamos como respuesta
    if (recipe) {
      // const diets = await recipe.getDiets();
      return res.json({
        recipe: recipe,
        // diets: diets
      });
    }

    // si no encontramos la receta en la base de datos, buscamos en la API
    //const apiDataFoods = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${APIKEY}&includeNutrition=false`);
    // si encontramos la receta en la API, la enviamos como respuesta
    if (!recipe) {
      const apiResponse = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${APIKEY}`);
      // si no encontramos la receta en la API, enviamos un mensaje de error
      if (!apiResponse.data) {
        return res.status(404).json({ error: 'No se ha encontrado la receta' });
      }

      // si encontramos la receta en la API, la enviamos como respuesta
      return res.json({
        id: apiResponse.data.id,
        name: apiResponse.data.title,
        summary: apiResponse.data.summary,
        healthScore: apiResponse.data.healthScore,
        analyzedInstructions: apiResponse.data.analyzedInstructions,
        image: apiResponse.data.image,
        diets: apiResponse.data.diets.map(diet =>diet)
      });
    }


    // si no encontramos la receta ni en la base de datos ni en la API, enviamos un mensaje de error
    return res.status(404).json({ error: 'No se ha encontrado la receta solicitada' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al obtener la receta' });
  }
});


router.get('/diets', async (req, res) => {
  try {
    // Consultamos todos los tipos de dieta en la base de datos
    const diets = await TypeOfDiet.findAll();
    // Si no encontramos ningún tipo de dieta, precargamos la base de datos con los tipos de dieta predefinidos
    if (!diets.length) {
      const defaultDiets = [
        { name: 'Whole30' },
        { name: 'Low FODMAP' },
        { name: 'Primal' },
        { name: 'Paleo' },
        { name: 'Pescetarian' },
        { name: 'Vegan' },
        { name: 'Ovo-Vegetarian' },
        { name: 'Lacto-Vegetarian' },
        { name: 'Vegetarian' },
        { name: 'Ketogenic' },
        { name: 'Gluten Free' },
      ];
      await TypeOfDiet.bulkCreate(defaultDiets);
      res.send(defaultDiets);
    } else {
      // Si encontramos tipos de dieta en la base de datos, los enviamos como respuesta
      res.send(diets);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al obtener los tipos de dieta' });
  }
});

module.exports = router;
