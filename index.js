import { forEach } from 'lodash';
import csv from 'csvtojson';
import { SLR } from 'ml-regression';
import readline from 'readline';

const csvfilepath = './advertising.csv';

let csvdata = [],
  X = [],
  Y = [];

let regressionModel;

const f = s => {
  return parseFloat(s);
};

const dressData = () => {
  forEach(csvdata, row => {
    X.push(f(row.radio)), Y.push(f(row.sales));
  });
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const predictOutput = () => {
  rl.question(
    'Enter input X for prediction (Press CTRL+C to exit) : ',
    answer => {
      const number = parseInt(answer);
      console.log(`At x = ${answer}, y = ${regressionModel.predict(number)}`);
      predictOutput();
    }
  );
};

const performRegression = () => {
  console.log(X, Y);
  regressionModel = new SLR(X, Y);
  console.log('regressionModel>>>', regressionModel.toString(3));
  predictOutput();
};

csv()
  .fromFile(csvfilepath)
  .on('json', jsonObj => {
    csvdata.push(jsonObj);
  })
  .on('done', () => {
    dressData();
    performRegression();
  });
