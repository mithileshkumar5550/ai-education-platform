const { spawn } = require('child_process');
const http = require('http');

console.log('🧪 Starting backend automated API tests...');

// 1. Start backend process
const serverProcess = spawn('node', ['server.js'], {
  cwd: 'c:\\Users\\HP\\Desktop\\website\\backend',
  env: { ...process.env, PORT: 5000, JWT_SECRET: 'test_jwt_secret_key' }
});

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
  const str = data.toString();
  serverOutput += str;
  console.log(`[Server]: ${str.trim()}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data.toString().trim()}`);
});

const makeRequest = (path, method, body = null) => {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: JSON.parse(data)
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(payload);
    req.end();
  });
};

const runTests = async () => {
  // Wait 3 seconds for server boot & seeding
  await new Promise((r) => setTimeout(r, 3000));

  try {
    console.log('\n--- 1. Testing Health Endpoint ---');
    const health = await makeRequest('/api/health', 'GET');
    console.log(`Status: ${health.statusCode}`);
    console.log('Payload:', health.data);
    if (health.data.status !== 'healthy') throw new Error('Health check failed');

    console.log('\n--- 2. Testing Courses Listing ---');
    const courses = await makeRequest('/api/courses', 'GET');
    console.log(`Status: ${courses.statusCode}`);
    console.log(`Seeded Courses: ${courses.data.length}`);
    if (courses.data.length === 0) throw new Error('Course seeding failed');
    courses.data.forEach(c => console.log(` - [${c.difficulty}] ${c.title} (${c.lessons.length} lessons)`));

    console.log('\n--- 3. Testing User Registration ---');
    const registerPayload = {
      name: 'Test Student',
      email: `student_${Date.now()}@edu.com`,
      password: 'password123'
    };
    const register = await makeRequest('/api/auth/register', 'POST', registerPayload);
    console.log(`Status: ${register.statusCode}`);
    if (register.statusCode !== 201 || !register.data.token) {
      throw new Error('Registration failed: ' + JSON.stringify(register.data));
    }
    console.log('✅ Registered user:', register.data.user.name);
    console.log('✅ Received token:', register.data.token.slice(0, 15) + '...');

    console.log('\n🌟 ALL BACKEND API CHECKS PASSED SUCCESSFULLY! 🌟');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exitCode = 1;
  } finally {
    console.log('\nStopping backend server...');
    serverProcess.kill();
  }
};

runTests();
