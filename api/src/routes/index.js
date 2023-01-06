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
    //https://api.spoonacular.com/recipes/complexSearch/?apiKey=fe8bd4d6626f46828d02af6feccc38db&addRecipeInformation=true&number=100
    
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
            
        };
        return obj;
    });    
    const db = await Recipe.findAll({include: [{model: TypeOfDiet}]});
    const suma = [...apiMapData, ...db];
    res.json(suma);
});
// // // RUTA: GET /recipes?name="..."

router.get('/recipes', async (req, res) => {
  try {
    const apiDataFoods = await axios.get(`https://api.spoonacular.com/recipes/complexSearch/?apiKey=${APIKEY}&addRecipeInformation=true&number=100`);
    const name = req.query.name;
    const recipes = await apiDataFoods.data.findAll({
      where: {
        name: { [Sequelize.Op.like]: `%${name}%` },
      }
    });
    if (!recipes.length) {
      return res.status(404).json({ error: 'No se han encontrado recetas con ese nombre' });
    }
    return res.json(recipes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al obtener las recetas' });
  }
});
// // // RUTA POST /recipes:
router.post("/create",async(req,res)=>{
    
    const { name, summaryDish, levelHealthyFood, stepByStep, image, create} = req.body;
    try{
        const formNewRecipe ={name, summaryDish, levelHealthyFood, stepByStep, image, create} 
        const newRecipe = await Recipe.create(formNewRecipe)
        console.log("Entidad",newRecipe.__proto__);
        console.log("Modelo",newRecipe.__proto__);
        res.send(newRecipe);
    }catch{
        res.status(400).json({msg:"Faltan Datos"});
    }
});
module.exports = router;