import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import * as shiki from 'shiki'
import { GetStaticPropsResult, GetStaticPropsContext } from 'next'

import { getTags, nonNullNode, renderMath } from '../utils/qdo-dom'

export default function Home({ post }: HomeProps) {
  return (
    <div dangerouslySetInnerHTML={{ __html: post }}></div>
  )
}


interface HomeProps {
  post: string
}

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
  const tags = getTags(metas);


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
        const lang = element.getAttribute('lang')!
        const mathString = highlighter.codeToHtml(sourceCode, lang)
        const doc = domParser.parseFromString(mathString, 'text/html')!
        element.parentNode!.replaceChild(doc.body!.firstChild!, element)
      }
    })


  return {
    props: {
      post: domTree.serialize()
    },
  }
}