import { Router } from "express"
import { CartManager, Cart } from "../cartManager.js"
import { ProductManager, Product } from "../ProductManager.js";

const router = Router()
const cartManager = new CartManager('./carritos.json')
const productManager = new ProductManager('./productos.json')

router.get("/:cid", async (req, res) => {
    try{
        const {cid} = req.params
        const cartNum = parseInt(cid)
        
        const products = await cartManager.getCartById(cartNum)
        res.json(products);
    } catch (error) {
        console.error("Hubo un error al devolver los carritos", error);
        res.status(500).send("Hubo un error al devolver los carritos");
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const cartId = parseInt(cid);

    try {
        const pIDNum = parseInt(pid)
        const product = await productManager.getProductById(pIDNum);
        if (!product) {
            return res.status(404).send(`El producto con ID ${pid} no existe.`);
        }
    } catch (error) {
        console.error("Hubo un error al devolver los productos a través del ID", error);
        return res.status(500).send(`Hubo un error al devolver los productos a través del ID: ${pid}`);
    }
    

    try {

        const { quantity } = req.body;

        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).send(`La cantidad debe ser un número entero positivo.`);
        }

        await cartManager.addProduct(parseInt(cid), parseInt(pid), parsedQuantity)

       res.json(cartManager);
    } catch (error) {
        console.error("Hubo un error al agregar el producto al carrito", error);
        res.status(500).send("Hubo un error al agregar el producto al carrito");
    }
});


export default router;