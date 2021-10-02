export interface QuizProps {
    quiz: string
}

export default function Quiz({ quiz }: QuizProps) {
    return (
        <div dangerouslySetInnerHTML={{ __html: quiz }}></div>
    )
}
