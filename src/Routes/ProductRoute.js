import express from 'express'
const router = express.Router()

import { AddProduct, deleteProduct, updateProduct, getProductsByCategory,  getSingleProduct, getAllProducts } from '../Controllers/addProduct.controller.js'
import { upload } from '../Middlewares/multer.js'
import { authorizeAdmin } from '../Middlewares/adminAuthorization.middleware.js'
import { verifyJWT } from '../Middlewares/auth.middleware.js'
import { adminVerifyJWT } from '../Middlewares/adminAuth.middleware.js'


router.post('/addProduct',
   
    upload.single('productImage'),
    adminVerifyJWT,
    authorizeAdmin,
    // upload.fields([
    //     {
    //         name: "product_Image",
    //         maxCount: 1
    //     }
    // ]),
    AddProduct
)
router.get('/', getAllProducts)

router.get('/category/:category', getProductsByCategory)
router.get('/:id', getSingleProduct)
router.put(
    "/:id",
    // verifyJWT,
    adminVerifyJWT,
    authorizeAdmin,
    upload.single('productImage'),
    updateProduct
);
router.delete('/:id',
    // verifyJWT,
    adminVerifyJWT,
    authorizeAdmin,
    deleteProduct
)

export default router