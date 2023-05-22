//TODO: seeds script should come here, so we'll be able to put some data in our local env

const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { User, Item, Comment } = require('../models');

async function seedUsers() {
  try {
    // Connect to the MongoDB database
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    mongoose.set('debug', true);
    //const { User, Item, Comment } = require('../models');
    require('../config/passport');

    // Generate and insert 100 fake users
    const users = Array.from({ length: 10 }, () => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(faker.internet.password(), salt);
      return {
        username: 'TestUser',
        email: faker.internet.email(),
        bio: faker.lorem.sentences(),
        image: faker.internet.avatar(),
        role: faker.helpers.arrayElement(['user', 'admin']),
        hash,
        salt,
      };
    });

    await User.insertMany(users);

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    // Disconnect from the MongoDB database
    await mongoose.disconnect();
    console.log('The end!');
  }
}

seedUsers();
