// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';
require('@testing-library/jest-dom');

const fetch = require('node-fetch');
global.fetch = fetch;
global.Request = fetch.Request;
global.Response = fetch.Response;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
