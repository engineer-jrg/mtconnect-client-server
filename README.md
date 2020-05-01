# MTCONNECT CLIENT-SERVER
---
Este proyecto trata la parte del servidor-api para una aplicacion web que permite una conexión a un agente mtconnect y la visualización de sus datos.

## Comenzando 🚀
---
Estas instrucciones le permitirán obtener una copia del proyecto funcionando en su máquina local para propósitos de desarrollo y pruebas.

### Pre-requisitos 📋
  * ![test](https://git-scm.com/favicon.ico) **Git**. Para utilizar el control de versiones mediante linea de comandos con `$ git`, [Descargar Git](https://git-scm.com/downloads).
  
  * ![test](https://nodejs.org/favicon.ico) **Node JS**. Para descargar las dependencias del proyecto y ejecutar comandos con `$ npm`. [Descargar Node js](https://nodejs.org/es/download/).
  
  * ![test](https://github.com/favicon.ico) **MTconnect-client-client**. El cliente web para conexion y visualizacion de datos. [Instalar MTconnect-client-client](https://github.com/engineer-jrg/mtconnect-client-client).

### Instalación 🔧
Ejecute las siguientes instrucciones en order utilizando la cli de su sitema operativo para poder obtener una copia del proyecto funcional.
  * Clonar el proyecto:
  ```sh
  git clone https://github.com/engineer-jrg/mtconnect-client-server.git
  ```
  * Moverse a la carpeta del proyecto:
  ```sh
  cd ./mtconnect-client-server
  ```
  * Instalar las dependencias necesarias:
  ```sh
  npm install
  ```

Si ejecuto todos estos comandos y no obtuvo ningun error usted ya tiene instalado el proyecto en su máquina local correctamente.

## Configuración ⚙️
---
Configuración de las variables de entorno:
  * Se deben crear dos archivo en la ruta `config/environment/` con los siguientes nombres:
  ```sh
  para desarrollo: ".env.development.json"
  para producción: ".env.production.json"
  ```
  * En cada archivo se debe crear la configuración de cada ambiente, se puede usar como guía el archivo de esquema ubicado en la ruta `config/environment/schema.js`. La configuración de ambientes se hace en formto JSON, a continuación se muestra una ejemplo de como se veria un archivo de estos:

  ```javascript
  // .env.development.json
  // Nota: actualmente solo esta soporta bases de datos mongoDB
  {
    "env": "development",
    "port": 4000,
    "secret": "CLAVE_SECRETA_PARA_LOS_TOKEN",
    "urlClient": "http://la/url/del/cliente/web/MTconnect/client/client",
    "db": {
      "host": "HOST_DE_LA_BASE_DE_DATOS",
      "name": "mtconnect-client-dev" // nombre de la base de datos
    }
  }
  ```

## Despliegue 📦
---
Puede desplegar la aplicacion en dos modos: producción y desarrollo,ejecutando los siguientes comandos:

**Para desarrollo** ☔
  * Lanzar la aplicación:
  `npm run start:dev`

**Para producción** ☕
  * Lanzar la aplicación:
  `npm run start:prod`

**Desplegar con Node js** 🕋
  * Lanzar el servidor
  `npm start`

## Construido con 🛠
---
  * [**Apollo Graphql con Express**](https://www.apollographql.com/docs/apollo-server/v1/servers/express/) - Biblioteca para crear el servidor Graphql.
  * [**Mongoose JS**](https://mongoosejs.com/) - Bliblioteca para conectarce a la base de datos MongoDB.
  * [**Nodemon**](https://nodemon.io/) - Servidor para pruebas locales.
  *  [**Eslint**](https://eslint.org/) - Dependencia para estandarizar y regular el código.

## Wiki 📖
---
Podra encontrar más detalles de como usar la aplicación aquí [Wiki](https://#) (proximamente...)

## Versionado 📌
---
Se usa [Git](https://github.com/) para el versionado y Github como alojamiento remoto para el proyecto. Para mirar todas las versiones disponibles desde aquí [Tags](https://github.com/engineer-jrg/mtconnect-client-server/tags)

## Autores ✒️
---
  * ![](https://avatars3.githubusercontent.com/u/20565331?s=50&u=a2ff3ce90ae29ad6515ab7415993f86b7588f9b9&v=4) **Efrain Rodriguez** - _Sponsor_ - [EfrainRodriguez](https://github.com/EfrainRodriguez).
  
  * ![](https://avatars2.githubusercontent.com/u/58745412?s=50&u=6f39dce34dda3cec7ca7eedb6981225e34b46a0a&v=4) **Juan Rodriguez** - _Developer_ - [engineer-jrg](https://github.com/engineer-jrg).
  
## Licencia 📄
---
Este proyecto está bajo la Licencia (Por definir...) - mira el archivo LICENSE.md para detalles

## Expresiones de Gratitud 🎁
---
  * Los desarrolladores de [cppagent](https://github.com/mtconnect/cppagent), el cual fue el agente mtconnect utilizado para desarrollar las pruebas 📦.
  * [**Efrain Rodriguez**](https://github.com/EfrainRodriguez) por el patrocinio y el apoyo durante su desarrollo 💪.
