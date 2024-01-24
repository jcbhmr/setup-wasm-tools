#!/usr/bin/env node
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { join } from "node:path";
import * as semver from "semver";
import * as github from "@actions/github";
import { createUnauthenticatedAuth } from "@octokit/auth-unauthenticated";

const token =
  core.getInput("github_token") || core.getInput("wasm-tools-token");
const octokit = token
  ? github.getOctokit(token)
  : github.getOctokit(token, {
      authStrategy: createUnauthenticatedAuth,
      auth: { reason: "no 'wasm-tools-token' input" },
    });

const versionRaw =
  core.getInput("version") || core.getInput("wasm-tools-version");
let version = versionRaw;
if (version === "latest") {
  const { data } = await octokit.rest.repos.getLatestRelease({
    owner: "bytecodealliance",
    repo: "wasm-tools",
  });
  version = data.tag_name.slice("wasm-tools-".length);
} else {
  const releases = await octokit.paginate(octokit.rest.repos.listReleases, {
    owner: "bytecodealliance",
    repo: "wasm-tools",
  });
  const versions = releases.map((release) =>
    release.tag_name.slice("wasm-tools-".length),
  );
  version = semver.maxSatisfying(versions, version)!;
}
core.debug(`Resolved version: v${version}`);
if (!version) throw new DOMException(`${versionRaw} resolved to ${version}`);

let found = tc.find("wasm-tools", version);
core.setOutput("cache-hit", !!found);
if (!found) {
  const target = {
    "darwin,arm64": "aarch64-macos",
    "darwin,x64": "x86_64-macos",
    "linux,arm64": "aarch64-linux",
    "linux,x64": "x86_64-linux",
    "win32,x64": "x86_64-windows",
  }[[process.platform, process.arch].toString()]!;
  const archiveExt = {
    darwin: ".tar.gz",
    linux: ".tar.gz",
    win32: ".zip",
  }[process.platform.toString()]!;
  const folder = `wasm-tools-${version}-${target}`;
  const file = `${folder}${archiveExt}`;

  found = await tc.downloadTool(
    `https://github.com/bytecodealliance/wasm-tools/releases/download/wasm-tools-${version}/${file}`,
  );
  if (file.endsWith(".zip")) {
    found = await tc.extractZip(found);
  } else {
    // https://github.com/actions/toolkit/blob/68f22927e727a60caff909aaaec1ab7267b39f75/packages/tool-cache/src/tool-cache.ts#L226
    // J flag is .tar.xz
    // z flag is .tar.gz
    found = await tc.extractTar(found);
  }
  found = join(found, folder);
  found = await tc.cacheDir(found, "wasm-tools", version);
  core.info(`wasm-tools v${version} added to cache`);
}
core.addPath(found);
core.setOutput("wasm-tools-version", version);
core.info(`✅ wasm-tools v${version} installed!`);
