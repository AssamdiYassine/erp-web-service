const Depenses = require('../../models/depenses');


module.exports = {
  List: async (req, res, next) => {

    try {
      // const { user } = req;
      // const { type,status } = req.body;
      // let listeDep = await Depenses.find(); // { user }
      let listeDep = [
        { reference: 'AC000011', type_depense: 'unitaire', date_depense: '', etat: '', fournisseur: 'Frs 001', type_document: 'Facture', total_ht: '120,000,00', total_ttc: '144,000,00', total_regle: '48,000,ÀÀ', restant: '96,000,00' },
        { reference: 'AC000011', type_depense: 'Périodique', date_depense: '', etat: '', fournisseur: 'Frs 001', type_document: 'Facture', total_ht: '120,000,00', total_ttc: '144,000,00', total_regle: '48,000,ÀÀ', restant: '96,000,00' },
        { reference: 'AC000011', type_depense: 'unitaire', date_depense: '', etat: '', fournisseur: 'Frs 001', type_document: 'Facture', total_ht: '120,000,00', total_ttc: '144,000,00', total_regle: '48,000,ÀÀ', restant: '96,000,00' },
      ]
      // console.log(listeDep)

      res.status(200).send({ depenses: listeDep });
    } catch (error) {
      res.status(200).send({ error });
    }
  },
}
