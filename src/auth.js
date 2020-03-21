// Dependencias
const Bcrypt = require('bcrypt');
const JsonWebToken = require('jsonwebtoken');
require('dotenv').config();

// Modelos
const Models = require('./models/index');

const getToken = ({ _id }) => {
    const token = JsonWebToken.sign({ user: { _id } }, process.env.SECRET, { expiresIn: '10s' });
    return token;
}

// funcion para logear al usuario
const login = async (email, password, User) => {
    let errors_login = [];
    let success_login = false;
    let token_login = 'null';
    const user = await User.findOne({email});
    if(!user){
        errors_login.push({ path: "email", message: "Este correo no se encuentra registrado"})
    }else{
        const validPassword = await Bcrypt.compare(password, user.password);
        if(!validPassword){
            errors_login.push({ path: "password", message: "La contraseña no es correcta"})
        }else{
            token_login = getToken(user);
            success_login = true;
        }
    }
    return {
        success: success_login,
        token: token_login,
        errors: errors_login
    }
}

// funcion para leer los encabezados de la solicitud http
const checkHeaders = async (req, res, next) => {
    const token = req.headers["x-token"];
    if(token){
        try {
            const { user } = JsonWebToken.verify(token, process.env.SECRET);
            req.user = user;
        } catch (error) {
            // Token no valido
            const newToken = await checkToken(token);
            if(newToken){
                req.user = newToken.user;
                if(newToken.token){
                    res.set("Access-Control-Expose-Headers", "x-token");
                    res.set("x-token", newToken.token);
                }
            }
        }
    }
    next();
}
// verificar el estado de un token
const checkToken = async (token) => {
    let idUser=null;
    try{
        const { user } = JsonWebToken.decode(token);
        idUser=user._id;
    }catch(e){
        return {}
    }
    const user = await Models.models.User.findOne({_id:idUser});
    if(user){
        const newToken = getToken(user)
        // console.log("=> new token: "+newToken)
        return {
            user: {
                _id: user._id
            },
            token: newToken
        }
    }else{
        return {}
    }
}

exports.getToken = getToken;
exports.login = login;
exports.checkHeaders = checkHeaders;
exports.checkToken = checkToken;