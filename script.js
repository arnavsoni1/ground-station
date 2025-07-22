// --- Telemetry value selectors ---
const telemetrySelectors = {
  altitude: document.querySelector('.telemetry .quantity:nth-child(1) span'),
  velocity: document.querySelector('.telemetry .quantity:nth-child(2) span'),
  temperature: document.querySelector('.telemetry .quantity:nth-child(3) span'),
  pressure: document.querySelector('.telemetry .quantity:nth-child(4) span'),
  acceleration: Array.from(document.querySelectorAll('.telemetry .quantity:nth-child(5) span')),
  gyro: Array.from(document.querySelectorAll('.telemetry .quantity:nth-child(6) span'))
};

// --- Chart.js Graphs ---
let graph1, graph2;
function setupGraphs() {
  const ctx1 = document.getElementById('graph1').getContext('2d');
  const ctx2 = document.getElementById('graph2').getContext('2d');
  graph1 = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Altitude (m)',
        data: [],
        borderColor: 'blue',
        fill: false
      }]
    },
    options: { animation: false, scales: { x: { title: { display: true, text: 'Time (s)' } }, y: { beginAtZero: true } } }
  });
  graph2 = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'red',
        fill: false
      }]
    },
    options: { animation: false, scales: { x: { title: { display: true, text: 'Time (s)' } }, y: { beginAtZero: true } } }
  });
}

// --- WebSocket Telemetry Handling ---
let ws;
let t = 0;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:8080');
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  ws.onmessage = (event) => {
    handleTelemetryData(event.data);
  };
  ws.onclose = () => {
    console.log('WebSocket disconnected, retrying in 2s...');
    setTimeout(connectWebSocket, 2000);
  };
  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
    ws.close();
  };
}

function handleTelemetryData(line) {
  // Expected CSV: altitude,velocity,temperature,pressure,accelX,accelY,accelZ,gyroX,gyroY,gyroZ
  const parts = line.split(',');
  if (parts.length < 10) return;
  telemetrySelectors.altitude.textContent = parts[0];
  telemetrySelectors.velocity.textContent = parts[1];
  telemetrySelectors.temperature.textContent = parts[2];
  telemetrySelectors.pressure.textContent = parts[3];
  telemetrySelectors.acceleration.forEach((el, i) => el.textContent = parts[4 + i]);
  telemetrySelectors.gyro.forEach((el, i) => el.textContent = parts[7 + i]);

  // Update graphs
  if (graph1 && graph2) {
    if (graph1.data.labels.length > 50) {
      graph1.data.labels.shift();
      graph1.data.datasets[0].data.shift();
      graph2.data.labels.shift();
      graph2.data.datasets[0].data.shift();
    }
    graph1.data.labels.push(t);
    graph1.data.datasets[0].data.push(Number(parts[0]));
    graph2.data.labels.push(t);
    graph2.data.datasets[0].data.push(Number(parts[2]));
    graph1.update();
    graph2.update();
  }
  t++;
}

// --- Initialize everything on DOMContentLoaded ---
window.addEventListener('DOMContentLoaded', () => {
  setupGraphs();
  connectWebSocket();
  // Optionally, remove or hide the old serial connect button if present
});
    graph2.update();
  
  t++;


// --- Initialize everything on DOMContentLoaded ---
window.addEventListener('DOMContentLoaded', () => {
  setupGraphs();
  // Add a button to connect to serial
  const btn = document.createElement('button');
  btn.textContent = 'Connect to ESP32';
  btn.id = 'connect-esp32-btn';
  btn.onclick = connectSerial;
  document.body.insertBefore(btn, document.body.firstChild);
});
