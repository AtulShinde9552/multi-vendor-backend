const regionalAdminModel = require('../../models/regionalAdminModel');
const { responseReturn } = require('../../utiles/response');
class regionaladminController {
    get_regionaladmin= async(req, res) => {
    try {
        const regionaladmins = await regionalAdminModel.find(); 
        responseReturn(res, 200, regionaladmins, "Area Managers fetched successfully");
        console.log(regionaladmins);
    } catch (error) {
        responseReturn(res, 500, null, "Failed to fetch Area Managers");
    }
};
}
module.exports = new regionaladminController();