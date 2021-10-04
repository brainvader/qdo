import path from 'path'

import { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { walk, readQuiz, Quiz } from '../../utils/helper'

interface QuizListProps {
    quizzes: Quiz[]
}

// Display All Quizzes like alphabetical order
export default function QuizList({ quizzes }: QuizListProps) {
    return (
        <ul>
            {
                quizzes.map((quiz, i) => <div key={i}>{quiz.path}</div>)
            }
        </ul >
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<QuizListProps>> {
    // construct path to directory that contains quiz files
    const quizDir = path.join(process.cwd(), 'quiz')

    // get a list of all pathes to quiz files
    const files: string[] = await walk(quizDir, [])

    // read content from quiz files
    const quizzes: Quiz[] = []
    for (const file of files) {
        const quiz = await readQuiz(file)
        quizzes.push(quiz)
    }

    return {
        props: {
            quizzes: quizzes
        }
    }
}