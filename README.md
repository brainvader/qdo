# Qdo

Quiz style tuts, tips, and notes

## 描画の流れ

データソースとしてHTMLファイルを使う.

1. getStaticPropsでHTMLファイルを読み込む
2. JSDomあたりでパース
3. [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)で表示する.

2でkatexやshikiでのレンダリングを実行し置き換える. 必要ならJSONに変換しコンポーネントに渡す.

## ブログとしてのQdo

SSGの機能を利用して静的HTMLを出力する. 

```json
"ssg": "next build && next export"
```

この時Katexによる数式の描画やshikiによるコード・ハイライトが実行される.

## WebアプリとしてのQdo

簡単なクイズアプリとして実行する. rust側で操作するべきか?

TODO: [env-cmd](https://www.npmjs.com/package/env-cmd)を調べる


## References

- [How to use diferent .env files with nextjs?](https://stackoverflow.com/questions/59462614/how-to-use-diferent-env-files-with-nextjs/61750672#61750672)