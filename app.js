const scanButton = document.getElementById("scanButton");
const statusEl = document.getElementById("status");
const distanceEl = document.getElementById("distance");

function estimateDistance(rssi) {
  // Fórmula aproximada: d = 10 ^ ((TxPower - RSSI) / (10 * n))
  // TxPower típico = -59 dBm, n = 2 (espacio libre)
  const txPower = -59;
  const n = 2;
  return Math.pow(10, (txPower - rssi) / (10 * n));
}

scanButton.addEventListener("click", async () => {
  try {
    statusEl.textContent = "Estado: Escaneando...";
    
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service'] // Puedes usar servicios comunes
    });

    statusEl.textContent = `Estado: Conectado a ${device.name || "dispositivo"}`;

    const server = await device.gatt.connect();

    // 🚫 La Web Bluetooth API no expone directamente RSSI.
    // Pero algunos dispositivos pueden emitir RSSI a través de características específicas.
    // Aquí simulamos un RSSI (por limitación de navegador)
    const simulatedRSSI = -65; // Ejemplo de RSSI en dBm

    const distance = estimateDistance(simulatedRSSI);
    distanceEl.textContent = `Distancia estimada: ${distance.toFixed(2)} metros`;

    // NOTA: En apps nativas (Android Studio, Swift) puedes acceder a RSSI real
  } catch (error) {
    statusEl.textContent = "Error: " + error.message;
  }
});
