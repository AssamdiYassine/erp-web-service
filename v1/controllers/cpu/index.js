const CpuIdentityDocument = require('../../../models/cpu_identity_docs');
const CpuFolder = require('../../../models/cpu_folders');
const TurnoverArchive = require('../../../models/turnover_archive');
const CpuUserData = require('../../../models/cpu_user_data');


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
      const { user } = req;
      user.regime_type = "CPU"
      await user.save()

      // Response with token and user
      res.status(200).json({ user: req.user, token });
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
      res.status(200).json({ user, token });
    } catch (error) {
      throw error;
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
      let folder = await CpuFolder.findOne({ user: user._id });

      if (!folder) {
        folder = new CpuFolder();
        folder.status = "steps";
        folder.user = user._id;
      }

      let doc = await CpuIdentityDocument.findOne({ user: user._id, type: document.type, status: "pending" });
      if (!doc) {
        doc = new CpuIdentityDocument();
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
        user.signupStage = 20;
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
      const cpu_folder = await CpuFolder.findOne({ user: user._id });
      if (cpu_folder) {
        if (cpu_folder.status === "validated") {
          const user_infos = await CpuUserData.findOne({ user: user._id });
          if (user_infos.year < new Date().getFullYear())
            res.status(200).json({ verify: { status: "expired", turnover: user_infos.turnover, year: user_infos.year }, error: false, message: "" });
          return;
        }

        if (cpu_folder.status === "rejected") {
          let rejected = []
          const docs = await CpuIdentityDocument.find({ user: user._id, status: "rejected" })
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
      const cpu_docs = await CpuIdentityDocument.findOne({ user: user._id, status, type });
      res.status(200).send({ docs: cpu_docs });
    } catch (error) {
      res.status(200).send({ error });
    }
  }
}