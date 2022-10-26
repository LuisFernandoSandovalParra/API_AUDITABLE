const {createLogger, format, transports} = require('winston');
const { timestamp, combine, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  });

const devLogger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports:[
        new transports.File({
            maxsize: 5120000,
            maxFiles: 50,
            filename: `${__dirname}/../logs/log-api.log`
        }),
        new transports.Console({
            level:'debug'
        })
    ]
})

module.exports = devLogger;