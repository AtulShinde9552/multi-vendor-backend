const sellerModel = require('../../models/sellerModel');
const { responseReturn } = require('../../utiles/response');

class sellerController {

    get_seller_request = async (req, res) => {
        const { page = 1, searchValue = '', parPage = 10 } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);
        
        try {
            let query = { status: 'pending' };

            if (searchValue) {
                query = {
                    ...query,
                    $text: { $search: searchValue }
                };
            }

            const sellers = await sellerModel.find(query).skip(skipPage).limit(parseInt(parPage)).sort({ createdAt: -1 });
            const totalSeller = await sellerModel.countDocuments(query);

            responseReturn(res, 200, { totalSeller, sellers });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_seller = async (req, res) => {
        const { sellerId } = req.params;
        
        try {
            const seller = await sellerModel.findById(sellerId);
            responseReturn(res, 200, { seller });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    // product_update = async (req, res) => {
    //     let { name, description, discount, price, brand, productId, stock } = req.body;
    //     name = name.trim()
    //     const slug = name.split(' ').join('-')
    //     try {
    //         await productModel.findByIdAndUpdate(productId, {
    //             name, description, discount, price, brand, productId, stock, slug
    //         })
    //         const product = await productModel.findById(productId)
    //         responseReturn(res, 200, { product, message: 'product update success' })
    //     } catch (error) {
    //         responseReturn(res, 500, { error: error.message })
    //     }
    // }

    update_seller_data = async (req, res) => {
        const { sellerId } = req.body;
        let {
            shopName,
            division,
            district,
            address,
            bankName,
            bankAccount,
            ifscCode,
            pinCode,
            login,
            password} = req.body

    
        try {
            await sellerModel.findByIdAndUpdate(sellerId,{
            shopName,
            division,
            district,
            address,
            bankName,
            bankAccount,
            ifscCode,
            pinCode,
            login,
            password,sellerId
            })
            const seller = await sellerModel.findById(sellerId)

            responseReturn(res, 200, { message: 'Seller updated successfully', seller});
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_active_sellers = async (req, res) => {
        let { page = 1, searchValue = '', parPage = 10 } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            let query = { status: 'active' };

            if (searchValue) {
                query = {
                    ...query,
                    $text: { $search: searchValue }
                };
            }

            const sellers = await sellerModel.find(query).skip(skipPage).limit(parseInt(parPage)).sort({ createdAt: -1 });
            const totalSeller = await sellerModel.countDocuments(query);
            console.log(sellers);
            responseReturn(res, 200, { totalSeller, sellers });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_deactive_sellers = async (req, res) => {
        let { page = 1, searchValue = '', parPage = 10 } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            let query = { status: 'deactive' };

            if (searchValue) {
                query = {
                    ...query,
                    $text: { $search: searchValue }
                };
            }

            const sellers = await sellerModel.find(query).skip(skipPage).limit(parseInt(parPage)).sort({ createdAt: -1 });
            const totalSeller = await sellerModel.countDocuments(query);

            responseReturn(res, 200, { totalSeller, sellers });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new sellerController();
