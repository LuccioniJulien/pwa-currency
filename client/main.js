let rates_top;
let body;
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
  body = document.body.innerHTML;
}

function convert() {
  const selectedItem = document.getElementById("selectCurrency").value;
  const rate = rates_top[selectedItem];
  const valueToConvert = parseFloat(
    document.getElementById("valueToConvert").value
  );
  document.getElementById("convertedValue").value = valueToConvert * rate;
}

async function addRateInfoToTable() {
  try {
    const { rates } = await fetchAsync(
      "https://localhost:5001/api/xeu?baseCurrency=EUR&symbols=GBP,JPY,USD,CAD,CHF"
    );
    rates_top = rates;
    console.log(rates_top);
    const html = Object.entries(rates).reduce((accumulator, [key, value]) => {
      setOption(key);
      return `${accumulator}
         <tr>
          <th>${key}</th>
          <td>${value}</td>
         </tr>`;
    }, "");
    document.getElementById("bodyTableRate").innerHTML = html;
  } catch (error) {
    console.log(error);
  }
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
  verifStatut(res.status);
  const json = await res.json();
  console.log(json);
  return json;
}

function verifStatut(statut) {
  switch (statut) {
    case 400:
    case 401:
    case 402:
    case 403:
    case 404:
    case 500:
      throw "Error";
  }
}

async function subscribe() {
  const body = {
    Name: document.getElementById("name").value,
    Email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    passwordConfirmation: document.getElementById("passwordConfirmation").value
  };
  try {
    console.log(body);
    const result = await fetchAsync(
      "https://localhost:5001/api/users/Register",
      {
        method: "POST",
        body
      }
    );
    console.log(result);
    document.getElementById("name").value = document.getElementById(
      "email"
    ).value = document.getElementById(
      "password"
    ).value = document.getElementById("passwordConfirmation").value = "";

    document.getElementById("responseRegister").innerHTML =
      "<p>Success! You can now login</p>";
  } catch (error) {
    console.log(error);
    document.getElementById("responseRegister").innerHTML = "error";
  }
}

async function connect() {
  const body = {
    Email: document.getElementById("emailLogin").value,
    password: document.getElementById("passwordLogin").value
  };
  try {
    console.log(body);
    const result = await fetchAsync("https://localhost:5001/api/users/Auth", {
      method: "POST",
      body
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

function setLogin(isLogin = true) {
  document.body.innerHTML = isLogin
    ? `<div
  class="d-flex justify-content-center bg-info"
  style="height: 100px;padding-top:15px"
>
  <div class="row">
    <div class="col-sm">
      <h5 class="text-light">Hello there</h5>
      <a class="text-light" onclick="setLogin(false)">Converter</a>
    </div>
  </div>
</div>
<!-- Form -->
<div class="container login-container">
  <div class="row">
    <div class="col-md-6 login-form-1">
      <h3>Login</h3>
      <form>
        <div class="form-group">
          <input
            id="emailLogin"
            type="text"
            class="form-control"
            placeholder="Email *"
            value=""
          />
        </div>
        <div class="form-group">
          <input
            id="passwordLogin"
            type="password"
            class="form-control"
            placeholder="Password *"
            value=""
          />
        </div>
        <div class="form-group">
          <button onclick="connect()" type="button" class="btn btn-primary">
            Ok
          </button>
        </div>
      </form>
    </div>
    <div class="col-md-6 login-form-2">
      <h3>Inscription</h3>
      <form>
        <div class="form-group">
          <input
            id="name"
            type="text"
            class="form-control"
            placeholder="Name *"
            value=""
          />
        </div>
        <div class="form-group">
          <input
            id="email"
            type="text"
            class="form-control"
            placeholder="Email *"
            value=""
          />
        </div>
        <div class="form-group">
          <input
            id="password"
            type="password"
            class="form-control"
            placeholder="Your Password *"
            value=""
          />
        </div>
        <div class="form-group">
          <input
            id="passwordConfirmation"
            type="password"
            class="form-control"
            placeholder="confirm your password *"
            value=""
          />
        </div>
        <div class="form-group">
          <button
            onclick="subscribe()"
            type="button"
            class="btn btn-primary"
          >
            Ok
          </button>
          <div id="responseRegister">
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
`
    : body;
}
