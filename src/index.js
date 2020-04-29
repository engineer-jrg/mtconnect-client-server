const Cors = require('cors');
const Express = require('express');

const Config = require('../config/environment/config');
const Auth = require('./auth');
const databaseConnection = require('./utils/databaseConnection');
const graphqlServer = require('./utils/graphqlServer');

// Conexion a la db
databaseConnection.conect();

// Configuracion del servidor
const app = Express();
app.set('port', Config.get('port') || Config.default('port'));
app.use(Cors({
  origin: [Config.get('urlClient')],
}));

// Middleware
app.use(Auth.checkHeaders);

// Agregar graphql al servidor
const serverGQL = graphqlServer.server();
const pathGQL = '/graphql';
serverGQL.applyMiddleware({ app, pathGQL });

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from((`<h2>👋 Hello Api MTConnect Client 🚀</h2><br>\
                        <span>Ingresar: \
                          <a href="${pathGQL}" style="text-decoration: none;">📦 Api</a>\
                        </span>`)));
  res.send(`, visita: ${pathGQL}`);
});

app.listen(
  app.get('port'),
  () => console.log(`🚀 Server ready at http://localhost:${app.get('port')}${serverGQL.graphqlPath}`),
);
