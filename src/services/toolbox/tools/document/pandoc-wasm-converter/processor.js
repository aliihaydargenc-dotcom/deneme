/**
 * Pandoc WASM Processor
 * Browser-safe document conversion wrapper.
 */

import workerUrl from './worker.js?worker&url';
import pandocWasmUrl from './pandoc.wasm?url';

const MIME_TYPES = {
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    md: 'text/markdown;charset=utf-8',
    html: 'text/html;charset=utf-8',
    rtf: 'application/rtf',
    csv: 'text/csv;charset=utf-8',
    tsv: 'text/tab-separated-values;charset=utf-8',
    json: 'application/json;charset=utf-8',
    rst: 'text/plain;charset=utf-8',
    epub: 'application/epub+zip',
    odt: 'application/vnd.oasis.opendocument.text',
    docbook: 'application/xml;charset=utf-8',
    txt: 'text/plain;charset=utf-8',
};

const UNSUPPORTED_BINARY_INPUTS = {
    '.pdf': 'PDF files are binary documents and cannot be read by Pandoc in this converter. Use the dedicated PDF tools instead.',
    '.doc': 'Legacy .doc files are not supported by Pandoc. Please save the file as .docx first.',
};

class PandocWasmProcessor {
    constructor() {
        this.wasm = null;
        this.wasmLoading = null;
    }

    async ensureWasmLoaded(signal) {
        if (this.wasm) return;
        if (!this.wasmLoading) {
            this.wasmLoading = (async () => {
                try {
                    const response = await fetch(pandocWasmUrl, {
                        priority: 'low',
                        signal,
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to fetch Pandoc WASM: ${response.status} ${response.statusText}`);
                    }
                    const buffer = await response.arrayBuffer();
                    this.wasm = buffer;
                    return buffer;
                } catch (err) {
                    this.wasmLoading = null;
                    throw err;
                }
            })();
        }
        await this.wasmLoading;
    }

    getExtension(filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        return ext ? `.${ext}` : '';
    }

    async convert(file, outputFormat) {
        const fromExt = this.getExtension(file.name);
        const outputExt = String(outputFormat || '').toLowerCase().replace(/^\./, '');

        if (UNSUPPORTED_BINARY_INPUTS[fromExt]) {
            throw new Error(UNSUPPORTED_BINARY_INPUTS[fromExt]);
        }

        if (!outputExt) {
            throw new Error('No output format selected.');
        }

        if (outputExt === 'doc') {
            throw new Error('Legacy .doc output is not supported. Please use DOCX instead.');
        }

        await this.ensureWasmLoaded();

        return new Promise((resolve, reject) => {
            const worker = new Worker(workerUrl, { type: 'module' });

            const cleanup = () => {
                clearTimeout(timeout);
                worker.removeEventListener('message', handleMessage);
                worker.removeEventListener('error', handleError);
                worker.terminate();
            };

            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error('Conversion timeout after 30s'));
            }, 30000);

            const handleMessage = (event) => {
                const { type, output, error, isZip, errorKind } = event.data;

                if (type === 'loaded') {
                    worker.postMessage({
                        type: 'convert',
                        to: outputExt,
                        input: {
                            file,
                            name: file.name,
                            from: fromExt,
                            to: outputExt,
                        },
                        id: file.name,
                    });
                    return;
                }

                if (type === 'finished') {
                    cleanup();

                    const baseName = file.name.replace(/\.[^/.]+$/, '');
                    const ext = isZip ? 'zip' : outputExt;
                    const newFileName = `${baseName}.${ext}`;
                    const mimeType = isZip ? 'application/zip' : (MIME_TYPES[ext] || 'application/octet-stream');
                    const blob = new Blob([output], { type: mimeType });
                    const convertedFile = new File([blob], newFileName, { type: mimeType });

                    resolve({
                        file: convertedFile,
                        blob,
                        originalSize: file.size,
                        convertedSize: blob.size,
                        format: ext.toUpperCase(),
                    });
                    return;
                }

                if (type === 'error') {
                    cleanup();

                    let errMsg = typeof error === 'string' ? error : (error?.message || 'Conversion failed');
                    if (errorKind === 'PandocUnknownReaderError') {
                        errMsg = `${fromExt || file.name} is not a supported input format for document conversion.`;
                    } else if (errorKind === 'PandocUnknownWriterError') {
                        errMsg = `${outputExt} is not a supported output format for document conversion.`;
                    } else if (errorKind === 'PandocParseError' && errMsg.includes('JSON missing pandoc-api-version')) {
                        errMsg = 'This JSON file is not Pandoc JSON and cannot be converted with this engine.';
                    }

                    reject(new Error(errMsg));
                }
            };

            const handleError = (err) => {
                cleanup();
                reject(err instanceof Error ? err : new Error(String(err)));
            };

            worker.addEventListener('message', handleMessage);
            worker.addEventListener('error', handleError);

            worker.postMessage({
                type: 'load',
                wasm: this.wasm,
                id: file.name,
            });
        });
    }

    async preload(signal) {
        await this.ensureWasmLoaded(signal);
    }
}

const processor = new PandocWasmProcessor();

export default {
    convert: (...args) => processor.convert(...args),
    preload: (signal) => processor.preload(signal),
    terminate: () => {},
};
