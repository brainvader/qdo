import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import katex from 'katex'
import * as shiki from 'shiki'
import { GetStaticPropsResult, GetStaticPropsContext } from 'next'

export default function Home({ post }: HomeProps) {
  return (
    <div dangerouslySetInnerHTML={{ __html: post }}></div>
  )
}

// get keywords in meta tag
function getKeywords(metaData: HTMLCollectionOf<HTMLMetaElement>): string[] {
  const metaValues = Object.values(metaData);
  const keywords = metaValues.find((meta) => meta.name === "keywords");
  return keywords!.content.split(",");
}

function renderMath(math_string: string): string {
  return katex.renderToString(math_string, {
    displayMode: true,
    output: 'mathml',
    throwOnError: false
  })
}

interface HomeProps {
  post: string
}

// Check non null
const nonNullNode = (element: Element | null): boolean => !!element;

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {

  // Read data source
  const dataDir = path.resolve(process.cwd(), 'quiz', 'qdo')
  const dataFiename = path.resolve(dataDir, "index.html")
  const dataPath = path.resolve(dataDir, dataFiename)
  const data = fs.readFileSync(dataPath, 'utf8');


  const domTree = await JSDOM.fromFile(dataPath)
  const document = domTree.window.document

  // Get meta data
  const metas = document.getElementsByTagName('meta')
  const keyword = getKeywords(metas)


  // Get math string
  const mathNodes = document.querySelectorAll('.math');
  Array.from(mathNodes)
    .filter(nonNullNode)
    .map(element => {
      if (element.textContent !== null) {
        const katexMath = renderMath(element.textContent)
        element.innerHTML = katexMath
      }
    })

  // Highlight code
  const jsdom = new JSDOM()
  const domParser = new jsdom.window.DOMParser()
  const highlighter = await shiki.getHighlighter({ theme: 'monokai' })
  const codeNodes = document.querySelectorAll('.code code')
  Array.from(codeNodes)
    .filter(nonNullNode)
    .map(element => {
      if (element.textContent !== null) {
        const sourceCode = element.textContent
        // TODO: Fix hard code rust: should give the language name dynamically
        const doc = domParser.parseFromString(highlighter.codeToHtml(sourceCode, 'rust'), 'text/html')!
        element.parentNode!.replaceChild(doc.body!.firstChild!, element)
      }
    })


  return {
    props: {
      post: domTree.serialize()
    },
  }
}