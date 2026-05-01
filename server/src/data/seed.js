require('dotenv').config();
const mongoose = require('mongoose');
const Career = require('../models/Career');
const Exam = require('../models/Exam');
const { careers, exams } = require('./seedData');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Career.deleteMany({});
    await Exam.deleteMany({});
    console.log('Cleared existing data');

    const createdExams = await Exam.insertMany(exams);
    console.log(`Seeded ${createdExams.length} exams`);

    // Link exams to careers
    const examMap = {};
    createdExams.forEach(e => { examMap[e.name] = e._id; });

    const careersWithExams = careers.map(c => {
      const linked = [];
      if (c.category === 'technology') { linked.push(examMap['JEE Main'], examMap['GRE']); }
      if (c.category === 'medical') { linked.push(examMap['NEET']); }
      if (c.category === 'business') { linked.push(examMap['CAT']); }
      if (c.category === 'government') { linked.push(examMap['UPSC CSE']); }
      c.exams = linked.filter(Boolean);
      return c;
    });

    const createdCareers = await Career.insertMany(careersWithExams);
    console.log(`Seeded ${createdCareers.length} careers`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
