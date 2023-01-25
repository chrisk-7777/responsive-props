import { Stack } from './stack/stack';

import cn from './app.module.css';

export default function App() {
  return (
    <div>
      <Stack direction={{ base: 'column', lg: 'row' }}>
        <div className={cn.box}></div>
        <div className={cn.box}></div>
        <div className={cn.box}></div>
      </Stack>
    </div>
  );
}
