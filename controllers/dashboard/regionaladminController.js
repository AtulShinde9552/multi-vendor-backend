const regionalAdminModel = require('../../models/regionalAdminModel');
const { responseReturn } = require('../../utiles/response');
class regionaladminController {
    get_regionaladmin= async(req, res) => {
    try {
        const regionaladmins = await regionalAdminModel.find(); 
        const response = {
            total: regionaladmins.length,
            data: regionaladmins
        };
        responseReturn(res, 200, response, "Area Managers fetched successfully");
        console.log(response);
    } catch (error) {
        responseReturn(res, 500, null, "Failed to fetch Area Managers");
    }
};
}
module.exports = new regionaladminController();