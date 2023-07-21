/* eslint-disable max-len */
/* eslint-disable max-lines */
const models = require('../models');
const sequelize = require('sequelize');
const SubscriptionModel = models.Subscription;
const apiResponse = require('../utills/response');
const Utill = require('../utills/helper');
const PlanModel = models.Plan;
const User = models.User;
const FeatureModel = models.Feature;
const { Op } = require('sequelize');

/**
 * @api {post} /api/v1/register
 * @apiName subscribe user
 * @apiGroup Supscription
 * @apiPermission UserAuthenticated
 * @apiParam {String} user_id 
 * @apiParam {String} supscription_id
 * @apiParam {String} starts_at 
 * @apiParam {String} ends_at
 * @apiSuccess {Number} success Response Status Code 200.
 * @apiSuccess {String} message The response message.
 * @apiSuccessExample {json} Success-Response:
 * {
    {
    "success":"",
    "msg":"You have been succesfully subscribed to use rentsolutue."
}
    },
   
}
 */

exports.plan = async(req, res) => { 
  
  try {
    const insertData = {
      stripe_price_id:req.body.stripe_price_id,
      title:req.body.title,
      type:req.body.type,
      price:req.body.price
    };
  
    const planDetails = await PlanModel.create(insertData);
    return apiResponse.SuccessResponseWithData(res,res.__('PLAN_DETAILS'), planDetails);
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }

};

exports.getPlan = async(req,res) => {
  try {
    const getplan = await PlanModel.findAll({
      attributes:['id','stripe_price_id','title','type','price'],
      include:[
        {
          model:FeatureModel,
          as:'features',
          attributes:['id','feature','plan_id']
        },
        {
          model:SubscriptionModel,
          as:'subscribed_plan',
          where:{user_id:req.userData.id},
          // attributes:[[sequelize.fn('COUNT', sequelize.col('user_id')), 'totalCount']],
          required:false,
          // raw:false
        }
       
      ],
    
      order: [['createdAt', 'ASC']]
    });
    // console.log('getplans-----',getplan);
    const result_array = [];
    const plan_res = getplan.map((ele) => {
      return {
        ...ele.dataValues,
        active:ele.dataValues.subscribed_plan.length > 0 ? 1 : 0,
      };
    });
 
    console.log(result_array);
    //const getCount = getplan.subscribed_plan
   
    return apiResponse.SuccessResponseWithData(res,res.__('PLAN_DETAILS_FOUND_SUCCESSFUL'),plan_res);
  
    // return apiResponse.SuccessResponseWithData(res,res.__('PLAN_DETAILS_FOUND_SUCCESSFUL'),getUserPlan);
    
  }
  catch (e) {
    return apiResponse.InternalServerError(res,e);
  }
};

exports.subscription = async (req, res) => {
  try {
    const insertData = {
      user_id:req.userData.id,
      subscription_id:req.body.supscription_id,
      plan_id:req.body.plan_id,
      plan_type:req.body.plan_type,
      starts_at:req.body.starts_at,
      ends_at:req.body.ends_at,
      stripe_price_id:req.body.plan_id,
      status:req.body.status,
      updatedAt:Utill.getCurrentTime(),
      createdAt:Utill.getCurrentTime()
     
    };

    const updateStatus = await User.update({
      subscription_active:1,
    },
    {
      where:{
        id : req.userData.id
      },
      individualHooks: true,
    }
    );
      
    const supscriptionDetails = await SubscriptionModel.create(insertData);
    return apiResponse.SuccessResponseWithData(res,res.__('SUBSCRIBED_SUCESSFULL'), supscriptionDetails);
    
    
  } catch (e) {
    console.log(e);
    return apiResponse.InternalServerError(res, e);

  }
};

exports.getSubscription = async(req,res) => {
  try {
    const user_id = req.userData.id;
    const getSupscription = await SubscriptionModel.findOne(
      { where: { user_id:user_id},
     
      });
    if (!getSupscription) {
      return apiResponse.FailedResponseWithOutData(res, res.__('USER_NOT_EXIST'));
    }
    return apiResponse.SuccessResponseWithData(res,res.__('SUPSCRIPTION_FOUND_SUCESSFULLY'),getSupscription);
    
  }
  catch (e) {
    console.log(e);
    return apiResponse.InternalServerError(res,e);
  }
};

exports.updateSubscription = async(req,res) => {
  try {
    console.log(req.userData.id);
    const findUser = await User.findOne({where:{id:req.userData.id}});
  
    //console.log(req.userData.id);
    const update =   await SubscriptionModel.update({
      user_id:req.userData.id,
      subscription_id:req.body.supscription_id,
      starts_at:req.body.starts_at,
      ends_at:req.body.ends_at,
      status:req.body.status,
      plan_id:req.body.plan_id,
      stripe_price_id:req.body.plan_id,
      updatedAt:Utill.getCurrentTime(),
      // createdAt:Utill.getCurrentTime()
    },
    {
      where:{
        [Op.and]: [
          {user_id:req.userData.id},
          
        ]
      },
      individualHooks: true,
    }
   
    );
    
    // const updateStripe = await SubscriptionModel.update(
    //   {stripe_price_id:req.body.plan_id},
    //   { 
    //     where:{
    //       subscription_id:req.body.supscription_id
    //     },
    //     individualHooks:true
    //   }
    // );
    return apiResponse.SuccessResponseWithOutData(res,res.__('SUBSCRIPTION_UPDATED_SUCESSFULLY'));
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }
};

exports.getPlan2 = async(req,res) => {
  try {
    const getplan = await PlanModel.findAll({
      attributes:['id','stripe_price_id','title','type','price'],
      include:[
        {
          model:FeatureModel,
          as:'features',
          attributes:['id','feature','plan_id']
        },
        // {
        //   model:SubscriptionModel,
        //   as:'subscribed_plan',
        //   where:{user_id:req.userData.id},
        //   // attributes:[[sequelize.fn('COUNT', sequelize.col('user_id')), 'totalCount']],
        //   required:false,
        //   // raw:false
        // }
       
      ],
    
      order: [['createdAt', 'ASC']]
    });
    // console.log('getplans-----',getplan);
    // const result_array = [];
    // const plan_res = getplan.map((ele) => {
    //   return {
    //     ...ele.dataValues,
    //     active:ele.dataValues.subscribed_plan.length > 0 ? 1 : 0,
    //   };
    // });
 
    // console.log(result_array);
    //const getCount = getplan.subscribed_plan
   
    return apiResponse.SuccessResponseWithData(res,res.__('PLAN_DETAILS_FOUND_SUCCESSFUL'),getplan);
  
    // return apiResponse.SuccessResponseWithData(res,res.__('PLAN_DETAILS_FOUND_SUCCESSFUL'),getUserPlan);
    
  }
  catch (e) {
    return apiResponse.InternalServerError(res,e);
  }
};

exports.subscription2 = async (req, res) => {
  try {
    console.log(req.userData.id);
    const findSubscriber = await SubscriptionModel.findOne(
      {where:{[Op.and]:[
        {user_id:req.userData.id},
        {plan_id:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'},
        {status:'trialing'}
      ]}}
    );
    
    if (findSubscriber) {
      console.log('------------freeeeeeeee');
      const updateStatus = await SubscriptionModel.update(
        { 
          plan_id:req.body.plan_id,
          card_no:req.body.card_no,
          stripe_price_id:req.body.plan_id,
          current_plan:req.body.current_plan,
          next_plan:req.body.next_plan,
          showPlanChangeText:req.body.showPlanChangeText,
          updatedAt:Utill.getCurrentTime(),
          cancel_at:req.body.cancel_at ? req.body.cancel_at : ''
        },
        { 
          where:{[Op.and]:[
            {user_id:req.userData.id},
            {plan_id:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'},
            {status:'trialing'},
         
          ]
           
          },
          individualHooks:true
        }
      );
    }
    const insertData = {
      user_id:req.userData.id,
      subscription_id:req.body.supscription_id,
      plan_id:req.body.plan_id,
      plan_type:req.body.plan_type,
      starts_at:req.body.starts_at,
      ends_at:req.body.ends_at,
      stripe_price_id:req.body.plan_id,
      current_plan:req.body.current_plan,
      next_plan:req.body.next_plan,
      status:req.body.status,
      si_id:req.body.si_id,
      stripe_customer_id:req.body.stripe_customer_id,
      cancel_at:req.body.cancel_at ? req.body.cancel_at : '' ,
      active_plan:req.body.plan_id ,
      card_no:req.body.card_no,
      showPlanChangeText:req.body.showPlanChangeText,
      // coupon_end:req.body.coupon_end,
      createdAt:Utill.getCurrentTime(),
      updatedAt:Utill.getCurrentTime()
    };
    // const insertLog = {
    //   body: JSON.stringify(req.body),
    //   user_id: req.userData.id
    // };
    // await SubscriptionLogModel.create(insertLog);
    
    const updateStatus = await User.update({
      subscription_active:1,

    },
    {
      where:{
        id : req.userData.id
      },
      individualHooks: true,
    }
    );
      
    const supscriptionDetails = await SubscriptionModel.create(insertData);
    return apiResponse.SuccessResponseWithData(res,res.__('SUBSCRIBED_SUCESSFULL'), supscriptionDetails);
    
    
  } catch (e) {
    console.log(e);
    return apiResponse.InternalServerError(res, e);

  }
};

exports.updateSubscription2 = async(req,res) => {
  try {
    console.log('user_id',req.userData.id);
    console.log('req.body',req.body);
    const findUser = await User.findOne(
      {where:{id:req.userData.id},

      });

    const findSubscriber = await SubscriptionModel.findOne(
      {where:{[Op.and]:[
        {user_id:req.userData.id},
        {plan_id:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'},
        {status:'trialing'},
     
      ]}}
    );
    console.log('findSubscriber',findSubscriber);
    if (findSubscriber) {
      console.log('-------------free');
   
      // const data = {
      //   user_id:req.userData.id,
      //   subscription_id:req.body.supscription_id,
      //   starts_at:req.body.starts_at,
      //   ends_at:req.body.ends_at,
      //   status:req.body.status,
      //   plan_id:req.body.plan_id,
      //   stripe_price_id:req.body.plan_id,
      //   plan_type:req.body.plan_type,
      //   coupon:req.body.coupon,
      //   coupon_end:req.body.coupon_end,
      //   stripe_customer_id:req.body.stripe_customer_id,
      //   cancel_at:req.body.cancel_at ? req.body.cancel_at : '',
      //   si_id:req.body.si_id,
      //   card_no:req.body.card_no,
      //   updatedAt:Utill.getCurrentTime(),
      //   createdAt:Utill.getCurrentTime()
      // };
 
      const updateStatus = await SubscriptionModel.update(
        {plan_id:req.body.plan_id,
          // current_plan:req.body.current_plan,
          card_no:req.body.card_no,
          stripe_price_id:req.body.plan_id,
          current_plan:req.body.current_plan,
          next_plan:req.body.next_plan,
          showPlanChangeText:req.body.showPlanChangeText,
        },
        { 
          where:{[Op.and]:[
            {user_id:req.userData.id},
            {subscription_id:req.body.supscription_id},
            
          ]
           
          },
          individualHooks:true
        }
      );
      // if(data) {
      //   const insertData = await SubscriptionModel.create(data);
      // }
      // return apiResponse.SuccessResponseWithOutData(res,res.__('SUBSCRIPTION_UPDATED_SUCESSFULLY'));

      return apiResponse.SuccessResponseWithOutData(res,res.__('SUBSCRIPTION_UPDATED_SUCESSFULLY'));
    }
    else {

      console.log('-------------active');
      const update =   await SubscriptionModel.update({
        user_id:req.userData.id,
        subscription_id:req.body.supscription_id,
        starts_at:req.body.starts_at,
        ends_at:req.body.ends_at,
        status:req.body.status,
        plan_type:req.body.plan_type,
        plan_id:req.body.plan_id,
        stripe_price_id:req.body.plan_id,
        stripe_customer_id:req.body.stripe_customer_id,
        cancel_at:req.body.cancel_at,
        // active_plan:req.body.plan_id ,
        card_no:req.body.card_no,
        si_id:req.body.si_id,
        current_plan:req.body.current_plan,
        showPlanChangeText:req.body.showPlanChangeText,
        next_plan:req.body.next_plan,
        updatedAt:Utill.getCurrentTime()
      },
      {
        where:{
          [Op.and]: [
            {subscription_id:req.body.supscription_id},
            {user_id:req.userData.id},
            //{cancel_at:''}
            
          ]
        },
        individualHooks: true,
      }
     
      );
      // return apiResponse.SuccessResponseWithOutData(res,res.__('SUBSCRIPTION_UPDATED_SUCESSFULLY'));
      return apiResponse.SuccessResponseWithOutData(res,res.__('SUBSCRIPTION_UPDATED_SUCESSFULLY'));
    }
  
    //console.log(req.userData.id);
   
    // const insertLog = {
    //   body: JSON.stringify(req.body),
    //   user_id: req.userData.id
    // };
    // await SubscriptionLogModel.create(insertLog);
   
  
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }
};

exports.subscriptionStatus = async(req,res) => {
  try {
    const user_id = req.userData.id;
    const findUser = await SubscriptionModel.findAll(
      {where:{user_id:user_id},
        attributes:['user_id','id','status' ],
        order: [
          ['id', 'DESC'],
     
        ],
        limit:1
      });
    // console.log('findUser',findUser);
    // console.log('findUser dataValues',findUser[0].dataValues);
    // console.log('upadte Status',findUser[0].dataValues.status);
    // for (const user of findUser) {
    let active = '';
    if (findUser.length > 0) {
      const status = findUser[0].dataValues.status;
    
      if (status == 'active') {
        active = 1;
      }
      else {
        active = 0;
      }
            
      // }
      console.log('active---',active);
      
     
    }
    else if (findUser.length == 0) {
      active = 0;
    }
    return apiResponse.SuccessResponseWithData(res,res.__('SUBSCRIPTIOJN_DATA'),{active:active});
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }
};

exports.getPlan3 = async(req,res) => {
  try {
    console.log('------------->',req.userData.id);
    
    const findUser = await SubscriptionModel.findAndCountAll(
      {where:{[Op.and]:[
        {user_id:req.userData.id},
        {active_plan:{[Op.eq]:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'}},
        {status:{[Op.eq]:'trialing'}}
   
      ]}
      
      });

    const findUser0 = await SubscriptionModel.findAndCountAll(
      {where:{[Op.and]:[
        {user_id:req.userData.id},
        {active_plan:{[Op.eq]:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'}},
        {status:{[Op.eq]:'expire'}}
     
      ]}
      });
    // const findUser2 = await SubscriptionModel.findAndCountAll(
    //   {where:{[Op.and]:[
    //     {user_id:req.userData.id},
    //     // {active_plan:{[Op.ne]:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'}},
    //     // {plan_type:{[Op.eq]:0}},
    //     // {status:{[Op.eq]:'inactive'}}
     
    //   ]}
        
    //   });

    console.log(findUser);
    // console.log(findUser2);
    

    let getplan = '';
    if (findUser.count > 0) {
      console.log('First');
      getplan = await PlanModel.findAll({
     
        attributes:['id','stripe_price_id','title','type','price','is_free'],
        include:[
          {
            model:FeatureModel,
            as:'features',
            attributes:['id','feature','plan_id']
          },
          {
            model:SubscriptionModel,
            as:'subscribed_plan',
            where:{[Op.and]:
              [
                {user_id:req.userData.id},
                {status:'trialing' }
              ],
        
            },
            
            // attributes:[[sequelize.fn('COUNT', sequelize.col('user_id')), 'totalCount']],
            required:false,
            // raw:false
          }
         
        ],
        // required:false,
        // order: [['orderId', 'ASC']]
      });
    } else if (findUser0.count > 0) {
      getplan = await PlanModel.findAll({
        where:{stripe_price_id:{[Op.ne]:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'}},
        attributes:['id','stripe_price_id','title','type','price','is_free'],
        include:[
          {
            model:FeatureModel,
            as:'features',
            attributes:['id','feature','plan_id']
          },
          {
            model:SubscriptionModel,
            as:'subscribed_plan',
            where:{[Op.and]:
              [
                {user_id:req.userData.id},
                {status:'active' }
              ],
        
            },
            
            // attributes:[[sequelize.fn('COUNT', sequelize.col('user_id')), 'totalCount']],
            required:false,
            // raw:false
          }
         
        ],
        // required:false,
        // order: [['orderId', 'ASC']]
      });
    }
    else {
      getplan = await PlanModel.findAll({
        where:{stripe_price_id:{[Op.ne]:'price_1N5pDmIxqXqbL7wmSEPjV9Z3'}},
        attributes:['id','stripe_price_id','title','type','price','is_free'],
        include:[
          {
            model:FeatureModel,
            as:'features',
            attributes:['id','feature','plan_id']
          },
          {
            model:SubscriptionModel,
            as:'subscribed_plan',
            where:{[Op.and]:
              [
                {user_id:req.userData.id},
                {status:'active' }
              ],
        
            },
            
            // attributes:[[sequelize.fn('COUNT', sequelize.col('user_id')), 'totalCount']],
            required:false,
            // raw:false
          }
         
        ],
        // required:false,
        // order: [['orderId', 'ASC']]
      });
    }

  
    // console.log('getplans-----',getplan);
    const result_array = [];
    
    const plan_res = getplan.map((ele) => {
      //console.log(ele.dataValues.subscribed_plan);
      console.log(ele.dataValues);
      //console.log(ele.dataValues.subscribed_plan);
      return {
        ...ele.dataValues,
        // eslint-disable-next-line max-len
        active:(ele.dataValues.subscribed_plan.length > 0 && (ele.dataValues.subscribed_plan[0]['dataValues'].status == 'active' || ele.dataValues.subscribed_plan[0]['dataValues'].status == 'trialing')  && ele.dataValues != 'undefined') ? 1 : 0,
      };
    });
    // for (const plan of getplan) {
    //   console.log(plan);
    //   console.log(plan.subscribed_plan.length);
    //   result_array.push(
    //     {
    //       id:plan.id,
    //       stripe_price_id:plan.stripe_price_id,
    //       title:plan.title,
    //       type:plan.type,
    //       price:plan.price,
       
    //       active:1
          
        
    //     }
    //   );
    // }
    // console.log(result_array);
    //const getCount = getplan.subscribed_plan
   
    return apiResponse.SuccessResponseWithData(res,res.__('PLAN_DETAILS_FOUND_SUCCESSFUL'),plan_res);
  
    // return apiResponse.SuccessResponseWithData(res,res.__('PLAN_DETAILS_FOUND_SUCCESSFUL'),getUserPlan);
    
  }
  catch (e) {
    console.log(e);
    return apiResponse.InternalServerError(res,e);
  }
};

exports.subscriptionStatus2 = async(req,res) => {
  try {
    const user_id = req.userData.id;
    const findUser = await SubscriptionModel.findAll(
      {where:{user_id:user_id},
        attributes:['user_id','id','status','stripe_customer_id','si_id','subscription_id','plan_type','current_plan','active_plan' ],
        order: [
          ['id', 'DESC'],
     
        ],
        required:false,
        limit:1
      });
      
    console.log(findUser[0]);
    // console.log(findUser[0].dataValues.plan_type);
    let free_plan;
    let stripe_customer_id;
    let si_id;
    let subscription_id;
    let current_plan;
    console.log(findUser);
    // console.log('Lenght',findUser[0].dataValues.length > 0);
    if (findUser.length > 0) {
      if (findUser[0].dataValues.active_plan == 'price_1N5pDmIxqXqbL7wmSEPjV9Z3' && findUser[0].dataValues.status == 'trialing') {
        free_plan = 1;
        stripe_customer_id = findUser[0].dataValues.stripe_customer_id;
        si_id = findUser[0].dataValues.si_id;
        subscription_id = findUser[0].dataValues.subscription_id;
        current_plan = findUser[0].dataValues.current_plan;
      }
      else {
        free_plan = 0;
        stripe_customer_id = findUser[0].dataValues.stripe_customer_id;
        si_id = findUser[0].dataValues.si_id;
        subscription_id = findUser[0].dataValues.subscription_id;
        current_plan = findUser[0].dataValues.current_plan;
      }
    }

    
    // console.log('findUser',findUser);
    // console.log('findUser dataValues',findUser[0].dataValues);
    // console.log('upadte Status',findUser[0].dataValues.status);
    // for (const user of findUser) {
    let sub_status = '';
    if (findUser.length > 0) {
      const status = findUser[0].dataValues.status;
    
      if (status == 'active') {
        sub_status = 'active';
      }
      else if (status == 'past_due') {
        sub_status = 'past_due';
      }
      else if (status == 'unpaid') {
        sub_status = 'unpaid';
      }
      else if (status == 'canceled') {
        sub_status = 'canceled';
      }
      else if (status == 'incomplete') {
        sub_status = 'incomplete';
      }
      else if (status == 'incomplete_expired') {
        sub_status = 'incomplete_expired';
      }
      else if (status == 'trialing') {
        sub_status = 'trialing';
      }
      else if (status == 'paused') {
        sub_status = 'paused';
      }
      else if (status == 'expire') {
        sub_status = 'expire';
      }
      
            
      // }
      console.log('active---',sub_status);
      
     
    }
    else if (findUser.length == 0) {
      sub_status = 0;
    }
    return apiResponse.SuccessResponseWithData(res,res.__('SUBSCRIPTIOJN_DATA'),{sub_status:sub_status,free_plan:free_plan,stripe_customer_id:stripe_customer_id,si_id:si_id,subscription_id:subscription_id,current_plan:current_plan});
  } catch (error) {
    console.log(error);
    return apiResponse.InternalServerError(res,error);
  }
};

