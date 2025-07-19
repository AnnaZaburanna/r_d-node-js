import {SharedState} from "../types";
import * as path from "path";
import sharp from "sharp";
import {workerData, parentPort} from 'worker_threads'

interface WorkerData {
    imagePath: string;
    outputDir: string;
    state: SharedState;
}

(async () => {
    const { imagePath, outputDir } = workerData as WorkerData;

    try {
        const outputFile = path.join(outputDir, path.basename(imagePath));
        const image = sharp(imagePath);

        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height) {
            parentPort?.postMessage('skipped');
            return;
        }

        await image
            .resize(150)
            .toFile(outputFile);

        parentPort?.postMessage('processed');
    } catch (err) {
        console.error('Worker error:', err);
        parentPort?.postMessage('skipped');
    }
})();