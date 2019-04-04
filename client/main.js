let RATES;

async function installServiceWorkerAsync() {
  if ("serviceWorker" in navigator) {
    try {
      const sw = await navigator.serviceWorker.register("./service-worker.js");
      console.log("Service registered: ", sw);
    } catch (error) {
      console.log("failed to register service worker");
      console.log(error);
    }
  }
}

function onLoad() {
  installServiceWorkerAsync();
  addRateInfoToTable();
}

function convert() {
  const selectedItem = document.getElementById("selectCurrency").value;
  const rate = RATES[selectedItem];
  const valueToConvert = parseFloat(
    document.getElementById("valueToConvert").value
  );
  document.getElementById("convertedValue").value = valueToConvert * rate;
}

async function addRateInfoToTable() {
  const { rates } = await fetchAsync("https://localhost:5001/api/xeu");
  RATES = rates;
  const html = Object.entries(rates).reduce((accumulator, [key, value]) => {
    setOption(key);
    return `${accumulator}
       <tr>
        <th>${key}</th>
        <td>${value}</td>
       </tr>`;
  }, "");
  document.getElementById("bodyTableRate").innerHTML = html;
}

function setOption(key) {
  const select = document.getElementById("selectCurrency");
  const option = document.createElement("option");
  option.text = key;
  select.appendChild(option);
}

async function fetchAsync(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw "ERROR";
  }
  return res.json();
}
