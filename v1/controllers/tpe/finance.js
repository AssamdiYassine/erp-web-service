const TpeBank = require('../../../models/tpe_bank');
const TpeFinanceDoc = require('../../../models/tpe_finance_docs');
const TpeJournal = require('../../../models/tpe_journal');
const TpeTransactionDoc = require('../../../models/tpe_transaction_docs');
const User = require('../../../models/user');



module.exports = {
  getFinanceDocuments: async (req, res, next) => {
    try {
      const { user } = req;
      // const { type,status } = req.body;
      const listeDocs = await TpeFinanceDoc.find({ user });
      res.status(200).send({ docs: listeDocs });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
  addFinanceDoc: async (req, res, next) => {
    try {
      const { user } = req;
      const { document } = req.body;
      doc = new TpeFinanceDoc();
      doc.url = document.url
      // doc.type = document.type
      doc.comment = document.comment
      doc.client_comment = document.client_comment
      doc.status = document.status;
      doc.user = user;
      doc.save();
      res.status(200).send({ doc });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
  getTransaction: async (req, res, next) => {
    try {
      const { user } = req;
      // const { type,status } = req.body;
      const listeDocs = await TpeTransactionDoc.find({ user });
      res.status(200).send({ docs: listeDocs });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
  getBanks: async (req, res, next) => {
    try {
      const { user } = req;
      const banks = await TpeBank.find({ user });
      res.status(200).send({ banks: banks });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
  addBank: async (req, res, next) => {
    try {
      const { name, numero, url } = req.body;

      let bank = new TpeBank();

      bank.name = name
      bank.numero = numero
      bank.url = url
      bank.user = req.user._id

      await bank.save();
      res.status(200).json({ bank });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
  getJournal: async (req, res, next) => {
    try {
      const docs = await TpeJournal.find({ user: req.user._id });
      res.status(200).send({ docs: docs });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
}