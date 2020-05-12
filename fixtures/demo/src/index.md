# `remark-codesandbox` demo

The below code block will have a codesandbox button.

```jsx codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root'),
);
```

Let's create another one! Now with the `vanilla` (Parcel) template, with additional query params.

```js codesandbox=vanilla?previewwindow=console
console.log('Hello remark-codesandbox!');
```

We can even create custom templates. Here's an example with `reaviz` custom template. You can find the config in `index.js`.

```jsx codesandbox=reaviz
import React from 'react';
import { PieChart } from 'reaviz';

export const data = [
  {
    key: 'Phishing Attack',
    data: 10,
  },
  {
    key: 'IDS',
    data: 14,
  },
  {
    key: 'Malware',
    data: 5,
  },
  {
    key: 'DLP',
    data: 18,
  },
];

export default () => (
  <div style={{ margin: '55px', textAlign: 'center' }}>
    <PieChart width={250} height={250} data={data} />
  </div>
);
```

Looks cool? Try it yourself! You can try editing this file or change the configuration in `index.js`. For example, try changing the mode in `index.js` to `iframe` and see the magic!
