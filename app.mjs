import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { glob } from 'glob';

const currentModuleUrl = new URL(import.meta.url);
const modulePath = fileURLToPath(currentModuleUrl);

(async () => {
    try {
        let year;
        if (process.argv[2]) year = `/${process.argv[2]}`;
        else year = '';

        let acc = 0;

        // With glob //
        const path = `stores${year}/**/*.json`;
        const allFiles = await glob(path);
        for (let file of allFiles) {
            const fileRead = await readFile(file);
            const jsonData = JSON.parse(fileRead);
            acc += jsonData.total;
        }

        // With readdir //

        // const path = `stores${year}`;
        // const allFiles = await readdir(path, { recursive: true, withFileTypes: true});
        // for (let file of allFiles) {
        //     if (file.isFile() && file.name.endsWith('.json')) {
        //         const fileRead = await readFile(`${file.parentPath}/${file.name}`);
        //             const jsonData = JSON.parse(fileRead);
        //             acc += jsonData.total;
        //     }
        // }

        const today = new Date().toLocaleDateString('fr-FR');
        const totalFile = await readFile('salesTotals/totals.txt', 'utf8');
        await writeFile('salesTotals/totals.txt', `${totalFile} \nTotal at ${today} from stores${year} : ${acc} €`);
        console.log('Data written to file, Total = ' + acc);
    } catch (err) {
        console.error(err);
    }
})();

// Run with node app.mjs 2023
