"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCallbackSuccess = defaultCallbackSuccess;
exports.defaultCallbackFailure = defaultCallbackFailure;
exports.escapeHtml = escapeHtml;
const errors_1 = require("./errors");
// Default function to call when OAuth flow is successful
function defaultCallbackSuccess(installation, _options, _req, res) {
    let redirectUrl;
    if (isNotOrgInstall(installation) && installation.appId !== undefined) {
        // redirect back to Slack native app
        // Changes to the workspace app was installed to, to the app home
        redirectUrl = `slack://app?team=${installation.team.id}&id=${installation.appId}`;
    }
    else if (isOrgInstall(installation)) {
        // redirect to Slack app management dashboard
        redirectUrl = `${installation.enterpriseUrl}manage/organization/apps/profile/${installation.appId}/workspaces/add`;
    }
    else {
        // redirect back to Slack native app
        // does not change the workspace the slack client was last in
        redirectUrl = 'slack://open';
    }
    let browserUrl = redirectUrl;
    if (isNotOrgInstall(installation)) {
        browserUrl = `https://app.slack.com/client/${installation.team.id}`;
    }
    const htmlResponse = `<html>
  <head>
  <meta http-equiv="refresh" content="0; URL=${escapeHtml(redirectUrl)}">
  <style>
  body {
    padding: 10px 15px;
    font-family: verdana;
    text-align: center;
  }
  </style>
  </head>
  <body>
  <h2>Thank you!</h2>
  <p>Redirecting to the Slack App... click <a href="${escapeHtml(redirectUrl)}">here</a>. If you use the browser version of Slack, click <a href="${escapeHtml(browserUrl)}" target="_blank">this link</a> instead.</p>
  </body>
  </html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlResponse);
}
// Default function to call when OAuth flow is unsuccessful
function defaultCallbackFailure(error, _options, _req, res) {
    let httpStatus;
    switch (error.code) {
        case errors_1.ErrorCode.MissingStateError:
        case errors_1.ErrorCode.InvalidStateError:
        case errors_1.ErrorCode.MissingCodeError:
            httpStatus = 400;
            break;
        default:
            httpStatus = 500;
    }
    res.writeHead(httpStatus, { 'Content-Type': 'text/html; charset=utf-8' });
    const html = `<html>
  <head>
  <style>
  body {
    padding: 10px 15px;
    font-family: verdana;
    text-align: center;
  }
  </style>
  </head>
  <body>
  <h2>Oops, Something Went Wrong!</h2>
  <p>Please try again or contact the app owner (reason: ${escapeHtml(error.code)})</p>
  </body>
  </html>`;
    res.end(html);
}
// ------------------------------------------
// Internals
// ------------------------------------------
// Type guard to narrow Installation type to OrgInstallation
function isOrgInstall(installation) {
    return installation.isEnterpriseInstall || false;
}
function isNotOrgInstall(installation) {
    return !isOrgInstall(installation);
}
function escapeHtml(input) {
    if (input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    return '';
}
//# sourceMappingURL=callback-options.js.map