import {/* inject, */ BindingScope, injectable} from '@loopback/core';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  generarClave() {
    //param1 = longitud de la contraseña
    //param2 = intensidad de la clav, True = mas compleja
    //generador(param1, param2)
    const clave = generador(8, false);
    return clave;
  }

  cifrarClave(clave: string) {
    const claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }
}
