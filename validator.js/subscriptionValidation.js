



exports.supscriptionValidationRules = () => {
  return [
    //body('user_id').exists().notEmpty().trim().withMessage('user_id is required.'),
    body('supscription_id').exists().notEmpty().trim().withMessage('supscription_id is required.'),
    body('starts_at').exists().notEmpty().trim().withMessage('starts_at is required.'),
    body('ends_at').exists().notEmpty().withMessage('ends_at is required.'),
    body('plan_type').exists().notEmpty().withMessage('paln_type is required.'),
    
  ];
};



exports.PlanRules = () => {
  return [
    body('stripe_price_id').exists().notEmpty().trim().withMessage('stripe_price_id is required.'),
    body('title').exists().notEmpty().trim().withMessage('title is required.'),
    body('price').exists().notEmpty().trim().withMessage('price is required.'),
    body('type').exists().notEmpty().trim().withMessage('type is required.')
  ];
};



exports.DeletePlanRules = () => {
  return [
    query('plan_id').exists().notEmpty().trim().withMessage('plan_id is required.'),

  ];
};




