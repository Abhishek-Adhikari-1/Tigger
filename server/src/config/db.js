import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("Tigger", "postgres", "Abhi@123", {
  dialect: "postgres",
  host: "localhost",
});

export const dbConnection = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
  }
};
