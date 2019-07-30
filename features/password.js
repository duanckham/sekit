const fs = require('fs');
const _ = require('lodash');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const EMPTY = '';
const SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '_', '-' , '.'];

function mixParameters(parameters) {
  return parameters.reduce((item, property) => {
    return property.reduce((accumulator, param) => {
      return accumulator.concat(item.map(p => [].concat(p, param)));
    }, []);
  });
}

function ask(questions) {
  let answers = {};

  return new Promise(async resolve => {
    for (let i = 0; i < questions.length; i++) {
      let { key, question, multiple } = questions[i];
      let answer = await askQuestion(`< ${question}${(multiple ? ' (separate by space)' : '')}`);

      answers[key] = multiple ? answer.split(' ') : answer;
    }

    resolve(answers);
  });
}

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(`${question}: `, resolve);
  });
}

function upperCaseFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Example: Yue Qingyu
function dismemberingChineseNames(data) {
  let words = [];

  // yqy
  words.push(data.map(v => v[0]).join(''));

  // YQY
  words.push(words[0].toUpperCase());

  // Yqy
  words.push(upperCaseFirstLetter(words[0]));

  // yueqy
  words.push(data[0] + words[0].substr(1));

  // Yueqy
  words.push(upperCaseFirstLetter(words[3]));

  // qingyu
  words.push(data.slice(1).join(''));

  // Qingyu
  words.push(upperCaseFirstLetter(words[5]));

  // qy
  words.push(data.slice(1).map(v => v[0]).join(''));

  // Qy
  words.push(upperCaseFirstLetter(words[7]));

  return words;
}

function dismemberingBirthday(data) {
  return [
    data,
    data.substr(0, 4),
    data.substr(4, 4),
    data.substr(2, 6),
    `${parseInt(data.substr(4, 2))}${parseInt(data.substr(6, 2))}`,
  ];
}

exports.do = async outputFile => {
  let answers = await ask([
    {
      key: 'actualName',
      question: 'Actual name',
      multiple: true,
    },
    {
      key: 'networkID',
      question: 'Network ID',
      multiple: true,
    },
    {
      key: 'qq',
      question: 'QQ',
    },
    {
      key: 'mobile',
      question: 'Mobile number',
    },
    {
      key: 'birthday',
      question: 'Birthday (YYYYMMDD)',
    },
    {
      key: 'possiblePrefixes',
      question: 'Possible prefixes',
      multiple: true,
    },
    {
      key: 'possibleSuffixes',
      question: 'Possible suffixes',
      multiple: true,
    },
    {
      key: 'keywords',
      question: 'Keywords',
      multiple: true,
    },
  ]);

  let samples = {
    prefixes: [EMPTY],
    keywords: [EMPTY],
    symbols: [EMPTY, ...SYMBOLS],
  };

  // Prefixes
  if (answers.possiblePrefixes.length) {
    samples.prefixes = samples.prefixes.concat(answers.possiblePrefixes);
  }

  if (answers.possibleSuffixes.length) {
    samples.prefixes = samples.prefixes.concat(answers.possibleSuffixes);
  }

  if (answers.actualName.length) {
    samples.prefixes = samples.prefixes.concat(dismemberingChineseNames(answers.actualName));
  }

  if (answers.networkID.length) {
    samples.prefixes = samples.prefixes.concat(answers.networkID);
    samples.keywords = samples.keywords.concat(answers.networkID);
  }

  // Keywords
  if (answers.qq.length) {
    samples.keywords = samples.keywords.concat(answers.qq);
  }

  if (answers.mobile.length) {
    samples.keywords = samples.keywords.concat([answers.mobile, answers.mobile.substr(-4)]);
  }

  if (answers.birthday.length) {
    samples.keywords = samples.keywords.concat(dismemberingBirthday(answers.birthday));
  }

  if (answers.keywords.length) {
    samples.keywords = samples.keywords.concat(answers.keywords);
  }

  let passwordsSetA = mixParameters([
    [...samples.symbols],
    [...samples.prefixes],
    [...samples.symbols],
    [...samples.keywords],
    [...samples.symbols],
  ]);

  let passwordsSetB = mixParameters([
    [...samples.symbols],
    [...samples.keywords],
    [...samples.symbols],
    [...samples.prefixes],
    [...samples.symbols],
  ]);

  console.log(`> Generating passwords...`);

  passwordsSetA = passwordsSetA.map(item => item.join('')).filter(item => item.length >= 6 && item.length <= 20);
  passwordsSetB = passwordsSetB.map(item => item.join('')).filter(item => item.length >= 6 && item.length <= 20);

  let result = _.uniq([...passwordsSetA, ...passwordsSetB]);
  let logger = fs.createWriteStream(`${outputFile}-${Date.now()}.txt`, { flags: 'a' });

  console.log(`> Creating passwords file, count: ${result.length}.`);

  for (let i = 0; i < result.length; i++) {
    logger.write(result[i] + '\n');
  }

  logger.end();
  rl.close();

  console.log(`> Done.`);
};

