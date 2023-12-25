const fs = require('fs');


//clase con el nombre ProductManager
class ProductManager {
  constructor(filePath) {
    //contar con una variable this.path que se inicializara con el constructor
    this.path = filePath;
  }


  /*metodo addProduct que recibe el objeto:
        id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
        title (nombre del producto)
        description (descripción del producto)
        price (precio)
        thumbnail (ruta de imagen)
        code (código identificador)
        stock (número de piezas disponibles)

  */
  async addProduct(product) {
    const products = await this.getProducts();
    //id autoincrementable
    const newProduct = { id: products.length + 1, ...product };
    products.push(newProduct);
    //metodo para guardar en el archivo
    await this.saveProducts(products);
    return newProduct;
  }
  
  //metodo getProduct que lee el archivo y devuelve los productos en formato arreglo
  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o hay un error al leerlo, devuelve un array vacío.
      return [];
    }
  }
  
  //metodo getProductById recibe un id y lee el archivo y regresa el producto en formato objeto
  async getProductById(id) {
    const products = await this.getProducts();
    const productById = products.find(product => product.id === id);
    if(productById===undefined){
        return "Error: No se encontro producto"
    }
    return productById;
  }

  // método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar
  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);

    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      await this.saveProducts(products);
      return products[index];
    }

    return "No se encontro el producto"; // No se encontró el producto con el ID especificado.
  }

  //metodo deleteProduct donde recibe el id y elimina el objeto
  async deleteProduct(id) {
    const products = await this.getProducts();
    //se obtendra todos los productos excepto el que sera eliminado
    const updatedProducts = products.filter(product => product.id !== id);
    //se guardaran todos excepto el eliminado
    await this.saveProducts(updatedProducts);
  }

  async saveProducts(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }
}

// Se creará una instancia de la clase “ProductManager”
const productManager = new ProductManager('productos.json');

/*
Se llamará al método “addProduct” con los campos:
    title: “producto prueba”
    description:”Este es un producto prueba”
    price:200,
    thumbnail:”Sin imagen”
    code:”abc123”,
    stock:25

*/
(async () => {
  await productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });

  //El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

  //Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
  const allProducts = await productManager.getProducts();
  console.log('Todos los productos:', allProducts);

  //Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
  const productById = await productManager.getProductById(2);
  console.log('Producto con ID 1:', productById);

  //Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
  await productManager.updateProduct(1, { price: 30, stock: 40 });
  console.log('Producto actualizado:', await productManager.getProductById(1));

  //Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
  await productManager.deleteProduct(1);
  console.log('Productos después de eliminar el producto con ID 1:', await productManager.getProducts());
})();