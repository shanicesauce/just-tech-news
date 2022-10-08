const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//user model
class User extends Model { }

//define table columns and configuration

User.init(
    {
        //define an id column
        id: {
            //use the special sequelize datatypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // same as NOT NULL in sql
            allowNull: false,
            //primary key
            primaryKey: true,
            //auto increment
            autoIncrement: true
        },
        //username column 
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //email
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //no duplicate email values
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //password
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //password must be at least 4 characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            //beforeCreate lifecycle function
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData
            },
            //beforeUpdate lifecycle function (if user updates pass rehash)
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //table configuration options (https://sequelize.org/v5/manual/models-definition.html#configuration))
        //imported sequelize connection (to direct connection to db)
        sequelize,
        //don't auto create createdAt/updatedAt timestamps
        timestamps: false,
        //don't pluralize the name of db
        freezeTableName: true,
        //use underscores instead of camel case
        underscored: true,
        //make model name lowercase in db
        modelName: 'user'
    }
);

module.exports = User;