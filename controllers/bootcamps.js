const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");

// @desc    GET all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  //copy req.query
  let reqQuery = { ...req.query };

  let removeFields = ["select", "sort", "pageSize", "page"]; //limit = pageSize
  removeFields.forEach((field) => delete reqQuery[field]);

  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  //filtering query -> ?state=MA&housing=false
  queryStr = queryStr.replace(
    /\b(lt|gt|gte|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  //Select query -> ?select=name, description
  if (req.query.select) {
    let str = req.query.select.split(",").join(" ");
    console.log(str);
    query = query.select(str);
  }

  //sort
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.pageSize, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.count(query);

  query = query.skip(startIndex).limit(limit);

  //exec query
  const bootcamps = await query;

  //create pagination obj for response

  const pagination = { total, page, pageSize: limit };

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      pageSize: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      pageSize: limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
    pagination,
  });
});

// @desc    GET single Bootcamps by Id
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.findById(req.params.id).populate("courses");
  if (!bootcamps) {
    return next(new ErrorResponse(`Not found ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamps });
});

// @desc    Create a Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    body: bootcamp,
  });
});

// @desc    Update a Bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`Not found ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete a Bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  //findByIdAndDelete will not trigger remove pre middileware
  //const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Not found ${req.params.id}`, 404));
  }
  bootcamp.remove(); //trigger pre remove middle ware
  res.status(202).json({ success: true, data: {} });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
