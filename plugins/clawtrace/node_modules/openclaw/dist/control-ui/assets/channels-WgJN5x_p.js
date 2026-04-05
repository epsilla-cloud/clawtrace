import{i as e,n as t}from"./lit-zdTgzAJI.js";import{d as n,l as r}from"./format-Cbj45nru.js";import{F as i,I as a,c as o,l as s}from"./index-D7mg1IkY.js";import{n as c,t as l}from"./channel-config-extras-DNCeHtEf.js";function u(e,t){let n=e;for(let e of t){if(!n)return null;let t=a(n);if(t===`object`){let t=n.properties??{};if(typeof e==`string`&&t[e]){n=t[e];continue}let r=n.additionalProperties;if(typeof e==`string`&&r&&typeof r==`object`){n=r;continue}return null}if(t===`array`){if(typeof e!=`number`)return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function d(e,t){return c(e,t)??{}}var f=[`groupPolicy`,`streamMode`,`dmPolicy`];function p(t){let n=f.flatMap(e=>e in t?[[e,t[e]]]:[]);return n.length===0?null:e`
    <div class="status-list" style="margin-top: 12px;">
      ${n.map(([t,n])=>e`
          <div>
            <span class="label">${t}</span>
            <span>${l(n)}</span>
          </div>
        `)}
    </div>
  `}function m(t){let n=o(t.schema),r=n.schema;if(!r)return e` <div class="callout danger">Schema unavailable. Use Raw.</div> `;let i=u(r,[`channels`,t.channelId]);if(!i)return e` <div class="callout danger">Channel config schema unavailable.</div> `;let a=d(t.configValue??{},t.channelId);return e`
    <div class="config-form">
      ${s({schema:i,value:a,path:[`channels`,t.channelId],hints:t.uiHints,unsupported:new Set(n.unsupportedPaths),disabled:t.disabled,showLabel:!1,onPatch:t.onPatch})}
    </div>
    ${p(a)}
  `}function h(t){let{channelId:n,props:r}=t,i=r.configSaving||r.configSchemaLoading;return e`
    <div style="margin-top: 16px;">
      ${r.configSchemaLoading?e` <div class="muted">Loading config schema…</div> `:m({channelId:n,configValue:r.configForm,schema:r.configSchema,uiHints:r.configUiHints,disabled:i,onPatch:r.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${i||!r.configFormDirty}
          @click=${()=>r.onConfigSave()}
        >
          ${r.configSaving?`Saving…`:`Save`}
        </button>
        <button class="btn" ?disabled=${i} @click=${()=>r.onConfigReload()}>
          Reload
        </button>
      </div>
    </div>
  `}function g(e,t){return t.snapshot?.channels?.[e]}function _(e,t){let n=t.snapshot?.channelAccounts?.[e]??[],r=t.snapshot?.channelDefaultAccountId?.[e];return(r?n.find(e=>e.accountId===r):void 0)??n[0]??null}function v(e,t){let n=g(e,t),r=t.snapshot?.channelAccounts?.[e]??[],i=_(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof i?.configured==`boolean`?i.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:i,hasAnyActiveAccount:r.some(e=>e.configured||e.running||e.connected),status:n}}function y(e,t){if(!t.snapshot)return!1;let n=v(e,t);return n.configured===!0||n.running===!0||n.connected===!0||n.hasAnyActiveAccount}function b(e,t){return v(e,t).configured}function x(e){return e==null?`n/a`:e?`Yes`:`No`}function S(n){return e`
    <div class="card">
      <div class="card-title">${n.title}</div>
      <div class="card-sub">${n.subtitle}</div>
      ${n.accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        ${n.statusRows.map(t=>e`
            <div>
              <span class="label">${t.label}</span>
              <span>${t.value}</span>
            </div>
          `)}
      </div>

      ${n.lastError?e`<div class="callout danger" style="margin-top: 12px;">${n.lastError}</div>`:t}
      ${n.secondaryCallout??t} ${n.extraContent??t}
      ${n.configSection} ${n.footer??t}
    </div>
  `}function C(e,t){return t?.[e]?.length??0}function w(n,r){let i=C(n,r);return i<2?t:e`<div class="account-count">Accounts (${i})</div>`}function T(n){let{props:i,discord:a,accountCountLabel:o}=n;return S({title:`Discord`,subtitle:`Bot status and channel configuration.`,accountCountLabel:o,statusRows:[{label:`Configured`,value:x(b(`discord`,i))},{label:`Running`,value:a?.running?`Yes`:`No`},{label:`Last start`,value:a?.lastStartAt?r(a.lastStartAt):`n/a`},{label:`Last probe`,value:a?.lastProbeAt?r(a.lastProbeAt):`n/a`}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          Probe ${a.probe.ok?`ok`:`failed`} · ${a.probe.status??``}
          ${a.probe.error??``}
        </div>`:t,configSection:h({channelId:`discord`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>Probe</button>
    </div>`})}function E(n){let{props:i,googleChat:a,accountCountLabel:o}=n;return S({title:`Google Chat`,subtitle:`Chat API webhook status and channel configuration.`,accountCountLabel:o,statusRows:[{label:`Configured`,value:x(b(`googlechat`,i))},{label:`Running`,value:a?a.running?`Yes`:`No`:`n/a`},{label:`Credential`,value:a?.credentialSource??`n/a`},{label:`Audience`,value:a?.audienceType?`${a.audienceType}${a.audience?` · ${a.audience}`:``}`:`n/a`},{label:`Last start`,value:a?.lastStartAt?r(a.lastStartAt):`n/a`},{label:`Last probe`,value:a?.lastProbeAt?r(a.lastProbeAt):`n/a`}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          Probe ${a.probe.ok?`ok`:`failed`} · ${a.probe.status??``}
          ${a.probe.error??``}
        </div>`:t,configSection:h({channelId:`googlechat`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>Probe</button>
    </div>`})}function D(n){let{props:i,imessage:a,accountCountLabel:o}=n;return S({title:`iMessage`,subtitle:`macOS bridge status and channel configuration.`,accountCountLabel:o,statusRows:[{label:`Configured`,value:x(b(`imessage`,i))},{label:`Running`,value:a?.running?`Yes`:`No`},{label:`Last start`,value:a?.lastStartAt?r(a.lastStartAt):`n/a`},{label:`Last probe`,value:a?.lastProbeAt?r(a.lastProbeAt):`n/a`}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          Probe ${a.probe.ok?`ok`:`failed`} · ${a.probe.error??``}
        </div>`:t,configSection:h({channelId:`imessage`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>Probe</button>
    </div>`})}function O(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:`n/a`}function k(n){let{props:a,nostr:o,nostrAccounts:s,accountCountLabel:c,profileFormState:l,profileFormCallbacks:u,onEditProfile:d}=n,f=s[0],p=o?.configured??f?.configured??!1,m=o?.running??f?.running??!1,g=o?.publicKey??f?.publicKey,_=o?.lastStartAt??f?.lastStartAt??null,v=o?.lastError??f?.lastError??null,y=s.length>1,b=l!=null,x=n=>{let i=n.publicKey,a=n.profile;return e`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${a?.displayName??a?.name??n.name??n.accountId}</div>
          <div class="account-card-id">${n.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${n.running?`Yes`:`No`}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${n.configured?`Yes`:`No`}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${i??``}">${O(i)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span
              >${n.lastInboundAt?r(n.lastInboundAt):`n/a`}</span
            >
          </div>
          ${n.lastError?e` <div class="account-card-error">${n.lastError}</div> `:t}
        </div>
      </div>
    `};return e`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${c}
      ${y?e`
            <div class="account-card-list">
              ${s.map(e=>x(e))}
            </div>
          `:e`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${p?`Yes`:`No`}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${m?`Yes`:`No`}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${g??``}"
                  >${O(g)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span
                  >${_?r(_):`n/a`}</span
                >
              </div>
            </div>
          `}
      ${v?e`<div class="callout danger" style="margin-top: 12px;">${v}</div>`:t}
      ${(()=>{if(b&&u)return i({state:l,callbacks:u,accountId:s[0]?.accountId??`default`});let{name:n,displayName:r,about:a,picture:c,nip05:m}=f?.profile??o?.profile??{},h=n||r||a||c||m;return e`
      <div
        style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md);"
      >
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"
        >
          <div style="font-weight: 500;">Profile</div>
          ${p?e`
                <button
                  class="btn btn--sm"
                  @click=${d}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:t}
        </div>
        ${h?e`
              <div class="status-list">
                ${c?e`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${c}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${e=>{e.target.style.display=`none`}}
                        />
                      </div>
                    `:t}
                ${n?e`<div><span class="label">Name</span><span>${n}</span></div>`:t}
                ${r?e`<div>
                      <span class="label">Display Name</span><span>${r}</span>
                    </div>`:t}
                ${a?e`<div>
                      <span class="label">About</span
                      ><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;"
                        >${a}</span
                      >
                    </div>`:t}
                ${m?e`<div><span class="label">NIP-05</span><span>${m}</span></div>`:t}
              </div>
            `:e`
              <div style="color: var(--text-muted); font-size: 13px">
                No profile set. Click "Edit Profile" to add your name, bio, and avatar.
              </div>
            `}
      </div>
    `})()} ${h({channelId:`nostr`,props:a})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>a.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function A(n){let{props:i,signal:a,accountCountLabel:o}=n;return S({title:`Signal`,subtitle:`signal-cli status and channel configuration.`,accountCountLabel:o,statusRows:[{label:`Configured`,value:x(b(`signal`,i))},{label:`Running`,value:a?.running?`Yes`:`No`},{label:`Base URL`,value:a?.baseUrl??`n/a`},{label:`Last start`,value:a?.lastStartAt?r(a.lastStartAt):`n/a`},{label:`Last probe`,value:a?.lastProbeAt?r(a.lastProbeAt):`n/a`}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          Probe ${a.probe.ok?`ok`:`failed`} · ${a.probe.status??``}
          ${a.probe.error??``}
        </div>`:t,configSection:h({channelId:`signal`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>Probe</button>
    </div>`})}function j(n){let{props:i,slack:a,accountCountLabel:o}=n;return S({title:`Slack`,subtitle:`Socket mode status and channel configuration.`,accountCountLabel:o,statusRows:[{label:`Configured`,value:x(b(`slack`,i))},{label:`Running`,value:a?.running?`Yes`:`No`},{label:`Last start`,value:a?.lastStartAt?r(a.lastStartAt):`n/a`},{label:`Last probe`,value:a?.lastProbeAt?r(a.lastProbeAt):`n/a`}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          Probe ${a.probe.ok?`ok`:`failed`} · ${a.probe.status??``}
          ${a.probe.error??``}
        </div>`:t,configSection:h({channelId:`slack`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>Probe</button>
    </div>`})}function M(n){let{props:i,telegram:a,telegramAccounts:o,accountCountLabel:s}=n,c=o.length>1,l=b(`telegram`,i),u=n=>{let i=n.probe?.bot?.username,a=n.name||n.accountId;return e`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${i?`@${i}`:a}</div>
          <div class="account-card-id">${n.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${n.running?`Yes`:`No`}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${n.configured?`Yes`:`No`}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span
              >${n.lastInboundAt?r(n.lastInboundAt):`n/a`}</span
            >
          </div>
          ${n.lastError?e` <div class="account-card-error">${n.lastError}</div> `:t}
        </div>
      </div>
    `};return c?e`
      <div class="card">
        <div class="card-title">Telegram</div>
        <div class="card-sub">Bot status and channel configuration.</div>
        ${s}

        <div class="account-card-list">
          ${o.map(e=>u(e))}
        </div>

        ${a?.lastError?e`<div class="callout danger" style="margin-top: 12px;">${a.lastError}</div>`:t}
        ${a?.probe?e`<div class="callout" style="margin-top: 12px;">
              Probe ${a.probe.ok?`ok`:`failed`} · ${a.probe.status??``}
              ${a.probe.error??``}
            </div>`:t}
        ${h({channelId:`telegram`,props:i})}

        <div class="row" style="margin-top: 12px;">
          <button class="btn" @click=${()=>i.onRefresh(!0)}>Probe</button>
        </div>
      </div>
    `:S({title:`Telegram`,subtitle:`Bot status and channel configuration.`,accountCountLabel:s,statusRows:[{label:`Configured`,value:x(l)},{label:`Running`,value:a?.running?`Yes`:`No`},{label:`Mode`,value:a?.mode??`n/a`},{label:`Last start`,value:a?.lastStartAt?r(a.lastStartAt):`n/a`},{label:`Last probe`,value:a?.lastProbeAt?r(a.lastProbeAt):`n/a`}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          Probe ${a.probe.ok?`ok`:`failed`} · ${a.probe.status??``}
          ${a.probe.error??``}
        </div>`:t,configSection:h({channelId:`telegram`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>Probe</button>
    </div>`})}function N(i){let{props:a,whatsapp:o,accountCountLabel:s}=i;return S({title:`WhatsApp`,subtitle:`Link WhatsApp Web and monitor connection health.`,accountCountLabel:s,statusRows:[{label:`Configured`,value:x(b(`whatsapp`,a))},{label:`Linked`,value:o?.linked?`Yes`:`No`},{label:`Running`,value:o?.running?`Yes`:`No`},{label:`Connected`,value:o?.connected?`Yes`:`No`},{label:`Last connect`,value:o?.lastConnectedAt?r(o.lastConnectedAt):`n/a`},{label:`Last message`,value:o?.lastMessageAt?r(o.lastMessageAt):`n/a`},{label:`Auth age`,value:o?.authAgeMs==null?`n/a`:n(o.authAgeMs)}],lastError:o?.lastError,extraContent:e`
      ${a.whatsappMessage?e`<div class="callout" style="margin-top: 12px;">${a.whatsappMessage}</div>`:t}
      ${a.whatsappQrDataUrl?e`<div class="qr-wrap">
            <img src=${a.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:t}
    `,configSection:h({channelId:`whatsapp`,props:a}),footer:e`<div class="row" style="margin-top: 14px; flex-wrap: wrap;">
      <button
        class="btn primary"
        ?disabled=${a.whatsappBusy}
        @click=${()=>a.onWhatsAppStart(!1)}
      >
        ${a.whatsappBusy?`Working…`:`Show QR`}
      </button>
      <button
        class="btn"
        ?disabled=${a.whatsappBusy}
        @click=${()=>a.onWhatsAppStart(!0)}
      >
        Relink
      </button>
      <button class="btn" ?disabled=${a.whatsappBusy} @click=${()=>a.onWhatsAppWait()}>
        Wait for scan
      </button>
      <button
        class="btn danger"
        ?disabled=${a.whatsappBusy}
        @click=${()=>a.onWhatsAppLogout()}
      >
        Logout
      </button>
      <button class="btn" @click=${()=>a.onRefresh(!0)}>Refresh</button>
    </div>`})}function P(n){let i=n.snapshot?.channels,a=i?.whatsapp??void 0,o=i?.telegram??void 0,s=i?.discord??null,c=i?.googlechat??null,l=i?.slack??null,u=i?.signal??null,d=i?.imessage??null,f=i?.nostr??null;return e`
    <section class="grid grid-cols-2">
      ${F(n.snapshot).map((e,t)=>({key:e,enabled:y(e,n),order:t})).toSorted((e,t)=>e.enabled===t.enabled?e.order-t.order:e.enabled?-1:1).map(e=>I(e.key,n,{whatsapp:a,telegram:o,discord:s,googlechat:c,slack:l,signal:u,imessage:d,nostr:f,channelAccounts:n.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">
          ${n.lastSuccessAt?r(n.lastSuccessAt):`n/a`}
        </div>
      </div>
      ${n.lastError?e`<div class="callout danger" style="margin-top: 12px;">${n.lastError}</div>`:t}
      <pre class="code-block" style="margin-top: 12px;">
${n.snapshot?JSON.stringify(n.snapshot,null,2):`No snapshot yet.`}
      </pre
      >
    </section>
  `}function F(e){return e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder?.length?e.channelOrder:[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]}function I(e,t,n){let r=w(e,n.channelAccounts);switch(e){case`whatsapp`:return N({props:t,whatsapp:n.whatsapp,accountCountLabel:r});case`telegram`:return M({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:r});case`discord`:return T({props:t,discord:n.discord,accountCountLabel:r});case`googlechat`:return E({props:t,googleChat:n.googlechat,accountCountLabel:r});case`slack`:return j({props:t,slack:n.slack,accountCountLabel:r});case`signal`:return A({props:t,signal:n.signal,accountCountLabel:r});case`imessage`:return D({props:t,imessage:n.imessage,accountCountLabel:r});case`nostr`:{let e=n.channelAccounts?.nostr??[],i=e[0],a=i?.accountId??`default`,o=i?.profile??null,s=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,c=s?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return k({props:t,nostr:n.nostr,nostrAccounts:e,accountCountLabel:r,profileFormState:s,profileFormCallbacks:c,onEditProfile:()=>t.onNostrProfileEdit(a,o)})}default:return L(e,t,n.channelAccounts??{})}}function L(n,r,i){let a=z(r.snapshot,n),o=v(n,r),s=typeof o.status?.lastError==`string`?o.status.lastError:void 0,c=i[n]??[];return e`
    <div class="card">
      <div class="card-title">${a}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${w(n,i)}
      ${c.length>0?e`
            <div class="account-card-list">
              ${c.map(e=>W(e))}
            </div>
          `:e`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${x(o.configured)}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${x(o.running)}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${x(o.connected)}</span>
              </div>
            </div>
          `}
      ${s?e`<div class="callout danger" style="margin-top: 12px;">${s}</div>`:t}
      ${h({channelId:n,props:r})}
    </div>
  `}function R(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(e=>[e.id,e])):{}}function z(e,t){return R(e)[t]?.label??e?.channelLabels?.[t]??t}var B=600*1e3;function V(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<B:!1}function H(e){return e.running?`Yes`:V(e)?`Active`:`No`}function U(e){return e.connected===!0?`Yes`:e.connected===!1?`No`:V(e)?`Active`:`n/a`}function W(n){let i=H(n),a=U(n);return e`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${n.name||n.accountId}</div>
        <div class="account-card-id">${n.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">Running</span>
          <span>${i}</span>
        </div>
        <div>
          <span class="label">Configured</span>
          <span>${n.configured?`Yes`:`No`}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${a}</span>
        </div>
        <div>
          <span class="label">Last inbound</span>
          <span
            >${n.lastInboundAt?r(n.lastInboundAt):`n/a`}</span
          >
        </div>
        ${n.lastError?e` <div class="account-card-error">${n.lastError}</div> `:t}
      </div>
    </div>
  `}export{P as renderChannels};
//# sourceMappingURL=channels-WgJN5x_p.js.map