const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Initializing Local Tunnel Pipeline...');

let backendUrl = '';
let frontendUrl = '';

// Helper to spawn processes cleanly
const runProcess = (cmd, args, options) => {
  const proc = spawn(cmd, args, { shell: true, ...options });
  
  proc.stderr.on('data', (data) => {
    console.error(`[${options.name} ERROR]:`, data.toString().trim());
  });

  return proc;
};

// 1. Start the Backend API Server
console.log('Starting Backend Server on port 5000...');
const backendProc = runProcess('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  name: 'Backend'
});

backendProc.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('[Backend Logs]:', output.trim());
});

// 2. Start Backend Tunnel
console.log('Starting Backend Tunnel (localtunnel)...');
const backendTunnel = runProcess('npx', ['-y', 'localtunnel', '--port', '5000'], {
  cwd: __dirname,
  name: 'Backend-Tunnel'
});

backendTunnel.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('your url is:')) {
    backendUrl = output.split('your url is:')[1].trim();
    console.log(`\n💚 Backend Tunnel Active: ${backendUrl}\n`);
    
    // Now that we have the backend URL, start the frontend dev server and tunnel
    startFrontendPipeline(backendUrl);
  }
});

const startFrontendPipeline = (apiBaseUrl) => {
  console.log(`Building/Launching Frontend pointing to API: ${apiBaseUrl}/api ...`);
  
  // Start Frontend Dev Server
  const frontendProc = runProcess('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    env: { 
      ...process.env, 
      VITE_API_URL: `${apiBaseUrl}/api` 
    },
    name: 'Frontend'
  });

  frontendProc.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('[Frontend Logs]:', output.trim());
  });

  // Start Frontend Tunnel on port 5173
  console.log('Starting Frontend Tunnel (localtunnel)...');
  const frontendTunnel = runProcess('npx', ['-y', 'localtunnel', '--port', '5173'], {
    cwd: __dirname,
    name: 'Frontend-Tunnel'
  });

  frontendTunnel.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('your url is:')) {
      frontendUrl = output.split('your url is:')[1].trim();
      console.log('\n🌟 =================================================== 🌟');
      console.log('🎉 WEB APPLICATION IS LIVE!');
      console.log(`👉 Access URL: ${frontendUrl}`);
      console.log('🌟 =================================================== 🌟\n');
      console.log('Share the Access URL above with anyone to access your platform.');
    }
  });
};
