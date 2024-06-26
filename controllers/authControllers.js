const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const areaManagerModel = require('../models/areaManagerModel');
const regionalAdminModel = require('../models/regionalAdminModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const { responseReturn } = require('../utiles/response');
const { createToken } = require('../utiles/tokenCreate');

class AuthControllers {
    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await adminModel.findOne({ email }).select('+password');
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: 'Login success' });
                } else {
                    responseReturn(res, 404, { error: "Password wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    area_manager_register = async (req, res) => {
        const { email, name, password, areaname, areacode } = req.body;
        try {
            const getUser = await areaManagerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email already exists' });
            } else {
                await areaManagerModel.create({
                    name,
                    areaname,
                    areacode,
                    email,
                    password: await bcrypt.hash(password, 10)
                });
                responseReturn(res, 201, { message: 'Register success' });
                console.log(res);
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' });
            console.log(error);
        }
    }

    area_manager_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const areaManager = await areaManagerModel.findOne({ email }).select('+password');
            if (areaManager) {
                const match = await bcrypt.compare(password, areaManager.password);
                if (match) {
                    const token = await createToken({
                        id: areaManager.id,
                        role: areaManager.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: 'Login success' });
                } else {
                    responseReturn(res, 404, { error: "Password wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    seller_register = async (req, res) => {
        const { email, name, password, status } = req.body;
        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email already exists' });
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manual',
                    shopInfo: {},
                    status: status || 'active'
                });
                await sellerCustomerModel.create({
                    myId: seller.id
                });
                responseReturn(res, 201, { message: 'Register success' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    seller_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const seller = await sellerModel.findOne({ email }).select('+password');
            if (seller) {
                const match = await bcrypt.compare(password, seller.password);
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: 'Login success' });
                } else {
                    responseReturn(res, 404, { error: "Password wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    
    regional_admin_register = async (req, res) => {
        const { email, name, password,region,regionCode} = req.body;
        try {
            const getUser = await regionalAdminModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email already exists' });
            } else {
                await regionalAdminModel.create({
                    name,
                    email,
                    region,
                    regionCode,
                    password: await bcrypt.hash(password, 10)
                });
                responseReturn(res, 201, { message: 'Register success' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }


    regional_admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const regionalAdmin = await regionalAdminModel.findOne({ email }).select('+password');
            if (regionalAdmin) {
                const match = await bcrypt.compare(password, regionalAdmin.password);
                if (match) {
                    const token = await createToken({
                        id: regionalAdmin.id,
                        role: regionalAdmin.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: 'Login success' });
                } else {
                    responseReturn(res, 404, { error: "Password wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    getUser = async (req, res) => {
        const { id, role } = req;

        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, { userInfo: user });
            } else if (role === 'areamanager') {
                const user = await areaManagerModel.findById(id);
                responseReturn(res, 200, { userInfo: user });
            } else if (role === 'regionaladmin') {
                const user = await regionalAdminModel.findById(id);
                responseReturn(res, 200, { userInfo: user });
            } else {
                const seller = await sellerModel.findById(id);
                responseReturn(res, 200, { userInfo: seller });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    profile_image_upload = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });
        form.parse(req, async (err, _, files) => {
            if (err) {
                responseReturn(res, 500, { error: err.message });
                return;
            }

            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET,
                secure: true
            });

            const { image } = files;
            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' });
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url
                    });
                    const userInfo = await sellerModel.findById(id);
                    responseReturn(res, 201, { message: 'Image upload success', userInfo });
                } else {
                    responseReturn(res, 404, { error: 'Image upload failed' });
                }
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    }

    profile_info_add = async (req, res) => {
        const { division, district, shopName, address,bankName, bankAccount,ifscCode,pinCode, login,password} = req.body;
        const { id } = req;

        try {
            await sellerModel.findByIdAndUpdate(id, {
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
                }
            });
            const userInfo = await sellerModel.findById(id);
            responseReturn(res, 201, { message: 'Profile info add success', userInfo });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    profile_info_update = async (req, res) => {
        const { division, district, shopName, address, bankName, bankAccount, ifscCode, pinCode } = req.body;
        const { id } = req;

        try {
            const updatedSeller = await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    address,
                    bankName,
                    bankAccount,
                    ifscCode,
                    pinCode,
                }
            }, { new: true });

            if (updatedSeller) {
                responseReturn(res, 200, { message: 'Profile info update success', userInfo: updatedSeller });
            } else {
                responseReturn(res, 404, { error: 'Seller not found' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            });
            responseReturn(res, 200, { message: 'Logout success' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new AuthControllers();
