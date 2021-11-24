import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Persona} from '../models';
import {PersonaRepository} from '../repositories';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    /* Add @inject to inject parameters */
    @repository(PersonaRepository)
    public personaRepository: PersonaRepository,
  ) {}

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

  identificarPersona(usuario: string, clave: string) {
    try {
      //buscando persona a identificar
      const p = this.personaRepository.findOne({
        where: {correo: usuario, clave: clave},
      });
      //validando si se encontró
      if (p) {
        //retornar persona
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }

  generarTokenJWT(persona: Persona) {
    const token = jwt.sign(
      {
        data: {
          //creando estructura del token creado
          id: persona.id,
          correo: persona.correo,
          nombre: persona.nombre + ' ' + persona.apellidos,
        },
      },
      //firmando el token creado
      Llaves.claveJWT,
    );
    return token;
  }

  validarTokenJWT(token: string) {
    try {
      const datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }
}
