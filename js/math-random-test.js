// Get all elements
const buttons = document.querySelectorAll('.button');
const graph = document.querySelector('#graph');
const container = document.querySelector('.container');
const infoQuantity = document.querySelector('.info__quantity');
const infoDuration = document.querySelector('.indo__duration');

// Constants
const DELAY_AFTER_BUTTON_CLICK = 10;
let CHART_CONTEXT = null;

// Test the Math.random() function a set amount of times
// return a promise with an object with
//    - percentages (the percentage that each number was chosen)
//    - duration (the duration it took to calculate, in ms)
function _test(testQuantity) {
  return new Promise((resolve, reject) => {
    const percentages = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
    };
    const startTime = Date.now();
    // Calculate...
    for (let i = 0; i < testQuantity; i++) {
      const randomNumber = Math.floor(Math.random() * 10).toString();
      percentages[randomNumber] = percentages[randomNumber] + 1;
    }
    const duration = Date.now() - startTime;
    resolve({ percentages, duration });
  });
}

// React to button click
//    - Get test quantity
//    - Update UI to 'loading'
//    - trigger test
//    - Update UI to 'ready'
//    - Trigger chart draw
async function _handleButtonClick(event) {
  const testQuantity = event.currentTarget.getAttribute('test-quantity');
  let result;
  updateUI('loading');
  setTimeout(async () => {
    result = await _test(testQuantity);
    updateUI('ready', result.duration, testQuantity);
    drawChart(result.percentages, testQuantity);
  }, DELAY_AFTER_BUTTON_CLICK)
}

// Init
//    - Check if all needed elements are available
//    - Add event listener to buttons
//    - Get canvas context for chart
function init() {
  if (!buttons || !graph || !container || !infoQuantity || !infoDuration) {
    console.error('could not find all necessary elements');
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', _handleButtonClick);
  });

  CHART_CONTEXT = graph.getContext('2d');
}

// Update UI
function updateUI(state, duration, quantity) {
  container.setAttribute('state', state);

  if (state === 'ready') {
    infoQuantity.textContent = formatNumberWithSeparators(quantity);
    infoDuration.textContent = duration;
  }
}

// Draw chart
function drawChart(percentages, testQuantity) {
  const chart = new Chart(CHART_CONTEXT, {
    type: 'pie',
    data: {
      labels: Object.keys(percentages),
      datasets: [{
        backgroundColor: [
          '#d32f2f',
          '#689F38',
          '#7B1FA2',
          '#F57C00',
          '#303F9F',
          '#FBC02D',
          '#0288D1',
          '#E64A19',
          '#00796B',
          '#C2185B',
        ],
        borderWidth: 0,
        data: Object.values(percentages)
      }]
    },

    options: {
      cutoutPercentage: 50,
      responsive: true,
      legend: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      plugins: {
        datalabels: {
          color: 'white',
          textAlign: 'center',
          formatter: function(value, context) {
            return context.dataIndex + ':\n ' + (value / testQuantity * 100).toFixed(2) + '%';
          }
        }
      }
    }
  });
}

// Format a number to have a '.' as a thousands separator
// 1000000 -> 1.000.000
function formatNumberWithSeparators(numberToFormat) {
  return numberToFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Initialize
init();
