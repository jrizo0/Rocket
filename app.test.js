const arrUsuarios= require('app.js');
const arrJuegos = require('app.js');

describe('Usuarios y juegos existen en el sistema',() =>{
    test('Jrizo existe en el array', () => {
        expect(arrUsuarios()).toContain('Jrizo');
    });
    test('nusuario no existe en el array', () =>{
        expect(arrUsuarios().not.toContain('nusuario'));
    });
    test('El array de Usuarios tiene 9 elementos', () =>{
        expect(arrUsuarios()).toHaveLength(9);
    });
    test('El array tiene más de 3 elementos', () =>{
        expect(arrUsuarios()).toHaveLength(3);
    });
    test('No existe el juego Fifa 21', () =>{
        expect(arrJuegos()).not.toContain('Fifa 21');
    });
    test('No existe el juego Halo 3', () =>{
        expect(arrJuegos()).not.toContain('Halo 3');
    });
    test('Existen minimo 15 juegos', () =>{
        expect(arrJuegos()).toHaveLength(15);
    });        
});




