// jest.setup.js
require('@testing-library/jest-dom');

const fetch = require('node-fetch');
global.fetch = fetch;
global.Request = fetch.Request;
global.Response = fetch.Response;
