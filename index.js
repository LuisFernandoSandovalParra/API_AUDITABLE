'use strict'

const app = require('./app/app.js')
const logger = require('./app/utils/dev-logger');

app.listen(app.get('port'), (error)=>{
    if(error){
        logger.error(`Hay un error ${error}`);
    }else{
        logger.info(`Servidor corriendo correctamente`);
    }
})