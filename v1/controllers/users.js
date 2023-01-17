const { validationToken } = require('../configs/methods')
const TpeProcessedInfos = require('../../models/tpe_processed_infos');

module.exports = {
  Autorized: async (req, res, next) => {
    try {
      // Check if Error
      if (req.user.error) {
        res.status(200).json({ error: true, message: req.user.message });
        return;
      }

      // Response with token and user
      let user = req.user.toObject();
      delete user.password

      const user_infos = await TpeProcessedInfos.findOne({ user });

      user.infos = user_infos;

      const token = req.user.generateAuthToken();

      res.status(200).json({ user, token });
    } catch (error) {
      throw error;
    }
  },
  Validation: async (req, res, next) => {
    try {
      // Get Token
      const { token } = req.params;
      
      // Validate token
      let user = await validationToken(token);
      if (!user) {
        res.status(422).send('Subscription cannot be activated!');
        return;
      }
      //generate new token
      const new_token = user.generateAuthToken();
      user = user.toObject();
      delete user.password
      res.status(200).json({ user, token: new_token });

    } catch (error) {
      throw error;
    }
  },
}