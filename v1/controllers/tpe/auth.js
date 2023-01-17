const TpeIdentityDocument = require('../../../models/tpe_identity_docs');
const TpeProcessedInfos = require('../../../models/tpe_processed_infos');
const ProcessedCollaborators = require('../../../models/tpe_processed_collaborators');
const TpeFolder = require('../../../models/tpe_folders');
const TpeUserData = require('../../../models/tpe_user_data');
const VerifyCode = require('../../../models/verify_code');
const User = require('../../../models/user');
const request = require('request');

const { 
  generateCode, 
  sendEMAILConfirmationCode, 
  sendResetPasswordEmail, 
  sendConfirmationUpdatePasswordEmail, 
  hashPassword 
} = require('../../configs/methods');

module.exports = {
  SignUp: async (req, res, next) => {
    try {
      // Check if Error
      if (req.user.error) {
        res.status(200).json(req.user);
        return;
      }

      // Generate token
      const token = req.user.generateAuthToken();
      // Response with token and user
      let user = req.user.toObject();
      delete user.password

      // Response with token and user
      res.status(200).json({ user, token });
    } catch (error) {
      throw error;
    }
  },
  SignIn: async (req, res, next) => {
    try {
      // Check if Error
      if (req.user.error) {
        res.status(200).json(req.user);
        return;
      }

      // Generate token
      const token = req.user.generateAuthToken();

      // Response with token and user
      let user = req.user.toObject();
      delete user.password
      let user_infos;
      if(user.role === "master") {
        user_infos = await TpeProcessedInfos.findOne({ user });
      } else {
        user_infos = await ProcessedCollaborators.findOne({ user });
      }

      user.infos = user_infos;
      
      res.status(200).json({ user, token });
    } catch (error) {
      throw error;
    }
  },
  ForgotPassword: async (req, res, next) => {
    try {
      const { email, phone } = req.body;
      let condition = { password: {$exists: true} }
      if(email && !phone) {
        condition = {...condition, email }
      } else if(!email && phone){
        condition = {...condition, phone }
      } else {
        condition = {...condition, $or:[{ email }, { phone }] }
      }

      let user = await User.findOne(condition);
      if (!user) return res.status(200).send({ error: true,  message: "User not found" });
    
      const code = await generateCode();
      const verify_code = new VerifyCode();
      verify_code.user = user;
      verify_code.code = code;
      verify_code.type = "password";
      await verify_code.save();
      if(email)
      await sendResetPasswordEmail({toUser: {username: user?.firstname, email: user.email}, code });
      if(phone)
      request("http://172.31.31.7:8000/sms/"+phone+"?&msg= Votre code de verification du compte mossahamti est: "+code, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) // Show the HTML for the Google homepage. 
        }
      });
    
      res.status(200).send({ message: "email sent" });
    } catch (error) {
      
    }
  },
  ResetPassword: async (req, res, next) => {
    try {
      const { email, phone, password } = req.body;
      let condition = { password: {$exists: true} }
      if(email && !phone) {
        condition = {...condition, email }
      } else if(!email && phone){
        condition = {...condition, phone }
      } else {
        condition = {...condition, $or:[{ email }, { phone }] }
      }

      let user = await User.findOne(condition);
      if (!user) return res.status(200).send({ error: true,  message: "User not found" });

      let hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
      user.save();
      // Generate token
      const token = user.generateAuthToken();
      if(email)
      await sendConfirmationUpdatePasswordEmail({toUser: {username: user.firstname ? user.firstname : '', email: user.email} })
      if(phone)
      request("http://172.31.31.7:8000/sms/"+phone+"?&msg= Votre mot de passe a été modifié avec succés", function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) // Show the HTML for the Google homepage. 
        }
      });
      res.status(200).send({user, token});
    } catch (error) {
      console.log(error);
    }
  },
  IdentityDocuments: async (req, res, next) => {
    try {
      const { user, body } = req;
      const { document } = body;
      // Check if Error
      if (user.error) {
        res.status(200).json({ error: true, message: user.message });
        return;
      }
      let folder = await TpeFolder.findOne({ user: user._id });

      if (!folder) {
        folder = new TpeFolder();
        folder.status = "steps";
        folder.user = user._id;
      }

      let doc = await TpeIdentityDocument.findOne({ user: user._id, type: document.type, status: "pending" });
      if (!doc) {
        doc = new TpeIdentityDocument();
      }

      if (document.url) {
        doc.url = document.url;
      }
      if (document.turnover) {
        doc.turnover = document.turnover;
        doc.indemnity = document.indemnity;
        doc.has_indemnity = document.has_indemnity;
      }
      if (document.payment_option) {
        doc.payment_option = document.payment_option;
      }
      doc.type = document.type;
      doc.status = "pending";
      doc.user = user._id;
      doc.save();
      if (document.step == 5) {
        folder.status = "pending";
        user.signupStage = 30;
        user.save();
      }

      if (folder.step) {
        if (folder.step <= document.step) {
          folder.step = document.step;
        }
      } else { folder.step = document.step; }

      folder.save();

      res.status(200).json({ error: null, message: 'success', doc });
    } catch (error) {
      throw error;
    }
  },
  VerifyStatus: async (req, res, next) => {
    try {
      // Check if Error
      if (req.user.error) {
        res.status(200).json({ verify: null, error: true, message: "Not authorized" });
        return;
      }
      // Check Folder status
      const { user } = req;
      const cpu_folder = await TpeFolder.findOne({ user: user._id });
      if (cpu_folder) {
        if (cpu_folder.status === "validated") {
          const user_infos = await TpeUserData.findOne({ user: user._id });
          if (user_infos.year < new Date().getFullYear())
            res.status(200).json({ verify: { status: "expired", turnover: user_infos.turnover, year: user_infos.year }, error: false, message: "" });
          return;
        }

        if (cpu_folder.status === "rejected") {
          let rejected = []
          const docs = await TpeIdentityDocument.find({ user: user._id, status: "rejected" })
          docs.map((d) => {
            switch (d.type) {
              case "cin":
                rejected.push(1)
                break;

              case "id_fiscale":
                rejected.push(2)
                break;

              case "turnover":
                rejected.push(3)
                break;

              default:
                break;
            }

          })
          res.status(200).json({ verify: { status: cpu_folder.status, rejected }, error: false, message: "" });
          return;
        }

        res.status(200).json({ verify: { status: cpu_folder.status, step: cpu_folder.step }, error: false, message: "" });
        return;
      }
      res.status(200).json({ verify: { status: "steps", step: 1 }, error: false, message: "" });
    } catch (error) {
      throw error;
    }
  },
  getDocuments: async (req, res, next) => { 
    try {
      const { user } = req;
      const { type,status } = req.body;
      const cpu_docs = await TpeIdentityDocument.findOne({ user: user._id, status, type });
      res.status(200).send({ docs: cpu_docs });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
  ActivationCode: async (req, res, next) => {
    try {
      const { user } = req;
      const { code } = req.query;
      const verify_code = await VerifyCode.findOne({ user: user._id, code, active: true, verified: false, type: "activation" })
      if(verify_code) {
        user.active = true;
        if(verify_code.type_confirmation === "SMS") {
            user.signupStage = 19;
            SendEMAILActivationCode(user);
        } else if(verify_code.type_confirmation === "EMAIL") {
            user.signupStage = 20;
        }
        await user.save();
        verify_code.active = false;
        verify_code.verified = true;
        await verify_code.save();
        const token = req.user.generateAuthToken();
        res.status(200).json({ user, token });
        return;
      }
      res.status(200).json({ user: null, error: true, message: "Activation failed" });
      
    } catch (error) {
        console.log(error)
    }
  },
  SendSMSActivationCode : async (user) => {
     // Send Verification SMS
     const code = await generateCode();
     const verify_code = new VerifyCode();
     verify_code.user = user;
     verify_code.code = code;
     verify_code.type = "activation";
     verify_code.type_confirmation = "SMS";
     await verify_code.save();
     console.log(user.phone, code)
     request("http://172.31.31.7:8000/sms/"+user.phone+"?&msg=Votre code de verification du compte mossahamti est: "+code, function (error, response, body) {
      if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage. 
       } else {
            console.log(error)
       }
     });
  },
  ResendResetPasswordCode: async (req, res, next) => {
    try {
      const { user } = req;
      const old_verify_code = await VerifyCode.findOne({ user: user._id, active: true, verified: false, type: "password" })
      if(old_verify_code) {
        old_verify_code.active = false;
        await old_verify_code.save();
      }
      const code = await generateCode();
      const verify_code = new VerifyCode();
      verify_code.user = user;
      verify_code.code = code;
      verify_code.type = "password";
      await verify_code.save();
      await sendConfirmationCode({toUser: {username: "", email: user.email}, code });
      request("http://172.31.31.7:8000/sms/"+user.phone+"?&msg= Votre code de verification du compte mossahamti est: "+code, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) // Show the HTML for the Google homepage. 
        }
      });

      res.status(200).json({ error: false });
    } catch (error) {
        res.status(200).json({ error: true, message: "Resend failed" });
    }
  },
  ResendSMSActivationCode: async (req, res, next) => {
    try {
      const { user } = req;
      const old_verify_code = await VerifyCode.findOne({ user: user._id, active: true, verified: false, type: "activation", type_confirmation: 'SMS' })
      if(old_verify_code) {
        old_verify_code.active = false;
        await old_verify_code.save();
      }
      const code = await generateCode();
      const verify_code = new VerifyCode();
      verify_code.user = user;
      verify_code.code = code;
      verify_code.type = "activation";
      verify_code.type_confirmation = "SMS";
      await verify_code.save();
      request("http://172.31.31.7:8000/sms/"+user.phone+"?&msg= Votre code de verification du compte mossahamti est: "+code, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) // Show the HTML for the Google homepage. 
        }
      });

      res.status(200).json({ error: false });
    } catch (error) {
        res.status(200).json({ error: true, message: "Resend failed" });
    }
  },
  ResendEMAILActivationCode: async (req, res, next) => {
    try {
      const { user } = req;
      const old_verify_code = await VerifyCode.findOne({ user: user._id, active: true, verified: false, type: "activation", type_confirmation: "EMAIL" })
      if(old_verify_code) {
        old_verify_code.active = false;
        await old_verify_code.save();
      }
      const code = await generateCode();
      const verify_code = new VerifyCode();
      verify_code.user = user;
      verify_code.code = code;
      verify_code.type = "activation";
      verify_code.type_confirmation = "EMAIL";
      await verify_code.save();
      await sendConfirmationCode({toUser: {username: "", email: user.email}, code });

      res.status(200).json({ error: false });
    } catch (error) {
        res.status(200).json({ error: true, message: "Resend failed" });
    }
  },
  PasswordVerificationCode: async (req, res, next) => {
    try {
      const { email, phone, code } = req.body;
      let condition = { password: {$exists: true} }
      if(email && !phone) {
        condition = {...condition, email }
      } else if(!email && phone){
        condition = {...condition, phone }
      } else {
        condition = {...condition, $or:[{ email }, { phone }] }
      }
      
      let user = await User.findOne(condition);

      if (!user) return res.status(200).send({ error: true,  message: "User not found" });

      const verify_code = await VerifyCode.findOne({ user: user._id, code, active: true, verified: false, type: "password" })
      if(verify_code) {
        verify_code.active = false;
        verify_code.verified = true;
        await verify_code.save();
        
        res.status(200).json({ error: false, message: "Verification successful"  });
        return;
      }
      res.status(200).json({ user: null, error: true, message: "Verification failed" });
      
    } catch (error) {
        
    }
  },
}

const SendEMAILActivationCode = async (user) => {
  const code = await generateCode();
  const verify_code = new VerifyCode();
  verify_code.user = user;
  verify_code.code = code;
  verify_code.type = "activation";
  verify_code.type_confirmation = "EMAIL";
  await verify_code.save();
  await sendEMAILConfirmationCode({toUser: {username: "", email: user.email}, code });
}