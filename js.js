const list = [];

const numberCorrection = (str, i) => {
  let result = str.match(/[0-9]/g);
  if (result !== null) {
    result = result.join('');
    if (result.length > 11 || result.length < 10) {
      const li = document.createElement('li');
      li.innerHTML = `Строка ${+i + 1}. Было: <b>${str}</b>. Стало: <b>${result}</b>`;
      document.querySelector('.check__list').appendChild(li);
    } else {
      return result;
    }
  }
}

function ucFirst(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

const chechIncludes = (string, include) => {
  const regexp = new RegExp(`${include}`, `g`);
  const result = string.match(regexp);
  return result === null ? false : true;
}

const getClientFirstName = (str, i) => {
  let firstName;
  // if (str === undefined) {
  //   const li = document.createElement('li');
  //   li.innerHTML = `Строка ${+i + 1}. Было: <b>${str}</b> Стало: <b>${firstName}</b>`;
  //   document.querySelector('.check__list').appendChild(li);
  // }
  if (str.length !== 0) {
    const arr = str.split(' ');
    // console.log(arr);
    if (arr.length === 1) {
      firstName = arr[0];
    };
    if (arr.length === 2) {
      if (arr[0] === 'Без') firstName = 'Уважаемый клиент'; //костыль
      if (arr[1].length === 1) {
        firstName = arr[0];
      } else if (chechIncludes(arr[1], 'вич|вна')) {
        firstName = arr[0];
      } else if (chechIncludes(arr[0], `ев$|ов$|ева$|ова$|ин$|ина$|ая$|ий$|ко$`)) { 
        firstName = arr[1]; 
      } else {
        const li = document.createElement('li');
        li.innerHTML = `Строка ${+i + 1}. Было: <b>${str}</b> Стало: <b>${firstName}</b>`;
        document.querySelector('.check__list').appendChild(li);
      }
    }
    if (arr.length === 3) firstName = arr[1];
    if (arr.length > 3) firstName = arr[1];
  } else {
    firstName = 'Уважаемый клиент';
  }
  return ucFirst(firstName);
}

document.getElementById('list').onchange = function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.onload = function (progressEvent) {
    let str = this.result.split('\n');
    for (let i = 0; i < str.length - 1; i += 1) {
      let clientData = str[i];
      const clientDataArr = clientData.split(';');
      const clientPhone = clientDataArr[0];
      const clientFullName = clientDataArr[1];
      const correctPhone = numberCorrection(clientPhone, i);
      // console.log(correctPhone);
      const correctName = getClientFirstName(clientFullName, i);
      // console.log(correctName);
      list.push(`${correctPhone};${correctName}`);
      // if (i === 339) {
      //   const arr = clientFullName.split(' ');
      //   console.log(arr)
      //   console.log(arr[0].length)
      //   console.log(arr[1].length);
      // }
    }
  }
  reader.readAsText(file, 'windows-1251');
}

document.getElementById('download').onclick = function () {
  console.log(list)
  var csv = `Телефон;Имя\n`;
  list.forEach(elem => {
    csv += elem;
    csv += '\n';
  });
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'Рассылка.csv';
  hiddenElement.click();
}