const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');
main().then(()=>{console.log("successful")}).catch((err) => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

async function initDB(){
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner:"6764f2ab9a0b06538f72b0c1"}));
    await Listing.insertMany(initdata.data);
    console.log("Data inserted");
};
initDB();
