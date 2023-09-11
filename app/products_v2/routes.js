const router = require('express').Router();
const Products = require('./model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({dest: 'uploads'})

router.post('/products', upload.single('image'), async(req, res) => {
    const {user_id, name, price, status, stock} = req.body;
    const image = req.file;
    if(image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target)
        try {
            await Products.sync();
            const result = await Products.create({user_id, name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`});
            res.send(result)
        } catch (e) {
            res.send(e);
        }
    };
})

router.get('/products', async(req, res) => {
    try {
        const result = await Products.findAll();
        res.send(result)
    } catch (e) {
        res.send(e)

    }
});

router.get('/products/:id', async (req, res) => {
    const productsId = req.params.id;
    try {
        const result = await Products.findByPk(productsId);
        if(!result) {
            return res.status(404)
        }
        res.send(result)
    } catch (e) {
        res.send(e)
    }
})

router.put('/products/:id', async(req, res) => {
    const productsId = req.params.id;
    const {user_id, name, price, stock, status} = req.body;
    const image = req.file;
    try {
        const result = await Products.findByPk(productsId);
        if(!result) {
            return res.status(404)
        }

        Products.user_id = user_id;
        Products. name = name;
        Products.price = price;
        Products.stock = stock;
        Products.status = status

        if(image) {
            const target = path.join(__dirname, '../../uploads', image.originalname);
            fs.renameSync(image.path, target)
            Products.image_url = `http://localhost:3000/public/${image.originalname}`
        }

        await result.save();
        res.send(result);
    } catch (e) {
        res.send(e);
    }
})

router.delete('products/:id', async(req, res) => {
    const ProductsId = req.params.id;
    
    try {
        const result = await Products.findByPk(ProductsId)
        if(!result){
            return res.status(404)
        }
        await result.destroy()
    }catch (e){
        res.send(e)
    }

})




module.exports = router;