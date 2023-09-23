import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.mjs'; // Assuming you have a Sequelize config in a similar location
import { v4 as uuidv4 } from 'uuid';

class Profile extends Model {}

Profile.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4().replace(/-/g, '')
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isKyc: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'Profile',
  tableName: 'plofiles',
  timestamps: true,
  createdAt: 'createdAt', // Default, but included for clarity
  updatedAt: 'updatedAt'  // Default, but included for clarity
});

export default Profile;
