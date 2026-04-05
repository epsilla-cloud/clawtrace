import{i as e,n as t}from"./lit-zdTgzAJI.js";import{t as n}from"./preload-helper-xBbMyY7u.js";import{l as r}from"./format-Cbj45nru.js";import{A as i,C as a,D as o,E as s,M as c,S as l,T as u,_ as d,a as f,b as p,f as m,g as h,h as g,j as _,k as v,m as y,n as b,p as x,r as S,t as C,v as w,w as T,x as E,y as D}from"./index-D7mg1IkY.js";import{r as O}from"./channel-config-extras-DNCeHtEf.js";import{i as k,n as A,r as j,t as M}from"./skills-shared-DJsJP4-4.js";function N(n){let{agent:r,configForm:i,agentFilesList:o,configLoading:s,configSaving:c,configDirty:u,onConfigReload:d,onConfigSave:f,onModelChange:m,onModelFallbacksChange:h,onSelectPanel:g}=n,_=p(i,r.id),v=(o&&o.agentId===r.id?o.workspace:null)||_.entry?.workspace||_.defaults?.workspace||`default`,b=_.entry?.model?l(_.entry?.model):l(_.defaults?.model),x=l(_.defaults?.model),S=a(_.entry?.model),C=a(_.defaults?.model)||(x===`-`?null:w(x)),T=S??C??null,O=E(_.entry?.model)??[],k=Array.isArray(_.entry?.skills)?_.entry?.skills:null,A=k?.length??null,j=!!(n.defaultId&&r.id===n.defaultId),M=!i||s||c,N=e=>{let t=O.filter((t,n)=>n!==e);h(r.id,t)};return e`
    <section class="card">
      <div class="card-title">Overview</div>
      <div class="card-sub">Workspace paths and identity metadata.</div>

      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div>
            <button
              type="button"
              class="workspace-link mono"
              @click=${()=>g(`files`)}
              title="Open Files tab"
            >
              ${v}
            </button>
          </div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${b}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${k?`${A} selected`:`all skills`}</div>
        </div>
      </div>

      ${u?e`
            <div class="callout warn" style="margin-top: 16px">
              You have unsaved config changes.
            </div>
          `:t}

      <div class="agent-model-select" style="margin-top: 20px;">
        <div class="label">Model Selection</div>
        <div class="agent-model-fields">
          <label class="field">
            <span>Primary model${j?` (default)`:``}</span>
            <select
              .value=${j?T??``:S??``}
              ?disabled=${M}
              @change=${e=>m(r.id,e.target.value||null)}
            >
              ${j?e` <option value="">Not set</option> `:e`
                    <option value="">
                      ${C?`Inherit default (${C})`:`Inherit default`}
                    </option>
                  `}
              ${y(i,T??void 0,n.modelCatalog)}
            </select>
          </label>
          <div class="field">
            <span>Fallbacks</span>
            <div
              class="agent-chip-input"
              @click=${e=>{let t=e.currentTarget.querySelector(`input`);t&&t.focus()}}
            >
              ${O.map((t,n)=>e`
                  <span class="chip">
                    ${t}
                    <button
                      type="button"
                      class="chip-remove"
                      ?disabled=${M}
                      @click=${()=>N(n)}
                    >
                      &times;
                    </button>
                  </span>
                `)}
              <input
                ?disabled=${M}
                placeholder=${O.length===0?`provider/model`:``}
                @keydown=${e=>{let t=e.target;if(e.key===`Enter`||e.key===`,`){e.preventDefault();let n=D(t.value);n.length>0&&(h(r.id,[...O,...n]),t.value=``)}}}
                @blur=${e=>{let t=e.target,n=D(t.value);n.length>0&&(h(r.id,[...O,...n]),t.value=``)}}
              />
            </div>
          </div>
        </div>
        <div class="agent-model-actions">
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${s}
            @click=${d}
          >
            Reload Config
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${c||!u}
            @click=${f}
          >
            ${c?`Saving…`:`Save`}
          </button>
        </div>
      </div>
    </section>
  `}var ee=Object.defineProperty,te=(e,t,n)=>t in e?ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,P=(e,t,n)=>te(e,typeof t==`symbol`?t:t+``,n),F={classPrefix:`cm-`,theme:`github`,linkTarget:`_blank`,sanitize:!1,plugins:[],customRenderers:{}};function I(e){return{...F,...e,plugins:e?.plugins??[],customRenderers:e?.customRenderers??{}}}function L(e,t){return typeof t==`function`?t(e):e}function R(e,t){let n=I(t),r=n.classPrefix,i=e;for(let e of n.plugins)e.transformBlock&&(i=i.map(e.transformBlock));let a=`<div class="${r}preview">${i.map(e=>{for(let t of n.plugins)if(t.renderBlock){let r=t.renderBlock(e,()=>z(e,n));if(r!==null)return r}let t=n.customRenderers[e.type];return t?t(e):z(e,n)}).join(`
`)}</div>`;return a=L(a,n.sanitize),a}async function ne(e,t){let n=I(t);for(let e of n.plugins)e.init&&await e.init();let r=R(e,t);for(let e of n.plugins)e.postProcess&&(r=await e.postProcess(r));return r}function z(e,t){let n=t.classPrefix;switch(e.type){case`paragraph`:return`<p class="${n}paragraph">${J(e.content,t)}</p>`;case`heading`:return B(e,t);case`bulletList`:return V(e,t);case`numberedList`:return H(e,t);case`checkList`:return U(e,t);case`codeBlock`:return W(e,t);case`blockquote`:return`<blockquote class="${n}blockquote">${J(e.content,t)}</blockquote>`;case`table`:return G(e,t);case`image`:return K(e,t);case`divider`:return`<hr class="${n}divider" />`;case`callout`:return q(e,t);default:return`<div class="${n}unknown">${J(e.content,t)}</div>`}}function B(e,t){let n=t.classPrefix,r=e.props.level,i=`h${r}`;return`<${i} class="${n}heading ${n}h${r}">${J(e.content,t)}</${i}>`}function V(e,t){return`<ul class="${t.classPrefix}bullet-list">
${e.children.map(e=>`<li>${J(e.content,t)}</li>`).join(`
`)}
</ul>`}function H(e,t){return`<ol class="${t.classPrefix}numbered-list">
${e.children.map(e=>`<li>${J(e.content,t)}</li>`).join(`
`)}
</ol>`}function U(e,t){let n=t.classPrefix,r=e.props.checked;return`
<div class="${n}checklist-item">
  <input type="checkbox" ${r?`checked disabled`:`disabled`} />
  <span class="${r?`${n}checked`:``}">${J(e.content,t)}</span>
</div>`.trim()}function W(e,t){let n=t.classPrefix,r=e.content.map(e=>e.text).join(``),i=e.props.language||``,a=X(r),o=i?` language-${i}`:``;return`<pre class="${n}code-block"${i?` data-language="${i}"`:``}><code class="${n}code${o}">${a}</code></pre>`}function G(e,t){let n=t.classPrefix,{headers:r,rows:i,alignments:a}=e.props,o=e=>{let t=a?.[e];return t?` style="text-align: ${t}"`:``};return`<table class="${n}table">
${r.length>0?`<thead><tr>${r.map((e,t)=>`<th${o(t)}>${X(e)}</th>`).join(``)}</tr></thead>`:``}
<tbody>
${i.map(e=>`<tr>${e.map((e,t)=>`<td${o(t)}>${X(e)}</td>`).join(``)}</tr>`).join(`
`)}
</tbody>
</table>`}function K(e,t){let n=t.classPrefix,{url:r,alt:i,title:a,width:o,height:s}=e.props,c=i?` alt="${X(i)}"`:` alt=""`,l=a?` title="${X(a)}"`:``,u=o?` width="${o}"`:``,d=s?` height="${s}"`:``;return`<figure class="${n}image">${`<img src="${X(r)}"${c}${l}${u}${d} />`}${i?`<figcaption>${X(i)}</figcaption>`:``}</figure>`}function q(e,t){let n=t.classPrefix,r=e.props.type;return`
<div class="${n}callout ${n}callout-${r}" role="alert">
  <strong class="${n}callout-title">${r}</strong>
  <div class="${n}callout-content">${J(e.content,t)}</div>
</div>`.trim()}function J(e,t){return e.map(e=>Y(e,t)).join(``)}function Y(e,t){let n=X(e.text),r=e.styles;if(r.code&&(n=`<code>${n}</code>`),r.highlight&&(n=`<mark>${n}</mark>`),r.strikethrough&&(n=`<del>${n}</del>`),r.underline&&(n=`<u>${n}</u>`),r.italic&&(n=`<em>${n}</em>`),r.bold&&(n=`<strong>${n}</strong>`),r.link){let e=t.linkTarget===`_blank`?` target="_blank" rel="noopener noreferrer"`:``,i=r.link.title?` title="${X(r.link.title)}"`:``;n=`<a href="${X(r.link.url)}"${i}${e}>${n}</a>`}return n}function X(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function Z(e){return[...[1,2,3,4,5,6].map(t=>({tag:`h${t}`,classes:[`${e}heading`,`${e}h${t}`]})),{tag:`p`,classes:[`${e}paragraph`]},{tag:`ul`,classes:[`${e}bullet-list`]},{tag:`ol`,classes:[`${e}numbered-list`]},{tag:`pre`,classes:[`${e}code-block`]},{tag:`blockquote`,classes:[`${e}blockquote`]},{tag:`hr`,classes:[`${e}divider`]},{tag:`table`,classes:[`${e}table`]},{tag:`figure`,classes:[`${e}image`]}]}function re(e,t){let n=t.join(` `),r=/\bclass\s*=\s*"([^"]*)"/i,i=e.match(r);return i?e.replace(r,`class="${n} ${i[1]}"`):e.endsWith(`/>`)?e.slice(0,-2)+` class="${n}" />`:e.slice(0,-1)+` class="${n}">`}function ie(e,t){return e.replace(/(?<!<figure[^>]*>\s*)(<img\s[^>]*\/?>)(?!\s*<\/figure>)/gi,`<figure class="${t}image">$1</figure>`)}function Q(e,t){let n=t?.classPrefix??`cm-`,r=t?.wrapperClass??`${n}preview`,i=Z(n),a=e;for(let{tag:e,classes:t}of i){let n=RegExp(`<${e}(\\s[^>]*)?>|<${e}\\s*\\/?>`,`gi`);a=a.replace(n,e=>re(e,t))}return a=ie(a,n),a=`<div class="${r}">${a}</div>`,typeof t?.sanitize==`function`&&(a=t.sanitize(a)),a}async function ae(e){try{return(await n(()=>import(`./dist-D8DZLmCF.js`),[],import.meta.url)).parse(e)}catch{throw Error(`@create-markdown/core is required to parse markdown in <markdown-preview>. Install it, or provide pre-parsed blocks via the blocks attribute / setBlocks().`)}}P(class extends HTMLElement{constructor(){super(),P(this,`_shadow`,null),P(this,`plugins`,[]),P(this,`defaultTheme`,`github`),P(this,`styleElement`),P(this,`contentElement`);let e=this.constructor._shadowMode;e!==`none`&&(this._shadow=this.attachShadow({mode:e})),this.styleElement=document.createElement(`style`),this.renderRoot.appendChild(this.styleElement),this.contentElement=document.createElement(`div`),this.contentElement.className=`markdown-preview-content`,this.renderRoot.appendChild(this.contentElement),this.updateStyles()}static get observedAttributes(){return[`theme`,`link-target`,`async`]}get renderRoot(){return this._shadow??this}connectedCallback(){this.render()}attributeChangedCallback(e,t,n){this.render()}setPlugins(e){this.plugins=e,this.render()}setDefaultTheme(e){this.defaultTheme=e,this.render()}getMarkdown(){let e=this.getAttribute(`blocks`);if(e)try{return JSON.parse(e).map(e=>e.content.map(e=>e.text).join(``)).join(`

`)}catch{return``}return this.textContent||``}setMarkdown(e){this.textContent=e,this.render()}setBlocks(e){this.setAttribute(`blocks`,JSON.stringify(e)),this.render()}getOptions(){return{theme:this.getAttribute(`theme`)||this.defaultTheme,linkTarget:this.getAttribute(`link-target`)||`_blank`,plugins:this.plugins}}async getBlocks(){let e=this.getAttribute(`blocks`);if(e)try{return JSON.parse(e)}catch{return console.warn(`Invalid blocks JSON in markdown-preview element`),[]}return ae(this.textContent||``)}async render(){let e=await this.getBlocks(),t=this.getOptions(),n=this.hasAttribute(`async`)||this.plugins.length>0;try{let r;r=n?await ne(e,t):R(e,t),this.contentElement.innerHTML=r}catch(e){console.error(`Error rendering markdown preview:`,e),this.contentElement.innerHTML=`<div class="error">Error rendering content</div>`}}updateStyles(){let e=this.plugins.filter(e=>e.getCSS).map(e=>e.getCSS()).join(`

`),t=this._shadow?`:host { display: block; }`:`markdown-preview { display: block; }`;this.styleElement.textContent=`
${t}

.markdown-preview-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

.error {
  color: #cf222e;
  padding: 1rem;
  background: #ffebe9;
  border-radius: 6px;
}

${e}
    `.trim()}},`_shadowMode`,`open`);function $(t,n,r){return e`
    <section class="card">
      <div class="card-title">Agent Context</div>
      <div class="card-sub">${n}</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div>
            <button
              type="button"
              class="workspace-link mono"
              @click=${()=>r(`files`)}
              title="Open Files tab"
            >
              ${t.workspace}
            </button>
          </div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${t.model}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Name</div>
          <div>${t.identityName}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Avatar</div>
          <div>${t.identityAvatar}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${t.skillsLabel}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Default</div>
          <div>${t.isDefault?`yes`:`no`}</div>
        </div>
      </div>
    </section>
  `}function oe(e,t){let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function se(e){if(!e)return[];let t=new Set;for(let n of e.channelOrder??[])t.add(n);for(let n of e.channelMeta??[])t.add(n.id);for(let n of Object.keys(e.channelAccounts??{}))t.add(n);let n=[],r=e.channelOrder?.length?e.channelOrder:Array.from(t);for(let e of r)t.has(e)&&(n.push(e),t.delete(e));for(let e of t)n.push(e);return n.map(t=>({id:t,label:oe(e,t),accounts:e.channelAccounts?.[t]??[]}))}var ce=[`groupPolicy`,`streamMode`,`dmPolicy`];function le(e){let t=0,n=0,r=0;for(let i of e){let e=i.probe&&typeof i.probe==`object`&&`ok`in i.probe?!!i.probe.ok:!1;(i.connected===!0||i.running===!0||e)&&(t+=1),i.configured&&(n+=1),i.enabled&&(r+=1)}return{total:e.length,connected:t,configured:n,enabled:r}}function ue(n){let i=se(n.snapshot),a=n.lastSuccess?r(n.lastSuccess):`never`;return e`
    <section class="grid grid-cols-2">
      ${$(n.context,`Workspace, identity, and model configuration.`,n.onSelectPanel)}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Channels</div>
            <div class="card-sub">Gateway-wide channel status snapshot.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${n.loading} @click=${n.onRefresh}>
            ${n.loading?`Refreshing…`:`Refresh`}
          </button>
        </div>
        <div class="muted" style="margin-top: 8px;">Last refresh: ${a}</div>
        ${n.error?e`<div class="callout danger" style="margin-top: 12px;">${n.error}</div>`:t}
        ${n.snapshot?t:e`
              <div class="callout info" style="margin-top: 12px">
                Load channels to see live status.
              </div>
            `}
        ${i.length===0?e` <div class="muted" style="margin-top: 16px">No channels found.</div> `:e`
              <div class="list" style="margin-top: 16px;">
                ${i.map(r=>{let i=le(r.accounts),a=i.total?`${i.connected}/${i.total} connected`:`no accounts`,o=i.configured?`${i.configured} configured`:`not configured`,s=i.total?`${i.enabled} enabled`:`disabled`,c=O({configForm:n.configForm,channelId:r.id,fields:ce});return e`
                    <div class="list-item">
                      <div class="list-main">
                        <div class="list-title">${r.label}</div>
                        <div class="list-sub mono">${r.id}</div>
                      </div>
                      <div class="list-meta">
                        <div>${a}</div>
                        <div>${o}</div>
                        <div>${s}</div>
                        ${i.configured===0?e`
                              <div>
                                <a
                                  href="https://docs.openclaw.ai/channels"
                                  target="_blank"
                                  rel="noopener"
                                  style="color: var(--accent); font-size: 12px"
                                  >Setup guide</a
                                >
                              </div>
                            `:t}
                        ${c.length>0?c.map(t=>e`<div>${t.label}: ${t.value}</div>`):t}
                      </div>
                    </div>
                  `})}
              </div>
            `}
      </section>
    </section>
  `}function de(n){let r=n.jobs.filter(e=>e.agentId===n.agentId);return e`
    <section class="grid grid-cols-2">
      ${$(n.context,`Workspace and scheduling targets.`,n.onSelectPanel)}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Scheduler</div>
            <div class="card-sub">Gateway cron status.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${n.loading} @click=${n.onRefresh}>
            ${n.loading?`Refreshing…`:`Refresh`}
          </button>
        </div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Enabled</div>
            <div class="stat-value">
              ${n.status?n.status.enabled?`Yes`:`No`:`n/a`}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Jobs</div>
            <div class="stat-value">${n.status?.jobs??`n/a`}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Next wake</div>
            <div class="stat-value">${f(n.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        ${n.error?e`<div class="callout danger" style="margin-top: 12px;">${n.error}</div>`:t}
      </section>
    </section>
    <section class="card">
      <div class="card-title">Agent Cron Jobs</div>
      <div class="card-sub">Scheduled jobs targeting this agent.</div>
      ${r.length===0?e` <div class="muted" style="margin-top: 16px">No jobs assigned.</div> `:e`
            <div class="list" style="margin-top: 16px;">
              ${r.map(r=>e`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${r.name}</div>
                      ${r.description?e`<div class="list-sub">${r.description}</div>`:t}
                      <div class="chip-row" style="margin-top: 6px;">
                        <span class="chip">${b(r)}</span>
                        <span class="chip ${r.enabled?`chip-ok`:`chip-warn`}">
                          ${r.enabled?`enabled`:`disabled`}
                        </span>
                        <span class="chip">${r.sessionTarget}</span>
                      </div>
                    </div>
                    <div class="list-meta">
                      <div class="mono">${S(r)}</div>
                      <div class="muted">${C(r)}</div>
                      <button
                        class="btn btn--sm"
                        style="margin-top: 6px;"
                        ?disabled=${!r.enabled}
                        @click=${()=>n.onRunNow(r.id)}
                      >
                        Run Now
                      </button>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function fe(n){let r=n.agentFilesList?.agentId===n.agentId?n.agentFilesList:null,a=r?.files??[],o=n.agentFileActive??null,s=o?a.find(e=>e.name===o)??null:null,l=o?n.agentFileContents[o]??``:``,u=o?n.agentFileDrafts[o]??l:``,d=o?u!==l:!1;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Core Files</div>
          <div class="card-sub">Bootstrap persona, identity, and tool guidance.</div>
        </div>
        <button
          class="btn btn--sm"
          ?disabled=${n.agentFilesLoading}
          @click=${()=>n.onLoadFiles(n.agentId)}
        >
          ${n.agentFilesLoading?`Loading…`:`Refresh`}
        </button>
      </div>
      ${r?e`<div class="muted mono" style="margin-top: 8px;">
            Workspace: <span>${r.workspace}</span>
          </div>`:t}
      ${n.agentFilesError?e`<div class="callout danger" style="margin-top: 12px;">
            ${n.agentFilesError}
          </div>`:t}
      ${r?a.length===0?e` <div class="muted" style="margin-top: 16px">No files found.</div> `:e`
              <div class="agent-tabs" style="margin-top: 14px;">
                ${a.map(r=>{let i=o===r.name,a=r.name.replace(/\.md$/i,``);return e`
                    <button
                      class="agent-tab ${i?`active`:``} ${r.missing?`agent-tab--missing`:``}"
                      @click=${()=>n.onSelectFile(r.name)}
                    >
                      ${a}${r.missing?e` <span class="agent-tab-badge">missing</span> `:t}
                    </button>
                  `})}
              </div>
              ${s?e`
                    <div class="agent-file-header" style="margin-top: 14px;">
                      <div>
                        <div class="agent-file-sub mono">${s.path}</div>
                      </div>
                      <div class="agent-file-actions">
                        <button
                          class="btn btn--sm"
                          title="Preview rendered markdown"
                          @click=${e=>{let t=e.currentTarget.closest(`.card`)?.querySelector(`dialog`);t&&t.showModal()}}
                        >
                          ${_.eye} Preview
                        </button>
                        <button
                          class="btn btn--sm"
                          ?disabled=${!d}
                          @click=${()=>n.onFileReset(s.name)}
                        >
                          Reset
                        </button>
                        <button
                          class="btn btn--sm primary"
                          ?disabled=${n.agentFileSaving||!d}
                          @click=${()=>n.onFileSave(s.name)}
                        >
                          ${n.agentFileSaving?`Saving…`:`Save`}
                        </button>
                      </div>
                    </div>
                    ${s.missing?e`
                          <div class="callout info" style="margin-top: 10px">
                            This file is missing. Saving will create it in the agent workspace.
                          </div>
                        `:t}
                    <label class="field agent-file-field" style="margin-top: 12px;">
                      <span>Content</span>
                      <textarea
                        class="agent-file-textarea"
                        .value=${u}
                        @input=${e=>n.onFileDraftChange(s.name,e.target.value)}
                      ></textarea>
                    </label>
                    <dialog
                      class="md-preview-dialog"
                      @click=${e=>{let t=e.currentTarget;e.target===t&&t.close()}}
                      @close=${e=>{e.currentTarget.querySelector(`.md-preview-dialog__panel`)?.classList.remove(`fullscreen`)}}
                    >
                      <div class="md-preview-dialog__panel">
                        <div class="md-preview-dialog__header">
                          <div class="md-preview-dialog__title mono">${s.name}</div>
                          <div class="md-preview-dialog__actions">
                            <button
                              class="btn btn--sm md-preview-expand-btn"
                              title="Toggle fullscreen"
                              @click=${e=>{let t=e.currentTarget,n=t.closest(`.md-preview-dialog__panel`);if(!n)return;let r=n.classList.toggle(`fullscreen`);t.classList.toggle(`is-fullscreen`,r)}}
                            >
                              <span class="when-normal">${_.maximize} Expand</span
                              ><span class="when-fullscreen">${_.minimize} Collapse</span>
                            </button>
                            <button
                              class="btn btn--sm"
                              title="Edit file"
                              @click=${e=>{e.currentTarget.closest(`dialog`)?.close(),document.querySelector(`.agent-file-textarea`)?.focus()}}
                            >
                              ${_.edit} Editor
                            </button>
                            <button
                              class="btn btn--sm"
                              @click=${e=>{e.currentTarget.closest(`dialog`)?.close()}}
                            >
                              ${_.x} Close
                            </button>
                          </div>
                        </div>
                        <div class="md-preview-dialog__body">
                          ${c(Q(v.parse(u,{gfm:!0,breaks:!0}),{sanitize:e=>i.sanitize(e)}))}
                        </div>
                      </div>
                    </dialog>
                  `:e` <div class="muted" style="margin-top: 16px">Select a file to edit.</div> `}
            `:e`
            <div class="callout info" style="margin-top: 12px">
              Load the agent workspace files to edit core instructions.
            </div>
          `}
    </section>
  `}function pe(n,r){let i=r.source??n.source,a=r.pluginId??n.pluginId,o=[];return i===`plugin`&&a?o.push(`plugin:${a}`):i===`core`&&o.push(`core`),r.optional&&o.push(`optional`),o.length===0?t:e`
    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;">
      ${o.map(t=>e`<span class="agent-pill">${t}</span>`)}
    </div>
  `}function me(e){return e.source===`plugin`?e.pluginId?`Connected: ${e.pluginId}`:`Connected`:e.source===`channel`?e.channelId?`Channel: ${e.channelId}`:`Channel`:`Built-in`}function he(n){let r=p(n.configForm,n.agentId),i=r.entry?.tools??{},a=r.globalTools??{},c=i.profile??a.profile??`full`,l=u(n.toolsCatalogResult),d=s(n.toolsCatalogResult),f=i.profile?`agent override`:a.profile?`global default`:`default`,m=Array.isArray(i.allow)&&i.allow.length>0,_=Array.isArray(a.allow)&&a.allow.length>0,v=!!n.configForm&&!n.configLoading&&!n.configSaving&&!m&&!(n.toolsCatalogLoading&&!n.toolsCatalogResult&&!n.toolsCatalogError),y=m?[]:Array.isArray(i.alsoAllow)?i.alsoAllow:[],b=m?[]:Array.isArray(i.deny)?i.deny:[],x=m?{allow:i.allow??[],deny:i.deny??[]}:T(c)??void 0,S=d.flatMap(e=>e.tools.map(e=>e.id)),C=e=>{let t=g(e,x),n=h(e,y),r=h(e,b);return{allowed:(t||n)&&!r,baseAllowed:t,denied:r}},w=S.filter(e=>C(e).allowed).length,E=(e,t)=>{let r=new Set(y.map(e=>o(e)).filter(e=>e.length>0)),i=new Set(b.map(e=>o(e)).filter(e=>e.length>0)),a=C(e).baseAllowed,s=o(e);t?(i.delete(s),a||r.add(s)):(r.delete(s),i.add(s)),n.onOverridesChange(n.agentId,[...r],[...i])},D=e=>{let t=new Set(y.map(e=>o(e)).filter(e=>e.length>0)),r=new Set(b.map(e=>o(e)).filter(e=>e.length>0));for(let n of S){let i=C(n).baseAllowed,a=o(n);e?(r.delete(a),i||t.add(a)):(t.delete(a),r.add(a))}n.onOverridesChange(n.agentId,[...t],[...r])};return e`
    <section class="card">
      <div class="row" style="justify-content: space-between; flex-wrap: wrap;">
        <div style="min-width: 0;">
          <div class="card-title">Tool Access</div>
          <div class="card-sub">
            Profile + per-tool overrides for this agent.
            <span class="mono">${w}/${S.length}</span> enabled.
          </div>
        </div>
        <div class="row" style="gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm" ?disabled=${!v} @click=${()=>D(!0)}>
            Enable All
          </button>
          <button class="btn btn--sm" ?disabled=${!v} @click=${()=>D(!1)}>
            Disable All
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${n.configLoading}
            @click=${n.onConfigReload}
          >
            Reload Config
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${n.configSaving||!n.configDirty}
            @click=${n.onConfigSave}
          >
            ${n.configSaving?`Saving…`:`Save`}
          </button>
        </div>
      </div>

      ${n.configForm?t:e`
            <div class="callout info" style="margin-top: 12px">
              Load the gateway config to adjust tool profiles.
            </div>
          `}
      ${m?e`
            <div class="callout info" style="margin-top: 12px">
              This agent is using an explicit allowlist in config. Tool overrides are managed in the
              Config tab.
            </div>
          `:t}
      ${_?e`
            <div class="callout info" style="margin-top: 12px">
              Global tools.allow is set. Agent overrides cannot enable tools that are globally
              blocked.
            </div>
          `:t}
      ${n.toolsCatalogLoading&&!n.toolsCatalogResult&&!n.toolsCatalogError?e`
            <div class="callout info" style="margin-top: 12px">Loading runtime tool catalog…</div>
          `:t}
      ${n.toolsCatalogError?e`
            <div class="callout info" style="margin-top: 12px">
              Could not load runtime tool catalog. Showing built-in fallback list instead.
            </div>
          `:t}

      <div class="agent-tools-meta" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Profile</div>
          <div class="mono">${c}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Source</div>
          <div>${f}</div>
        </div>
        ${n.configDirty?e`
              <div class="agent-kv">
                <div class="label">Status</div>
                <div class="mono">unsaved</div>
              </div>
            `:t}
      </div>

      <div style="margin-top: 18px;">
        <div class="label">Available Right Now</div>
        <div class="card-sub">
          What this agent can use in the current chat session.
          <span class="mono">${n.runtimeSessionKey||`no session`}</span>
        </div>
        ${n.runtimeSessionMatchesSelectedAgent?n.toolsEffectiveLoading&&!n.toolsEffectiveResult&&!n.toolsEffectiveError?e`
                <div class="callout info" style="margin-top: 12px">Loading available tools…</div>
              `:n.toolsEffectiveError?e`
                  <div class="callout info" style="margin-top: 12px">
                    Could not load available tools for this session.
                  </div>
                `:(n.toolsEffectiveResult?.groups?.length??0)===0?e`
                    <div class="callout info" style="margin-top: 12px">
                      No tools are available for this session right now.
                    </div>
                  `:e`
                    <div class="agent-tools-grid" style="margin-top: 16px;">
                      ${n.toolsEffectiveResult?.groups.map(t=>e`
                          <div class="agent-tools-section">
                            <div class="agent-tools-header">${t.label}</div>
                            <div class="agent-tools-list">
                              ${t.tools.map(t=>e`
                                  <div class="agent-tool-row">
                                    <div>
                                      <div class="agent-tool-title">${t.label}</div>
                                      <div class="agent-tool-sub">${t.description}</div>
                                      <div
                                        style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;"
                                      >
                                        <span class="agent-pill"
                                          >${me(t)}</span
                                        >
                                      </div>
                                    </div>
                                  </div>
                                `)}
                            </div>
                          </div>
                        `)}
                    </div>
                  `:e`
              <div class="callout info" style="margin-top: 12px">
                Switch chat to this agent to view its live runtime tools.
              </div>
            `}
      </div>

      <div class="agent-tools-presets" style="margin-top: 16px;">
        <div class="label">Quick Presets</div>
        <div class="agent-tools-buttons">
          ${l.map(t=>e`
              <button
                class="btn btn--sm ${c===t.id?`active`:``}"
                ?disabled=${!v}
                @click=${()=>n.onProfileChange(n.agentId,t.id,!0)}
              >
                ${t.label}
              </button>
            `)}
          <button
            class="btn btn--sm"
            ?disabled=${!v}
            @click=${()=>n.onProfileChange(n.agentId,null,!1)}
          >
            Inherit
          </button>
        </div>
      </div>

      <div class="agent-tools-grid" style="margin-top: 20px;">
        ${d.map(n=>e`
            <div class="agent-tools-section">
              <div class="agent-tools-header">
                ${n.label}
                ${n.source===`plugin`&&n.pluginId?e`<span class="agent-pill" style="margin-left: 8px;"
                      >plugin:${n.pluginId}</span
                    >`:t}
              </div>
              <div class="agent-tools-list">
                ${n.tools.map(t=>{let{allowed:r}=C(t.id);return e`
                    <div class="agent-tool-row">
                      <div>
                        <div class="agent-tool-title mono">${t.label}</div>
                        <div class="agent-tool-sub">${t.description}</div>
                        ${pe(n,t)}
                      </div>
                      <label class="cfg-toggle">
                        <input
                          type="checkbox"
                          .checked=${r}
                          ?disabled=${!v}
                          @change=${e=>E(t.id,e.target.checked)}
                        />
                        <span class="cfg-toggle__track"></span>
                      </label>
                    </div>
                  `})}
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function ge(n){let r=!!n.configForm&&!n.configLoading&&!n.configSaving,i=p(n.configForm,n.agentId),a=Array.isArray(i.entry?.skills)?i.entry?.skills:void 0,o=new Set((a??[]).map(e=>e.trim()).filter(Boolean)),s=a!==void 0,c=!!(n.report&&n.activeAgentId===n.agentId),l=c?n.report?.skills??[]:[],u=n.filter.trim().toLowerCase(),d=u?l.filter(e=>[e.name,e.description,e.source].join(` `).toLowerCase().includes(u)):l,f=k(d),m=s?l.filter(e=>o.has(e.name)).length:l.length,h=l.length;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between; flex-wrap: wrap;">
        <div style="min-width: 0;">
          <div class="card-title">Skills</div>
          <div class="card-sub">
            Per-agent skill allowlist and workspace skills.
            ${h>0?e`<span class="mono">${m}/${h}</span>`:t}
          </div>
        </div>
        <div class="row" style="gap: 8px; flex-wrap: wrap;">
          <div
            class="row"
            style="gap: 4px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 2px;"
          >
            <button
              class="btn btn--sm"
              ?disabled=${!r}
              @click=${()=>n.onClear(n.agentId)}
            >
              Enable All
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!r}
              @click=${()=>n.onDisableAll(n.agentId)}
            >
              Disable All
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!r||!s}
              @click=${()=>n.onClear(n.agentId)}
              title="Remove per-agent allowlist and use all skills"
            >
              Reset
            </button>
          </div>
          <button
            class="btn btn--sm"
            ?disabled=${n.configLoading}
            @click=${n.onConfigReload}
          >
            Reload Config
          </button>
          <button class="btn btn--sm" ?disabled=${n.loading} @click=${n.onRefresh}>
            ${n.loading?`Loading…`:`Refresh`}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${n.configSaving||!n.configDirty}
            @click=${n.onConfigSave}
          >
            ${n.configSaving?`Saving…`:`Save`}
          </button>
        </div>
      </div>

      ${n.configForm?t:e`
            <div class="callout info" style="margin-top: 12px">
              Load the gateway config to set per-agent skills.
            </div>
          `}
      ${s?e`
            <div class="callout info" style="margin-top: 12px">
              This agent uses a custom skill allowlist.
            </div>
          `:e`
            <div class="callout info" style="margin-top: 12px">
              All skills are enabled. Disabling any skill will create a per-agent allowlist.
            </div>
          `}
      ${!c&&!n.loading?e`
            <div class="callout info" style="margin-top: 12px">
              Load skills for this agent to view workspace-specific entries.
            </div>
          `:t}
      ${n.error?e`<div class="callout danger" style="margin-top: 12px;">${n.error}</div>`:t}

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${n.filter}
            @input=${e=>n.onFilterChange(e.target.value)}
            placeholder="Search skills"
            autocomplete="off"
            name="agent-skills-filter"
          />
        </label>
        <div class="muted">${d.length} shown</div>
      </div>

      ${d.length===0?e` <div class="muted" style="margin-top: 16px">No skills found.</div> `:e`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${f.map(e=>_e(e,{agentId:n.agentId,allowSet:o,usingAllowlist:s,editable:r,onToggle:n.onToggle}))}
            </div>
          `}
    </section>
  `}function _e(t,n){return e`
    <details class="agent-skills-group" ?open=${!(t.id===`workspace`||t.id===`built-in`)}>
      <summary class="agent-skills-header">
        <span>${t.label}</span>
        <span class="muted">${t.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${t.skills.map(e=>ve(e,{agentId:n.agentId,allowSet:n.allowSet,usingAllowlist:n.usingAllowlist,editable:n.editable,onToggle:n.onToggle}))}
      </div>
    </details>
  `}function ve(n,r){let i=r.usingAllowlist?r.allowSet.has(n.name):!0,a=M(n),o=A(n);return e`
    <div class="list-item agent-skill-row">
      <div class="list-main">
        <div class="list-title">${n.emoji?`${n.emoji} `:``}${n.name}</div>
        <div class="list-sub">${n.description}</div>
        ${j({skill:n})}
        ${a.length>0?e`<div class="muted" style="margin-top: 6px;">Missing: ${a.join(`, `)}</div>`:t}
        ${o.length>0?e`<div class="muted" style="margin-top: 6px;">Reason: ${o.join(`, `)}</div>`:t}
      </div>
      <div class="list-meta">
        <label class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${i}
            ?disabled=${!r.editable}
            @change=${e=>r.onToggle(r.agentId,n.name,e.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </label>
      </div>
    </div>
  `}function ye(n){let r=n.agentsList?.agents??[],i=n.agentsList?.defaultId??null,a=n.selectedAgentId??i??r[0]?.id??null,o=a?r.find(e=>e.id===a)??null:null,s=a&&n.agentSkills.agentId===a?n.agentSkills.report?.skills?.length??null:null,c=n.channels.snapshot?Object.keys(n.channels.snapshot.channelAccounts??{}).length:null,l=a?n.cron.jobs.filter(e=>e.agentId===a).length:null,u={files:n.agentFiles.list?.files?.length??null,skills:s,channels:c,cron:l||null};return e`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          <div class="agents-control-select">
            <select
              class="agents-select"
              .value=${a??``}
              ?disabled=${n.loading||r.length===0}
              @change=${e=>n.onSelectAgent(e.target.value)}
            >
              ${r.length===0?e` <option value="">No agents</option> `:r.map(t=>e`
                      <option value=${t.id} ?selected=${t.id===a}>
                        ${d(t)}${m(t.id,i)?` (${m(t.id,i)})`:``}
                      </option>
                    `)}
            </select>
          </div>
          <div class="agents-toolbar-actions">
            ${o?e`
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    @click=${()=>void navigator.clipboard.writeText(o.id)}
                    title="Copy agent ID to clipboard"
                  >
                    Copy ID
                  </button>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    ?disabled=${!!(i&&o.id===i)}
                    @click=${()=>n.onSetDefault(o.id)}
                    title=${i&&o.id===i?`Already the default agent`:`Set as the default agent`}
                  >
                    ${i&&o.id===i?`Default`:`Set Default`}
                  </button>
                `:t}
            <button
              class="btn btn--sm agents-refresh-btn"
              ?disabled=${n.loading}
              @click=${n.onRefresh}
            >
              ${n.loading?`Loading…`:`Refresh`}
            </button>
          </div>
        </div>
        ${n.error?e`<div class="callout danger" style="margin-top: 8px;">${n.error}</div>`:t}
      </section>
      <section class="agents-main">
        ${o?e`
              ${be(n.activePanel,e=>n.onSelectPanel(e),u)}
              ${n.activePanel===`overview`?N({agent:o,basePath:n.basePath,defaultId:i,configForm:n.config.form,agentFilesList:n.agentFiles.list,agentIdentity:n.agentIdentityById[o.id]??null,agentIdentityError:n.agentIdentityError,agentIdentityLoading:n.agentIdentityLoading,configLoading:n.config.loading,configSaving:n.config.saving,configDirty:n.config.dirty,modelCatalog:n.modelCatalog,onConfigReload:n.onConfigReload,onConfigSave:n.onConfigSave,onModelChange:n.onModelChange,onModelFallbacksChange:n.onModelFallbacksChange,onSelectPanel:n.onSelectPanel}):t}
              ${n.activePanel===`files`?fe({agentId:o.id,agentFilesList:n.agentFiles.list,agentFilesLoading:n.agentFiles.loading,agentFilesError:n.agentFiles.error,agentFileActive:n.agentFiles.active,agentFileContents:n.agentFiles.contents,agentFileDrafts:n.agentFiles.drafts,agentFileSaving:n.agentFiles.saving,onLoadFiles:n.onLoadFiles,onSelectFile:n.onSelectFile,onFileDraftChange:n.onFileDraftChange,onFileReset:n.onFileReset,onFileSave:n.onFileSave}):t}
              ${n.activePanel===`tools`?he({agentId:o.id,configForm:n.config.form,configLoading:n.config.loading,configSaving:n.config.saving,configDirty:n.config.dirty,toolsCatalogLoading:n.toolsCatalog.loading,toolsCatalogError:n.toolsCatalog.error,toolsCatalogResult:n.toolsCatalog.result,toolsEffectiveLoading:n.toolsEffective.loading,toolsEffectiveError:n.toolsEffective.error,toolsEffectiveResult:n.toolsEffective.result,runtimeSessionKey:n.runtimeSessionKey,runtimeSessionMatchesSelectedAgent:n.runtimeSessionMatchesSelectedAgent,onProfileChange:n.onToolsProfileChange,onOverridesChange:n.onToolsOverridesChange,onConfigReload:n.onConfigReload,onConfigSave:n.onConfigSave}):t}
              ${n.activePanel===`skills`?ge({agentId:o.id,report:n.agentSkills.report,loading:n.agentSkills.loading,error:n.agentSkills.error,activeAgentId:n.agentSkills.agentId,configForm:n.config.form,configLoading:n.config.loading,configSaving:n.config.saving,configDirty:n.config.dirty,filter:n.agentSkills.filter,onFilterChange:n.onSkillsFilterChange,onRefresh:n.onSkillsRefresh,onToggle:n.onAgentSkillToggle,onClear:n.onAgentSkillsClear,onDisableAll:n.onAgentSkillsDisableAll,onConfigReload:n.onConfigReload,onConfigSave:n.onConfigSave}):t}
              ${n.activePanel===`channels`?ue({context:x(o,n.config.form,n.agentFiles.list,i,n.agentIdentityById[o.id]??null),configForm:n.config.form,snapshot:n.channels.snapshot,loading:n.channels.loading,error:n.channels.error,lastSuccess:n.channels.lastSuccess,onRefresh:n.onChannelsRefresh,onSelectPanel:n.onSelectPanel}):t}
              ${n.activePanel===`cron`?de({context:x(o,n.config.form,n.agentFiles.list,i,n.agentIdentityById[o.id]??null),agentId:o.id,jobs:n.cron.jobs,status:n.cron.status,loading:n.cron.loading,error:n.cron.error,onRefresh:n.onCronRefresh,onRunNow:n.onCronRunNow,onSelectPanel:n.onSelectPanel}):t}
            `:e`
              <div class="card">
                <div class="card-title">Select an agent</div>
                <div class="card-sub">Pick an agent to inspect its workspace and tools.</div>
              </div>
            `}
      </section>
    </div>
  `}function be(n,r,i){return e`
    <div class="agent-tabs">
      ${[{id:`overview`,label:`Overview`},{id:`files`,label:`Files`},{id:`tools`,label:`Tools`},{id:`skills`,label:`Skills`},{id:`channels`,label:`Channels`},{id:`cron`,label:`Cron Jobs`}].map(a=>e`
          <button
            class="agent-tab ${n===a.id?`active`:``}"
            type="button"
            @click=${()=>r(a.id)}
          >
            ${a.label}${i[a.id]==null?t:e`<span class="agent-tab-count">${i[a.id]}</span>`}
          </button>
        `)}
    </div>
  `}export{ye as renderAgents};
//# sourceMappingURL=agents-BPOxZDBr.js.map