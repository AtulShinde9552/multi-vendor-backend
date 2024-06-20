const areaManagerModel = require('../../models/areaManagerModel');
const { responseReturn } = require('../../utiles/response');
class areamanagerController {
get_areamanager= async(req, res) => {
    try {
        const areaManagers = await areaManagerModel.find(); 
        const response = {
            total: areaManagers.length,
            data: areaManagers
        };
        responseReturn(res, 200, response, "Area Managers fetched successfully");
        console.log(response);
    } catch (error) {
        responseReturn(res, 500, null, "Failed to fetch Area Managers");
    }
};
}
module.exports = new areamanagerController();