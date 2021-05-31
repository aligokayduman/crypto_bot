import { Sequelize } from 'sequelize';
import DataTypes from 'sequelize';
import path from 'path';
import bcrypt from 'bcrypt-nodejs';

const __dirname = path.resolve(path.dirname(''));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/app/db/bot.db',
    logging: false
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  token: {
    type: DataTypes.STRING
  }
}, {
  hooks: {
    beforeCreate: (user) => {
      user.password = bcrypt.hashSync(user.password);
    }
  }, 
  timestamps: true
});

export default User;