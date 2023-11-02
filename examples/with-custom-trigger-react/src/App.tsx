import '@markprompt/css';

import { Markprompt, openMarkprompt } from '@markprompt/react';
import { ReactElement } from 'react';

import styles from './App.module.css';

function App(): ReactElement {
  return (
    <div className={styles.app}>
      <div className={styles.centered}>
        <p>Open the Markprompt dialog ⬇️</p>
        <Markprompt
          projectKey={import.meta.env.VITE_PROJECT_API_KEY}
          trigger={{ customElement: true }}
        />
        <button className={styles.customTrigger} onClick={openMarkprompt}>
          Open Markprompt
        </button>
      </div>
    </div>
  );
}

export default App;
