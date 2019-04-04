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

async function fetchAsync(url = API_MANGA) {
  console.log(url);
  const res = await fetch(url);
  if (!res.ok) {
    throw "ERROR";
  }
  const json = await res.json();
  return json;
}
