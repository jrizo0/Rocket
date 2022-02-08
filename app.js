//Importamos clases
const Juegos = require('./js/Juego');
const Usuarios = require('./js/Usuario');
const Carritos = require('./js/Carrito');
const Juego = Juegos.Juego;
const Usuario = Usuarios.Usuario;
const Carrito = Carritos.Carrito;

listaUsuarios = new Array();
listaJuegos = new Array();
listaPromociones = new Array();
listaDestacados = new Array();
listaProximamente = new Array();
listaRecomendados = new Array();
listaPorDebajo20k = new Array();
listaCarritoActual = new Array();
totalCarritoActual = 0;




/* var juego5 = new Juego(5, 'Fifa 2021', 86000, 'ea', 'Deportes', 'img/fifa.jpeg');
var juego6 = new Juego(6, 'Among Us', 10000, 'incognito', 'Casual', 'img/among.jpeg');
var juego7 = new Juego(7, 'Minecraft', 105000, 'Microsoft', 'Casual', 'img/minecraft.jpg');
var juego8 = new Juego(8, 'Inside', 50000, 'ea', 'Aventura', 'img/inside.jpg');
listaJuegos.push(juego5);
listaJuegos.push(juego6);
listaJuegos.push(juego7);
listaJuegos.push(juego8); */

//Invocamos a express
const express = require('express');
const app = express();
const path = require('path');

//Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Invocamos a dotenv (variables de entorno)
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//Recursos 
app.use('/stylesheets', express.static('stylesheets'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));
app.use('/img', express.static('img'));
app.use('/img', express.static(__dirname + 'img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/videos', express.static(__dirname + '/videos'));

//Establecemos el motor de plantillas ejs
app.set('view engine', 'ejs');

//Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//Var de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Invocamos al modulo de conexion de la BD
const connection = require('./database/db');

//Estableciendo las rutas
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/registro', (req, res) => {
    res.render('registro');
})

//LeerJuegos
/* connection.query('SELECT * FROM juegos WHERE 1', async (error, results) => {
    for (let i = 0; i < results.length + 1; i++) {
        connection.query('SELECT * FROM juegos WHERE id = ?', [i], async (error, results) => {
            let juego = new Juego(results[0].id, results[0].nombre, results[0].precio, results[0].id_usuario, results[0].categoria, results[0].imagen, results[0].promocion);
            listaJuegos.push(juego);
        })
    }
}) */

//Leer juegos en promocion
connection.query('SELECT * FROM juegos WHERE promocion > 0', async (error, results) => {
    for (let i = 0; i < results.length; i++) {
        var juego = new Juego(results[i].id, results[i].nombre, results[i].precio, results[i].id_usuario, results[i].categoria, results[i].imagen, results[i].promocion, results[i].destacado, results[i].proximamente, results[i].recomendado, results[i].progreso);
        listaPromociones.push(juego);
    }
})

//Leer juegos destacados
connection.query('SELECT * FROM juegos WHERE destacado = 1', async (error, results) => {
    for (let i = 0; i < results.length; i++) {
        var juego = new Juego(results[i].id, results[i].nombre, results[i].precio, results[i].id_usuario, results[i].categoria, results[i].imagen, results[i].promocion, results[i].destacado, results[i].proximamente, results[i].recomendado, results[i].progreso);
        listaDestacados.push(juego);
    }
})

//Leer juegos destacados
connection.query('SELECT * FROM juegos WHERE recomendado = 1', async (error, results) => {
    for (let i = 0; i < results.length; i++) {
        var juego = new Juego(results[i].id, results[i].nombre, results[i].precio, results[i].id_usuario, results[i].categoria, results[i].imagen, results[i].promocion, results[i].destacado, results[i].proximamente, results[i].recomendado, results[i].progreso);
        listaRecomendados.push(juego);
    }
})

//Leer juegos proximamente
connection.query('SELECT * FROM juegos WHERE proximamente = 1', async (error, results) => {
    for (let i = 0; i < results.length; i++) {
        var juego = new Juego(results[i].id, results[i].nombre, results[i].precio, results[i].id_usuario, results[i].categoria, results[i].imagen, results[i].promocion, results[i].destacado, results[i].proximamente, results[i].recomendado, results[i].progreso);
        listaProximamente.push(juego);
    }
})

//Leer juegos por debajo de 20k
connection.query('SELECT * FROM juegos WHERE precio < 20000', async (error, results) => {
    for (let i = 0; i < results.length; i++) {
        var juego = new Juego(results[i].id, results[i].nombre, results[i].precio, results[i].id_usuario, results[i].categoria, results[i].imagen, results[i].promocion, results[i].destacado, results[i].proximamente, results[i].recomendado, results[i].progreso);
        listaPorDebajo20k.push(juego);
    }
})

//Metodo POST /send-email con nodemailer
const nodemailer = require('nodemailer');
app.post('/send-email', async (req, res) => {
    const { nombre, apellido, correo, problema, descripcion } = req.body;
    if (nombre && apellido && correo && problema && descripcion) {
        contentHTML = `
        <h1>Informacion del usuario</h1>
        <ul>
            <li>Nombre: ${nombre}</li>
            <li>Apellido: ${apellido}</li>
            <li>User Email: ${correo}</li>
            <li>Problema: ${problema}</li>
        </ul>
        <p>${descripcion}</p>
    `;

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'rocketcontacto0@gmail.com',
                pass: 'wbjhxatblpsrzqxa'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"Rocket Contactanos" <rocketcontacto0@gmail.com>', // sender address,
            to: 'jr.rizo.o.jr@gmail.com',
            subject: 'Rocket Formulario Contacto',
            html: contentHTML
        })

        console.log('Message enviado: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        if (req.session.loggedin) {
            res.render('index', {
                login: true,
                name: req.session.name,
                listaPromociones: listaPromociones,
                listaDestacados: listaDestacados,
                alert: true,
                alertTitle: "Envío formulario",
                alertMessage: "¡Envío con exito!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        } else {
            res.render('index', {
                login: false,
                name: 'Debe iniciar sesión',
                listaPromociones: listaPromociones,
                listaDestacados: listaDestacados,
                alert: true,
                alertTitle: "Envío formulario",
                alertMessage: "¡Envío con exito!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    }
    else{
        if (req.session.loggedin) {
            res.render('index', {
                login: true,
                name: req.session.name,
                listaPromociones: listaPromociones,
                listaDestacados: listaDestacados,
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "¡No se pudo enviar el formulario!",
                alertIcon: "warning",
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } else {
            res.render('index', {
                login: false,
                name: 'Debe iniciar sesión',
                listaPromociones: listaPromociones,
                listaDestacados: listaDestacados,
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "¡No se pudo enviar el formulario!",
                alertIcon: "warning",
                showConfirmButton: true,
                timer: false,
                ruta: ''
            })
        }
    }

});

//Funcion cargar carrito
function cargarCarrito(req) {
    listaCarritoActual.length = 0;
    totalCarritoActual = 0;
    connection.query('SELECT * FROM usersxjuegos WHERE id_usuario = ?', [req.session.idActual], async (error, results) => {
        for (let i = 0; i < results.length; i++) {
            connection.query('SELECT * FROM juegos WHERE id = ?', [results[i].id_juego], async (error, results) => {
                //Arroja solo un resultado ya que el id es unico en las tablas
                var juego = new Juego(results[0].id, results[0].nombre, results[0].precio, results[0].id_usuario, results[0].categoria, results[0].imagen, results[0].promocion);
                listaCarritoActual.push(juego);
                totalCarritoActual += juego.precio;
            });
        }
    })
}

//Metodo POST /eliminar-Juego 
app.post('/eliminar-Juego', async (req, res) => {
    const { idJuego } = req.body;
    connection.query('DELETE FROM usersxjuegos WHERE id_usuario = ? AND id_juego = ?', [req.session.idActual, idJuego], async (error, results) => {
        if (error)
            return console.error(error.message);
        console.log('Deleted Row(s):', results.affectedRows);
        cargarCarrito(req);
        if (req.session.loggedin) {
            res.redirect('/carrito')
        } else {
            res.redirect('/')
        }
    })
})

//Metodo POST /vaciar-Carrito
app.post('/vaciar-Carrito', async (req, res) => {
    connection.query('SELECT * FROM usersxjuegos WHERE id_usuario = ?', [req.session.idActual], async (error, results) => {
        /* console.log(results)
        console.log(req.session.idActual)
        console.log() */
        for (let i = 0; i < results.length; i++) {
            connection.query('DELETE FROM usersxjuegos WHERE id_usuario = ? AND id_juego = ?', [req.session.idActual, results[i].id_juego], async (error, results) => {
                if (error)
                    return console.error(error.message);
                console.log('Deleted Row(s):', results.affectedRows);
                cargarCarrito(req);
                if (req.session.loggedin) {
                    res.redirect('/carrito')
                } else {
                    res.redirect('/')
                }
            });
        }
    })
})

//Metodo POST /pago-Carrito
app.post('/pago-Carrito', async (req, res) => {
    res.render('pago', {
        login: true,
        name: req.session.name,
        listaJuegos: listaJuegos,
        listaCarritoActual: listaCarritoActual,
        totalCarritoActual: totalCarritoActual
    })
})

//Metodo POST /visualizar-Juego
app.post('/pago-Juego', async (req, res) => {
    //TODO falta agregar a una base de datos de compras!!!!!!!!
    connection.query('SELECT * FROM usersxjuegos WHERE id_usuario = ?', [req.session.idActual], async (error, results) => {
        /* console.log(results)
        console.log(req.session.idActual)
        console.log() */
        for (let i = 0; i < results.length; i++) {
            connection.query('DELETE FROM usersxjuegos WHERE id_usuario = ? AND id_juego = ?', [req.session.idActual, results[i].id_juego], async (error, results) => {
                if (error)
                    return console.error(error.message);
                console.log('Deleted Row(s):', results.affectedRows);
            });
        }
        cargarCarrito(req);
    });
    res.render('pago', {
        alert: true,
        alertTitle: "Pago exitoso",
        alertMessage: "¡PAGO REALIZADO!",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: 'carrito',
        login: true,
        name: req.session.name,
        listaJuegos: listaJuegos,
        listaCarritoActual: listaCarritoActual,
    })
})

//Metodo POST /visualizar-Juego
app.post('/visualizar-Juego', async (req, res) => {
    const { idJuego } = req.body;
    connection.query('SELECT * FROM juegos WHERE id = ?', [idJuego], async (error, results) => {
        juegoVisualizar = results[0];
        if (req.session.loggedin) {
            res.render('juego', {
                login: true,
                name: req.session.name,
                juego: juegoVisualizar
            });
        } else {
            res.render('juego', {
                login: false,
                name: 'Debe iniciar sesión',
                juego: juegoVisualizar
            })
        }
    });
})

//Metodo POST /buscar-Juego
app.post('/buscar-Juego', async (req, res) => {
    const { busqueda } = req.body;
    connection.query('SELECT * FROM juegos WHERE nombre = ?', [busqueda], async (error, results) => {
        if (results.length == 0) {
            if (req.session.loggedin) {
                res.render('tienda', {
                    login: true,
                    name: req.session.name,
                    listaRecomendados: listaRecomendados,
                    listaPorDebajo20k: listaPorDebajo20k,
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "No se han encontrado coincidencias",
                    alertIcon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'tienda'
                });
            } else {
                res.render('tienda', {
                    login: false,
                    name: 'Debe iniciar sesión',
                    listaRecomendados: listaRecomendados,
                    listaPorDebajo20k: listaPorDebajo20k,
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "No se han encontrado coincidencias",
                    alertIcon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'tienda'
                })
            }
        }
        else {
            juegoVisualizar = results[0]
            if (req.session.loggedin) {
                res.render('juego', {
                    login: true,
                    name: req.session.name,
                    juego: juegoVisualizar
                });
            } else {
                res.render('juego', {
                    login: false,
                    name: 'Debe iniciar sesión',
                    juego: juegoVisualizar
                })
            }
        }
    });
})

//Metodo POST /agregar-Juego
app.post('/agregar-Juego', async (req, res) => {
    const { idJuego } = req.body;
    connection.query('INSERT INTO usersxjuegos(id_usuario, id_juego) VALUES (?,?)', [req.session.idActual, idJuego], async (error, results) => {
        if (error)
            return console.error(error.message);
        console.log('Added Row(s):', results.affectedRows);
    });
    cargarCarrito(req)
    res.render('index', {
        alert: true,
        alertTitle: "Carrito",
        alertMessage: "¡Juego Agregado!",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: '',
        login: true,
        name: req.session.name,
    })
})

//Metodo POST /donar-Juego
app.post('/donar-Juego', async (req, res) => {
    const { idJuego } = req.body;
    connection.query('SELECT * FROM juegos WHERE id = ?', [idJuego], async (error, results) => {
        juego = results[0];
        if (req.session.loggedin) {
            res.render('pago', {
                login: true,
                name: req.session.name,
                juego: juego,
                listaCarritoActual: listaCarritoActual,
                totalCarritoActual: totalCarritoActual
            });
        } else {
            res.redirect('/')
        }
    });
})

//Registración 
app.post('/registro', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;
    const rol = req.body.rol;
    const email = req.body.email;
    const nuevoUsuario = new Usuario(name, user, pass, rol, email);
    listaUsuarios.push(nuevoUsuario);
    console.log(listaUsuarios[0]);
    let passwordHash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', { user: nuevoUsuario.nomUsuario, name: nuevoUsuario.nombre, rol: nuevoUsuario.rol, pass: passwordHash, email: nuevoUsuario.email }, async (error, results) => {
        if (error) {
            res.render('registro', {
                alert: true,
                alertTitle: "Registration error",
                alertMessage: "No se ha podido registrar!",
                alertIcon: 'error',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
            console.log(error);
        } else {
            res.render('registro', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
})

//Autenticacion 
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o password incorrectas",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
            } else {
                req.session.loggedin = true;
                req.session.user = results[0].user
                req.session.name = results[0].name
                req.session.idActual = results[0].id
                req.session.rol = results[0].rol
                req.session.email = results[0].email
                /* console.log(req.session.user) */
                cargarCarrito(req)
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexión exitosa",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                })
            }
        })
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "¡Por favor ingrese un usuario y/o password!",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        })
    }
})

//Auth pages
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name,
            listaPromociones: listaPromociones,
            listaDestacados: listaDestacados,
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión',
            listaPromociones: listaPromociones,
            listaDestacados: listaDestacados,
        })
    }
})
app.get('/tienda', (req, res) => {
    if (req.session.loggedin) {
        res.render('tienda', {
            login: true,
            name: req.session.name,
            listaRecomendados: listaRecomendados,
            listaPorDebajo20k: listaPorDebajo20k
        });
    } else {
        res.render('tienda', {
            login: false,
            name: 'Debe iniciar sesión',
            listaRecomendados: listaRecomendados,
            listaPorDebajo20k: listaPorDebajo20k
        })
    }
})
app.get('/sobreNosotros', (req, res) => {
    if (req.session.loggedin) {
        res.render('sobreNosotros', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('sobreNosotros', {
            login: false,
            name: 'Debe iniciar sesión'
        })
    }
})
app.get('/noticias', (req, res) => {
    if (req.session.loggedin) {
        res.render('noticias', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('noticias', {
            login: false,
            name: 'Debe iniciar sesión'
        })
    }
})
app.get('/donacion', (req, res) => {
    if (req.session.loggedin) {
        res.render('donacion', {
            login: true,
            name: req.session.name,
            listaProximamente: listaProximamente
        });
    } else {
        res.render('donacion', {
            login: false,
            name: 'Debe iniciar sesión',
            listaProximamente: listaProximamente
        })
    }
})
app.get('/carrito', (req, res) => {
    if (req.session.loggedin) {
        res.render('carrito', {
            login: true,
            name: req.session.name,
            listaJuegos: listaJuegos,
            /*             listaJuegosJason: JSON.stringify(listaJuegos), */
            listaCarritoActual: listaCarritoActual,
            totalCarritoActual: totalCarritoActual
        });
    } else {
        res.redirect('/')
    }
})
app.get('/perfil', (req, res) => {
    if (req.session.loggedin) {
        res.render('perfil', {
            login: true,
            name: req.session.name,
            user: req.session.user,
            rol: req.session.rol,
            email: req.session.email,
        });
    } else {
        res.redirect('/')
    }
})
app.get('/juego', (req, res) => {
    if (req.session.loggedin) {
        res.render('sobreNosotros', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('sobreNosotros', {
            login: false,
            name: 'Debe iniciar sesión'
        })
    }
})

//Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

//Modo escucha puerto 3000
app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
})