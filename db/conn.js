import { connect } from 'mongoose';
import config from '../app/utils/config.js';

const url = config.MONGO_URL || "mongodb://localhost:27017";

connect(url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to Database on URL '+url)
}).catch((e) => { console.log("Error in Database", e) })