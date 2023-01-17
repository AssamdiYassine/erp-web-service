const {
  LeaveRequest,
  validateLeaveRequest,
} = require("../../../models/leave_request");

module.exports = {
  create: async (req, res) => {
    // const { error } = validateLeaveRequest(req.body.params);
    // if (error) return res.status(400).send(error.details[0].message);

    let leave_request = new LeaveRequest({
      // user: req.user._id,
      user: req.body.params.user,
      // processed_by: req.body.params.processed_by,
      request_date: req.body.params.request_date,
      selected_date: req.body.params.selected_date,
      status: req.body.params.status,
      nbr_jrs: req.body.params.nbr_jrs,
      annee_debit: req.body.params.annee_debit,
      // processing_date: req.body.params.processing_date,
      holiday_type: req.body.params.holiday_type,
    });

    // console.log(req.body.params);
    leave_request = await leave_request.save();

    res.send(leave_request);
  },
  getAll: async (req, res) => {
    const leave_requestes = await LeaveRequest.find();
    res.send({ leave_requests: leave_requestes });
  },
  getById: async (req, res) => {
    const leave_request = await LeaveRequest.findById(req.params.id).select(
      "-__v"
    );

    if (!leave_request)
      return res
        .status(404)
        .send("The leave_request with the given ID was not found.");

    res.send(leave_request);
  },
  update: async (req, res) => {
    const { error } = validateLeaveRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const leave_request = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        user: req.user._id,
        processed_by: req.body.processed_by,
        request_date: req.body.request_date,
        selected_date: req.body.selected_date,
        status: req.body.status,
        nbr_jrs: req.body.nbr_jrs,
        annee_debit: req.body.annee_debit,
        processing_date: req.body.processing_date,
        holiday_type: req.body.holiday_type,
      },
      {
        new: true,
      }
    );

    if (!leave_request)
      return res
        .status(404)
        .send("The leave_request with the given ID was not found.");

    res.send(leave_request);
  },
  archive: async (req, res) => {
    const { error } = validateLeaveRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const leave_request = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { archive: 1 },
      {
        new: true,
      }
    );

    if (!leave_request)
      return res
        .status(404)
        .send("The leave_request with the given ID was not found.");

    res.send(leave_request);
  },
};
