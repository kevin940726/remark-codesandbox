import remark from 'remark';
import html from 'remark-html';
import codesandbox from 'remark-codesandbox';
import markdown from './index.md';
import 'github-markdown-css';
import './styles.css';

remark()
  .use(codesandbox, {
    mode: 'button',
    customTemplates: {
      reaviz: {
        extends: 'qr0pk',
        entry: 'src/App.js',
      },
    },
  })
  .use(html)
  .process(markdown)
  .then(({ contents }) => {
    document.getElementById('contents').innerHTML = contents;
  });
