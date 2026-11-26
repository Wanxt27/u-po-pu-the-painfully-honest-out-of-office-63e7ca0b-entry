// The Painfully Honest Out-of-Office — make.fun entry
// u-po-pu-the-painfully-honest-out-of-office-63e7ca0b
//
// Writes one out-of-office email auto-reply to /output/entry.txt.
// The reply must be exactly one sentence of 1-200 characters: painfully
// honest about the sender's inbox, yet polite enough to survive a manager
// reading it. Node 22, stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

// One sentence, 174 characters: honest about the dreaded inbox and the
// pretence of ever catching up, polite in promising a proper reply.
const REPLY =
  "I'm away, and your email just joined 412 unread messages I'm quietly " +
  "dreading — I'll reply when I'm back, properly and eventually, once " +
  "I've stopped pretending I'll catch up.";

function gate(text: string): void {
  if (typeof text !== "string" || text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim() !== text) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line with no newline");
  }
  if (!/\S/.test(text)) {
    throw new Error("entry must not be only whitespace");
  }
  // The judge wants a single sentence: no sentence-ending period before
  // the final character, and exactly one trailing full stop.
  const body = text.slice(0, -1);
  if (body.includes(".")) {
    throw new Error("entry must be a single sentence");
  }
  if (!text.endsWith(".")) {
    throw new Error("entry must end with a full stop");
  }
}

function main(): void {
  gate(REPLY);
  // Never delete the output directory itself; only create it if missing.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, REPLY, "utf8");
  // Read back and verify what actually landed on disk.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== REPLY) {
    throw new Error("written output does not match the entry text");
  }
  gate(written);
  console.log(`wrote ${OUT_FILE} (${REPLY.length} characters)`);
}

main();
