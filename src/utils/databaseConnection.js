const Mongoose = require('mongoose');

const Config = require('../../config/environment/config');

const getMongoUri = () => {
  let mongoUri = Config.get('db.host') || Config.default('db.host');
  switch (Config.get('db.type')) {
    case 'mongoCloud':
      mongoUri = `${mongoUri
        + Config.get('db.user')}:${
        Config.get('db.password')
      }${Config.get('db.suffix')}`;
      break;
    default:
      mongoUri += Config.get('db.name');
      break;
  }
  return mongoUri;
};

const conect = () => {
  Mongoose.Promise = global.Promise;
  Mongoose.connect(getMongoUri() || Config.default('db.host'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then(() => {
    console.log('DB is connected');
  })
    .catch((err) => {
      console.log('X Error DB no connected');
      console.error(err);
    });
};

exports.conect = conect;
