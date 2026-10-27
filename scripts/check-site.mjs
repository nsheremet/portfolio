import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), "gallery-check-"));
const collection = "collections/leica-m11-test-drive/";
const photoCount = readdirSync(join(root, "content", collection)).filter((name) => /\.jpg$/i.test(name)).length;
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));

try {
  for (const drafts of [false, true]) {
    const prefix = drafts ? "/portfolio/" : "/";
    const destination = join(temporary, drafts ? "drafts" : "production");
    const args = ["--panicOnWarning", "--destination", destination, "--baseURL", `https://example.test${prefix}`];
    if (drafts) args.push("--buildDrafts");
    execFileSync("hugo", args, { cwd: root, stdio: "pipe" });

    const home = readFileSync(join(destination, "index.html"), "utf8");
    const gallery = readFileSync(join(destination, collection, "index.html"), "utf8");
    assert.equal(existsSync(join(destination, "collections/example/index.html")), drafts, "Draft collection visibility");
    assert.equal(home.includes(`${prefix}collections/example/`), drafts, "Draft homepage link visibility");
    assert.ok(home.includes(`href="${prefix}${collection}"`), "Published collection is linked");
    assert.ok(home.includes('id="collections"'), "Work anchor exists");

    for (const html of [home, gallery]) {
      for (const anchor of ["content", "top"]) {
        assert.ok(html.includes(`id="${anchor}"`), `${anchor} anchor exists`);
        assert.ok(html.includes(`href="#${anchor}"`), `${anchor} navigation remains`);
      }
      assert.ok(html.includes('href="mailto:ukrainianwithcamera@gmail.com"'), "Contact link remains");
      assert.ok(/<link[^>]+rel="stylesheet"/.test(html), "Stylesheet is linked");
      assert.ok(/<script[^>]+src=/.test(html), "Gallery script is linked");
      for (const match of html.matchAll(/\b(?:src|href)="(\/[^"\s]*)"/g)) {
        const url = match[1];
        assert.ok(url.startsWith(prefix), `Local URL respects base path: ${url}`);
        assert.ok(existsSync(join(destination, decodeURIComponent(url.slice(prefix.length)))), `Local target exists: ${url}`);
      }
    }

    const links = [...gallery.matchAll(/<a\b[^>]*\bdata-lightbox\b[^>]*>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, photoCount, "Every Cambridge photograph opens in the viewer");
    for (const [index, match] of links.entries()) {
      const image = attributes(match[1].match(/<img\b[^>]*>/)?.[0] ?? "");
      assert.ok(image.alt?.trim(), `Photograph ${index + 1} has alternative text`);
      assert.ok(Number(image.width) > 0 && Number(image.height) > 0, "Photograph reserves its aspect ratio");
      assert.ok(image.srcset?.includes(image.src), "Responsive sources include the full thumbnail");
      assert.equal(image.loading, index === 0 ? "eager" : "lazy", "Gallery loading priorities remain");
    }
    for (const hook of ["data-viewer", "data-viewer-stage", "data-viewer-image", "data-viewer-status", "data-viewer-caption", "data-viewer-count", "data-previous", "data-next", "data-fullscreen"]) {
      assert.ok(gallery.includes(hook), `Viewer hook remains: ${hook}`);
    }
    assert.ok(gallery.includes('method="dialog"'), "Native dialog close form remains");

    const cssTag = [...home.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag)).find((tag) => tag.rel === "stylesheet");
    const css = readFileSync(join(destination, cssTag.href.slice(prefix.length)), "utf8");
    const fontFiles = [...css.matchAll(/url\(["']?(\.\.\/fonts\/[^\s)"']+)["']?\)/g)];
    assert.ok(fontFiles.length > 0, "Fonts are hosted locally");
    for (const [, font] of fontFiles) assert.ok(existsSync(join(destination, "css", font)), `Font exists: ${font}`);
  }
  console.log("Site checks passed: production, drafts, base path, images, viewer hooks and local assets.");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
