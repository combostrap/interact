#!/usr/bin/env node
// build script (e.g. scripts/build-info.js), run before publishing
// It seems that npm sets every file's mtime in the published tarball to a fixed date (1985-10-26)
// https://github.com/npm/npm/issues/20439
// This is an NPM "feature" in order to have deterministic builds.
import {writeFileSync} from 'node:fs';

writeFileSync(
    'build-info.json',
    JSON.stringify({builtAt: new Date().toISOString().slice(0, 16)})
);