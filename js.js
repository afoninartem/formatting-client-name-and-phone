const list = [];

const numberCorrection = (str, i) => {
  let result = str.match(/[0-9]/g);
  if (result !== null) {
    result = result.join('');
    if (result.length > 11 || result.length < 10) {
      const li = document.createElement('li');
      li.innerHTML = `Строка ${+i + 1}. Было: <b>${str}</b>. Стало: <b>${result}</b> - номер указан некорректно.`;
      document.querySelector('.check__list').appendChild(li);
    } else {
      return result;
    }
  }
}

const clearCheckList = () => {
  document.querySelector('.check__list').innerHTML = '';
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
  clearCheckList();
  let file = this.files[0];
  let reader = new FileReader();
  reader.onload = function (progressEvent) {
    let str = this.result.split('\n');
    let start = str[0].includes('Моб') ? 1 : 0;
    console.log(start, str[0])
    for (let i = start; i < str.length - 1; i += 1) {
      let clientData = str[i];
      const clientDataArr = clientData.split(';');
      const clientPhone = clientDataArr[0];
      const clientFullName = clientDataArr[1];
      const correctPhone = numberCorrection(clientPhone, i);
      const correctName = getClientFirstName(clientFullName, i);
      list.push(`${correctPhone};${correctName}`);
    }
  }
  reader.readAsText(file, 'windows-1251');
}

document.getElementById('download').onclick = function () {
  // console.log(list)
  var csv = `Телефон;Имя\n`;
  list.forEach(elem => {
    csv += elem;
    csv += '\n';
  });
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI("\uFEFF" + csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'Рассылка.csv';
  hiddenElement.click();
}