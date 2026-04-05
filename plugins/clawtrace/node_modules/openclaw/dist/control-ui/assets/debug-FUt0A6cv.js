import{i as e,n as t}from"./lit-zdTgzAJI.js";import{i as n}from"./index-D7mg1IkY.js";function r(r){let i=(r.status&&typeof r.status==`object`?r.status.securityAudit:null)?.summary??null,a=i?.critical??0,o=i?.warn??0,s=i?.info??0,c=a>0?`danger`:o>0?`warn`:`success`,l=a>0?`${a} critical`:o>0?`${o} warnings`:`No critical issues`;return e`
    <section class="grid">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Snapshots</div>
            <div class="card-sub">Status, health, and heartbeat data.</div>
          </div>
          <button class="btn" ?disabled=${r.loading} @click=${r.onRefresh}>
            ${r.loading?`Refreshing…`:`Refresh`}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">Status</div>
            ${i?e`<div class="callout ${c}" style="margin-top: 8px;">
                  Security audit: ${l}${s>0?` · ${s} info`:``}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:t}
            <pre class="code-block">${JSON.stringify(r.status??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Health</div>
            <pre class="code-block">${JSON.stringify(r.health??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Last heartbeat</div>
            <pre class="code-block">${JSON.stringify(r.heartbeat??{},null,2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Manual RPC</div>
        <div class="card-sub">Send a raw gateway method with JSON params.</div>
        <div class="stack" style="margin-top: 16px;">
          <label class="field">
            <span>Method</span>
            <select
              .value=${r.callMethod}
              @change=${e=>r.onCallMethodChange(e.target.value)}
            >
              ${r.callMethod?t:e` <option value="" disabled>Select a method…</option> `}
              ${r.methods.map(t=>e`<option value=${t}>${t}</option>`)}
            </select>
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${r.callParams}
              @input=${e=>r.onCallParamsChange(e.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${r.onCall}>Call</button>
        </div>
        ${r.callError?e`<div class="callout danger" style="margin-top: 12px;">${r.callError}</div>`:t}
        ${r.callResult?e`<pre class="code-block" style="margin-top: 12px;">${r.callResult}</pre>`:t}
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Models</div>
      <div class="card-sub">Catalog from models.list.</div>
      <pre class="code-block" style="margin-top: 12px;">
${JSON.stringify(r.models??[],null,2)}</pre
      >
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Event Log</div>
      <div class="card-sub">Latest gateway events.</div>
      ${r.eventLog.length===0?e` <div class="muted" style="margin-top: 12px">No events yet.</div> `:e`
            <div class="list debug-event-log" style="margin-top: 12px;">
              ${r.eventLog.map(t=>e`
                  <div class="list-item debug-event-log__item">
                    <div class="list-main">
                      <div class="list-title">${t.event}</div>
                      <div class="list-sub">${new Date(t.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta debug-event-log__meta">
                      <pre class="code-block debug-event-log__payload">
${n(t.payload)}</pre
                      >
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}export{r as renderDebug};
//# sourceMappingURL=debug-FUt0A6cv.js.map