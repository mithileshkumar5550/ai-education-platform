const https = require('https');

const configurations = [
  { url: 'https://ai-education-platform.onrender.com', label: 'ai-education-platform' },
  { url: 'https://ai-education-platform-backend.onrender.com', label: 'ai-education-platform-backend' },
  { url: 'https://ai-education-backend.onrender.com', label: 'ai-education-backend' }
];

configurations.forEach(config => {
  // Test Root
  const rootUrl = `${config.url}/`;
  const reqRoot = https.get(rootUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk.toString().slice(0, 100)); // Get first 100 chars
    res.on('end', () => {
      console.log(`[ROOT] ${config.label} -> Status: ${res.statusCode}`);
      console.log(`[ROOT_PREVIEW] ${config.label} -> ${data.replace(/\s+/g, ' ')}\n`);
    });
  });
  reqRoot.on('error', (e) => console.log(`[ROOT_ERROR] ${config.label} -> ${e.message}`));
  reqRoot.setTimeout(15000, () => reqRoot.destroy());

  // Test API Courses
  const apiUrl = `${config.url}/api/courses`;
  const reqApi = https.get(apiUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`[API_COURSES] ${config.label} -> Status: ${res.statusCode}`);
      console.log(`[API_PREVIEW] ${config.label} -> ${data.slice(0, 200)}\n`);
    });
  });
  reqApi.on('error', (e) => console.log(`[API_ERROR] ${config.label} -> ${e.message}`));
  reqApi.setTimeout(15000, () => reqApi.destroy());
});
