import { Router } from "express"
import { ProductManager, Product } from "../ProductManager.js"

const router = Router()
const productManager = new ProductManager('./productos.json')

router.get("/", async (req, res) => {
    const products = await productManager.getProducts()
    const { limit } = req.query

    if (!limit) {
        try{
            res.json(products);
        } catch (error) {
            console.error("Hubo un error al devolver los productos", error);
            res.status(500).send("Hubo un error al devolver los productos");
        }
    } else {
        try {
            const parsedLimit = parseInt(limit)

            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                return res.send(`El parametro que estableciste como limite (${limit} no es un numero entero.)`)
            }
            const limitedProducts = products.slice(0, parsedLimit);
            res.json(limitedProducts);

        } catch (error) {
            console.error("Hubo un error al devolver los productos con el limite determinado", error);
            res.status(500).send("Hubo un error al devolver los productos con el limite determinado");
        }
    }
})

router.get("/:pID", async (req, res) => {

    const { pID } = req.params

    if (!pID || pID.trim() === "") {
        try{
            const products = await productManager.getProducts()
            res.json(products);
        } catch (error) {
            console.error("Hubo un error al devolver los productos", error);
            res.status(500).send("Hubo un error al devolver los productos");
        }
    } else {
        try{
            const pIDNum = parseInt(pID)
            const product = await productManager.getProductById(pIDNum)
            res.json(product)
        } catch (error) {
            console.error("Hubo un error al devolver los productos a traves del ID", error);
            res.status(500).send(`Hubo un error al devolver los productos a traves del ID: ${pID}`);
        }
    }

})

router.post("/", async (req, res) => {
    try{
        const {title, description, code, price, stock, category, thumbnail} = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Faltan propiedades obligatorias." });
        }
        const products = await productManager.addProduct(req.body);
        res.json({
            product: req.body
        })
        return;
    } catch (error){
        console.log("Hubo un error al agregar el producto");
        res.status(500).send(`Hubo un error al agregar el producto`)
    }
})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try{
        const existingProduct = await productManager.getProductById(parseInt(pid));

        if (!existingProduct) {
            return res.status(404).send(`El producto con ID ${pid} no existe.`);
        }

        const { title, description, code, price, status, stock, category, thumbnail } = req.body;

        /*const updatedFields = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        };*/
        
        await productManager.updateProduct(parseInt(pid), req.body);

        res.json({
            message: `Producto con ID ${pid} actualizado.`,
        });
    } catch (error) {
        console.error("Hubo un error al actualizar el producto", error);
        res.status(500).send("Hubo un error al actualizar el producto");
    }
})

router.delete("/:pid", async (req, res) => {

    const { pid } = req.params
    const parsedPid = parseInt(pid);
    try{
        if (!isNaN(parsedPid)) {
            const products = await productManager.deleteProduct(parsedPid);
            res.json(products);
        } else {
            res.status(400).send(`El parámetro pid (${pid}) no es un número entero válido.`);
        }
    } catch (error) {
        console.error("Hubo un error al borrar el producto", error);
        res.status(500).send("Hubo un error al borrar el producto");
    }
})

export default router;