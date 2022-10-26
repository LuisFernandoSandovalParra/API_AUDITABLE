'use strict'

const { json } = require('express');
const connection = require('../../config/connection.js')
const jwt = require('jsonwebtoken');
const logger = require('../utils/dev-logger')

const getStudents = (req, res) => {   
    jwt.verify(req.token, 'secretkey', async (error) => {
        if(!error){
            try{
                const result = await connection.query("select * from students");
                res.json(result);
                logger.info(`Se ha accedido a la lista de los estudiantes.`)
            }catch(error){
                res.json({message: `Ha ocurrido un error: ${error}`});
                logger.error(`${error}`)
        }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })   
}

async function getOneStudent(req, res){
    const {document_num} = req.params
    jwt.verify(req.token, 'secretkey', async (error) =>{
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM students WHERE document_num = ${connection.escape(data.document_num)}`);
            if(queryValidate.length === 1){
                try{
                    const result = await connection.query(`select * from students where document_num = ${connection.escape(document_num)}`);
                    res.json(result);
                    logger.info(`Se accedío a la información del estudiante ${document_num}`)
                }catch(error){
                    res.json(error);
                    logger.error(`${error}`)
                }
            }else{
                res.json({message: "El estudiante que busca, no existe."})
                logger.error(`Se ha buscado un estudiante que no existe.`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })
}

const addStudent = async (req, res) =>{
    const data = req.body;
    jwt.verify(req.token, 'secretkey', async (error) =>{
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM students WHERE document_num = ${connection.escape(data.document_num)}`);
            if(queryValidate.length === 0){
                try {
                    await connection.query(`Insert into students(document_type, document_num, first_name, last_name, email, phone_number, birthdate, career_snies_code, enroll_date) values (${connection.escape(data.document_type)}, ${connection.escape(data.document_num)}, ${connection.escape(data.first_name)}, ${connection.escape(data.last_name)}, ${connection.escape(data.email)},${connection.escape(data.phone_number)}, ${connection.escape(data.birthdate)}, ${connection.escape(data.career_snies_code)}, now())`)
                    res.json({message: `${connection.escape(data.first_name)} fue agregado correctamente.`})
                    logger.info(`Se agrego el estudiante ${data.document_num}`)
                } catch (error) {
                    res.json(error)
                    logger.error(`${error}`)
                }
            }else{
                res.json({message: "El estudiante que intenta ingresar ya existe."})
                logger.error(`Se ha intentado ingresar un estudiante que ya existe.`)
            } 
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })  
}

const modifyStudent = async (req, res) =>{
    const data = req.body; 
    jwt.verify(req.token, 'secretkey', async (error) =>{
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM students WHERE document_num = ${connection.escape(data.document_num)}`);
            if(queryValidate.length === 1){
                try {
                    await connection.query(`update students set document_type = ${connection.escape(data.document_type)},first_name = ${connection.escape(data.first_name)}, last_name = ${connection.escape(data.last_name)}, email = ${connection.escape(data.email)}, phone_number = ${connection.escape(data.phone_number)}, birthdate = ${connection.escape(data.birthdate)} where document_num= ${connection.escape(data.document_num)}`);
                    res.json({message: `${connection.escape(data.first_name)} se ha modificado correctamente`})
                    loggin.info(`Se ha modificado la información del estudiante ${data.document_num}`)
                    } catch (error) {
                        res.json({message: `Ha ocurrido un error ${error}`});
                        logger.error(`${error}`)
                    }
            }else{
                res.json({message: "El estudiante que intenta modificar no existe."})
                logger.error(`Se ha intentado modificar un estudiante que no existe.`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })
}

const deleteStudent = async (req, res) => {
    const {document_num} = req.params;
    const data = req.body;
    jwt.verify(req.token, 'secretkey', async (error) =>{
        if(!error){
            let queryValidate = await connection.query(`SELECT * FROM students WHERE document_num = ${connection.escape(document_num)}`);
            if(queryValidate.length === 1){
                try {
                    await connection.query(`delete from students where document_num = ${connection.escape(document_num)}`)
                    res.json({message: "Estudiante eliminado correctamente"})
                    logger.info(`Se ha eliminado el estudiante ${document_num}`)
                } catch (error) {
                    res.json(error);
                    logger.error(`${error}`)
                }
            }else{
                res.json({message: "El estudiante que intenta eliminar no existe."})
                logger.error(`Se ha intentado eliminar un estudiante que no existe.`)
            }
        }else{
            res.sendStatus(403);
            logger.error(`Codigo 403`)
        }
    })        
}

module.exports = {getStudents, getOneStudent, addStudent, modifyStudent, deleteStudent}