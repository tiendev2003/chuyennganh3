const { DataTypes } = require("sequelize");
const { sequelize } = require("./../config/db");
const User = require("./user");

const HealthProfile = sequelize.define(
  "HealthProfile",
  {
    profile_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
      },
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      validate: {
        min: 0,
      },
    },
    medical_history: {
      type: DataTypes.TEXT,
    },
    allergies: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
  },
  {
    tableName: "health_profiles",
    timestamps: false,
  },
);

module.exports = HealthProfile;
