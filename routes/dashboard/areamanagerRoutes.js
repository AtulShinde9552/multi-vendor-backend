const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const areamanagerController = require('../../controllers/dashboard/areamanagerController')

router.get('/get_areamanager',authMiddleware,areamanagerController.get_areamanager)


module.exports = router