const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    // id:{
    //   type: DataTypes.UUIDV4,
    //   primaryKey: true,
    //   allowNull: false,
    //   defaultValue:DataTypes.UUIDV4,
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summaryDish:{
      type: DataTypes.STRING,
      allowNull: false
    },
    levelHealthyFood:{
      type: DataTypes.INTEGER
    },
    stepByStep:{
      type: DataTypes.STRING
    },
    image:{
      type: DataTypes.STRING
    },
    create:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  });
};
