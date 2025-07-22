const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws'); // Add ws import

const portName = 'COM3';

const port = new SerialPort({
  path: portName,
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const logsFile = path.join(__dirname, 'logs.csv');

// --- WebSocket Server Setup ---
const wss = new WebSocket.Server({ port: 8080 }); // Listen on port 8080

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});
// --- End WebSocket Server Setup ---

port.on('open', () => {
  console.log(`Serial port ${portName} opened.`);
});

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

parser.on('data', (line) => {
  if (!port.isOpen) {
    console.error('Port is not open. Data not written.');
    return;
  }
  fs.appendFile(logsFile, line.trim() + '\n', (err) => {
    if (err) {
      console.error('Error writing to logs.csv:', err);
    } else {
      console.log('Logged:', line.trim());
    }
  });

  // Broadcast telemetry to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(line.trim());
    }
  });
});

// Handle port open errors
port.open((err) => {
  if (err) {
    return console.error('Failed to open port:', err.message);
  }
});
