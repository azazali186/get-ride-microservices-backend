import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import expressListRoutes from 'express-list-routes';

const app = express();

import { inserData } from './utils/index.mjs';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import sequelize from "./config/sequelize.mjs"
sequelize.sync();

Country.hasMany(States, { foreignKey: 'countryId' });
States.belongsTo(Country, { foreignKey: 'countryId' });

import languagesRoutes from "./routes/languages/index.mjs"
import countriesRoutes from "./routes/countries/index.mjs"
import statesRoutes from "./routes/states/index.mjs"
import currenciesRoutes from "./routes/currencies/index.mjs"
import Country from './models/country.mjs';
import States from './models/states.mjs';

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

app.use("/api/languages", languagesRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/currencies", currenciesRoutes);

inserData(expressListRoutes, app);

app.listen(process.env.PORT || 5110, function () {
  console.log(
    "CORS-enabled web server listening on port ",
    process.env.PORT || 5110
  );
});