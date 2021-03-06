const fs = require("fs");
const PersonaDTO = require("./PersonaDTO.js");

class PersonaFileDao {
  constructor() {
    this.archivo = null;
  }

  async init(archivo) {
    this.archivo = archivo;

    try {
      await fs.promises.readFile(this.archivo, "utf-8");
    } catch (error) {
      await fs.promises.writeFile(this.archivo, JSON.stringify([]));
    }
  }

  getNextId(personas) {
    const { length } = personas;

    return length ? personas[length - 1].id + 1 : 1;
  }

  getIndex(id, personas) {
    return personas.findIndex((persona) => persona.id === id);
  }

  getFyH() {
    return new Date().toLocaleString();
  }

  async getAll() {
    if (!this.archivo) {
      return "Debe llamar al método init con el nombre del archivo";
    }

    try {
      return JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
    } catch (error) {
      console.log(error);

      throw new Error("Error en getAll");
    }
  }

  async getById(idBuscado) {
    if (!this.archivo) {
      return "Debe llamar al método init con el nombre del archivo";
    }

    try {
      const personas = await this.getAll();
      const index = this.getIndex(idBuscado, personas);

      const persona = personas[index];

      return persona;
    } catch (error) {
      console.log(error);

      throw new Error("Error en getById");
    }
  }

  async add(personaNueva) {
    if (!this.archivo) {
      return "Debe llamar al método init con el nombre del archivo";
    }

    try {
      const personas = await this.getAll();
      const dto = PersonaDTO(
        personaNueva,
        this.getNextId(personas),
        this.getFyH()
      );

      personas.push(dto);
      await fs.promises.writeFile(this.archivo, JSON.stringify(personas));

      return dto;
    } catch (error) {
      console.log(error);

      throw new Error("Error en add");
    }
  }

  async deleteById(idParaBorrar) {
    if (!this.archivo) {
      return "Debe llamar al método init con el nombre del archivo";
    }

    try {
      const personas = await this.getAll();
      const persona = personas.splice(this.getIndex(idParaBorrar, personas), 1);

      await fs.promises.writeFile(this.archivo, JSON.stringify(personas));

      return persona[0];
    } catch (error) {
      console.log(error);

      throw new Error("Error en deleteById");
    }
  }

  async updateById(idParaReemplazar, nuevaPersona) {
    if (!this.archivo) {
      return "Debe llamar al método init con el nombre del archivo";
    }

    try {
      const personas = await this.getAll();
      const dto = PersonaDTO(nuevaPersona, idParaReemplazar, this.getFyH());

      personas.splice(this.getIndex(idParaReemplazar, personas), 1, dto);

      await fs.promises.writeFile(this.archivo, JSON.stringify(personas));

      return dto;
    } catch (error) {
      console.log(error);

      throw new Error("Error en updateById");
    }
  }
}

module.exports = PersonaFileDao;
