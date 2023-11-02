import Layout from '@theme/Layout';
import { ReactElement } from 'react';

import styles from './index.module.css';

export default function Home(): ReactElement {
  return (
    <Layout description="A demo showing Markprompt + Algolia in Docusaurus">
      <main className={styles.main}>
        <h1>Markprompt + Algolia demo</h1>
        <p>
          This is the demo of the{' '}
          <code>@markprompt/docusaurus-theme-search</code> plugin.
        </p>
        <p>Click the button at the bottom right to open Markprompt.</p>
      </main>
    </Layout>
  );
}
