const axios = require('axios');

const scanner = {
  // Main scan function
  scan: async (apiUrl, scanType) => {
    const vulnerabilities = [];

    try {
      switch (scanType) {
        case 'authentication':
          vulnerabilities.push(...await scanner.checkAuthentication(apiUrl));
          break;
        case 'rateLimit':
          vulnerabilities.push(...await scanner.checkRateLimit(apiUrl));
          break;
        case 'dataExposure':
          vulnerabilities.push(...await scanner.checkDataExposure(apiUrl));
          break;
        case 'all':
        default:
          vulnerabilities.push(...await scanner.checkAll(apiUrl));
          break;
      }
    } catch (error) {
      vulnerabilities.push({
        name: 'Scan Error',
        severity: 'low',
        description: error.message,
        remediation: 'Verify the target URL is accessible and supports GET requests.'
      });
    }

    return vulnerabilities;
  },

  // 1. Authentication Check
  // Flags as MEDIUM if accessible without auth — public APIs are not CRITICAL
  checkAuthentication: async (apiUrl) => {
    const vulnerabilities = [];

    try {
      const response = await axios.get(apiUrl, { timeout: 5000 });
      if (response.status === 200) {
        vulnerabilities.push({
          name: 'No Authentication Required',
          severity: 'medium',
          description: 'Endpoint is publicly accessible without authentication headers. Ensure this is intentional.',
          remediation: 'If this endpoint exposes sensitive data, protect it with JWT, API keys, or OAuth2.'
        });
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Good — auth is enforced
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        vulnerabilities.push({
          name: 'Endpoint Unreachable',
          severity: 'low',
          description: `Could not connect to the target: ${error.message}`,
          remediation: 'Verify the URL is correct and the server is running.'
        });
      }
    }

    return vulnerabilities;
  },

  // 2. Rate Limiting Check — 20 requests, flags only if ALL pass without a 429
  checkRateLimit: async (apiUrl) => {
    const vulnerabilities = [];
    const requests = 20;
    let successCount = 0;
    let rateLimited = false;
    const startTime = Date.now();

    try {
      const promises = Array(requests).fill(null).map(() =>
        axios.get(apiUrl, { timeout: 3000 }).catch(err => err)
      );
      const results = await Promise.all(promises);

      for (const result of results) {
        if (result.status === 200) successCount++;
        if (result.status === 429) { rateLimited = true; break; }
      }

      if (!rateLimited && successCount >= 18) {
        const duration = (Date.now() - startTime) / 1000;
        vulnerabilities.push({
          name: 'No Rate Limiting Detected',
          severity: 'medium',
          description: `API accepted ${successCount}/${requests} rapid requests without throttling (${(successCount / duration).toFixed(1)} req/sec).`,
          remediation: 'Implement rate limiting (e.g., 60-100 requests per minute per IP) to prevent abuse and DoS.'
        });
      }
    } catch (error) {
      console.log('Rate limit check error:', error.message);
    }

    return vulnerabilities;
  },

  // 3. Data Exposure — uses regex for real emails & SSNs, checks for dangerous field names
  checkDataExposure: async (apiUrl) => {
    const vulnerabilities = [];

    try {
      const response = await axios.get(apiUrl, { timeout: 5000 });
      const data = response.data;
      const dataStr = JSON.stringify(data);

      // Real email addresses in response values
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = dataStr.match(emailRegex);
      if (emails && emails.length > 0) {
        vulnerabilities.push({
          name: 'Email Addresses Exposed',
          severity: 'high',
          description: `Response contains ${emails.length} email address(es). Verify this is intentional.`,
          remediation: 'Avoid exposing user emails in API responses unless necessary.'
        });
      }

      // SSN-format strings (e.g., 123-45-6789)
      const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/;
      if (ssnRegex.test(dataStr)) {
        vulnerabilities.push({
          name: 'Potential SSN Exposure',
          severity: 'critical',
          description: 'Response may contain Social Security Numbers.',
          remediation: 'Never expose SSNs in API responses. Mask or remove them entirely.'
        });
      }

      // Top-level keys that should never appear in responses
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const dangerousKeys = ['password', 'passwd', 'pwd', 'secret', 'private_key'];
        const flatKeys = Object.keys(data).map(k => k.toLowerCase());
        const found = dangerousKeys.filter(k => flatKeys.includes(k));
        if (found.length > 0) {
          vulnerabilities.push({
            name: 'Sensitive Fields in Response',
            severity: 'critical',
            description: `Response body contains sensitive field(s): ${found.join(', ')}`,
            remediation: 'Never include passwords, secrets, or private keys in API response bodies.'
          });
        }
      }

      // Missing security headers
      if (!response.headers['x-content-type-options']) {
        vulnerabilities.push({
          name: 'Missing X-Content-Type-Options Header',
          severity: 'low',
          description: 'API is missing the X-Content-Type-Options response header.',
          remediation: 'Add "X-Content-Type-Options: nosniff" to prevent MIME-type sniffing attacks.'
        });
      }

      if (!response.headers['strict-transport-security'] && apiUrl.startsWith('https')) {
        vulnerabilities.push({
          name: 'Missing HSTS Header',
          severity: 'low',
          description: 'HTTPS endpoint is missing the Strict-Transport-Security (HSTS) header.',
          remediation: 'Add "Strict-Transport-Security: max-age=31536000; includeSubDomains" to enforce HTTPS.'
        });
      }
    } catch (error) {
      console.log('Data exposure check error:', error.message);
    }

    return vulnerabilities;
  },

  // 4. CORS Check — only flags dangerous combinations, not plain wildcards
  checkCORS: async (apiUrl) => {
    const vulnerabilities = [];

    try {
      const response = await axios.get(apiUrl, {
        headers: { 'Origin': 'http://malicious-site.com' },
        timeout: 5000
      });

      const allowOrigin = response.headers['access-control-allow-origin'];
      const allowCreds = response.headers['access-control-allow-credentials'];

      if (allowOrigin === '*' && allowCreds === 'true') {
        vulnerabilities.push({
          name: 'Misconfigured CORS (Wildcard + Credentials)',
          severity: 'high',
          description: 'API sets both Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials: true. This is a security misconfiguration.',
          remediation: 'Use a specific origin allowlist instead of wildcard (*) when credentials are used.'
        });
      } else if (allowOrigin === '*') {
        vulnerabilities.push({
          name: 'Open CORS Policy',
          severity: 'low',
          description: 'API allows requests from any origin (*). Fine for public APIs but review if serving authenticated or private data.',
          remediation: 'Restrict CORS to trusted domains if the API serves user-specific data.'
        });
      }
    } catch (error) {
      console.log('CORS check error:', error.message);
    }

    return vulnerabilities;
  },

  // 5. SQL Injection — only flags if the API leaks actual SQL error text in the response
  checkSQLInjection: async (apiUrl) => {
    const vulnerabilities = [];
    const sqlPayloads = ["'", "1' OR '1'='1", "'; DROP TABLE users;--"];
    const sqlErrorKeywords = ['sql syntax', 'mysql_fetch', 'ora-', 'pg::', 'sqlite_', 'unclosed quotation', 'syntax error near', 'you have an error in your sql'];

    for (const payload of sqlPayloads) {
      try {
        const testUrl = `${apiUrl}?id=${encodeURIComponent(payload)}`;
        const response = await axios.get(testUrl, { timeout: 5000 });
        const body = JSON.stringify(response.data).toLowerCase();

        const leaked = sqlErrorKeywords.filter(kw => body.includes(kw));
        if (leaked.length > 0) {
          vulnerabilities.push({
            name: 'SQL Error Leakage (Possible SQL Injection)',
            severity: 'critical',
            description: `API revealed SQL error details for payload: "${payload}". Found: ${leaked.join(', ')}`,
            remediation: 'Use parameterized queries. Never expose raw database errors to clients.'
          });
          break;
        }
      } catch (error) {
        // 400/500 errors are expected when attacks are blocked — don't flag
      }
    }

    return vulnerabilities;
  },

  // Run all checks
  checkAll: async (apiUrl) => {
    const all = [];
    all.push(...await scanner.checkAuthentication(apiUrl));
    all.push(...await scanner.checkRateLimit(apiUrl));
    all.push(...await scanner.checkDataExposure(apiUrl));
    all.push(...await scanner.checkCORS(apiUrl));
    all.push(...await scanner.checkSQLInjection(apiUrl));
    return all;
  }
};

module.exports = scanner;