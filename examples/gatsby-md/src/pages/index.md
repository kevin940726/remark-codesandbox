---
path: '/'
---

# Hello remark-codesandbox

The below code block will have a **Edit on CodeSandbox** button.

```jsx codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root')
);
```

This one will render a React component custom template.

```jsx codesandbox=react-component
import React from 'react';

export default function App() {
  return <h1>Hello remark-codesandbox!</h1>;
}
```
