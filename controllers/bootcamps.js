// @desc    GET all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: "Show all bootcamps from controller" });
};

// @desc    GET single Bootcamps by Id
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show bootcamp for id ${req.params.id}`,
  });
};

// @desc    Create a Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ success: true, msg: "create a bootcamp" });
};

// @desc    Update a Bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `update bootcamp for id ${req.params.id}` });
};

// @desc    Delete a Bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `delete bootcamp for id ${req.params.id}` });
};
