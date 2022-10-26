'use strict'

const logger = require('../utils/dev-logger');
const { json } = require('express');
const connection = require('../../config/connection.js')
const jwt = require('jsonwebtoken');

const getCareers = (req, res) =>{
    jwt.verify(req.token, 'secretkey', async (error) =>{
        if(!error){
            try {
                const result = await connection.query("select * from careers");
                res.json(result);
                logger.info("Se ha accedido a la lista de carreras.")
            } catch (error) {
                res.json({message: "Ha ocurrido un error."})
                logger.error(`Ha ocurrido un error al querer acceder a la lista de carreras.`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Ha ocurrido un error: Codigo 403`)
        }
    })
   
}

const getOneCareer = (req, res) =>{
    const {snies_code} = req.params;
    jwt.verify(req.token, 'secretkey', async (error) => {
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM careers WHERE snies_code = ${connection.escape(snies_code)}`);
            if(queryValidate.length === 1){
                try {
                    const result = await connection.query(`select * from careers where snies_code = ${connection.escape(snies_code)}`);
                    res.json(result);
                    logger.info(`Se solicito acceso a la carrera ${snies_code}`)
                } catch (error) {
                    res.json({message: `Hay un error: ${error}`});
                    logger.error(`Ha ocurrido un error: ${error}`);
                }
            }else{
                res.json({message: "La carrera que intenta buscar no existe."});
                logger.error(`No se encontró la carrera solicitada`);
            }
        }else{
            res.sendStatus(403);
            logger.error(`Ha ocurrido un error: Codigo 403`)
        }
    })  
}

const addCareer = (req, res) =>{
    const data = req.body;
    jwt.verify(req.token, 'secretkey', async (error) => {
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM careers WHERE snies_code = ${connection.escape(data.snies_code)}`);
            if(queryValidate.length === 0){
                try {
                    await connection.query(`Insert into careers(snies_code, faculty, name) values (${connection.escape(data.snies_code)} ,${connection.escape(data.faculty)}, ${connection.escape(data.name)})`);
                    res.json({message: `Se agregó correctamente la carrera ${data.name}`});
                    logger.info(`Se agregó la carrera ${data.name}`)
                } catch (error) {
                    res.json({message: `Hay un error: ${error}`})
                    logger.error(`${error}`)
                }
            }else{
                res.json({message: "La carrera que intenta agregar ya existe."});
                logger.error(`Se ha intentado agregar una carrera ya existente`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })
}

const deleteCareer = (req, res) =>{
    const {snies_code} = req.params;
    jwt.verify(req.token, 'secretkey', async (error) => {
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM careers WHERE snies_code = ${connection.escape(snies_code)}`);
            if(queryValidate.length === 1){
                try {
                    await connection.query(`delete from careers where snies_code = ${connection.escape(snies_code)}`);
                    res.json({message: "Se ha eliminado correctamente la carrera."});
                    logger.info(`Se ha eliminado correctamente la carrera ${snies_code}`);
                } catch (error) {
                    res.json({message: `Ha ocurrido un error: ${error}`});
                    logger.error(`${error}`);
                }
            }else{
                res.json({message: "La carrera que intenta eliminar, no existe."});
                logger.error(`La carrera que se ha intentado eliminar, no existe.`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })
   
}

const modifyCareer = async (req, res) =>{
    const data = req.body;
    jwt.verify(req.token, 'secretkey', async (error) => {
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM careers WHERE snies_code = ${connection.escape(data.snies_code)}`);
            if(queryValidate.length === 1){
                try {
                    await connection.query(`update careers set faculty = ${connection.escape(data.faculty)}, name = ${connection.escape(data.name)} where snies_code = ${connection.escape(data.snies_code)}`);
                    res.json({message:`Se ha modificado correctamente la carrera`});
                    logger.info(`Se ha realizado la modificacion de la carrera ${data.name}`);
                } catch (error) {
                    res.json({message: `Ha ocurrido un error: ${error}`});
                    logger.error(`${error}`)
                }
            }else{
                res.json({message: "La carrera que intenta modificar, no existe."})
                logger.error(`La carrera que se ha intentado modificar no existe.`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })
}

module.exports = { getCareers, getOneCareer, addCareer, deleteCareer, modifyCareer };