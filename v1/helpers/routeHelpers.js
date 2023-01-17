const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const phoneNumberJoi = Joi.extend(require("joi-phone-number"));

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body);
      if (result.error) {
        return res.status(200).send({ error: result.error.details[0] });
      }

      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },

  schemas: {
    CPUloginSchema: Joi.object().keys({
      phone: Joi.string().min(10).required(),
      password: Joi.string().min(8).required(), //.pattern(new RegExp(pattern))
    }),
    CPUsignupSchema: Joi.object().keys({
      phone: Joi.string().min(10).required(),
      // password: Joi.string().min(8).required(),//.pattern(new RegExp(pattern))
    }),
    TPEloginSchema: Joi.object().keys({
      credential: Joi.alternatives().try(
        Joi.string().email().required(),
        Joi.string().min(10).required()
      ),
      password: Joi.string().min(8).required(), //.pattern(new RegExp(pattern))
    }),
    TPEsignupSchema: Joi.object().keys({
      phone: Joi.string().min(10).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(), //.pattern(new RegExp(pattern))
      country: Joi.string().required(),
    }),
  },
};
