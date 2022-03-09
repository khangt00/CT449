const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Contact namw is required"],
        },
        email: {
            type: String,
            trim: true,
            Lowercase: true,
        },
        address: String,
        phone: String,
        favorite: Boolean,
    },
    { timestamps: true}
);

// Replace _id with id and remove __V
schema.method("toJSON", function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("contact", schema);