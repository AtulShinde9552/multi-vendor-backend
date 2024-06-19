const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const regionaladminController = require('../../controllers/dashboard/regionaladminController')

router.get('/get_regionaladmin',authMiddleware,regionaladminController.get_regionaladmin)


module.exports = router