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


export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {

  // Read data source
  const dataDir = path.resolve(process.cwd(), '..', 'data')
  const dataFiename = path.resolve(dataDir, "sample.html")
  const dataPath = path.resolve(dataDir, dataFiename)
  const data = fs.readFileSync(dataPath, 'utf8');


  const domTree = await JSDOM.fromFile(dataPath)
  const document = domTree.window.document

  // Get meta data
  const metas = document.getElementsByTagName('meta')
  const keyword = getKeywords(metas)


  // Get math string
  const mathNode = document.querySelector('.math')!
  mathNode.innerHTML = renderMath(mathNode.textContent!)

  // Highlight code
  const jsdom = new JSDOM()
  const domParser = new jsdom.window.DOMParser()
  const highlighter = await shiki.getHighlighter({ theme: 'monokai' })
  const codeNode = document.querySelector('.code code')!
  const sourceCode = codeNode.textContent!
  const doc = domParser.parseFromString(highlighter.codeToHtml(sourceCode, 'rust'), 'text/html')!
  codeNode.parentNode!.replaceChild(doc.body!.firstChild!, codeNode)

  return {
    props: {
      post: domTree.serialize()
    },
  }
}