import express from 'express';
import multer from 'multer'
import * as path from "path";
import * as fs from "fs/promises";
import {unzip} from "./utils/unzip";
import {SharedState} from "./types";
import {Worker} from 'worker_threads'
import {fileURLToPath} from 'url'
import {Mutex} from "async-mutex";
// import {Mutex} from "async-mutex";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;


const upload = multer({dest: 'uploads/'});
const mutex = new Mutex();
app.post("/zip", upload.single('zip'), async (req, res) => {
    const startTime = performance.now();
    const requestId = Date.now().toString();

    const tempDir =  path.join(__dirname, '..', 'tmp')
    const extractDir = path.join(tempDir, requestId);
    const previewDir = path.join(__dirname, '..', 'previews', requestId);

    await fs.mkdir(extractDir, { recursive: true });
    await fs.mkdir(previewDir, { recursive: true });

    const state: SharedState = { processed: 0, skipped: 0 };

    try {
        await unzip(req.file!.path, extractDir);

        const files = await fs.readdir(extractDir);
        const workers = files.map((file) => {
            const filePath = path.join(extractDir, file);

            return new Promise<void>((resolve, reject) => {
                const worker = new Worker(path.join(__dirname, 'worker', 'thumbnail.js'), {
                    workerData: {
                        imagePath: filePath,
                        outputDir: previewDir
                    }
                });

                worker.on('message', async (msg: keyof SharedState) => {
                    if (msg === 'processed' || msg === 'skipped') {
                        await mutex.runExclusive(() => {
                            state[msg]++;
                        });
                    }
                });

                worker.on('exit', resolve);
                worker.on('error', reject);
            });
        });

        await Promise.allSettled(workers);

        const durationMs = performance.now() - startTime;

        await fs.rm(tempDir, { recursive: true, });

        res.json({
            processed: state.processed,
            skipped: state.skipped,
            durationMs: Math.round(durationMs),
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: (err as Error).message });
    }
})
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`))