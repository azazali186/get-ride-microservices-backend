import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import expressListRoutes from 'express-list-routes';

import { Eureka } from 'eureka-js-client'
import eurekaConfig from './config/eureka.js'

const app = express();

import { inserData } from './utils/index.mjs';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register with Eureka
const eurekaClient = new Eureka(eurekaConfig);

eurekaClient.start(error => {
  console.log(error || 'Eureka registration complete');
});


import sequelize from "./config/sequelize.mjs"
sequelize.sync();

import profileRoutes from "./routes/profile/index.mjs"

var whitelist = ["http://localhost:8000", "http://localhost:8080"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["*"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api/profile-service/profile", profileRoutes);

inserData(expressListRoutes, app);

app.listen(process.env.PORT || 5120, function () {
  console.log(
    "CORS-enabled web server listening on port ",
    process.env.PORT || 5120
  );
});


// Handle exit and deregister from Eureka
process.on('SIGINT', () => {
  eurekaClient.stop(error => {
    console.log(error || 'Deregistered from Eureka');
    process.exit(error ? 1 : 0);
  });
});