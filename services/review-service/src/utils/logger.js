import chalk from "chalk";

const logger = {
   info: (msg, meta = {}) => {
      console.log(chalk.green(`[INFO] ${msg}`), 
      Object.keys(meta).length ? meta : "");
   },
   warn: (msg, meta = {}) => {
      console.warn(chalk.yellow(`[WARN] ${msg}`), 
      Object.keys(meta).length ? meta : "");
   },
   error: (msg, meta = {}) => {
      console.error(chalk.red(`[ERROR] ${msg}`),
       Object.keys(meta).length ? meta : "");
   },
};

export default logger;
