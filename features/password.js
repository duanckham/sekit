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
      answers[questions[i].key] = await askQuestion(questions[i].question);
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
      key: 'actual_name',
      question: 'Target actual name (separate by space)',
    },
    {
      key: 'network_name',
      question: 'Target network name (separate by space)',
    },
    {
      key: 'network_id',
      question: 'Target network id',
    },
  ]);

  console.log(answers);
};