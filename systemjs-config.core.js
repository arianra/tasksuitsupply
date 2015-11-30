"use strict";
System.config({
  baseURL: ".",
  defaultJSExtensions: true,
  transpiler: "typescript",
  typescriptOptions: {
    "module": "system",
    "target": "es5",
    "sourceMap": true,
    "removeComments": true
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "src/core": {
      "main": "core",
      "format": "register",
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        }
      }
    }
  },

  map: {
    "ts": "github:frankwallis/plugin-typescript@2.2.2",
    "typescript": "npm:typescript@1.6.2",
    "github:frankwallis/plugin-typescript@2.2.2": {
      "typescript": "npm:typescript@1.6.2"
    }
  }
})
