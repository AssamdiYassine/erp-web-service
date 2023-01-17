const {
  LeaveBalance,
  validateLeaveBalance,
} = require("../../../models/leave_balance");

module.exports = {
  create: async (req, res) => {
    const { error } = validateLeaveBalance(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let leave_balance = new LeaveBalance({
      id_user: req.body.id_user,
      demande_id: req.body.demande_id,
      annee: req.body.annee,
      debit: req.body.debit,
      credit: req.body.credit,
      type: req.body.type,
      date: req.body.date,
    });
    leave_balance = await leave_balance.save();

    res.send(leave_balance);
  },
  getAll: async (req, res) => {
    const leave_balancees = await LeaveBalance.find();
    res.send({ leave_balances: leave_balancees });
  },
  getById: async (req, res) => {
    const leave_balance = await LeaveBalance.findById(req.params.id).select(
      "-__v"
    );

    if (!leave_balance)
      return res
        .status(404)
        .send("The leave_balance with the given ID was not found.");

    res.send(leave_balance);
  },
  update: async (req, res) => {
    const { error } = validateLeaveBalance(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const leave_balance = await LeaveBalance.findByIdAndUpdate(
      req.params.id,
      {
        id_user: req.body.id_user,
        demande_id: req.body.demande_id,
        annee: req.body.annee,
        debit: req.body.debit,
        credit: req.body.credit,
        type: req.body.type,
        date: req.body.date,
      },
      {
        new: true,
      }
    );

    if (!leave_balance)
      return res
        .status(404)
        .send("The leave_balance with the given ID was not found.");

    res.send(leave_balance);
  },
  archive: async (req, res) => {
    const { error } = validateLeaveBalance(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const leave_balance = await LeaveBalance.findByIdAndUpdate(
      req.params.id,
      { archive: 1 },
      {
        new: true,
      }
    );

    if (!leave_balance)
      return res
        .status(404)
        .send("The leave_balance with the given ID was not found.");

    res.send(leave_balance);
  },
};
