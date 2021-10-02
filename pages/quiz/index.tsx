import { GetStaticPropsContext, GetStaticPropsResult } from 'next'


interface QuizListProps {
    quizzes: string[]
}

// Display All Quizzes like alphabetical order
export default function QuizList({ quizzes }: QuizListProps) {
    return (
        <ul>
            {
                quizzes.map((i, quiz) => <div key={i}>{quiz}</div>)
            }
        </ul >
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<QuizListProps>> {
    return {
        props: {
            quizzes: [
                "React",
                "Unity",
                "C#",
                "TypeScript",
                "Algorithm"
            ]
        }
    }
}