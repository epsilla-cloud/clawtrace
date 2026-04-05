import{i as e,n as t}from"./lit-zdTgzAJI.js";import{j as n,o as r}from"./index-D7mg1IkY.js";var i=!1;function a(r){let a=!i;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Connected Instances</div>
          <div class="card-sub">Presence beacons from the gateway and clients.</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button
            class="btn btn--icon ${a?``:`active`}"
            @click=${()=>{i=!i,r.onRefresh()}}
            title=${a?`Show hosts and IPs`:`Hide hosts and IPs`}
            aria-label="Toggle host visibility"
            aria-pressed=${!a}
            style="width: 36px; height: 36px;"
          >
            ${a?n.eyeOff:n.eye}
          </button>
          <button class="btn" ?disabled=${r.loading} @click=${r.onRefresh}>
            ${r.loading?`Loading…`:`Refresh`}
          </button>
        </div>
      </div>
      ${r.lastError?e`<div class="callout danger" style="margin-top: 12px;">${r.lastError}</div>`:t}
      ${r.statusMessage?e`<div class="callout" style="margin-top: 12px;">${r.statusMessage}</div>`:t}
      <div class="list" style="margin-top: 16px;">
        ${r.entries.length===0?e` <div class="muted">No instances reported yet.</div> `:r.entries.map(e=>o(e,a))}
      </div>
    </section>
  `}function o(n,i){let a=n.lastInputSeconds==null?`n/a`:`${n.lastInputSeconds}s ago`,o=n.mode??`unknown`,s=n.host??`unknown host`,c=n.ip??null,l=Array.isArray(n.roles)?n.roles.filter(Boolean):[],u=Array.isArray(n.scopes)?n.scopes.filter(Boolean):[],d=u.length>0?u.length>3?`${u.length} scopes`:`scopes: ${u.join(`, `)}`:null;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          <span class="${i?`redacted`:``}">${s}</span>
        </div>
        <div class="list-sub">
          ${c?e`<span class="${i?`redacted`:``}">${c}</span> `:t}${o}
          ${n.version??``}
        </div>
        <div class="chip-row">
          <span class="chip">${o}</span>
          ${l.map(t=>e`<span class="chip">${t}</span>`)}
          ${d?e`<span class="chip">${d}</span>`:t}
          ${n.platform?e`<span class="chip">${n.platform}</span>`:t}
          ${n.deviceFamily?e`<span class="chip">${n.deviceFamily}</span>`:t}
          ${n.modelIdentifier?e`<span class="chip">${n.modelIdentifier}</span>`:t}
          ${n.version?e`<span class="chip">${n.version}</span>`:t}
        </div>
      </div>
      <div class="list-meta">
        <div>${r(n)}</div>
        <div class="muted">Last input ${a}</div>
        <div class="muted">Reason ${n.reason??``}</div>
      </div>
    </div>
  `}export{a as renderInstances};
//# sourceMappingURL=instances-DS1SJ7RU.js.map