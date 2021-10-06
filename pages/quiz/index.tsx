import path from 'path'

import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Link from 'next/link'

import { walk, readQuiz, Quiz } from '../../utils/helper'

interface QuizListProps {
    quizzes: Quiz[]
}

// Display All items like index
export default function QuizList({ quizzes }: QuizListProps) {
    return (
        <ul>
            {
                quizzes.map((quiz, i) => {
                    const slug = quiz.slug
                    const base = path.parse(slug).dir
                    const categoryPath = path.relative('/quiz/', slug)
                    const category = path.parse(categoryPath).dir
                    // quiz.html => quiz
                    const indexHeading = path.parse(slug).name

                    return (
                        <li key={i}>
                            < Link href={path.join(base, indexHeading)}>
                                <a>{`${indexHeading} [${category}]`}</a>
                            </Link >
                        </li>
                    )
                })
            }
        </ul >
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<QuizListProps>> {
    // construct path to directory that contains quiz files
    const quizDir = path.join('.', 'quiz')
    console.log(process.cwd());


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