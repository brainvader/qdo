import path from 'path'
import { readdir } from 'fs/promises';
import { Dirent } from 'fs'

export async function walk(dir: string, fileList: string[]): Promise<string[]> {
    const dirents: Dirent[] = await readdir(dir, { withFileTypes: true })

    for (const dirent of dirents) {
        const fullPath = path.join(dir, dirent.name)

        if (dirent.isDirectory()) {
            fileList = await walk(fullPath, fileList)
        } else {
            fileList = [...fileList, fullPath]
        }
    }
    return fileList
}
