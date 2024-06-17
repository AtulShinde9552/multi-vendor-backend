const areaManagerModel = require('../../models/areaManagerModel');
const { responseReturn } = require('../../utiles/response');
class areamanagerController {
get_areamanager= async(req, res) => {
    try {
        const areaManagers = await areaManagerModel.find(); 
        responseReturn(res, 200, areaManagers, "Area Managers fetched successfully");
        console.log(areaManagers);
    } catch (error) {
        responseReturn(res, 500, null, "Failed to fetch Area Managers");
    }
};
}
module.exports = new areamanagerController();