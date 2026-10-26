/* eslint-disable n/no-sync */
// n/no-sync : Node loads a required file synchronously, so the compiler hook cannot be async

// deps

    // natives
    const { existsSync, readFileSync } = require("node:fs");
    const Module = require("node:module");
    const { dirname, relative, resolve } = require("node:path");

    // externals
    const ts = require("typescript");

// consts

    const SOURCE = resolve(__dirname, "..", "lib", "src");
    const EXTENSIONS = [ ".ts", ".cts" ];

// private

    function _fromSource (filename) {

        const fromSource = relative(SOURCE, filename);

        return "" !== fromSource && !fromSource.startsWith("..");

    }

    function _compiled (filename) {

        const result = ts.transpileModule(readFileSync(filename, "utf8"), {
            "fileName": filename,
            "reportDiagnostics": true,
            "compilerOptions": {
                "alwaysStrict": true,
                "esModuleInterop": true,
                "inlineSourceMap": true,
                "inlineSources": true,
                "module": ts.ModuleKind.CommonJS,
                "target": ts.ScriptTarget.ES2024
            }
        });
        const diagnostics = result.diagnostics || [];
        const errors = diagnostics.filter((item) => {

            return item.category === ts.DiagnosticCategory.Error;

        });

        if (0 < errors.length) {

            const message = errors.map((item) => {

                return ts.flattenDiagnosticMessageText(item.messageText, "\n");

            }).join("\n");

            throw new Error(filename + "\n" + message);

        }

        return result.outputText;

    }

    function _candidate (request, parentFilename) {

        if (!request.startsWith(".")) {
            return "";
        }

        const base = resolve(dirname(parentFilename), request);

        if (existsSync(base)) {
            return base;
        }

        const found = EXTENSIONS.find((ext) => {

            return existsSync(base + ext);

        });

        return found ? base + found : "";

    }

    function _load (module, filename) {

        module._compile(_compiled(filename), filename);

    }

// module

    const resolveFilename = Module._resolveFilename;

    Module._extensions[".ts"] = _load;
    Module._extensions[".cts"] = _load;
    Module._resolveFilename = function _resolveFilename (request, parent, ...rest) {

        try {
            return resolveFilename.call(this, request, parent, ...rest);
        }
        catch (err) {

            const parentFilename = parent && parent.filename;
            const candidate = parentFilename && _fromSource(parentFilename) ? _candidate(request, parentFilename) : "";

            if ("" === candidate) {
                throw err;
            }

            return candidate;

        }

    };
