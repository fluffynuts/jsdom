"use strict";

const { describe, specify } = require("mocha-sugar-free");
const { assert } = require("chai");
const { JSDOM } = require("../..");
const { injectIFrameWithScript } = require("../util.js");

describe("post-message (iframes)", () => {
  specify("postMessage should provide source property", t => {
    // This would require knowledge of the source window
    // See: https://github.com/tmpvar/jsdom/pull/1140#issuecomment-111587499
    const maxWaitMs = 240000;
    t.timeout(240000); // FIXME: remove once debugging is over
    debugger;
    const { window } = new JSDOM(undefined, { runScripts: "dangerously" });
    const { document } = window;
    let messageReceived = false;

    console.log(`parent id: ${window._ID_}`);

    const iframe = document.createElement("iframe");
    iframe.id = "CHILD";
    document.body.appendChild(iframe);

    return new Promise((resolve, reject) => {
      window.addEventListener("message", event => {
        console.log(`source id: ${event.source.__id}`);
        try {
          assert.ok(event.source);
          assert.ok(event.source === iframe);
          messageReceived = true;
          resolve();
        } catch (e) {
          reject(e);
        }
      });

      window.setTimeout(() => {
        if (!messageReceived) {
          reject(new Error(`No message received within ${maxWaitMs}ms`));
        }
      }, maxWaitMs);

      injectIFrameWithScript(document, `
        window.parent.postMessage("ack-attack", "*");
      `);
    });
  }, undefined, { expectPromise: true });
});
