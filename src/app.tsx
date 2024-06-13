import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
const el = (
  <>
    <h2>Hello from React!</h2>
    <h1 className='text-3xl font-bold underline'>Hello world Tailwind!</h1>
  </>
);
root.render(el);
