class Carrito {
    constructor() {
        this.listaCarrito = new Array();
        this.total = 0;
    }

    añadirJuego(juego) {
        this.listaCarrito.push(juego);
    }
    eliminarJuego(juego) {
        var i = listaCarrito.indexOf(juego);
        if (i !== -1) {
            listaCarrito.splice(i, 1);
        }
    }
    vaciaCarrito() {
        for (carrito in listaCarrito) {
            this.eliminarJuego(this.listaCarrito[carrito]);
        }
    }
}

class Usuario {
    constructor(nombre, nomUsuario, contrasena, rol, email) {
        this.nombre = nombre;
        this.nomUsuario = nomUsuario;
        this.contrasena = contrasena;
        this.rol = rol;
        this.email = email;
        this.carrito = new Carrito();
    }
}


module.exports = {
    Usuario: Usuario,
    Carrito: Carrito
};