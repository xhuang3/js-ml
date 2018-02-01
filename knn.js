/**
 * k-Nearest-Neighbours
 *
 * A supervised learning algorithm.
 * It can be used for classification, as well as regression problems.
 */

import { map, forEach } from 'lodash';
import csv from 'csvtojson';
import KNN from 'ml-knn';
import prompt from 'prompt';

let knn;

const csvfilepath = './iris.csv';
const names = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
  'type',
];

let seperationSize;

let data = [],
  X = [],
  Y = [];

let trainingSetX = [],
  trainingSetY = [],
  testSetX = [],
  testSetY = [];

const predict = () => {
  let temp = [];
};

const error = (predicted, expected) => {
  let misclassifications = 0;
  for (let index = 0; index < predicted.length; index++) {
    if (predicted[index] !== expected[index]) {
      misclassifications++;
    }
  }
  return misclassifications;
};

const test = () => {
  const result = knn.predict(testSetX);
  const testSetLength = testSetX.length;
  const predictionError = error(result, testSetY);
  console.log(
    `Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`
  );
  predict();
};

const train = () => {
  knn = new KNN(trainingSetX, trainingSetY, { k: 7 });
  test();
};

const dressData = () => {
  /**
   * There are three different types of Iris flowers
   * that this dataset classifies.
   *
   * 1. Iris Setosa (Iris-setosa)
   * 2. Iris Versicolor (Iris-versicolor)
   * 3. Iris Virginica (Iris-virginica)
   *
   * We are going to change these classes from Strings to numbers.
   * Such that, a value of type equal to
   * 0 would mean setosa,
   * 1 would mean versicolor, and
   * 3 would mean virginica
   */

  let types = new Set();

  forEach(data, row => {
    types.add(row.type);
  });

  const typesArray = [...types];

  forEach(data, row => {
    let rowArray, typeNumber;
    rowArray = map(Object.keys(row), key => {
      if (key === 'type') {
        return;
      }
      return parseFloat(row[key]);
    });
    typeNumber = typesArray.indexOf(row.type);

    X.push(rowArray);
    Y.push(typeNumber);
  });
  console.log(X, Y);
  trainingSetX = X.slice(0, seperationSize);
  trainingSetY = Y.slice(0, seperationSize);
  testSetX = X.slice(seperationSize);
  testSetY = Y.slice(seperationSize);
  train();
};

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

csv({ noheader: true, headers: names })
  .fromFile(csvfilepath)
  .on('json', jsonObj => {
    data.push(jsonObj);
  })
  .on('done', err => {
    seperationSize = 0.7 * data.length;
    data = shuffleArray(data);
    dressData();
  });
