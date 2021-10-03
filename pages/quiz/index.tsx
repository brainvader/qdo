import path from 'path'

import { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { walk } from '../../utils/helper'

interface QuizListProps {
    quizzes: string[]
}

// Display All Quizzes like alphabetical order
export default function QuizList({ quizzes }: QuizListProps) {
    return (
        <ul>
            {
                quizzes.map((quiz, i) => <div key={i}>{quiz}</div>)
            }
        </ul >
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<QuizListProps>> {
    const quizDir = path.join(process.cwd(), 'quiz')
    const fileList: string[] = await walk(quizDir, [])

    return {
        props: {
            quizzes: fileList
        }
    }
}