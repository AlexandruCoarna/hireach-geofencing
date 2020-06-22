import configProd from "./config-production";
import configDev from "./config-development";

const config = {
    production: configProd,
    development: configDev
}

export default config[process.env.env];