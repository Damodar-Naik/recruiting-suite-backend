import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CandidateAttributes {
    id: number;
    firstName: string;
    familyName: string;
    email: string;
    phone: string;
    summary: string;
    totalYearsExperience: number;
    appliedRole: string;
    overallScore: number;
    recommendation: string;
    onboardingStage: string;
    rawData: any;
    evaluation: any;
    createdAt: Date;
    updatedAt: Date;
}

interface CandidateCreationAttributes extends Optional<CandidateAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class Candidate extends Model<CandidateAttributes, CandidateCreationAttributes> implements CandidateAttributes {
    declare id: number;
    declare firstName: string;
    declare familyName: string;
    declare email: string;
    declare phone: string;
    declare summary: string;
    declare totalYearsExperience: number;
    declare appliedRole: string;
    declare overallScore: number;
    declare recommendation: string;
    declare onboardingStage: string;
    declare rawData: any;
    declare evaluation: any;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Candidate.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    familyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    totalYearsExperience: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    appliedRole: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    overallScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    recommendation: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    onboardingStage: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'new',
    },
    rawData: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    evaluation: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Candidate',
    tableName: 'candidates',
    indexes: [
        { fields: ['appliedRole'] },
        { fields: ['overallScore'] },
        { fields: ['onboardingStage'] },
        { fields: ['createdAt'] }
    ]
});