'use strict'

const logger = require('../utils/dev-logger')
const {json} = require('express');
const connection = require('../../config/connection.js');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


const validateUser = async (req, res) =>{
    const {email, password} = req.params;
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const user = await connection.query(`Select * from users where email = ${connection.escape(email)} and password = ${connection.escape(hash)}`);
    if(user.length === 1){
        jwt.sign({user}, 'secretkey',{expiresIn: '2h'}, (err, token) => {
            res.json({token});
            logger.info(`El usuario ${email} ha generado un nuevo token.`)
        });
    }else{
        res.json({message: "Usuario o contraseña incorrecto."});
        loggin.warning(`Se ha intentado acceder a la cuenta ${email}`)
    }
        
}

// AUthorization: Bearer <token>
const verifyToken = (req, res, next) =>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

const addUser = (req, res) =>{
    const data = req.body;
    jwt.verify(req.token, 'secretkey', async (error) =>{
        if(!error){
            let queryValidate = await connection.query(`SELECT name FROM users WHERE email = ${connection.escape(data.email)};`)
            if(queryValidate.length === 0){
                try {
                    const result = await connection.query(`Insert into users (name, email, password) values (${connection.escape(data.name)}, ${connection.escape(data.email)}, ${connection.escape(data.password)})`);
                    res.json({message: "Usuario creado correctamente."})
                    logger.info(`Se ha creado un nuevo usuario.`)
                }catch (error) {
                    res.json({message: `Ha ocurrido un error: ${error}`});
                    logger.error(`${error}`)
                }
            }else{
                res.json({message: "No se pudo ingresar el usuario, ya existe."})
                logger.error(`Se ha intentado ingresar un usuario ya existente.`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    }) 
}

const deleteUser = (req, res) =>{
    const {email, password} = req.params;
    jwt.verify(req.token, 'secretkey', async (error) =>{
        if(!error){
            let queryValidate = await connection.query(`SELECT name FROM users WHERE email = ${connection.escape(email)} and password = ${connection.escape(password)}`);
            if(queryValidate.length === 1){
                try {
                    const result = await connection.query(`Delete from users where email = ${connection.escape(email)} and password = ${connection.escape(password)}`);
                    res.json({message:"Usuario eliminado correctamente."})
                    logger.info(`Se ha eliminado el usuario ${email}`)
                }catch (error) {
                    res.json({message: `Ha ocurrido un error: ${error}`});
                    logger.error(`${error}`)
                }
            }else{
                res.json({message: "El usuario que intenta eliminar no existe."})
                logger.error(`Se ha intentado eliminar un usuario que no existe.`)
            }   
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })
}

const getUser = async (req, res) =>{
    const {email} = req.params;
    jwt.verify(req.token, 'secretkey', async (error, authData) =>{
        if(!error){
            try {
                const result = await connection.query(`Select id, name, email, password from users where email = ${connection.escape(email)}`);
                if(result.length === 1){
                    res.json(result);
                    loggin.info(`Se ha accedido a la información del usuario ${email}`)
                }else{
                    res.json({message: "El usuario que busca no existe."})
                    logger.error(`Se realizó la busqueda de un usuario que no existe.`)
                }
            } catch (error) {
                res.json({message: `Ha ocurrido un error: ${error}`});
                logger.error(`${error}`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        } 
    })
}

module.exports = {addUser, deleteUser, getUser, verifyToken, validateUser};