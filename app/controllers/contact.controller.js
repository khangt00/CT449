const mongoose = require("mongoose");
const { BadRequestError } = require("../errors");
const handlePromise = require("../helpers/promise.helper");
const Contact = require("../models/contact.model");

exports.create = (req, res) => {
    res.send({ message: "create handler" });
};

exports.findAll = (req, res) => {
    res.send({ message: "findAll handler" });
};

exports.findOne = (req, res) => {
    res.send({ message: "findOne handler" });
};

exports.update = (req, res) => {
    res.send({ message: "update handler" });
};

exports.delete = (req, res) => {
    res.send({ message: "delete handler" });
};

exports.deleteAll = (req, res) => {
    res.send({ message: "deleteAll handler" });
};

exports.findAllFavorite = (req, res) => {
    res.send({ message: "findAllFavorite handler"});
};

// Create and Save a new Contact
exports.create = async (req, res, next) => {
    // Validate request
    if (!req.body.name) {
        return next(new BadRequestError(400, "Name can not be emty"));
    }

    //Create a contact
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: req.body.favorite === true,
    });

    // Save contact in the database
    const [error, document] = await handlePromise(contact.save());

    if (error) {
        return next(new BadRequestError(500,
            "An error occurred while creating the contact"));
    }

    return res.send(document);
};

// Retrieve all contacts of a user from the database
exports.findAll = async (req, res, next) => {
    const condition = {  };
    const { name } = req.query;
    if (name) {
        condition.name = { $regex: new RegExp(name), $options: "i" };
    }

    const [error, documents] = await handlePromise(Contact.find(condition));

    if (error) {
        return next(new BadRequestError(500,
            "An error occurred while retrieving contacts"));
    }

    return res.send(documents);
};

// Find a single contact with an id
exports.findOne = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise(Contact.findOne(condition));

    if (error) {
        return next (new BadRequestError(500,
            `Error retrieving contact with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }

    return res.send(document);
};

// Update a contact by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new BadRequestError(400,
            "Data to update can not be emty"));
    }

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise(
        Contact.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );

    if (error) {
        return next(new BadRequestError(500,
            `Error updating contact with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }

    return res.send({ message: "Contact was updated successfully", });
};

// Delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise(
        Contact.findByIdAndDelete(condition)
    );

    if (error) {
        return next(new BadRequestError(500,
            `Could not delete contact with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }

    return res.send({ message: "Contact was deleted successfully"});
};

// Find all favorite contacts of a user
exports.findAllFavorite = async (req, res, next) => {
    const [error, documents] = await handlePromise(
        Contact.find({ favorite: true, })
    );

    if (error) {
        return next(new BadRequestError(500,
            "An error occured while retrieving favorite contacts"));
    }

    return res.send(documents);
};

// Delete all contacts of a user from the database
exports.deleteAll = async (req, res, next) => {
    const [error, data] = await handlePromise(
        Contact.deleteMany({ })
    );

    if (error) {
        return next(new BadRequestError(500,
            "An error occured while removing all contacts"));
    }

    return res.send({
        message: `${data.deleteCount} contacts were deleted successfully`,
    });
};