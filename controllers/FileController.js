const dbClient = require("../utils/db");
const ObjectID = require("mongodb").ObjectId;
const AppError = require("../utils/appError");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const userModel = require("../models/user.model");

exports.fileUpload = async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password"); // Exclude password field

  req.setLocale(user.languagePreference);

  if (!user) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  const { name, type, parentId, path, data } = req.body;

  if (!name) {
    return next(new AppError(req.__('errors.missing_name'), 400));
  }
  if (!type) {
    return next(new AppError(req.__('errors.missing_type'), 400));
  }
  if (type !== "folder" && !data) {
    return next(new AppError(req.__('errors.missing_data'), 400));
  }

  const files = dbClient.db.collection("files");
  if (parentId) {
    const idObject = new ObjectID(parentId);
    const file = await files.findOne({ _id: idObject, userId: user._id });
    if (!file) {
      return next(new AppError(req.__('errors.user_not_found'), 400));
    }
    if (file.type !== "folder") {
      return next(new AppError(req.__('errors.error_creating_folder'), 400));
    }
  }

  if (type === "folder") {
    files
      .insertOne({
        userId: user._id,
        name,
        type,
        parentId: parentId || 0,
        isPublic: false, // Assuming isPublic is false by default
      })
      .then((result) =>
        res.status(201).json({
          id: result.insertedId,
          userId: user._id,
          name,
          type,
          isPublic: false,
          parentId: parentId || 0,
        })
      )
      .catch((error) => {
        console.log(error);
        next(new AppError(req.__('errors.error_creating_folder'), 500));
      });
  } else {
    const filePath = process.env.FOLDER_PATH || "/tmp/files_manager";
    const fileName = `${filePath}/${uuidv4()}`;
    const buff = Buffer.from(data, "base64");

    try {
      try {
        await fs.mkdir(filePath, { recursive: true });
      } catch (error) {
        // pass. Error raised when file already exists
      }
      await fs.writeFile(fileName, buff);
    } catch (error) {
      console.log(error);
      return next(new AppError(req.__('errors.error_saving_file'), 500));
    }

    files
      .insertOne({
        userId: user._id,
        name,
        type,
        isPublic: false, // Assuming isPublic is false by default
        parentId: parentId || 0,
        localPath: fileName,
      })
      .then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId: user._id,
          name,
          type,
          isPublic: false,
          parentId: parentId || 0,
        });
      })
      .catch((error) => {
        console.log(error);
        next(new AppError(req.__('errors.error_saving_file'), 500));
      });
  }
};

exports.readFile = async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password"); // Exclude password field

  req.setLocale(user.languagePreference);

  if (!user) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  const fileId = req.params.id;
  const files = dbClient.db.collection("files");

  const file = await files.findOne({ _id: new ObjectID(fileId), userId: user._id });

  if (!file) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  res.status(200).json({
    status: "success",
    file,
  });
};

exports.updateFile = async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password"); // Exclude password field

  req.setLocale(user.languagePreference);

  if (!user) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  const fileId = req.params.id;
  const { data } = req.body;

  if (!data) {
    return next(new AppError(req.__('errors.missing_data'), 400));
  }

  const files = dbClient.db.collection("files");
  const file = await files.findOne({ _id: new ObjectID(fileId), userId: user._id });

  if (!file) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  const filePath = file.localPath;
  const buff = Buffer.from(data, "base64");

  try {
    await fs.writeFile(filePath, buff);
  } catch (error) {
    console.log(error);
    return next(new AppError(req.__('errors.error_updating_file'), 500));
  }

  files
    .updateOne(
      { _id: new ObjectID(fileId), userId: user._id },
      { $set: { data } }
    )
    .then(() => {
      res.status(200).json({
        status: "success",
        message: req.__('files.file_updated_successfully'),
      });
    })
    .catch((error) => {
      console.log(error);
      next(new AppError(req.__('errors.error_updating_file'), 500));
    });
};

exports.updateFileName = async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password"); // Exclude password field

  req.setLocale(user.languagePreference);

  if (!user) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  const fileId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return next(new AppError(req.__('errors.missing_name'), 400));
  }

  const files = dbClient.db.collection("files");
  const file = await files.findOne({ _id: new ObjectID(fileId), userId: user._id });

  if (!file) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  files
    .updateOne(
      { _id: new ObjectID(fileId), userId: user._id },
      { $set: { name } }
    )
    .then(() => {
      res.status(200).json({
        status: "success",
        message: req.__('files.file_name_updated_successfully'),
      });
    })
    .catch((error) => {
      console.log(error);
      next(new AppError(req.__('errors.error_updating_file'), 500));
    });
};

exports.deleteFile = async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password"); // Exclude password field

  req.setLocale(user.languagePreference);

  if (!user) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  const fileId = req.params.id;

  const files = dbClient.db.collection("files");
  const file = await files.findOne({ _id: new ObjectID(fileId), userId: user._id });

  if (!file) {
    return next(new AppError(req.__('errors.user_not_found'), 400));
  }

  const filePath = file.localPath;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.log(error);
    return next(new AppError(req.__('errors.error_deleting_file'), 500));
  }

  files
    .deleteOne({ _id: new ObjectID(fileId), userId: user._id })
    .then(() => {
      res.status(200).json({
        status: "success",
        message: req.__('files.file_deleted_successfully'),
      });
    })
    .catch((error) => {
      console.log(error);
      next(new AppError(req.__('errors.error_deleting_file'), 500));
    });
};
