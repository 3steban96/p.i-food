const { DataTypes } = require('sequelize');
module.exports = sequelize => {
    sequelize.define('typeOfDiet', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING
        }
    });
};