import {
  DEFAULT_MODEL,
  DEFAULT_I_DONT_KNOW_MESSAGE,
  MARKPROMPT_COMPLETIONS_URL,
  type OpenAIModelId,
  submitPrompt,
} from '@markprompt/core';
import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type Ref, createRef, ref } from 'lit/directives/ref.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { until } from 'lit/directives/until.js';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

declare global {
  interface HTMLElementTagNameMap {
    'animated-caret': Caret;
    'markprompt-content': Markprompt;
  }
}

@customElement('markprompt-content')
export class Markprompt extends LitElement {
  @property({ type: String })
  model: OpenAIModelId = DEFAULT_MODEL;

  @property({ type: String })
  promptTemplate: string | undefined = undefined;

  @property({ type: String })
  iDontKnowMessage = DEFAULT_I_DONT_KNOW_MESSAGE;

  @property({ type: Boolean })
  showReferencesImmediatebly = true;

  @property({ type: String })
  completionsUrl = MARKPROMPT_COMPLETIONS_URL;

  @property({ type: String })
  projectKey = '';

  @property({ type: String })
  placeholder = 'Ask me anything…';

  @property({ type: Boolean })
  includeBranding = true;

  @property({ type: String })
  referencesHeading = 'Generated from the following sources:';

  @property({ type: String, state: true })
  prompt = '';

  @property({ type: Object })
  idToRefMap: Record<
    (typeof this.references)[number],
    { href: string; label: string }
  > = {};

  @property({ type: Boolean, state: true })
  loading = false;

  @property({ type: Boolean, state: true })
  shouldStopStreaming = false;

  @property({ type: String, state: true })
  answer = '';

  @property({ type: Array, state: true })
  references: string[] = [];

  controller = new AbortController();
  inputRef: Ref<HTMLInputElement> = createRef();
  resultRef: Ref<HTMLDivElement> = createRef();

  static styles = css`
    .root {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .input-container {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      gap: var(--input-container-gap, 0.5rem);
      border-style: var(--input-container-border-bottom-style, solid);
      border-top-width: 0;
      border-left-width: 0;
      border-right-width: 0;
      border-bottom-width: var(--input-container-border-bottom-width, 1px);
      border-color: var(--border-color, #e5e5e5);
      padding: var(--input-container-padding, 1rem);
      background-color: var(
        --input-container-background-color,
        var(--input-background-color, #fff)
      );
      height: var(--input-container-height, var(--input-height, 3rem));
    }

    .input-container svg {
      flex: none;
      height: var(--input-container-icon-size, 16px);
      width: var(--input-container-icon-size, 16px);
      color: var(--search-icon-color);
    }

    .prompt-form {
      flex-grow: 1;
      margin-block-end: 0;
    }

    .prompt-input {
      box-sizing: border-box;
      width: 100%;
      appearance: none;
      border-width: 0px;
      background-color: transparent;
      border-radius: var(--prompt-input-border-radius, 0.375em);
      padding: var(--prompt-input-padding, 4px);
      color: var(--text-color, #171717);
      font-size: var(--font-size-base, var(--text-size, 1rem));
    }

    .prompt-input::placeholder {
      color: var(--input-placeholder-color, #d4d4d4);
    }

    .prompt-input:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: 0 0 0 0 black;
    }

    .result {
      box-sizing: border-box;
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      max-width: 100%;
      scroll-behavior: smooth;
      background-color: var(--result-background-color, #f5f5f5);
      top: var(--input-container-height, var(--input-height, 3rem));
    }

    .result::-webkit-scrollbar {
      display: none;
    }

    .stacked-result {
      box-sizing: border-box;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .references-container {
      flex: none;
      box-sizing: border-box;
      overflow-y: auto;
      color: var(--references-container-color, #737373);
      border-top: 1px solid var(--border-color, #e5e5e5);
      line-height: var(--references-container-line-height, 1.25rem);
      padding-top: var(--references-container-padding, 1rem);
      padding-bottom: var(--references-container-padding, 1rem);
      font-size: var(--font-size-base, 1rem);
    }

    .references-heading {
      color: var(--text-color, #171717);
      font-size: var(
        --references-heading-font-size,
        var(--font-size-xs, 0.875rem)
      );
      padding-left: var(--references-container-padding, 1rem);
      padding-right: var(--references-container-padding, 1rem);
      font-weight: var(--references-heading-font-weight, 600);
      padding-bottom: var(--references-heading-padding-bottom, 0.75rem);
    }

    .references {
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      align-items: center;
      -ms-overflow-style: none;
      scrollbar-width: none;
      padding-left: var(--references-container-padding, 1rem);
      padding-right: var(--references-container-padding, 1rem);
      gap: var(--references-gap, 0.5em);
    }

    .references::-webkit-scrollbar {
      display: none;
    }

    .reference-item {
      text-decoration: none;
      transition-property: background-color, border-color, color, fill, stroke,
        opacity, box-shadow, transform;
      transition-duration: 200ms;
      white-space: nowrap;
      font-weight: var(--reference-item-font-weight, 600);
      padding-left: var(--reference-item-padding-x, 0.5em);
      padding-right: var(--reference-item-padding-x, 0.5em);
      padding-top: var(--reference-item-padding-y, 0.25em);
      padding-bottom: var(--reference-item-padding-y, 0.25em);
      border-radius: var(--reference-item-border-radius, 0.375em);
      background-color: var(--reference-item-background-color, #ffffff);
      border: 1px solid
        var(--reference-item-border-color, var(--border-color, #e5e5e5));
      color: var(--accent-color, #38bdf8);
      font-size: var(--reference-item-font-size, var(--font-size-base, 1rem));
    }

    .reference-item:hover {
      background-color: var(--reference-item-background-color-hover);
    }

    .branding {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      color: #a3a3a3;
      font-size: 12px;
      padding-left: var(--references-container-padding, 1rem);
      padding-right: var(--references-container-padding, 1rem);
      padding-top: 4px;
      padding-bottom: 12px;
    }

    .branding a {
      color: #a3a3a3;
    }

    .caret {
      color: var(--caret-color, #38bdf8);
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(var(--slide-up-translate-x, 16px));
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slide-up {
      animation-name: slide-up;
      animation-duration: 1s;
      animation-fill-mode: both;
      transition-timing-function: ease-in-out;
    }

    .answer {
      overflow-y: auto;
      box-sizing: border-box;
      flex-grow: 1 !important;
      padding: var(--answer-padding, 1rem);
      color: var(--text-color, #171717);
      font-size: var(--font-size-sm, 14px);
    }

    .answer p {
      margin-top: var(--answer-paragraph-margin, 1.25em);
      margin-bottom: var(--answer-paragraph-margin, 1.25em);
      font-size: var(--font-size-sm, 14px);
      line-height: var(--line-height-base, 1.5);
      color: var(--text-color, #171717);
    }

    .answer a {
      color: var(--link-color, #0ea5e9);
      font-weight: var(--link-weight, 600);
    }

    .answer img {
      max-width: 100%;
    }

    .answer pre {
      max-width: 100%;
      overflow-x: auto;
    }

    .answer :where(ol) {
      list-style-type: decimal;
      padding-left: var(--answer-list-padding-left, 1.625em);
    }

    .answer :where(ul) {
      list-style-type: disc;
      padding-left: var(--answer-list-padding-left, 1.625em);
    }

    .answer :where(ol > li)::marker {
      color: var(--answer-list-numbered-color, #404040);
    }

    .answer :where(ul > li)::marker {
      color: var(--answer-list-bullet-color, #d4d4d4);
    }

    .answer :where(li) {
      margin-top: var(--answer-list-padding-y, 14px);
      margin-bottom: var(--answer-list-padding-y, 14px);
      font-size: var(--font-size-sm, 14px);
      line-height: var(--line-height-base, 1.5);
    }

    .answer :where(hr) {
      border-top: 1px solid var(--border-color, #e5e5e5);
      border-bottom: 0px;
      margin-top: 3em;
      margin-bottom: 3em;
    }

    .answer :where(blockquote) {
      font-weight: 500;
      font-style: var(--answer-quote-font-style, italic);
      color: var(--text-color, #171717);
      border-left-style: solid;
      border-left-width: var(--answer-quote-border-left, 0.2rem);
      border-left-color: var(--answer-quote-border-color, #171717);
      margin-top: var(--answer-quote-margin-y: 1.5em);
      margin-bottom: var(--answer-quote-margin-y: 1.5em);
      padding-left: var(--answer-quote-padding-left, 1em);
      margin-block-start: 0;
      margin-block-end: 0;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }

    .answer :where(h1) {
      color: var(--text-color, #171717);
      font-weight: 800;
      line-height: 1.1111111;
      font-size: var(--answer-heading1-font-size, 2.25em);
      margin-top: var(--answer-heading1-margin-top, 0);
      margin-bottom: var(--answer-heading1-margin-bottom, 0.8888889em);
    }

    .answer :where(h2) {
      font-weight: 700;
      line-height: 1.3333333;
      color: var(--text-color, #171717);
      font-size: var(--answer-heading2-font-size, 1.5em);
      margin-top: var(--answer-heading2-margin-top, 2em);
      margin-bottom: var(--answer-heading2-margin-bottom, 1em);
    }

    .answer :where(h3) {
      font-weight: 600;
      line-height: 1.6;
      color: var(--text-color, #171717);
      font-size: var(--answer-heading3-font-size, 1.25em);
      margin-top: var(--answer-heading3-margin-top, 1.6em);
      margin-bottom: var(--answer-heading3-margin-bottom, 0.6em);
    }

    .answer :where(h4) {
      font-weight: 600;
      line-height: 1.5;
      color: var(--text-color, #171717);
      margin-top: var(--answer-heading4-margin-top, 1.5em);
      margin-bottom: var(--answer-heading4-margin-bottom, 0.5em);
    }

    .answer :where(img) {
      margin-top: var(--answer-image-margin-y, 1em);
      margin-bottom: var(--answer-image-margin-y, 1em);
      border-radius: var(--answer-image-border-radius, 0.375em);
    }

    .answer :where(code) {
      color: var(--text-color, #171717);
      font-weight: 600;
      font-size: var(--font-size-sm, 14px);
      border: 1px solid var(--border-color, #e5e5e5);
      border-radius: var(--answer-code-border-radius, 0.25em);
      padding-left: var(--answer-code-padding-x, 4px);
      padding-right: var(--answer-code-padding-x, 4px);
      padding-top: var(--answer-code-padding-y, 2px);
      padding-bottom: var(--answer-code-padding-y, 2px);
      background-color: var(--answer-code-background-color, #f1f5f9);
    }

    .answer :where(pre) {
      overflow-x: auto;
      font-weight: 400;
      line-height: var(--answer-pre-line-height, 1.5);
      margin-top: var(--answer-pre-margin-y, 1em);
      margin-bottom: var(--answer-pre-margin-y, 1em);
      padding: var(--answer-pre-padding, 1em);
      color: var(--answer-pre-text-color, #f8fafc);
      background-color: var(--answer-pre-background-color, #0f172a);
      border-radius: var(--answer-pre-border-radius, 0.375em);
      font-size: var(--font-size-sm, 14px);
    }

    .answer :where(pre code) {
      background-color: transparent;
      border-width: 0;
      border-radius: 0;
      padding: 0;
      font-weight: inherit;
      color: inherit;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
    }

    .answer :where(table) {
      width: 100%;
      table-layout: auto;
      border-collapse: collapse;
      text-align: left;
      margin-top: var(--answer-table-margin-y, 1em);
      margin-bottom: var(--answer-table-margin-y, 1em);
      font-size: var(--font-size-sm, 16px);
      line-height: var(--line-height-base, 1.5);
    }

    .answer :where(thead) {
      border-bottom-style: solid;
      border-bottom-width: 1px;
      border-bottom-color: var(--border-color, #d4d4d4);
    }

    .answer :where(thead th) {
      color: var(--text-color, #171717);
      font-weight: 600;
      vertical-align: bottom;
      padding: var(--answer-table-head-padding, 0.5em);
    }

    .answer :where(tbody tr) {
      border-bottom-style: solid;
      border-bottom-width: 0.5px;
      border-bottom-color: var(--border-color, #e5e5e5);
    }

    .answer :where(tbody tr:last-child) {
      border-bottom-width: 0;
    }

    .answer :where(tbody td) {
      vertical-align: baseline;
      padding: var(--answer-table-head-padding, 0.5em);
    }

    .answer :where(thead th:first-child) {
      padding-left: 0;
    }

    .answer :where(thead th:last-child) {
      padding-right: 0;
    }

    .answer :where(tbody td:first-child) {
      padding-left: 0;
    }

    .answer :where(tbody td:last-child) {
      padding-right: 0;
    }
  `;

  disconnectedCallback() {
    super.disconnectedCallback();
    // abort requests on removal from DOM
    this.controller.abort();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.prompt = input.value;
  }

  scrollToBottom() {
    const results = this.resultRef.value;
    if (!results) return;
    results.scrollTop = results.scrollHeight;
  }

  getRefFromId(id: string) {
    const href = id.replace(/.md(x|oc)?$/, '');
    const label = id.split('/').slice(-1)[0].split('.').slice(0, -1).join('.');
    return { href, label };
  }

  reset() {
    const input = this.inputRef.value;
    if (input) {
      input.value = '';
    }
    this.prompt = '';
    this.answer = '';
    this.references = [];
    this.loading = false;
    this.shouldStopStreaming = true;
  }

  focus() {
    this.inputRef.value?.focus();
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    if (this.prompt === '') return;

    this.answer = '';
    this.references = [];
    this.loading = true;
    this.shouldStopStreaming = false;

    await submitPrompt(
      this.prompt,
      this.projectKey,
      (chunk) => {
        if (this.shouldStopStreaming) {
          return false;
        }
        this.answer += chunk;
        setTimeout(() => this.scrollToBottom(), 50);
        return true;
      },
      (references) => {
        this.references = references;
        setTimeout(() => this.scrollToBottom(), 50);
      },
      (error) => {
        console.error(error);
      },
      {
        model: this.model,
        iDontKnowMessage: this.iDontKnowMessage,
        completionsUrl: this.completionsUrl,
        signal: this.controller.signal,
        ...(this.promptTemplate ? { promptTemplate: this.promptTemplate } : {}),
      },
    );

    this.loading = false;
  }

  async renderMarkdown(markdown: string) {
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(markdown);

    if (typeof file.value !== 'string') {
      return '';
    }

    return unsafeHTML(file.value);
  }

  render() {
    const shouldShowReferences =
      this.references.length > 0 &&
      ((!this.loading && this.answer.length > 0) ||
        this.showReferencesImmediatebly);

    return html`
      <div class="root">
        <div class="input-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd"
            />
          </svg>

          <form class="prompt-form" @submit="${this.onSubmit}">
            <input
              ${ref(this.inputRef)}
              class="prompt-input"
              type="text"
              name="prompt"
              @input="${this.onInput}"
              placeholder="${this.placeholder}"
              value="${this.prompt}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              autofocus
            />
          </form>
        </div>
        <div class="result">
          <div class="stacked-result">
            <div class="answer" ${ref(this.resultRef)}>
              ${this.loading && !(this.answer.length > 0)
                ? html`<animated-caret class="caret"></animated-caret>`
                : nothing}
              ${until(this.renderMarkdown(this.answer), nothing)}
              ${this.loading && this.answer.length > 0
                ? html`<animated-caret class="caret"></animated-caret>`
                : nothing}
            </div>
            ${shouldShowReferences
              ? html`
                  <div class="references-container">
                    <div class="animate-slide-up">
                      <div class="references-heading">
                        ${this.referencesHeading}
                      </div>
                      <div class="references">
                        ${this.references.map((reference) => {
                          let refInfo = this.idToRefMap
                            ? this.idToRefMap[reference]
                            : undefined;
                          if (!refInfo) {
                            refInfo = this.getRefFromId(reference);
                          }
                          if (refInfo && refInfo.href) {
                            return html`<a
                              href="${refInfo.href}"
                              class="reference-item"
                            >
                              ${refInfo.label || reference}</a
                            >`;
                          }
                          return html`<div class="reference-item">
                            ${reference}
                          </div>`;
                        })}
                      </div>
                    </div>
                  </div>
                `
              : nothing}
            ${this.includeBranding
              ? html` <div class="branding">
                  <span>AI powered by</span>
                  <a href="https://markprompt.com">Markprompt</a>
                </div>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

@customElement('animated-caret')
export class Caret extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: 8px;
      height: 15px;
      background-color: currentColor;
      animation: blink 1s infinite;
      transform: matrix(1, 0, 0, 1, 2, 2);
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, currentColor 0px 0px 3px 0px;
      border-radius: 1px;
    }

    @keyframes blink {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `;

  render() {
    return html`<span></span>`;
  }
}
