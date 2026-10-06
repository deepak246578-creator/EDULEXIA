/**
 * Cross-platform combined development runner
 * Spawns both the Express API server and the Vite React frontend
 */
const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('  Starting EDULEXIA - Dyslexia Learning Support Platform');
console.log('  API Server: http://localhost:5000');
console.log('  Frontend App: http://localhost:3000');
console.log('================================================================\n');

// 1. Start Server
const serverProcess = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Client
const clientProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

// Handle graceful termination
const cleanExit = () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
