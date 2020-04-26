const Convict = require('convict');
const Path = require('path');

const Schema = require('../environment/schema');

const config = Convict(Schema);
const mode = config.get('env');
try {
    const configPath = Path.resolve(__dirname, './.env.' + mode + '.json');
    config.loadFile(configPath);
    config.validate();
} catch (error) {
    console.log('* Ejecutandoce con la configuración por defecto');
}

module.exports = config;