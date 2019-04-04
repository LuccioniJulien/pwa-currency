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
  const { rates } = await fetchAsync(
    "https://localhost:5001/api/xeu?baseCurrency=EUR&symbols=GBP,JPY,USD"
  );
  RATES = rates;
  console.log(RATES);
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

async function fetchAsync(url, { method = "GET", body, jwt } = {}) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  const options = {
    headers,
    method
  };
  if (method === "POST") {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    throw "ERROR";
  }
  const json = await res.json();
  return json;
}
