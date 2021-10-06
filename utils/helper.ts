import path from 'path'
import { readdir, readFile } from 'fs/promises';
import { Dirent, PathLike } from 'fs'

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

// Pair path to file with its content
export type Quiz = {
    slug: string,
    content: string
}

// Read quiz string in a html format
export async function readQuiz(filePath: string): Promise<Quiz> {
    const quiz = await readFile(filePath, { encoding: "utf-8" })

    return {
        slug: filePath,
        content: quiz
    }
}
