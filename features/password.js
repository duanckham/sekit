const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

exports.do = async outputFile => {
  let answers = await ask([
    {
      key: 'actualName',
      question: 'Actual name',
    },
    {
      key: 'networkName',
      question: 'Network name',
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

  let seeds = [];
};