'use strict'
/*
 * hexo-renderer-ts v1.3.0
 * (c) 2018-2022 Opportunity
 * Released under the MIT License.
 * https://github.com/OpportunityLiu/hexo-renderer-ts
 */

if (hexo.theme.config.compatibility.useBuiltTsRenderer) {
  let __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
      for (let s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i]
        for (const p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) {
            t[p] = s[p]
          }
        }
      }
      return t
    }
    return __assign.apply(this, arguments)
  }
  exports.__esModule = true
  const ts = require('typescript')
  const os = require('os')
  const path = require('path')

  function reportDiagnostics (diagnostics) {
    if (!diagnostics) {
      return
    }
    diagnostics.forEach(function (diagnostic) {
      const message = ts.formatDiagnostic(diagnostic, {
        getCurrentDirectory: function () {
          return hexo.base_dir
        },
        getNewLine: function () {
          return os.EOL
        },
        getCanonicalFileName: function (fileName) {
          return path.normalize(fileName)
        }
      })
      hexo.log.error(message.trim())
    })
  }

  function getCompileOption (options) {
    let result
    const config = hexo && hexo.config && hexo.config.render && hexo.config.render.ts
    const defaultOptions = ts.getDefaultCompilerOptions()
    let fileOptions = null
    if (config) {
      if (typeof config === 'object') {
        result = ts.convertCompilerOptionsFromJson(config, hexo.base_dir)
        reportDiagnostics(result.errors)
        fileOptions = result.options
      } else {
        const file = hexo.base_dir + String(config)
        const json = require(file)
        result = ts.convertCompilerOptionsFromJson(json.compilerOptions, hexo.base_dir, String(config))
        reportDiagnostics(result.errors)
        fileOptions = result.options
      }
    }
    let argOptions = null
    if (options) {
      result = ts.convertCompilerOptionsFromJson(options, hexo.base_dir)
      reportDiagnostics(result.errors)
      argOptions = result.options
    }
    const mergedOptions = __assign(__assign(__assign({}, defaultOptions), fileOptions), argOptions)
    // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
    mergedOptions.suppressOutputPathCheck = true
    // Filename can be non-ts file.
    mergedOptions.allowNonTsExtensions = true
    // We are not doing a full typecheck, we are not resolving the whole context,
    // so pass --noResolve to avoid reporting missing file errors.
    mergedOptions.noResolve = true
    return mergedOptions
  }

  function tsRenderer (data, hexoOptions) {
    const options = getCompileOption(hexoOptions)
    // if jsx is specified then treat file as .tsx
    const inputFileName = data.path || (options.jsx ? 'module.tsx' : 'module.ts')
    const sourceFile = ts.createSourceFile(inputFileName, data.text, options.target)
    // Output
    let outputText
    let sourceMapText
    const defHost = ts.createCompilerHost(options)
    // Create a compilerHost object to allow the compiler to read and write files
    const compilerHost = __assign(__assign({}, defHost), {
      getSourceFile: function (fileName, langVersion, onError, shouldCreateNewSourceFile) {
        return fileName === path.normalize(inputFileName)
          ? sourceFile
          : defHost.getSourceFile(fileName, langVersion, onError, shouldCreateNewSourceFile)
      },
      writeFile: function (name, text) {
        if (path.extname(name) === '.map') {
          sourceMapText = text
        } else {
          outputText = text
        }
      },
      useCaseSensitiveFileNames: function () {
        return false
      },
      getCanonicalFileName: function (fileName) {
        return fileName
      },
      getCurrentDirectory: function () {
        return hexo.base_dir
      },
      fileExists: function (fileName) {
        return fileName === inputFileName || defHost.fileExists(fileName)
      }
    })
    const program = ts.createProgram([inputFileName], options, compilerHost)
    // Emit
    const emitResult = program.emit()
    const allDiagnostics = ts
      .getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics)
    reportDiagnostics(allDiagnostics)
    return outputText || ''
  }

  hexo.extend.renderer.register('ts', 'js', tsRenderer, true)
  hexo.extend.renderer.register('tsx', 'js', tsRenderer, true)
}
