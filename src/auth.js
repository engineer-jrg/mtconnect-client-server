// Dependencias
import Bcrypt from 'bcrypt';
import JsonWebToken from 'jsonwebtoken';
import 'dotenv/config';

// Modelos
import Models from './models/index';

const auth = {
    // funcion para generar un token de logeado
    getToken: ({ _id }) => {
        const token = JsonWebToken.sign({ user: { _id } }, process.env.SECRET, { expiresIn: '10s' });
        return token;
    },
    // funcion para logear al usuario
    login: async (email, password, User) => {
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
                token_login = auth.getToken(user);
                success_login = true;
            }
        }
        return {
            success: success_login,
            token: token_login,
            errors: errors_login
        }
    },

    // funcion para leer los encabezados de la solicitud http
    checkHeaders: async (req, res, next) => {
        const token = req.headers["x-token"];
        if(token){
            try {
                const { user } = JsonWebToken.verify(token, process.env.SECRET);
                req.user = user;
            } catch (error) {
                // Token no valido
                const newToken = await auth.checkToken(token);
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
    },

    // verificar el estado de un token
    checkToken: async (token) => {
        let idUser=null;
        try{
            const { user } = JsonWebToken.decode(token);
            idUser=user._id;
        }catch(e){
            return {}
        }
        const user = await Models.User.findOne({_id:idUser});
        if(user){
            const newToken = auth.getToken(user)
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
}

export default auth;