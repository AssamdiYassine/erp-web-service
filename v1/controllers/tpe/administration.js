const TpeCollaboratorFolder = require('../../../models/tpe_collaborator_folders');
const TpeCollaboratorDocument = require('../../../models/tpe_collaborator_docs');
const Demands = require('../../../models/tpe_demands');
const UpdateDocs = require('../../../models/tpe_update_docs');
const User = require('../../../models/user');
const UserCollaborator = require("../../../models/user_collaborator");

const { hashPassword, sendConfirmationUpdatePasswordEmail, generateRef } = require('../../configs/methods')

module.exports = {
  UpdatePasswrod: async (req, res, next) => {
    const { body, user } = req;
    const { password, new_password } = body;

    const matchPassword = await user.isValidPassword(password);
    if (matchPassword) {
      let hashedPassword = await hashPassword(new_password);
      user.password = hashedPassword;
      user.save();

      await sendConfirmationUpdatePasswordEmail({toUser: {username: user.firstname ? user.firstname : '', email: user.email} })

      res.status(200).send({code: 'sucess'});
      return
    }
    res.status(200).send({error: true, code: 1});
  },
  CompanyDocs: async (req, res, next) => {
    try{
      
      const { body, user } = req;
      const { type, document } = body;
      // Check if Error
      if (user.error) {
        res.status(200).json({ error: true, message: user.message });
        return;
      }
      let demand = await Demands.findOne({ user: user._id });
      if (!demand) {
        demand = new Demands();
        demand.status = "pending";
        demand.user = user._id;
        demand.type = type;
        await demand.save();
      }

      let doc = await UpdateDocs.findOne({ user: user._id, type: document.type, status: "pending", demand });
      if (!doc) {
        doc = new UpdateDocs();
      }

      if (document.url) {
        doc.url = document.url;
      }
      doc.type = document.type;
      doc.status = "pending";
      doc.user = user._id;
      doc.demand = demand._id;
      doc.save();

      res.status(200).send({code: 'sucess'});
      return

    } catch(e) {
      res.status(200).send({error: true, code: 1});
    }
  },
  CollaboratorDocs: async (req, res, next) => {
    try{
      
      const { body, user } = req;
      const { document, collaborator, company } = body;
      // Check if Error
      if (user.error) {
        res.status(200).json({ error: true, message: user.message });
        return;
      }
      let collaborator_ = await TpeCollaboratorFolder.findOne({ _id: collaborator });
      if (!collaborator_) {
        collaborator_ = new TpeCollaboratorFolder();
        collaborator_.status = "steps";
        collaborator_.company = company;
        collaborator_.user = user._id;
        collaborator_.ref = await generateRef();
        await collaborator_.save();
      }

      let doc ;
      if(document.type != "attestation" && document.type != "diplome")
      doc= await TpeCollaboratorDocument.findOne({ user: user._id, type: document.type, status: "pending", collaborator: collaborator_ });
      
      if (!doc) {
        doc = new TpeCollaboratorDocument();
      }

      doc.url = document.url;
      doc.type = document.type;
      doc.status = "pending";
      doc.user = user._id;
      doc.collaborator = collaborator_._id;
      doc.save();
      if(document.type === "attestation_rib") {
        // collaborator_.phone = phone;
        // collaborator_.email = email;
        collaborator_.status = "pending";
        await collaborator_.save();
      }
      res.status(200).send({code: 'sucess', collaborator: collaborator_});
      return

    } catch(e) {
      console.log(e)
      res.status(200).send({error: true, code: 1});
    }
  },
  getCollaborators: async (req, res, next) => {
    try {
      // Check if Error
      if (req.user.error) {
        res.status(200).json(req.user);
        return;
      }
      const collaborators = await UserCollaborator.find({ user: req.user._id }).populate("user_infos");
      // const collaborators = await UserCollaborator.find().populate("user_infos");
      res.status(200).send({ collaborators });
    } catch (error) {
      console.log(error);
    }
  },
  
}