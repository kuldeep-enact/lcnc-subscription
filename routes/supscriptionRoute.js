const express = require('express');
const router = express.Router();
const SupscriptionController = require('../controller/supscriptionController'); 
const { verifyToken } = require('../utills/helper');


const { supscriptionValidationRules, validate } = require('../validator/validationRule');


router.post('/subscription', supscriptionValidationRules(),validate,verifyToken, SupscriptionController.subscription);

router.get('/subscription',verifyToken,SupscriptionController.getSubscription);

router.put('/subscription',verifyToken,SupscriptionController.updateSubscription);

router.post('/subscription2', supscriptionValidationRules(),validate,verifyToken, SupscriptionController.subscription2);

router.put('/subscription2',verifyToken,SupscriptionController.updateSubscription2);

router.post('/plan',SupscriptionController.plan);

router.get('/plan',verifyToken,SupscriptionController.getPlan);

router.get('/plan2',SupscriptionController.getPlan2);

router.get('/plan3',verifyToken,SupscriptionController.getPlan3);

router.get('/subscription-status',verifyToken,SupscriptionController.subscriptionStatus);

router.get('/subscription-status2',verifyToken,SupscriptionController.subscriptionStatus2);
module.exports = router;