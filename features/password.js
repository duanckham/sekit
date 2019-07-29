const _ = require('lodash');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const EMPTY = '';

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
      let answer = await askQuestion(`> ${question}${(multiple ? ' (separate by space)' : '')}`);

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

function dismemberingUsedPasswords(data) {
  let prefixList = [];
  let suffixList = [];
  let keywordList = [];

  for (let i = 0; i < data.length; i++) {
    // yqy123456
    if (/[\D]+[\d]+/.test(data[i])) {
      console.log(data[i]);
    }
  }
}

console.log(dismemberingUsedPasswords(['yqy11112222', 'yueqingyu', '123456']));

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
      key: 'email',
      question: 'Email',
    },
    {
      key: 'birthday',
      question: 'Birthday (YYYYMMDD)',
    },
    {
      key: 'usedPasswords',
      question: 'Used passwords',
      multiple: true,
    },
    {
      key: 'possiblePrefix',
      question: 'Possible prefix',
      multiple: true,
    },
    {
      key: 'possibleSuffix',
      question: 'Possible suffix',
      multiple: true,
    },
    {
      key: 'keywords',
      question: 'Keywords',
      multiple: true,
    },
  ]);

  console.log(answers);

  let seeds = [
    [EMPTY], // Prefix
    [EMPTY], // Key
    [EMPTY], // Joiner
  ];

  // Prefix
  if (answers.possiblePrefix.length) {
    seeds[0] = seeds[0].concat(answers.possiblePrefix);
  }

  if (answers.actualName.length) {
    seeds[0] = seeds[0].concat(dismemberingChineseNames(answers.actualName));
  }

  if (answers.networkID.length) {
    seeds[0] = seeds[0].concat(answers.networkID);
  }



  // Keyword
  if (answers.networkName)

  console.log(seeds);
};