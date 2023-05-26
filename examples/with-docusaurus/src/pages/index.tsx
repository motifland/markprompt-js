import Layout from '@theme/Layout';
import React, { ReactElement } from 'react';

import styles from './index.module.css';

export default function Home(): ReactElement {
  return (
    <Layout description="A demo showing Markprompt in Docusaurus">
      <main className={styles.main}>
        <h1>Markprompt demo</h1>
        <p>
          This is the demo for <code>@markprompt/docusaurus-theme-search</code>.
        </p>
        <p>Click the button on the bottom right to open a Markprompt dialog.</p>
      </main>
    </Layout>
  );
}
