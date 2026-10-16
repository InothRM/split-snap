import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { Blob } from "node:buffer";
import app from "./server.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("health endpoint reports the API is ready", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("analyze endpoint returns mock analysis for a valid PDF", async () => {
  const body = new FormData();
  body.append("receipt", new Blob(["%PDF-1.7 demo"], { type: "application/pdf" }), "dinner.pdf");

  const response = await fetch(`${baseUrl}/api/analyze`, { method: "POST", body });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.fileName, "dinner.pdf");
  assert.equal(result.items.length, 4);
  assert.equal(result.items.reduce((sum, item) => sum + item.price, 0), 48);
  assert.equal(result.taxRate, 0.085);
  assert.equal(result.tipRate, 18);
});

test("analyze endpoint accepts PNG receipts", async () => {
  const body = new FormData();
  const pngSignature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  body.append("receipt", new Blob([pngSignature], { type: "image/png" }), "lunch.png");

  const response = await fetch(`${baseUrl}/api/analyze`, { method: "POST", body });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.fileName, "lunch.png");
  assert.equal(result.items.length, 4);
});

test("analyze endpoint rejects a file with an invalid signature", async () => {
  const body = new FormData();
  body.append("receipt", new Blob(["not a PDF"], { type: "application/pdf" }), "receipt.pdf");

  const response = await fetch(`${baseUrl}/api/analyze`, { method: "POST", body });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /does not match/);
});
