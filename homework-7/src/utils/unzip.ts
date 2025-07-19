import AdmZip from 'adm-zip';
import * as fs from "fs/promises";
export const unzip = async(zipPath: string, dest: string): Promise<void> => {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(dest);

    await fs.unlink(zipPath)
}