const authorOrder = require('../../models/authOrder')
const customerOrder = require('../../models/customerOrder')
const sellerWallet = require('../../models/sellerWallet')
const myShopWallet = require('../../models/myShopWallet')
const sellerModel = require('../../models/sellerModel')

const adminSellerMessage = require('../../models/chat/adminSellerMessage')
const sellerCustomerMessage = require('../../models/chat/sellerCustomerMessage')
const productModel = require('../../models/productModel')

const { mongo: { ObjectId } } = require('mongoose')
const { responseReturn } = require('../../utiles/response')

module.exports.get_seller_dashboard_data = async (req, res) => {
    const { id } = req;

    try {
        const totalSele = await sellerWallet.aggregate([
            {
                $match: {
                    sellerId: {
                        $eq: id
                    }
                }
            }, {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])

        const totalProduct = await productModel.find({
            sellerId: new ObjectId(id)
        }).countDocuments()

        const totalOrder = await authorOrder.find({
            sellerId: new ObjectId(id)
        }).countDocuments()

        const totalPendingOrder = await authorOrder.find({
            $and: [
                {
                    sellerId: {
                        $eq: new ObjectId(id)
                    }
                },
                {
                    delivery_status: {
                        $eq: 'pending'
                    }
                }
            ]
        }).countDocuments()

        const messages = await sellerCustomerMessage.find({
            $or: [
                {
                    senderId: {
                        $eq: id
                    }
                },
                {
                    receverId: {
                        $eq: id
                    }
                }
            ]
        }).limit(3)

        const recentOrders = await authorOrder.find({
            sellerId: new ObjectId(id)
        }).limit(5)

        responseReturn(res, 200, {
            totalOrder,
            totalSale: totalSele.length > 0 ? totalSele[0].totalAmount : 0,
            totalPendingOrder,
            messages,
            recentOrders,
            totalProduct
        })
    } catch (error) {
        console.log('get seller dashboard data error ' + error.messages)
    }
}

module.exports.get_admin_dashboard_data = async (req, res) => {
    const { id } = req
    try {
        const totalSele = await myShopWallet.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])


        const totalProduct = await productModel.find({}).countDocuments()

        const totalOrder = await customerOrder.find({}).countDocuments()

        const totalSeller = await sellerModel.find({}).countDocuments()

        const messages = await adminSellerMessage.find({}).limit(3)

        const recentOrders = await customerOrder.find({}).limit(5)

        responseReturn(res, 200, {
            totalOrder,
            totalSale: totalSele.length > 0 ? totalSele[0].totalAmount : 0,
            totalSeller,
            messages,
            recentOrders,
            totalProduct
        })

    } catch (error) {
        console.log('get admin dashboard data error ' + error.messages)
    }

}


module.exports.get_area_manager_dashboard_data = async (req, res) => {
    const { id } = req;

    try {
        const totalSale = await myShopWallet.aggregate([
            {
                $match: { areaManagerId: ObjectId(id) }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const totalProduct = await productModel.countDocuments({ areaManagerId: ObjectId(id) });
        const totalOrder = await customerOrder.countDocuments({ areaManagerId: ObjectId(id) });
        const totalSeller = await sellerModel.countDocuments({ areaManagerId: ObjectId(id) });

        const messages = await adminSellerMessage.find({
            $or: [
                { senderId: id },
                { receiverId: id }
            ]
        }).limit(3);

        const recentOrders = await customerOrder.find({ areaManagerId: ObjectId(id) }).limit(5);

        responseReturn(res, 200, {
            totalOrder,
            totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            totalSeller,
            messages,
            recentOrders,
            totalProduct
        });
    } catch (error) {
        console.error('get_area_manager_dashboard_data error: ' + error.message);
        responseReturn(res, 500, { error: 'Internal server error' });
    }
};

module.exports.get_regional_admin_dashboard_data = async (req, res) => {
    const { id } = req;

    try {
        const totalSale = await myShopWallet.aggregate([
            {
                $match: { regionalAdminId: ObjectId(id) }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const totalProduct = await productModel.countDocuments({ regionalAdminId: ObjectId(id) });
        const totalOrder = await customerOrder.countDocuments({ regionalAdminId: ObjectId(id) });
        const totalSeller = await sellerModel.countDocuments({ regionalAdminId: ObjectId(id) });

        const messages = await adminSellerMessage.find({
            $or: [
                { senderId: id },
                { receiverId: id }
            ]
        }).limit(3);

        const recentOrders = await customerOrder.find({ regionalAdminId: ObjectId(id) }).limit(5);

        responseReturn(res, 200, {
            totalOrder,
            totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            totalSeller,
            messages,
            recentOrders,
            totalProduct
        });
    } catch (error) {
        console.error('get_regional_admin_dashboard_data error: ' + error.message);
        responseReturn(res, 500, { error: 'Internal server error' });
    }
};


