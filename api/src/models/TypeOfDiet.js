const { DataTypes } = require('sequelize');
module.exports = sequelize => {
    sequelize.define('typeOfDiet', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        name:{
            type: DataTypes.STRING
        }
    });
};