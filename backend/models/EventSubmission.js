const mongoose = require("mongoose");

const eventSubmissionSchema = new mongoose.Schema(
  {
    kavuName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    district: {
      type: String,
      required: true,
      enum: [
        "Kannur",
        "Kasaragod",
        "Kozhikode",
        "Wayanad",
        "Malappuram",
      ],
    },

    festivalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    date: {
      type: Date,
      required: true,
    },

    theyyams: {
      type: [String],
      required: true,
      validate: {
        validator: function (items) {
          return (
            items.length > 0 &&
            items.every(
              (item) =>
                typeof item === "string" &&
                item.trim().length > 0
            )
          );
        },
        message: "At least one valid Theyyam name is required.",
      },
    },

    location: {
  latitude: {
    type: Number,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
  },
},

    submitterName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    contact: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EventSubmission",
  eventSubmissionSchema
);