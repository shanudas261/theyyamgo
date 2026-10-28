const mongoose = require("mongoose");

const kavuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    events: [
      {
        festivalName: {
          type: String,
          required: true,
        },

        date: {
          type: Date,
          required: true,
        },

        theyyams: {
          type: [String],
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Kavu", kavuSchema);