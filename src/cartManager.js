//CART MANAGER
import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    if (fs.existsSync(path)) {
      try {
        let carts = fs.readFileSync(path, "utf-8");
        this.carts = JSON.parse(carts);
      } catch {
        this.carts = [];
      }
    } else {
      this.carts = [];
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
  async addCart(cartAgregado) {
    if (this.carts.length === 0) {
      cartAgregado.id = 1;
    } else {
      cartAgregado.id = this.carts[this.carts.length - 1].id + 1;
    }

    this.carts.push(cartAgregado);

    const respuesta = await this.saveFile(this.carts);

    if (respuesta) {
      console.log("Carrito Agregado");
    } else {
      console.log("Hubo un error al agregar el carrito");
    }
  }

  async getCarts() {
    try {
      const carts = await this.readFile();
      return carts;
    } catch (error) {
      console.error("Hubo un error al leer el archivo de carritos.");
      return "Error al leer el archivo de carritos";
    }
}

  async getCartById(id) {
    
    try {
      const carts = await this.readFile();
      const cart = carts.find((cart) => cart.id === id);
  
      if (cart) {
        return cart;
      } else {
        return "Carrito no encontrado";
      }
    } catch (error) {
      console.error("Hubo un error al leer el archivo de carritos.");
      return "Error al leer el archivo de carritos";
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
    const index = this.productManagers.findIndex((productManager) => productManager.id === id);
  
    if (index !== -1) {
    
      updatedFields.id = id;
  
      Object.assign(this.productManagers[index], updatedFields);
  
      const success = await this.saveFile(this.productManagers);
      if (success) {
        console.log(`Carrito con ID ${id} actualizado.`);
      } else {
        console.log("Hubo un error al actualizar el carrito.");
      }
    } else {
      console.log(`Carrito con ID ${id} no encontrado.`);
    }
  }

  async addProduct(cartId, productId, quantity) {
    
    let cart = this.carts.find(
      (cart) => cart.id === cartId
    );
    
    if (! cart) {
      cart = new Cart()
      if (this.carts.length === 0) {
        cart.id = 1;
      } else {
        cart.id = this.carts[this.carts.length - 1].id + 1;
      }
      this.carts.push(cart);
    }
    
    let cartProduct = cart.cartProducts.find(
      (cartProduct) => cartProduct.id === productId
    );

    if (! cartProduct) {
      cartProduct = new CartProduct()
      cartProduct.id = productId
      cart.cartProducts.push(cartProduct);
    }

    cartProduct.quantity += quantity
    const respuesta = await this.saveFile(this.carts);

    if (respuesta) {
      console.log("Producto Agregado al carrito");
    } else {
      console.log("Hubo un error al agregar el carrito (cartManager.addProduct)");
    }
  }
}

class Cart {
  constructor() {
    this.cartProducts = [];
  }
}

class CartProduct {
  constructor() {
    this.quantity = 0;
  }
}

export { CartManager, Cart };

