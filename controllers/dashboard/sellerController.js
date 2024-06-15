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

    seller_status_update = async (req, res) => {
        const { sellerId, division, district, shopName, address, bankName, bankAccount, ifscCode, pinCode, login, password,image} = req.body;
        try {
            const updateData = {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    address,
                    bankName,
                    bankAccount,
                    ifscCode,
                    pinCode,
                    login,
                    password
                },
                image
            };

            await sellerModel.findByIdAndUpdate(sellerId, updateData, { new: true });
            const seller = await sellerModel.findById(sellerId);

            responseReturn(res, 200, { seller, message: 'Seller status update success' });
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

     update_seller_data = async (req, res) => {
        const { sellerId } = req.params;
        const updateData = req.body;
    
        const shopInfo = {
            shopName: updateData.shopName || '',
            division: updateData.division || '',
            district: updateData.district || '',
            address: updateData.address || '',
            bankName: updateData.bankName || '',
            bankAccount: updateData.bankAccount || '',
            ifscCode: updateData.ifscCode || '',
            pinCode: updateData.pinCode || '',
            login: updateData.login || '',
            password: updateData.password || ''
        };
    
        try {
            const updatedSeller = await sellerModel.findByIdAndUpdate(
                sellerId, 
                { shopInfo }, 
                { new: true, upsert: true }
            );
    
            if (!updatedSeller) {
                return responseReturn(res, 404, { message: 'Seller not found' });
            }
    
            responseReturn(res, 200, { message: 'Seller updated successfully', seller: updatedSeller });
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
