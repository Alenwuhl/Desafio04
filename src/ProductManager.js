//PRODUCT MANAGER
import { log } from "console";
import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    if (fs.existsSync(path)) {
      try {
        let products = fs.readFileSync(path, "utf-8");
        this.products = JSON.parse(products);
      } catch {
        this.products = [];
      }
    } else {
      this.products = [];
    }
  }
  async saveFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addProduct(productoAgregado) {
    if (
      !productoAgregado.code ||
      !productoAgregado.title ||
      !productoAgregado.price ||
      !productoAgregado.category ||
      !productoAgregado.stock ||
      !productoAgregado.description
    ) {
      console.log("Faltan valores obligatorios.");
      return "Faltan valores obligatorios.";
    }

    const existingProduct = this.products.find(
      (product) => product.code === productoAgregado.code
    );

    if (existingProduct) {
      console.log(
        `El código "${productoAgregado.code}" ya está en uso. Por favor, elija un código único.`
      );
      return `El código "${productoAgregado.code}" ya está en uso. Por favor, elija un código único.`;
    }

    if (this.products.length === 0) {
      productoAgregado.id = 1;
    } else {
      productoAgregado.id = this.products[this.products.length - 1].id + 1;
    }

    this.products.push(productoAgregado);

    const respuesta = await this.saveFile(this.products);

    if (respuesta) {
      console.log("Producto Agregado");
      const updatedProducts = await this.getProducts(); // Obtener la lista actualizada
      return updatedProducts;
    } else {
      console.log(
        "Hubo un error al agregar el producto (ProductManager.addProduct)"
      );
      return [];
    }
  }

  async getProducts() {
    try {
      const products = await this.readFile();
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.error(
        "Hubo un error al leer el archivo de productos:",
        error.message
      );
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.readFile();

      const product = this.products.find((product) => product.id === id);

      if (product) {
        return product;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Hubo un error al leer el archivo de productos.");
      return "Error al leer el archivo de productos";
    }
  }

  async readFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const index = this.products.findIndex((product) => product.id === id);
      if (index !== -1) {
        if (
          typeof updatedFields.title === "string" &&
          typeof updatedFields.description === "string" &&
          typeof updatedFields.code === "string" &&
          typeof updatedFields.price === "number" &&
          typeof updatedFields.status === "boolean" &&
          typeof updatedFields.stock === "number" &&
          typeof updatedFields.category === "string"
        ) {
          updatedFields.id = id;

          Object.assign(this.products[index], updatedFields);

          await this.saveFile(this.products);
          console.log(`Producto con ID ${id} actualizado.`);
        } else {
          console.log(
            "Los tipos de datos en los campos actualizados no son correctos."
          );
        }
      } else {
        console.log(`Producto con ID ${id} no encontrado.`);
      }
    } catch (error) {
      console.error("Hubo un error al actualizar el producto:", error);
      console.log("Hubo un error al actualizar el producto.");
    }
  }

  async deleteProduct(id) {
    console.log(`Intentando eliminar producto con ID: ${id}`);
    const index = this.products.findIndex((product) => product.id === id);
    console.log(`Índice del producto con ID ${id}: ${index}`);
    if (index !== -1) {
      this.products.splice(index, 1);

      const success = await this.saveFile(this.products);
      if (success) {
        console.log(`Producto con ID ${id} eliminado.`);
      } else {
        console.log("Hubo un error al eliminar el producto.");
      }
    } else {
      console.log(`Producto con ID ${id} no encontrado.`);
    }
  }

  async deleteProductByCode(code) {
    console.log(`Intentando eliminar producto con código: ${code}`);
    const index = this.products.findIndex((product) => product.code == code);
    console.log(`Índice del producto con código ${code}: ${index}`);
    if (index !== -1) {
      this.products.splice(index, 1);

      const success = await this.saveFile(this.products);
      if (success) {
        console.log(`Producto con código ${code} eliminado.`);
      } else {
        console.log("Hubo un error al eliminar el producto.");
      }
      return success
    } else {
      console.log(`Producto con código ${code} no encontrado.`)
      return false
    }
  }
}
class Product {
  constructor(code, title, description, price, thumbnail, stock, category) {
    (this.code = code),
      (this.title = title),
      (this.description = description),
      (this.price = price),
      (this.thumbnail = thumbnail),
      (this.stock = stock),
      (this.category = category),
      (this.status = true);
  }
}

export { ProductManager, Product};
