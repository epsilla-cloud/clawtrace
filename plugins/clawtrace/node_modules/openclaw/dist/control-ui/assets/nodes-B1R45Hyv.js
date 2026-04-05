import{i as e,n as t}from"./lit-zdTgzAJI.js";import{l as n,r,t as i}from"./format-Cbj45nru.js";function a(e){let t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],r=[];return n.forEach((e,t)=>{if(!e||typeof e!=`object`)return;let n=e,i=typeof n.id==`string`?n.id.trim():``;if(!i)return;let a=typeof n.name==`string`?n.name.trim():void 0,o=n.default===!0;r.push({id:i,name:a||void 0,isDefault:o,index:t,record:n})}),r}function o(e,t){let n=new Set(t),r=[];for(let t of e){if(!(Array.isArray(t.commands)?t.commands:[]).some(e=>n.has(String(e))))continue;let e=typeof t.nodeId==`string`?t.nodeId.trim():``;if(!e)continue;let i=typeof t.displayName==`string`&&t.displayName.trim()?t.displayName.trim():e;r.push({id:e,label:i===e?e:`${i} · ${e}`})}return r.sort((e,t)=>e.label.localeCompare(t.label)),r}var s=`__defaults__`,c=[{value:`deny`,label:`Deny`},{value:`allowlist`,label:`Allowlist`},{value:`full`,label:`Full`}],l=[{value:`off`,label:`Off`},{value:`on-miss`,label:`On miss`},{value:`always`,label:`Always`}];function u(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function d(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function f(e){let t=e?.defaults??{};return{security:u(t.security),ask:d(t.ask),askFallback:u(t.askFallback??`deny`),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function p(e){return a(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function m(e,t){let n=p(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function h(e,t){return e===s?s:e&&t.some(t=>t.id===e)?e:s}function g(e){let t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,r=f(t),i=m(e.configForm,t),a=C(e.nodes),o=e.execApprovalsTarget,c=o===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o===`node`&&c&&!a.some(e=>e.id===c)&&(c=null);let l=h(e.execApprovalsSelectedAgent,i),u=l===s?null:(t?.agents??{})[l]??null,d=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:r,selectedScope:l,selectedAgent:u,agents:i,allowlist:d,target:o,targetNodeId:c,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function _(n){let r=n.ready,i=n.target!==`node`||!!n.targetNodeId;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec approvals</div>
          <div class="card-sub">
            Allowlist and approval policy for <span class="mono">exec host=gateway/node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${n.disabled||!n.dirty||!i}
          @click=${n.onSave}
        >
          ${n.saving?`Saving…`:`Save`}
        </button>
      </div>

      ${v(n)}
      ${r?e`
            ${y(n)} ${b(n)}
            ${n.selectedScope===s?t:x(n)}
          `:e`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${n.loading||!i} @click=${n.onLoad}>
              ${n.loading?`Loading…`:`Load approvals`}
            </button>
          </div>`}
    </section>
  `}function v(n){let r=n.targetNodes.length>0,i=n.targetNodeId??``;return e`
    <div class="list" style="margin-top: 12px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Target</div>
          <div class="list-sub">Gateway edits local approvals; node edits the selected node.</div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Host</span>
            <select
              ?disabled=${n.disabled}
              @change=${e=>{if(e.target.value===`node`){let e=n.targetNodes[0]?.id??null;n.onSelectTarget(`node`,i||e)}else n.onSelectTarget(`gateway`,null)}}
            >
              <option value="gateway" ?selected=${n.target===`gateway`}>Gateway</option>
              <option value="node" ?selected=${n.target===`node`}>Node</option>
            </select>
          </label>
          ${n.target===`node`?e`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${n.disabled||!r}
                    @change=${e=>{let t=e.target.value.trim();n.onSelectTarget(`node`,t||null)}}
                  >
                    <option value="" ?selected=${i===``}>Select node</option>
                    ${n.targetNodes.map(t=>e`<option value=${t.id} ?selected=${i===t.id}>
                          ${t.label}
                        </option>`)}
                  </select>
                </label>
              `:t}
        </div>
      </div>
      ${n.target===`node`&&!r?e` <div class="muted">No nodes advertise exec approvals yet.</div> `:t}
    </div>
  `}function y(t){return e`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${t.selectedScope===s?`active`:``}"
          @click=${()=>t.onSelectScope(s)}
        >
          Defaults
        </button>
        ${t.agents.map(n=>{let r=n.name?.trim()?`${n.name} (${n.id})`:n.id;return e`
            <button
              class="btn btn--sm ${t.selectedScope===n.id?`active`:``}"
              @click=${()=>t.onSelectScope(n.id)}
            >
              ${r}
            </button>
          `})}
      </div>
    </div>
  `}function b(n){let r=n.selectedScope===s,i=n.defaults,a=n.selectedAgent??{},o=r?[`defaults`]:[`agents`,n.selectedScope],u=typeof a.security==`string`?a.security:void 0,d=typeof a.ask==`string`?a.ask:void 0,f=typeof a.askFallback==`string`?a.askFallback:void 0,p=r?i.security:u??`__default__`,m=r?i.ask:d??`__default__`,h=r?i.askFallback:f??`__default__`,g=typeof a.autoAllowSkills==`boolean`?a.autoAllowSkills:void 0,_=g??i.autoAllowSkills,v=g==null;return e`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${r?`Default security mode.`:`Default: ${i.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${n.disabled}
              @change=${e=>{let t=e.target.value;!r&&t===`__default__`?n.onRemove([...o,`security`]):n.onPatch([...o,`security`],t)}}
            >
              ${r?t:e`<option value="__default__" ?selected=${p===`__default__`}>
                    Use default (${i.security})
                  </option>`}
              ${c.map(t=>e`<option value=${t.value} ?selected=${p===t.value}>
                    ${t.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask</div>
          <div class="list-sub">
            ${r?`Default prompt policy.`:`Default: ${i.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${n.disabled}
              @change=${e=>{let t=e.target.value;!r&&t===`__default__`?n.onRemove([...o,`ask`]):n.onPatch([...o,`ask`],t)}}
            >
              ${r?t:e`<option value="__default__" ?selected=${m===`__default__`}>
                    Use default (${i.ask})
                  </option>`}
              ${l.map(t=>e`<option value=${t.value} ?selected=${m===t.value}>
                    ${t.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask fallback</div>
          <div class="list-sub">
            ${r?`Applied when the UI prompt is unavailable.`:`Default: ${i.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${n.disabled}
              @change=${e=>{let t=e.target.value;!r&&t===`__default__`?n.onRemove([...o,`askFallback`]):n.onPatch([...o,`askFallback`],t)}}
            >
              ${r?t:e`<option value="__default__" ?selected=${h===`__default__`}>
                    Use default (${i.askFallback})
                  </option>`}
              ${c.map(t=>e`<option value=${t.value} ?selected=${h===t.value}>
                    ${t.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${r?`Allow skill executables listed by the Gateway.`:v?`Using default (${i.autoAllowSkills?`on`:`off`}).`:`Override (${_?`on`:`off`}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${n.disabled}
              .checked=${_}
              @change=${e=>{let t=e.target;n.onPatch([...o,`autoAllowSkills`],t.checked)}}
            />
          </label>
          ${!r&&!v?e`<button
                class="btn btn--sm"
                ?disabled=${n.disabled}
                @click=${()=>n.onRemove([...o,`autoAllowSkills`])}
              >
                Use default
              </button>`:t}
        </div>
      </div>
    </div>
  `}function x(t){let n=[`agents`,t.selectedScope,`allowlist`],r=t.allowlist;return e`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${t.disabled}
        @click=${()=>{let e=[...r,{pattern:``}];t.onPatch(n,e)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${r.length===0?e` <div class="muted">No allowlist entries yet.</div> `:r.map((e,n)=>S(t,e,n))}
    </div>
  `}function S(r,a,o){let s=a.lastUsedAt?n(a.lastUsedAt):`never`,c=a.lastUsedCommand?i(a.lastUsedCommand,120):null,l=a.lastResolvedPath?i(a.lastResolvedPath,120):null;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${a.pattern?.trim()?a.pattern:`New pattern`}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${c?e`<div class="list-sub mono">${c}</div>`:t}
        ${l?e`<div class="list-sub mono">${l}</div>`:t}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${a.pattern??``}
            ?disabled=${r.disabled}
            @input=${e=>{let t=e.target;r.onPatch([`agents`,r.selectedScope,`allowlist`,o,`pattern`],t.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${r.disabled}
          @click=${()=>{if(r.allowlist.length<=1){r.onRemove([`agents`,r.selectedScope,`allowlist`]);return}r.onRemove([`agents`,r.selectedScope,`allowlist`,o])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function C(e){return o(e,[`system.execApprovals.get`,`system.execApprovals.set`])}function w(t){let n=k(t);return e`
    ${_(g(t))} ${A(n)} ${T(t)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Nodes</div>
          <div class="card-sub">Paired devices and live links.</div>
        </div>
        <button class="btn" ?disabled=${t.loading} @click=${t.onRefresh}>
          ${t.loading?`Loading…`:`Refresh`}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${t.nodes.length===0?e` <div class="muted">No nodes found.</div> `:t.nodes.map(e=>P(e))}
      </div>
    </section>
  `}function T(n){let r=n.devicesList??{pending:[],paired:[]},i=Array.isArray(r.pending)?r.pending:[],a=Array.isArray(r.paired)?r.paired:[];return e`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Devices</div>
          <div class="card-sub">Pairing requests + role tokens.</div>
        </div>
        <button class="btn" ?disabled=${n.devicesLoading} @click=${n.onDevicesRefresh}>
          ${n.devicesLoading?`Loading…`:`Refresh`}
        </button>
      </div>
      ${n.devicesError?e`<div class="callout danger" style="margin-top: 12px;">${n.devicesError}</div>`:t}
      <div class="list" style="margin-top: 16px;">
        ${i.length>0?e`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${i.map(e=>E(e,n))}
            `:t}
        ${a.length>0?e`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${a.map(e=>D(e,n))}
            `:t}
        ${i.length===0&&a.length===0?e` <div class="muted">No paired devices.</div> `:t}
      </div>
    </section>
  `}function E(t,i){let a=t.displayName?.trim()||t.deviceId,o=typeof t.ts==`number`?n(t.ts):`n/a`,s=t.role?.trim()||r(t.roles),c=r(t.scopes),l=t.isRepair?` · repair`:``,u=t.remoteIp?` · ${t.remoteIp}`:``;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${a}</div>
        <div class="list-sub">${t.deviceId}${u}</div>
        <div class="muted" style="margin-top: 6px;">
          role: ${s} · scopes: ${c} · requested ${o}${l}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>i.onDeviceApprove(t.requestId)}>
            Approve
          </button>
          <button class="btn btn--sm" @click=${()=>i.onDeviceReject(t.requestId)}>
            Reject
          </button>
        </div>
      </div>
    </div>
  `}function D(t,n){let i=t.displayName?.trim()||t.deviceId,a=t.remoteIp?` · ${t.remoteIp}`:``,o=`roles: ${r(t.roles)}`,s=`scopes: ${r(t.scopes)}`,c=Array.isArray(t.tokens)?t.tokens:[];return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">${t.deviceId}${a}</div>
        <div class="muted" style="margin-top: 6px;">${o} · ${s}</div>
        ${c.length===0?e` <div class="muted" style="margin-top: 6px">Tokens: none</div> `:e`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${c.map(e=>O(t.deviceId,e,n))}
              </div>
            `}
      </div>
    </div>
  `}function O(i,a,o){let s=a.revokedAtMs?`revoked`:`active`,c=`scopes: ${r(a.scopes)}`,l=n(a.rotatedAtMs??a.createdAtMs??a.lastUsedAtMs??null);return e`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${a.role} · ${s} · ${c} · ${l}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>o.onDeviceRotate(i,a.role,a.scopes)}
        >
          Rotate
        </button>
        ${a.revokedAtMs?t:e`
              <button
                class="btn btn--sm danger"
                @click=${()=>o.onDeviceRevoke(i,a.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}function k(e){let t=e.configForm,n=M(e.nodes),{defaultBinding:r,agents:i}=N(t);return{ready:!!t,disabled:e.configSaving||e.configFormMode===`raw`,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:r,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function A(n){let r=n.nodes.length>0,i=n.defaultBinding??``;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec node binding</div>
          <div class="card-sub">
            Pin agents to a specific node when using <span class="mono">exec host=node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${n.disabled||!n.configDirty}
          @click=${n.onSave}
        >
          ${n.configSaving?`Saving…`:`Save`}
        </button>
      </div>

      ${n.formMode===`raw`?e`
            <div class="callout warn" style="margin-top: 12px">
              Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
            </div>
          `:t}
      ${n.ready?e`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">Default binding</div>
                  <div class="list-sub">Used when agents do not override a node binding.</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>Node</span>
                    <select
                      ?disabled=${n.disabled||!r}
                      @change=${e=>{let t=e.target.value.trim();n.onBindDefault(t||null)}}
                    >
                      <option value="" ?selected=${i===``}>Any node</option>
                      ${n.nodes.map(t=>e`<option value=${t.id} ?selected=${i===t.id}>
                            ${t.label}
                          </option>`)}
                    </select>
                  </label>
                  ${r?t:e` <div class="muted">No nodes with system.run available.</div> `}
                </div>
              </div>

              ${n.agents.length===0?e` <div class="muted">No agents found.</div> `:n.agents.map(e=>j(e,n))}
            </div>
          `:e`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${n.configLoading} @click=${n.onLoadConfig}>
              ${n.configLoading?`Loading…`:`Load config`}
            </button>
          </div>`}
    </section>
  `}function j(t,n){let r=t.binding??`__default__`,i=t.name?.trim()?`${t.name} (${t.id})`:t.id,a=n.nodes.length>0;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">
          ${t.isDefault?`default agent`:`agent`} ·
          ${r===`__default__`?`uses default (${n.defaultBinding??`any`})`:`override: ${t.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${n.disabled||!a}
            @change=${e=>{let r=e.target.value.trim();n.onBindAgent(t.index,r===`__default__`?null:r)}}
          >
            <option value="__default__" ?selected=${r===`__default__`}>
              Use default
            </option>
            ${n.nodes.map(t=>e`<option value=${t.id} ?selected=${r===t.id}>
                  ${t.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function M(e){return o(e,[`system.run`])}function N(e){let t={id:`main`,name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=e.agents??{};if(!Array.isArray(i.list)||i.list.length===0)return{defaultBinding:r,agents:[t]};let o=a(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,index:e.index,isDefault:e.isDefault,binding:n}});return o.length===0&&o.push(t),{defaultBinding:r,agents:o}}function P(t){let n=!!t.connected,r=!!t.paired,i=typeof t.displayName==`string`&&t.displayName.trim()||(typeof t.nodeId==`string`?t.nodeId:`unknown`),a=Array.isArray(t.caps)?t.caps:[],o=Array.isArray(t.commands)?t.commands:[];return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">
          ${typeof t.nodeId==`string`?t.nodeId:``}
          ${typeof t.remoteIp==`string`?` · ${t.remoteIp}`:``}
          ${typeof t.version==`string`?` · ${t.version}`:``}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${r?`paired`:`unpaired`}</span>
          <span class="chip ${n?`chip-ok`:`chip-warn`}">
            ${n?`connected`:`offline`}
          </span>
          ${a.slice(0,12).map(t=>e`<span class="chip">${String(t)}</span>`)}
          ${o.slice(0,8).map(t=>e`<span class="chip">${String(t)}</span>`)}
        </div>
      </div>
    </div>
  `}export{w as renderNodes};
//# sourceMappingURL=nodes-B1R45Hyv.js.map