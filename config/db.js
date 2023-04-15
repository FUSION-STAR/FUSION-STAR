const mongoose = require('mongoose');
exports.connect = () => {
    mongoose.connect('mongodb://44.213.10.165:27017/FUSION_STAR_DB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('Database is connected'))
    .catch((e) => console.log(e));
};
