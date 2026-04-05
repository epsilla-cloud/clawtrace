import{i as e,n as t}from"./lit-zdTgzAJI.js";var n=[`trace`,`debug`,`info`,`warn`,`error`,`fatal`];function r(e){if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function i(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(` `).toLowerCase().includes(t):!0}function a(a){let o=a.filterText.trim().toLowerCase(),s=n.some(e=>!a.levelFilters[e]),c=a.entries.filter(e=>e.level&&!a.levelFilters[e.level]?!1:i(e,o)),l=o||s?`filtered`:`visible`;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Logs</div>
          <div class="card-sub">Gateway file logs (JSONL).</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${a.loading} @click=${a.onRefresh}>
            ${a.loading?`Loading…`:`Refresh`}
          </button>
          <button
            class="btn"
            ?disabled=${c.length===0}
            @click=${()=>a.onExport(c.map(e=>e.raw),l)}
          >
            Export ${l}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>Filter</span>
          <input
            .value=${a.filterText}
            @input=${e=>a.onFilterTextChange(e.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${a.autoFollow}
            @change=${e=>a.onToggleAutoFollow(e.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${n.map(t=>e`
            <label class="chip log-chip ${t}">
              <input
                type="checkbox"
                .checked=${a.levelFilters[t]}
                @change=${e=>a.onLevelToggle(t,e.target.checked)}
              />
              <span>${t}</span>
            </label>
          `)}
      </div>

      ${a.file?e`<div class="muted" style="margin-top: 10px;">File: ${a.file}</div>`:t}
      ${a.truncated?e`
            <div class="callout" style="margin-top: 10px">
              Log output truncated; showing latest chunk.
            </div>
          `:t}
      ${a.error?e`<div class="callout danger" style="margin-top: 10px;">${a.error}</div>`:t}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${a.onScroll}>
        ${c.length===0?e` <div class="muted" style="padding: 12px">No log entries.</div> `:c.map(t=>e`
                <div class="log-row">
                  <div class="log-time mono">${r(t.time)}</div>
                  <div class="log-level ${t.level??``}">${t.level??``}</div>
                  <div class="log-subsystem mono">${t.subsystem??``}</div>
                  <div class="log-message mono">${t.message??t.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}export{a as renderLogs};
//# sourceMappingURL=logs-vVeVJ0CI.js.map