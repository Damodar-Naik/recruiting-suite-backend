// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Database configuration with SSL support for production
const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        pool: {
            max: process.env.NODE_ENV === 'production' ? 10 : 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // Add retry logic for connection issues
        retry: {
            match: [
                /ConnectionError/,
                /ConnectionRefusedError/,
                /ConnectionTimedOutError/,
                /TimeoutError/,
            ],
            max: 3
        }
    }
);

// Test database connection with retry logic
const testConnection = async (retries = 3): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');

        // Log connection details (without sensitive info)
        console.log(`📊 Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
        console.log(`🔒 SSL: ${process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'}`);

    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);

        if (retries > 0) {
            console.log(`🔄 Retrying connection... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return testConnection(retries - 1);
        } else {
            throw new Error('Failed to connect to database after multiple attempts');
        }
    }
};

// Export both the sequelize instance, the test function, and the Sequelize class
export { sequelize, testConnection, Sequelize };