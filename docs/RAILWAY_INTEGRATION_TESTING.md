# Railway API Integration Testing Guide

## Overview

All Worksona.js demos have been updated to support Railway API server deployment with authentication. This document provides a comprehensive testing checklist.

## Prerequisites

1. **Railway API Server**: Deployed and running at `https://your-app.railway.app`
2. **API Key**: Valid Railway API key (format: `wsk_live_...`)
3. **Environment**: API keys configured on the Railway server

## Modified Files

### Core Module
- ✅ `www/assets/js/railway-config.js` - Shared configuration module

### Demos Updated
- ✅ `www/demos/endpoint-api-demo.html` - Main API testing interface
- ✅ `www/demos/delegation-demo.html` - Workflow builder
- ✅ `www/demos/test-connection.html` - Connection testing utility
- ✅ `public/index.html` - API console UI
- ✅ `public/app.js` - API console logic

## Testing Checklist

### 1. Railway Config Module (`railway-config.js`)

Test the core configuration module:

```javascript
// Open browser console on any demo page
console.log('API URL:', RailwayConfig.detectApiUrl());
console.log('Has API Key:', !!RailwayConfig.getApiKey());
console.log('Headers:', RailwayConfig.getHeaders());
```

**Expected Results:**
- API URL should detect Railway domain or use configured URL
- API key should be retrieved from localStorage if set
- Headers should include `x-api-key` if key is configured

### 2. Endpoint API Demo (`www/demos/endpoint-api-demo.html`)

#### Setup
1. Navigate to `/demos/endpoint-api-demo.html`
2. Look for the API configuration section in the status bar
3. Enter Railway API URL: `https://your-app.railway.app`
4. Enter API Key: `wsk_live_...`
5. Click "Save Config"

#### Tests

**A. Server Status Check**
- [ ] Status indicator turns green when server is online
- [ ] Agent list populates with available agents
- [ ] No console errors about authentication

**B. Simple Query Test**
- [ ] Select an agent from dropdown
- [ ] Enter a test query: "What is AI?"
- [ ] Click "Send Query"
- [ ] Response appears with 200 status
- [ ] Generated code examples include API key header

**C. Agent Chat Test**
- [ ] Switch to "Agent Chat" tab
- [ ] Enter agent ID and message
- [ ] Verify response contains agent reply
- [ ] Check response time is displayed

**D. Batch Processing Test**
- [ ] Switch to "Batch" tab
- [ ] Submit multiple queries
- [ ] All queries complete successfully
- [ ] Batch results show correct structure

**E. File Upload Test**
- [ ] Switch to "File Upload" tab
- [ ] Select a test file (PDF, image, or document)
- [ ] Enter analysis prompt
- [ ] Upload completes successfully
- [ ] Analysis results returned

**F. Image Generation Test**
- [ ] Switch to "Images" tab
- [ ] Enter image prompt
- [ ] Select model (gpt-image-1.5 or dall-e-3)
- [ ] Generate image successfully
- [ ] Image displays in response

**G. Authentication Error Handling**
- [ ] Clear API key from localStorage
- [ ] Try making a request
- [ ] Should receive 401 Unauthorized error
- [ ] Error message should be clear

**H. Rate Limit Testing**
- [ ] Make rapid successive requests
- [ ] If rate limit hit (429), error should be handled gracefully
- [ ] Error message should mention rate limit

### 3. Public API Console (`public/index.html`)

#### Setup
1. Navigate to `/index.html`
2. Enter Railway API URL in configuration section
3. Enter API Key
4. Click "Save Config"
5. Page should reload with new config

#### Tests

**A. Configuration Persistence**
- [ ] After page reload, API URL is still configured
- [ ] API Key is still present (masked)
- [ ] Server status check succeeds

**B. Provider Status**
- [ ] OpenAI provider shows as active
- [ ] Anthropic provider status reflects server config
- [ ] Google provider status reflects server config

**C. Agent Operations**
- [ ] Available agents list populates
- [ ] Can select agent from dropdown
- [ ] Agent query works correctly
- [ ] Response displays properly

**D. File Upload**
- [ ] File upload form accepts files
- [ ] Upload triggers analysis
- [ ] Results display correctly

### 4. Delegation Demo (`www/demos/delegation-demo.html`)

#### Setup
1. Navigate to `/demos/delegation-demo.html`
2. API URL should auto-detect Railway
3. Set API key in localStorage: `localStorage.setItem('worksona_railway_api_key', 'your-key')`
4. Reload page

#### Tests

**A. Workflow Creation**
- [ ] Can create new workflow
- [ ] Can add steps to workflow
- [ ] Steps show correct agent options

**B. Workflow Execution**
- [ ] Select or create a workflow
- [ ] Click "Execute Workflow"
- [ ] Each step executes in sequence
- [ ] Results propagate between steps
- [ ] Final output displays correctly

**C. Template Workflows**
- [ ] Load "Content Creation Pipeline" template
- [ ] Execute template workflow
- [ ] All steps complete successfully

**D. Code Export**
- [ ] Export workflow as JavaScript
- [ ] Export includes correct API URL
- [ ] Export includes API key header
- [ ] Exported code is valid and runnable

### 5. Test Connection Utility (`www/demos/test-connection.html`)

#### Setup
1. Navigate to `/demos/test-connection.html`
2. API should auto-detect Railway URL
3. Set API key if needed

#### Tests

**A. Health Check**
- [ ] ✅ Server is running (green status)
- [ ] Health data displays JSON response

**B. API Info**
- [ ] ✅ API info retrieved (green status)
- [ ] Shows available endpoints and versions

**C. List Agents**
- [ ] ✅ Found X agents (green status)
- [ ] Agent list shows IDs and configurations

**D. Test Chat**
- [ ] ✅ Chat test successful (green status)
- [ ] Response shows agent reply
- [ ] Token usage displayed

### 6. Cross-Origin Resource Sharing (CORS)

**Tests:**
- [ ] No CORS errors in browser console
- [ ] Railway server has correct CORS headers
- [ ] All origins are allowed or specific domains whitelisted
- [ ] Preflight OPTIONS requests succeed

### 7. Error Scenarios

**A. Missing API Key**
- [ ] Clear API key
- [ ] Attempt API call
- [ ] Receive 401 Unauthorized
- [ ] Error message is user-friendly

**B. Invalid API Key**
- [ ] Set incorrect API key
- [ ] Attempt API call
- [ ] Receive 401 Unauthorized
- [ ] Error suggests checking API key

**C. Server Offline**
- [ ] Stop Railway server (or use invalid URL)
- [ ] Status indicator shows offline
- [ ] Error message suggests checking server status

**D. Rate Limit Exceeded**
- [ ] Make >300 requests in 15 minutes
- [ ] Receive 429 Too Many Requests
- [ ] Error message explains rate limit
- [ ] Suggests waiting before retrying

**E. Malformed Requests**
- [ ] Send invalid JSON body
- [ ] Receive appropriate error
- [ ] Error describes validation issue

### 8. Browser Compatibility

Test in multiple browsers:

**Chrome/Edge:**
- [ ] All demos load correctly
- [ ] API calls succeed
- [ ] LocalStorage persists config

**Firefox:**
- [ ] All demos load correctly
- [ ] API calls succeed
- [ ] LocalStorage persists config

**Safari:**
- [ ] All demos load correctly
- [ ] API calls succeed
- [ ] LocalStorage persists config

### 9. Mobile Responsiveness

**Test on mobile devices or responsive mode:**
- [ ] Configuration UI is usable
- [ ] Input fields are accessible
- [ ] Buttons are tappable
- [ ] Response display is readable
- [ ] No horizontal scrolling issues

### 10. Configuration UI

**A. API URL Input**
- [ ] Accepts valid URLs
- [ ] Strips trailing slashes
- [ ] Saves to localStorage
- [ ] Displays current value on load

**B. API Key Input**
- [ ] Password field (masked)
- [ ] Saves to localStorage
- [ ] Displays current value on load (masked)
- [ ] Can be cleared

**C. Save Button**
- [ ] Shows visual feedback on save
- [ ] Updates API_BASE variable
- [ ] Triggers re-check of server status
- [ ] Changes saved persist across page reloads

## Code Generation Verification

Verify generated code examples include API key:

### cURL
```bash
curl -X POST https://your-app.railway.app/api/query \
  -H "x-api-key: wsk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

### JavaScript
```javascript
const response = await fetch('https://your-app.railway.app/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'wsk_live_...'
  },
  body: JSON.stringify({query: 'test'})
});
```

### Python
```python
import requests

response = requests.post('https://your-app.railway.app/api/query',
    json={'query': 'test'},
    headers={'x-api-key': 'wsk_live_...'})
```

## Security Considerations

**Verify:**
- [ ] API keys are stored in localStorage only (not sessionStorage or cookies)
- [ ] API keys are masked in password inputs
- [ ] API keys are not logged to console
- [ ] Generated code examples properly include auth headers
- [ ] No API keys hardcoded in source files

## Performance Tests

**A. Request Latency**
- [ ] Health check responds in <500ms
- [ ] Agent query responds in <5s
- [ ] Batch queries complete within reasonable time
- [ ] No memory leaks during extended use

**B. Concurrent Requests**
- [ ] Multiple tabs can use same API key
- [ ] Concurrent requests don't interfere
- [ ] Rate limiting tracked per IP correctly

## Deployment Verification

**Railway-Specific Checks:**
- [ ] Environment variables are set on Railway
- [ ] PORT is correctly configured
- [ ] Health check endpoint is accessible
- [ ] Logs show successful requests
- [ ] No authentication errors in Railway logs

## Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** Verify API key is correctly saved in localStorage and matches server configuration

### Issue: CORS Error
**Solution:** Check Railway server has `cors` middleware enabled and configured for frontend domain

### Issue: Can't connect to server
**Solution:** Verify Railway deployment is active and domain is correct

### Issue: Rate limit exceeded
**Solution:** Wait 15 minutes or implement request throttling

### Issue: API key not persisting
**Solution:** Check browser allows localStorage, not in private/incognito mode

## Success Criteria

All tests must pass:
- ✅ API URL auto-detection works for Railway
- ✅ Manual configuration UI functions correctly
- ✅ API key authentication succeeds
- ✅ All demo endpoints work with Railway server
- ✅ Error handling is robust and user-friendly
- ✅ Generated code examples include proper authentication
- ✅ Configuration persists across page reloads
- ✅ No console errors during normal operation

## Testing Complete

Once all checklist items are verified, the Railway integration is ready for production use.

**Tester Name:** _________________
**Date:** _________________
**Railway URL:** _________________
**Test Status:** ☐ Pass ☐ Fail ☐ Partial

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
