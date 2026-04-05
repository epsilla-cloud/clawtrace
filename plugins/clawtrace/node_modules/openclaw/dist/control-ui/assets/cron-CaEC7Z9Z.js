import{i as e,n as t}from"./lit-zdTgzAJI.js";import{i as n,l as r}from"./format-Cbj45nru.js";import{L as i,P as a,a as o,n as s}from"./index-D7mg1IkY.js";var c=e=>e??t;function l(){return[{value:`ok`,label:i(`cron.runs.runStatusOk`)},{value:`error`,label:i(`cron.runs.runStatusError`)},{value:`skipped`,label:i(`cron.runs.runStatusSkipped`)}]}function u(){return[{value:`delivered`,label:i(`cron.runs.deliveryDelivered`)},{value:`not-delivered`,label:i(`cron.runs.deliveryNotDelivered`)},{value:`unknown`,label:i(`cron.runs.deliveryUnknown`)},{value:`not-requested`,label:i(`cron.runs.deliveryNotRequested`)}]}function d(e,t,n){let r=new Set(e);return n?r.add(t):r.delete(t),Array.from(r)}function f(e,t){return e.length===0?t:e.length<=2?e.join(`, `):`${e[0]} +${e.length-1}`}function p(e){let t=[`last`,...e.channels.filter(Boolean)],n=e.form.deliveryChannel?.trim();n&&!t.includes(n)&&t.push(n);let r=new Set;return t.filter(e=>r.has(e)?!1:(r.add(e),!0))}function m(e,t){if(t===`last`)return`last`;let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function h(t){return e`
    <div class="field cron-filter-dropdown" data-filter=${t.id}>
      <span>${t.title}</span>
      <details class="cron-filter-dropdown__details">
        <summary class="btn cron-filter-dropdown__trigger">
          <span>${t.summary}</span>
        </summary>
        <div class="cron-filter-dropdown__panel">
          <div class="cron-filter-dropdown__list">
            ${t.options.map(n=>e`
                <label class="cron-filter-dropdown__option">
                  <input
                    type="checkbox"
                    value=${n.value}
                    .checked=${t.selected.includes(n.value)}
                    @change=${e=>{let r=e.target;t.onToggle(n.value,r.checked)}}
                  />
                  <span>${n.label}</span>
                </label>
              `)}
          </div>
          <div class="row">
            <button class="btn" type="button" @click=${t.onClear}>
              ${i(`cron.runs.clear`)}
            </button>
          </div>
        </div>
      </details>
    </div>
  `}function g(n,r){let i=Array.from(new Set(r.map(e=>e.trim()).filter(Boolean)));return i.length===0?t:e`<datalist id=${n}>
    ${i.map(t=>e`<option value=${t}></option> `)}
  </datalist>`}function _(e){return`cron-error-${e}`}function v(e){return e===`name`?`cron-name`:e===`scheduleAt`?`cron-schedule-at`:e===`everyAmount`?`cron-every-amount`:e===`cronExpr`?`cron-cron-expr`:e===`staggerAmount`?`cron-stagger-amount`:e===`payloadText`?`cron-payload-text`:e===`payloadModel`?`cron-payload-model`:e===`payloadThinking`?`cron-payload-thinking`:e===`timeoutSeconds`?`cron-timeout-seconds`:e===`failureAlertAfter`?`cron-failure-alert-after`:e===`failureAlertCooldownSeconds`?`cron-failure-alert-cooldown-seconds`:`cron-delivery-to`}function y(e,t,n){return e===`payloadText`?t.payloadKind===`systemEvent`?i(`cron.form.mainTimelineMessage`):i(`cron.form.assistantTaskPrompt`):e===`deliveryTo`?i(n===`webhook`?`cron.form.webhookUrl`:`cron.form.to`):{name:i(`cron.form.fieldName`),scheduleAt:i(`cron.form.runAt`),everyAmount:i(`cron.form.every`),cronExpr:i(`cron.form.expression`),staggerAmount:i(`cron.form.staggerWindow`),payloadText:i(`cron.form.assistantTaskPrompt`),payloadModel:i(`cron.form.model`),payloadThinking:i(`cron.form.thinking`),timeoutSeconds:i(`cron.form.timeoutSeconds`),deliveryTo:i(`cron.form.to`),failureAlertAfter:`Failure alert after`,failureAlertCooldownSeconds:`Failure alert cooldown`}[e]}function b(e,t,n){let r=[`name`,`scheduleAt`,`everyAmount`,`cronExpr`,`staggerAmount`,`payloadText`,`payloadModel`,`payloadThinking`,`timeoutSeconds`,`deliveryTo`,`failureAlertAfter`,`failureAlertCooldownSeconds`],i=[];for(let a of r){let r=e[a];r&&i.push({key:a,label:y(a,t,n),message:r,inputId:v(a)})}return i}function x(e){let t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`center`,behavior:`smooth`}),t.focus())}function S(n,r=!1){return e`<span>
    ${n}
    ${r?e`
          <span class="cron-required-marker" aria-hidden="true">*</span>
          <span class="cron-required-sr">${i(`cron.form.requiredSr`)}</span>
        `:t}
  </span>`}function C(n){let r=!!n.editingJobId,a=n.form.payloadKind===`agentTurn`,s=n.form.scheduleKind===`cron`,v=p(n),y=n.runsJobId==null?void 0:n.jobs.find(e=>e.id===n.runsJobId),C=n.runsScope===`all`?i(`cron.jobList.allJobs`):y?.name??n.runsJobId??i(`cron.jobList.selectJob`),D=n.runs.toSorted((e,t)=>n.runsSortDir===`asc`?e.ts-t.ts:t.ts-e.ts),O=l(),k=u(),A=O.filter(e=>n.runsStatuses.includes(e.value)).map(e=>e.label),j=k.filter(e=>n.runsDeliveryStatuses.includes(e.value)).map(e=>e.label),M=f(A,i(`cron.runs.allStatuses`)),P=f(j,i(`cron.runs.allDelivery`)),F=n.form.sessionTarget!==`main`&&n.form.payloadKind===`agentTurn`,I=n.form.deliveryMode===`announce`&&!F?`none`:n.form.deliveryMode,L=b(n.fieldErrors,n.form,I),R=!n.busy&&L.length>0,z=n.jobsQuery.trim().length>0||n.jobsEnabledFilter!==`all`||n.jobsScheduleKindFilter!==`all`||n.jobsLastStatusFilter!==`all`||n.jobsSortBy!==`nextRunAtMs`||n.jobsSortDir!==`asc`,B=R&&!n.canSubmit?L.length===1?i(`cron.form.fixFields`,{count:String(L.length)}):i(`cron.form.fixFieldsPlural`,{count:String(L.length)}):``;return e`
    <section class="card cron-summary-strip">
      <div class="cron-summary-strip__left">
        <div class="cron-summary-item">
          <div class="cron-summary-label">${i(`cron.summary.enabled`)}</div>
          <div class="cron-summary-value">
            <span class=${`chip ${n.status?.enabled?`chip-ok`:`chip-danger`}`}>
              ${n.status?n.status.enabled?i(`cron.summary.yes`):i(`cron.summary.no`):i(`common.na`)}
            </span>
          </div>
        </div>
        <div class="cron-summary-item">
          <div class="cron-summary-label">${i(`cron.summary.jobs`)}</div>
          <div class="cron-summary-value">${n.status?.jobs??i(`common.na`)}</div>
        </div>
        <div class="cron-summary-item cron-summary-item--wide">
          <div class="cron-summary-label">${i(`cron.summary.nextWake`)}</div>
          <div class="cron-summary-value">${o(n.status?.nextWakeAtMs??null)}</div>
        </div>
      </div>
      <div class="cron-summary-strip__actions">
        <button class="btn" ?disabled=${n.loading} @click=${n.onRefresh}>
          ${n.loading?i(`cron.summary.refreshing`):i(`cron.summary.refresh`)}
        </button>
        ${n.error?e`<span class="muted">${n.error}</span>`:t}
      </div>
    </section>

    <section class="cron-workspace">
      <div class="cron-workspace-main">
        <section class="card">
          <div
            class="row"
            style="justify-content: space-between; align-items: flex-start; gap: 12px;"
          >
            <div>
              <div class="card-title">${i(`cron.jobs.title`)}</div>
              <div class="card-sub">${i(`cron.jobs.subtitle`)}</div>
            </div>
            <div class="muted">
              ${i(`cron.jobs.shownOf`,{shown:String(n.jobs.length),total:String(n.jobsTotal)})}
            </div>
          </div>
          <div class="filters" style="margin-top: 12px;">
            <label class="field cron-filter-search">
              <span>${i(`cron.jobs.searchJobs`)}</span>
              <input
                .value=${n.jobsQuery}
                placeholder=${i(`cron.jobs.searchPlaceholder`)}
                @input=${e=>n.onJobsFiltersChange({cronJobsQuery:e.target.value})}
              />
            </label>
            <label class="field">
              <span>${i(`cron.jobs.enabled`)}</span>
              <select
                .value=${n.jobsEnabledFilter}
                @change=${e=>n.onJobsFiltersChange({cronJobsEnabledFilter:e.target.value})}
              >
                <option value="all">${i(`cron.jobs.all`)}</option>
                <option value="enabled">${i(`common.enabled`)}</option>
                <option value="disabled">${i(`common.disabled`)}</option>
              </select>
            </label>
            <label class="field">
              <span>${i(`cron.jobs.schedule`)}</span>
              <select
                data-test-id="cron-jobs-schedule-filter"
                .value=${n.jobsScheduleKindFilter}
                @change=${e=>n.onJobsFiltersChange({cronJobsScheduleKindFilter:e.target.value})}
              >
                <option value="all">${i(`cron.jobs.all`)}</option>
                <option value="at">${i(`cron.form.at`)}</option>
                <option value="every">${i(`cron.form.every`)}</option>
                <option value="cron">${i(`cron.form.cronOption`)}</option>
              </select>
            </label>
            <label class="field">
              <span>${i(`cron.jobs.lastRun`)}</span>
              <select
                data-test-id="cron-jobs-last-status-filter"
                .value=${n.jobsLastStatusFilter}
                @change=${e=>n.onJobsFiltersChange({cronJobsLastStatusFilter:e.target.value})}
              >
                <option value="all">${i(`cron.jobs.all`)}</option>
                <option value="ok">${i(`cron.runs.runStatusOk`)}</option>
                <option value="error">${i(`cron.runs.runStatusError`)}</option>
                <option value="skipped">${i(`cron.runs.runStatusSkipped`)}</option>
              </select>
            </label>
            <label class="field">
              <span>${i(`cron.jobs.sort`)}</span>
              <select
                .value=${n.jobsSortBy}
                @change=${e=>n.onJobsFiltersChange({cronJobsSortBy:e.target.value})}
              >
                <option value="nextRunAtMs">${i(`cron.jobs.nextRun`)}</option>
                <option value="updatedAtMs">${i(`cron.jobs.recentlyUpdated`)}</option>
                <option value="name">${i(`cron.jobs.name`)}</option>
              </select>
            </label>
            <label class="field">
              <span>${i(`cron.jobs.direction`)}</span>
              <select
                .value=${n.jobsSortDir}
                @change=${e=>n.onJobsFiltersChange({cronJobsSortDir:e.target.value})}
              >
                <option value="asc">${i(`cron.jobs.ascending`)}</option>
                <option value="desc">${i(`cron.jobs.descending`)}</option>
              </select>
            </label>
            <label class="field">
              <span>${i(`cron.jobs.reset`)}</span>
              <button
                class="btn"
                data-test-id="cron-jobs-filters-reset"
                ?disabled=${!z}
                @click=${n.onJobsFiltersReset}
              >
                ${i(`cron.jobs.reset`)}
              </button>
            </label>
          </div>
          ${n.jobs.length===0?e` <div class="muted" style="margin-top: 12px">${i(`cron.jobs.noMatching`)}</div> `:e`
                <div class="list" style="margin-top: 12px;">
                  ${n.jobs.map(e=>E(e,n))}
                </div>
              `}
          ${n.jobsHasMore?e`
                <div class="row" style="margin-top: 12px">
                  <button
                    class="btn"
                    ?disabled=${n.loading||n.jobsLoadingMore}
                    @click=${n.onLoadMoreJobs}
                  >
                    ${n.jobsLoadingMore?i(`cron.jobs.loading`):i(`cron.jobs.loadMore`)}
                  </button>
                </div>
              `:t}
        </section>

        <section class="card">
          <div
            class="row"
            style="justify-content: space-between; align-items: flex-start; gap: 12px;"
          >
            <div>
              <div class="card-title">${i(`cron.runs.title`)}</div>
              <div class="card-sub">
                ${n.runsScope===`all`?i(`cron.runs.subtitleAll`):i(`cron.runs.subtitleJob`,{title:C})}
              </div>
            </div>
            <div class="muted">
              ${i(`cron.jobs.shownOf`,{shown:String(D.length),total:String(n.runsTotal)})}
            </div>
          </div>
          <div class="cron-run-filters">
            <div class="cron-run-filters__row cron-run-filters__row--primary">
              <label class="field">
                <span>${i(`cron.runs.scope`)}</span>
                <select
                  .value=${n.runsScope}
                  @change=${e=>n.onRunsFiltersChange({cronRunsScope:e.target.value})}
                >
                  <option value="all">${i(`cron.runs.allJobs`)}</option>
                  <option value="job" ?disabled=${n.runsJobId==null}>
                    ${i(`cron.runs.selectedJob`)}
                  </option>
                </select>
              </label>
              <label class="field cron-run-filter-search">
                <span>${i(`cron.runs.searchRuns`)}</span>
                <input
                  .value=${n.runsQuery}
                  placeholder=${i(`cron.runs.searchPlaceholder`)}
                  @input=${e=>n.onRunsFiltersChange({cronRunsQuery:e.target.value})}
                />
              </label>
              <label class="field">
                <span>${i(`cron.jobs.sort`)}</span>
                <select
                  .value=${n.runsSortDir}
                  @change=${e=>n.onRunsFiltersChange({cronRunsSortDir:e.target.value})}
                >
                  <option value="desc">${i(`cron.runs.newestFirst`)}</option>
                  <option value="asc">${i(`cron.runs.oldestFirst`)}</option>
                </select>
              </label>
            </div>
            <div class="cron-run-filters__row cron-run-filters__row--secondary">
              ${h({id:`status`,title:i(`cron.runs.status`),summary:M,options:O,selected:n.runsStatuses,onToggle:(e,t)=>{let r=d(n.runsStatuses,e,t);n.onRunsFiltersChange({cronRunsStatuses:r})},onClear:()=>{n.onRunsFiltersChange({cronRunsStatuses:[]})}})}
              ${h({id:`delivery`,title:i(`cron.runs.delivery`),summary:P,options:k,selected:n.runsDeliveryStatuses,onToggle:(e,t)=>{let r=d(n.runsDeliveryStatuses,e,t);n.onRunsFiltersChange({cronRunsDeliveryStatuses:r})},onClear:()=>{n.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
            </div>
          </div>
          ${n.runsScope===`job`&&n.runsJobId==null?e`
                <div class="muted" style="margin-top: 12px">${i(`cron.runs.selectJobHint`)}</div>
              `:D.length===0?e`
                  <div class="muted" style="margin-top: 12px">${i(`cron.runs.noMatching`)}</div>
                `:e`
                  <div class="list" style="margin-top: 12px;">
                    ${D.map(e=>N(e,n.basePath,n.onNavigateToChat))}
                  </div>
                `}
          ${(n.runsScope===`all`||n.runsJobId!=null)&&n.runsHasMore?e`
                <div class="row" style="margin-top: 12px">
                  <button
                    class="btn"
                    ?disabled=${n.runsLoadingMore}
                    @click=${n.onLoadMoreRuns}
                  >
                    ${n.runsLoadingMore?i(`cron.jobs.loading`):i(`cron.runs.loadMore`)}
                  </button>
                </div>
              `:t}
        </section>
      </div>

      <section class="card cron-workspace-form">
        <div class="card-title">${i(r?`cron.form.editJob`:`cron.form.newJob`)}</div>
        <div class="card-sub">
          ${i(r?`cron.form.updateSubtitle`:`cron.form.createSubtitle`)}
        </div>
        <div class="cron-form">
          <div class="cron-required-legend">
            <span class="cron-required-marker" aria-hidden="true">*</span> ${i(`cron.form.required`)}
          </div>
          <section class="cron-form-section">
            <div class="cron-form-section__title">${i(`cron.form.basics`)}</div>
            <div class="cron-form-section__sub">${i(`cron.form.basicsSub`)}</div>
            <div class="form-grid cron-form-grid">
              <label class="field">
                ${S(i(`cron.form.fieldName`),!0)}
                <input
                  id="cron-name"
                  .value=${n.form.name}
                  placeholder=${i(`cron.form.namePlaceholder`)}
                  aria-invalid=${n.fieldErrors.name?`true`:`false`}
                  aria-describedby=${c(n.fieldErrors.name?_(`name`):void 0)}
                  @input=${e=>n.onFormChange({name:e.target.value})}
                />
                ${T(n.fieldErrors.name,_(`name`))}
              </label>
              <label class="field">
                <span>${i(`cron.form.description`)}</span>
                <input
                  .value=${n.form.description}
                  placeholder=${i(`cron.form.descriptionPlaceholder`)}
                  @input=${e=>n.onFormChange({description:e.target.value})}
                />
              </label>
              <label class="field">
                ${S(i(`cron.form.agentId`))}
                <input
                  id="cron-agent-id"
                  .value=${n.form.agentId}
                  list="cron-agent-suggestions"
                  ?disabled=${n.form.clearAgent}
                  @input=${e=>n.onFormChange({agentId:e.target.value})}
                  placeholder=${i(`cron.form.agentPlaceholder`)}
                />
                <div class="cron-help">${i(`cron.form.agentHelp`)}</div>
              </label>
              <label class="field checkbox cron-checkbox cron-checkbox-inline">
                <input
                  type="checkbox"
                  .checked=${n.form.enabled}
                  @change=${e=>n.onFormChange({enabled:e.target.checked})}
                />
                <span class="field-checkbox__label">${i(`cron.summary.enabled`)}</span>
              </label>
            </div>
          </section>

          <section class="cron-form-section">
            <div class="cron-form-section__title">${i(`cron.form.schedule`)}</div>
            <div class="cron-form-section__sub">${i(`cron.form.scheduleSub`)}</div>
            <div class="form-grid cron-form-grid">
              <label class="field cron-span-2">
                ${S(i(`cron.form.schedule`))}
                <select
                  id="cron-schedule-kind"
                  .value=${n.form.scheduleKind}
                  @change=${e=>n.onFormChange({scheduleKind:e.target.value})}
                >
                  <option value="every">${i(`cron.form.every`)}</option>
                  <option value="at">${i(`cron.form.at`)}</option>
                  <option value="cron">${i(`cron.form.cronOption`)}</option>
                </select>
              </label>
            </div>
            ${w(n)}
          </section>

          <section class="cron-form-section">
            <div class="cron-form-section__title">${i(`cron.form.execution`)}</div>
            <div class="cron-form-section__sub">${i(`cron.form.executionSub`)}</div>
            <div class="form-grid cron-form-grid">
              <label class="field">
                ${S(i(`cron.form.session`))}
                <select
                  id="cron-session-target"
                  .value=${n.form.sessionTarget}
                  @change=${e=>n.onFormChange({sessionTarget:e.target.value})}
                >
                  <option value="main">${i(`cron.form.main`)}</option>
                  <option value="isolated">${i(`cron.form.isolated`)}</option>
                </select>
                <div class="cron-help">${i(`cron.form.sessionHelp`)}</div>
              </label>
              <label class="field">
                ${S(i(`cron.form.wakeMode`))}
                <select
                  id="cron-wake-mode"
                  .value=${n.form.wakeMode}
                  @change=${e=>n.onFormChange({wakeMode:e.target.value})}
                >
                  <option value="now">${i(`cron.form.now`)}</option>
                  <option value="next-heartbeat">${i(`cron.form.nextHeartbeat`)}</option>
                </select>
                <div class="cron-help">${i(`cron.form.wakeModeHelp`)}</div>
              </label>
              <label class="field ${a?``:`cron-span-2`}">
                ${S(i(`cron.form.payloadKind`))}
                <select
                  id="cron-payload-kind"
                  .value=${n.form.payloadKind}
                  @change=${e=>n.onFormChange({payloadKind:e.target.value})}
                >
                  <option value="systemEvent">${i(`cron.form.systemEvent`)}</option>
                  <option value="agentTurn">${i(`cron.form.agentTurn`)}</option>
                </select>
                <div class="cron-help">
                  ${n.form.payloadKind===`systemEvent`?i(`cron.form.systemEventHelp`):i(`cron.form.agentTurnHelp`)}
                </div>
              </label>
              ${a?e`
                    <label class="field">
                      ${S(i(`cron.form.timeoutSeconds`))}
                      <input
                        id="cron-timeout-seconds"
                        .value=${n.form.timeoutSeconds}
                        placeholder=${i(`cron.form.timeoutPlaceholder`)}
                        aria-invalid=${n.fieldErrors.timeoutSeconds?`true`:`false`}
                        aria-describedby=${c(n.fieldErrors.timeoutSeconds?_(`timeoutSeconds`):void 0)}
                        @input=${e=>n.onFormChange({timeoutSeconds:e.target.value})}
                      />
                      <div class="cron-help">${i(`cron.form.timeoutHelp`)}</div>
                      ${T(n.fieldErrors.timeoutSeconds,_(`timeoutSeconds`))}
                    </label>
                  `:t}
            </div>
            <label class="field cron-span-2">
              ${S(n.form.payloadKind===`systemEvent`?i(`cron.form.mainTimelineMessage`):i(`cron.form.assistantTaskPrompt`),!0)}
              <textarea
                id="cron-payload-text"
                .value=${n.form.payloadText}
                aria-invalid=${n.fieldErrors.payloadText?`true`:`false`}
                aria-describedby=${c(n.fieldErrors.payloadText?_(`payloadText`):void 0)}
                @input=${e=>n.onFormChange({payloadText:e.target.value})}
                rows="4"
              ></textarea>
              ${T(n.fieldErrors.payloadText,_(`payloadText`))}
            </label>
          </section>

          <section class="cron-form-section">
            <div class="cron-form-section__title">${i(`cron.form.deliverySection`)}</div>
            <div class="cron-form-section__sub">${i(`cron.form.deliverySub`)}</div>
            <div class="form-grid cron-form-grid">
              <label class="field ${I===`none`?`cron-span-2`:``}">
                ${S(i(`cron.form.resultDelivery`))}
                <select
                  id="cron-delivery-mode"
                  .value=${I}
                  @change=${e=>n.onFormChange({deliveryMode:e.target.value})}
                >
                  ${F?e` <option value="announce">${i(`cron.form.announceDefault`)}</option> `:t}
                  <option value="webhook">${i(`cron.form.webhookPost`)}</option>
                  <option value="none">${i(`cron.form.noneInternal`)}</option>
                </select>
                <div class="cron-help">${i(`cron.form.deliveryHelp`)}</div>
              </label>
              ${I===`none`?t:e`
                    <label class="field ${I===`webhook`?`cron-span-2`:``}">
                      ${S(i(I===`webhook`?`cron.form.webhookUrl`:`cron.form.channel`),I===`webhook`)}
                      ${I===`webhook`?e`
                            <input
                              id="cron-delivery-to"
                              .value=${n.form.deliveryTo}
                              list="cron-delivery-to-suggestions"
                              aria-invalid=${n.fieldErrors.deliveryTo?`true`:`false`}
                              aria-describedby=${c(n.fieldErrors.deliveryTo?_(`deliveryTo`):void 0)}
                              @input=${e=>n.onFormChange({deliveryTo:e.target.value})}
                              placeholder=${i(`cron.form.webhookPlaceholder`)}
                            />
                          `:e`
                            <select
                              id="cron-delivery-channel"
                              .value=${n.form.deliveryChannel||`last`}
                              @change=${e=>n.onFormChange({deliveryChannel:e.target.value})}
                            >
                              ${v.map(t=>e`<option value=${t}>
                                    ${m(n,t)}
                                  </option>`)}
                            </select>
                          `}
                      ${I===`announce`?e` <div class="cron-help">${i(`cron.form.channelHelp`)}</div> `:e` <div class="cron-help">${i(`cron.form.webhookHelp`)}</div> `}
                    </label>
                    ${I===`announce`?e`
                          <label class="field cron-span-2">
                            ${S(i(`cron.form.to`))}
                            <input
                              id="cron-delivery-to"
                              .value=${n.form.deliveryTo}
                              list="cron-delivery-to-suggestions"
                              @input=${e=>n.onFormChange({deliveryTo:e.target.value})}
                              placeholder=${i(`cron.form.toPlaceholder`)}
                            />
                            <div class="cron-help">${i(`cron.form.toHelp`)}</div>
                          </label>
                        `:t}
                    ${I===`webhook`?T(n.fieldErrors.deliveryTo,_(`deliveryTo`)):t}
                  `}
            </div>
          </section>

          <details class="cron-advanced">
            <summary class="cron-advanced__summary">${i(`cron.form.advanced`)}</summary>
            <div class="cron-help">${i(`cron.form.advancedHelp`)}</div>
            <div class="form-grid cron-form-grid">
              <label class="field checkbox cron-checkbox">
                <input
                  type="checkbox"
                  .checked=${n.form.deleteAfterRun}
                  @change=${e=>n.onFormChange({deleteAfterRun:e.target.checked})}
                />
                <span class="field-checkbox__label">${i(`cron.form.deleteAfterRun`)}</span>
                <div class="cron-help">${i(`cron.form.deleteAfterRunHelp`)}</div>
              </label>
              <label class="field checkbox cron-checkbox">
                <input
                  type="checkbox"
                  .checked=${n.form.clearAgent}
                  @change=${e=>n.onFormChange({clearAgent:e.target.checked})}
                />
                <span class="field-checkbox__label">${i(`cron.form.clearAgentOverride`)}</span>
                <div class="cron-help">${i(`cron.form.clearAgentHelp`)}</div>
              </label>
              <label class="field cron-span-2">
                ${S(`Session key`)}
                <input
                  id="cron-session-key"
                  .value=${n.form.sessionKey}
                  @input=${e=>n.onFormChange({sessionKey:e.target.value})}
                  placeholder="agent:main:main"
                />
                <div class="cron-help">Optional routing key for job delivery and wake routing.</div>
              </label>
              ${s?e`
                    <label class="field checkbox cron-checkbox cron-span-2">
                      <input
                        type="checkbox"
                        .checked=${n.form.scheduleExact}
                        @change=${e=>n.onFormChange({scheduleExact:e.target.checked})}
                      />
                      <span class="field-checkbox__label">${i(`cron.form.exactTiming`)}</span>
                      <div class="cron-help">${i(`cron.form.exactTimingHelp`)}</div>
                    </label>
                    <div class="cron-stagger-group cron-span-2">
                      <label class="field">
                        ${S(i(`cron.form.staggerWindow`))}
                        <input
                          id="cron-stagger-amount"
                          .value=${n.form.staggerAmount}
                          ?disabled=${n.form.scheduleExact}
                          aria-invalid=${n.fieldErrors.staggerAmount?`true`:`false`}
                          aria-describedby=${c(n.fieldErrors.staggerAmount?_(`staggerAmount`):void 0)}
                          @input=${e=>n.onFormChange({staggerAmount:e.target.value})}
                          placeholder=${i(`cron.form.staggerPlaceholder`)}
                        />
                        ${T(n.fieldErrors.staggerAmount,_(`staggerAmount`))}
                      </label>
                      <label class="field">
                        <span>${i(`cron.form.staggerUnit`)}</span>
                        <select
                          .value=${n.form.staggerUnit}
                          ?disabled=${n.form.scheduleExact}
                          @change=${e=>n.onFormChange({staggerUnit:e.target.value})}
                        >
                          <option value="seconds">${i(`cron.form.seconds`)}</option>
                          <option value="minutes">${i(`cron.form.minutes`)}</option>
                        </select>
                      </label>
                    </div>
                  `:t}
              ${a?e`
                    <label class="field cron-span-2">
                      ${S(`Account ID`)}
                      <input
                        id="cron-delivery-account-id"
                        .value=${n.form.deliveryAccountId}
                        list="cron-delivery-account-suggestions"
                        ?disabled=${I!==`announce`}
                        @input=${e=>n.onFormChange({deliveryAccountId:e.target.value})}
                        placeholder="default"
                      />
                      <div class="cron-help">
                        Optional channel account ID for multi-account setups.
                      </div>
                    </label>
                    <label class="field checkbox cron-checkbox cron-span-2">
                      <input
                        type="checkbox"
                        .checked=${n.form.payloadLightContext}
                        @change=${e=>n.onFormChange({payloadLightContext:e.target.checked})}
                      />
                      <span class="field-checkbox__label">Light context</span>
                      <div class="cron-help">
                        Use lightweight bootstrap context for this agent job.
                      </div>
                    </label>
                    <label class="field">
                      ${S(i(`cron.form.model`))}
                      <input
                        id="cron-payload-model"
                        .value=${n.form.payloadModel}
                        list="cron-model-suggestions"
                        @input=${e=>n.onFormChange({payloadModel:e.target.value})}
                        placeholder=${i(`cron.form.modelPlaceholder`)}
                      />
                      <div class="cron-help">${i(`cron.form.modelHelp`)}</div>
                    </label>
                    <label class="field">
                      ${S(i(`cron.form.thinking`))}
                      <input
                        id="cron-payload-thinking"
                        .value=${n.form.payloadThinking}
                        list="cron-thinking-suggestions"
                        @input=${e=>n.onFormChange({payloadThinking:e.target.value})}
                        placeholder=${i(`cron.form.thinkingPlaceholder`)}
                      />
                      <div class="cron-help">${i(`cron.form.thinkingHelp`)}</div>
                    </label>
                  `:t}
              ${a?e`
                    <label class="field cron-span-2">
                      ${S(`Failure alerts`)}
                      <select
                        .value=${n.form.failureAlertMode}
                        @change=${e=>n.onFormChange({failureAlertMode:e.target.value})}
                      >
                        <option value="inherit">Inherit global setting</option>
                        <option value="disabled">Disable for this job</option>
                        <option value="custom">Custom per-job settings</option>
                      </select>
                      <div class="cron-help">
                        Control when this job sends repeated-failure alerts.
                      </div>
                    </label>
                    ${n.form.failureAlertMode===`custom`?e`
                          <label class="field">
                            ${S(`Alert after`)}
                            <input
                              id="cron-failure-alert-after"
                              .value=${n.form.failureAlertAfter}
                              aria-invalid=${n.fieldErrors.failureAlertAfter?`true`:`false`}
                              aria-describedby=${c(n.fieldErrors.failureAlertAfter?_(`failureAlertAfter`):void 0)}
                              @input=${e=>n.onFormChange({failureAlertAfter:e.target.value})}
                              placeholder="2"
                            />
                            <div class="cron-help">Consecutive errors before alerting.</div>
                            ${T(n.fieldErrors.failureAlertAfter,_(`failureAlertAfter`))}
                          </label>
                          <label class="field">
                            ${S(`Cooldown (seconds)`)}
                            <input
                              id="cron-failure-alert-cooldown-seconds"
                              .value=${n.form.failureAlertCooldownSeconds}
                              aria-invalid=${n.fieldErrors.failureAlertCooldownSeconds?`true`:`false`}
                              aria-describedby=${c(n.fieldErrors.failureAlertCooldownSeconds?_(`failureAlertCooldownSeconds`):void 0)}
                              @input=${e=>n.onFormChange({failureAlertCooldownSeconds:e.target.value})}
                              placeholder="3600"
                            />
                            <div class="cron-help">Minimum seconds between alerts.</div>
                            ${T(n.fieldErrors.failureAlertCooldownSeconds,_(`failureAlertCooldownSeconds`))}
                          </label>
                          <label class="field">
                            ${S(`Alert channel`)}
                            <select
                              .value=${n.form.failureAlertChannel||`last`}
                              @change=${e=>n.onFormChange({failureAlertChannel:e.target.value})}
                            >
                              ${v.map(t=>e`<option value=${t}>
                                    ${m(n,t)}
                                  </option>`)}
                            </select>
                          </label>
                          <label class="field">
                            ${S(`Alert to`)}
                            <input
                              .value=${n.form.failureAlertTo}
                              list="cron-delivery-to-suggestions"
                              @input=${e=>n.onFormChange({failureAlertTo:e.target.value})}
                              placeholder="+1555... or chat id"
                            />
                            <div class="cron-help">
                              Optional recipient override for failure alerts.
                            </div>
                          </label>
                          <label class="field">
                            ${S(`Alert mode`)}
                            <select
                              .value=${n.form.failureAlertDeliveryMode||`announce`}
                              @change=${e=>n.onFormChange({failureAlertDeliveryMode:e.target.value})}
                            >
                              <option value="announce">Announce (via channel)</option>
                              <option value="webhook">Webhook (HTTP POST)</option>
                            </select>
                          </label>
                          <label class="field">
                            ${S(`Alert account ID`)}
                            <input
                              .value=${n.form.failureAlertAccountId}
                              @input=${e=>n.onFormChange({failureAlertAccountId:e.target.value})}
                              placeholder="Account ID for multi-account setups"
                            />
                          </label>
                        `:t}
                  `:t}
              ${I===`none`?t:e`
                    <label class="field checkbox cron-checkbox cron-span-2">
                      <input
                        type="checkbox"
                        .checked=${n.form.deliveryBestEffort}
                        @change=${e=>n.onFormChange({deliveryBestEffort:e.target.checked})}
                      />
                      <span class="field-checkbox__label"
                        >${i(`cron.form.bestEffortDelivery`)}</span
                      >
                      <div class="cron-help">${i(`cron.form.bestEffortHelp`)}</div>
                    </label>
                  `}
            </div>
          </details>
        </div>
        ${R?e`
              <div class="cron-form-status" role="status" aria-live="polite">
                <div class="cron-form-status__title">${i(`cron.form.cantAddYet`)}</div>
                <div class="cron-help">${i(`cron.form.fillRequired`)}</div>
                <ul class="cron-form-status__list">
                  ${L.map(t=>e`
                      <li>
                        <button
                          type="button"
                          class="cron-form-status__link"
                          @click=${()=>x(t.inputId)}
                        >
                          ${t.label}: ${i(t.message)}
                        </button>
                      </li>
                    `)}
                </ul>
              </div>
            `:t}
        <div class="row cron-form-actions">
          <button
            class="btn primary"
            ?disabled=${n.busy||!n.canSubmit}
            @click=${n.onAdd}
          >
            ${n.busy?i(`cron.form.saving`):i(r?`cron.form.saveChanges`:`cron.form.addJob`)}
          </button>
          ${B?e`<div class="cron-submit-reason" aria-live="polite">${B}</div>`:t}
          ${r?e`
                <button class="btn" ?disabled=${n.busy} @click=${n.onCancelEdit}>
                  ${i(`cron.form.cancel`)}
                </button>
              `:t}
        </div>
      </section>
    </section>

    ${g(`cron-agent-suggestions`,n.agentSuggestions)}
    ${g(`cron-model-suggestions`,n.modelSuggestions)}
    ${g(`cron-thinking-suggestions`,n.thinkingSuggestions)}
    ${g(`cron-tz-suggestions`,n.timezoneSuggestions)}
    ${g(`cron-delivery-to-suggestions`,n.deliveryToSuggestions)}
    ${g(`cron-delivery-account-suggestions`,n.accountSuggestions)}
  `}function w(t){let n=t.form;return n.scheduleKind===`at`?e`
      <label class="field cron-span-2" style="margin-top: 12px;">
        ${S(i(`cron.form.runAt`),!0)}
        <input
          id="cron-schedule-at"
          type="datetime-local"
          .value=${n.scheduleAt}
          aria-invalid=${t.fieldErrors.scheduleAt?`true`:`false`}
          aria-describedby=${c(t.fieldErrors.scheduleAt?_(`scheduleAt`):void 0)}
          @input=${e=>t.onFormChange({scheduleAt:e.target.value})}
        />
        ${T(t.fieldErrors.scheduleAt,_(`scheduleAt`))}
      </label>
    `:n.scheduleKind===`every`?e`
      <div class="form-grid cron-form-grid" style="margin-top: 12px;">
        <label class="field">
          ${S(i(`cron.form.every`),!0)}
          <input
            id="cron-every-amount"
            .value=${n.everyAmount}
            aria-invalid=${t.fieldErrors.everyAmount?`true`:`false`}
            aria-describedby=${c(t.fieldErrors.everyAmount?_(`everyAmount`):void 0)}
            @input=${e=>t.onFormChange({everyAmount:e.target.value})}
            placeholder=${i(`cron.form.everyAmountPlaceholder`)}
          />
          ${T(t.fieldErrors.everyAmount,_(`everyAmount`))}
        </label>
        <label class="field">
          <span>${i(`cron.form.unit`)}</span>
          <select
            .value=${n.everyUnit}
            @change=${e=>t.onFormChange({everyUnit:e.target.value})}
          >
            <option value="minutes">${i(`cron.form.minutes`)}</option>
            <option value="hours">${i(`cron.form.hours`)}</option>
            <option value="days">${i(`cron.form.days`)}</option>
          </select>
        </label>
      </div>
    `:e`
    <div class="form-grid cron-form-grid" style="margin-top: 12px;">
      <label class="field">
        ${S(i(`cron.form.expression`),!0)}
        <input
          id="cron-cron-expr"
          .value=${n.cronExpr}
          aria-invalid=${t.fieldErrors.cronExpr?`true`:`false`}
          aria-describedby=${c(t.fieldErrors.cronExpr?_(`cronExpr`):void 0)}
          @input=${e=>t.onFormChange({cronExpr:e.target.value})}
          placeholder=${i(`cron.form.expressionPlaceholder`)}
        />
        ${T(t.fieldErrors.cronExpr,_(`cronExpr`))}
      </label>
      <label class="field">
        <span>${i(`cron.form.timezoneOptional`)}</span>
        <input
          .value=${n.cronTz}
          list="cron-tz-suggestions"
          @input=${e=>t.onFormChange({cronTz:e.target.value})}
          placeholder=${i(`cron.form.timezonePlaceholder`)}
        />
        <div class="cron-help">${i(`cron.form.timezoneHelp`)}</div>
      </label>
      <div class="cron-help cron-span-2">${i(`cron.form.jitterHelp`)}</div>
    </div>
  `}function T(n,r){return n?e`<div id=${c(r)} class="cron-help cron-error">${i(n)}</div>`:t}function E(n,r){let a=`list-item list-item-clickable cron-job${r.runsJobId===n.id?` list-item-selected`:``}`,o=e=>{r.onLoadRuns(n.id),e()};return e`
    <div class=${a} @click=${()=>r.onLoadRuns(n.id)}>
      <div class="list-main">
        <div class="list-title">${n.name}</div>
        <div class="list-sub">${s(n)}</div>
        ${D(n)}
        ${n.agentId?e`<div class="muted cron-job-agent">
              ${i(`cron.jobDetail.agent`)}: ${n.agentId}
            </div>`:t}
      </div>
      <div class="list-meta">${A(n)}</div>
      <div class="cron-job-footer">
        <div class="chip-row cron-job-chips">
          <span class=${`chip ${n.enabled?`chip-ok`:`chip-danger`}`}>
            ${n.enabled?i(`cron.jobList.enabled`):i(`cron.jobList.disabled`)}
          </span>
          <span class="chip">${n.sessionTarget}</span>
          <span class="chip">${n.wakeMode}</span>
        </div>
        <div class="row cron-job-actions">
          <button
            class="btn"
            ?disabled=${r.busy}
            @click=${e=>{e.stopPropagation(),o(()=>r.onEdit(n))}}
          >
            ${i(`cron.jobList.edit`)}
          </button>
          <button
            class="btn"
            ?disabled=${r.busy}
            @click=${e=>{e.stopPropagation(),o(()=>r.onClone(n))}}
          >
            ${i(`cron.jobList.clone`)}
          </button>
          <button
            class="btn"
            ?disabled=${r.busy}
            @click=${e=>{e.stopPropagation(),o(()=>r.onToggle(n,!n.enabled))}}
          >
            ${n.enabled?i(`cron.jobList.disable`):i(`cron.jobList.enable`)}
          </button>
          <button
            class="btn"
            ?disabled=${r.busy}
            @click=${e=>{e.stopPropagation(),o(()=>r.onRun(n,`force`))}}
          >
            ${i(`cron.jobList.run`)}
          </button>
          <button
            class="btn"
            ?disabled=${r.busy}
            @click=${e=>{e.stopPropagation(),o(()=>r.onRun(n,`due`))}}
          >
            Run if due
          </button>
          <button
            class="btn"
            ?disabled=${r.busy}
            @click=${e=>{e.stopPropagation(),r.onLoadRuns(n.id)}}
          >
            ${i(`cron.jobList.history`)}
          </button>
          <button
            class="btn danger"
            ?disabled=${r.busy}
            @click=${e=>{e.stopPropagation(),o(()=>r.onRemove(n))}}
          >
            ${i(`cron.jobList.remove`)}
          </button>
        </div>
      </div>
    </div>
  `}function D(n){if(n.payload.kind===`systemEvent`)return e`<div class="cron-job-detail">
      <span class="cron-job-detail-label">${i(`cron.jobDetail.system`)}</span>
      <span class="muted cron-job-detail-value">${n.payload.text}</span>
    </div>`;let r=n.delivery,a=r?.mode===`webhook`?r.to?` (${r.to})`:``:r?.channel||r?.to?` (${r.channel??`last`}${r.to?` -> ${r.to}`:``})`:``;return e`
    <div class="cron-job-detail">
      <span class="cron-job-detail-label">${i(`cron.jobDetail.prompt`)}</span>
      <span class="muted cron-job-detail-value">${n.payload.message}</span>
    </div>
    ${r?e`<div class="cron-job-detail">
          <span class="cron-job-detail-label">${i(`cron.jobDetail.delivery`)}</span>
          <span class="muted cron-job-detail-value">${r.mode}${a}</span>
        </div>`:t}
  `}function O(e){return typeof e!=`number`||!Number.isFinite(e)?i(`common.na`):r(e)}function k(e,t=Date.now()){let n=r(e);return i(e>t?`cron.runEntry.next`:`cron.runEntry.due`,{rel:n})}function A(t){let r=t.state?.lastStatus,a=r===`ok`?`cron-job-status-ok`:r===`error`?`cron-job-status-error`:r===`skipped`?`cron-job-status-skipped`:`cron-job-status-na`,o=i(r===`ok`?`cron.runs.runStatusOk`:r===`error`?`cron.runs.runStatusError`:r===`skipped`?`cron.runs.runStatusSkipped`:`common.na`),s=t.state?.nextRunAtMs,c=t.state?.lastRunAtMs;return e`
    <div class="cron-job-state">
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">${i(`cron.jobState.status`)}</span>
        <span class=${`cron-job-status-pill ${a}`}>${o}</span>
      </div>
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">${i(`cron.jobState.next`)}</span>
        <span class="cron-job-state-value" title=${n(s)}>
          ${O(s)}
        </span>
      </div>
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">${i(`cron.jobState.last`)}</span>
        <span class="cron-job-state-value" title=${n(c)}>
          ${O(c)}
        </span>
      </div>
    </div>
  `}function j(e){switch(e){case`ok`:return i(`cron.runs.runStatusOk`);case`error`:return i(`cron.runs.runStatusError`);case`skipped`:return i(`cron.runs.runStatusSkipped`);default:return i(`cron.runs.runStatusUnknown`)}}function M(e){switch(e){case`delivered`:return i(`cron.runs.deliveryDelivered`);case`not-delivered`:return i(`cron.runs.deliveryNotDelivered`);case`not-requested`:return i(`cron.runs.deliveryNotRequested`);case`unknown`:return i(`cron.runs.deliveryUnknown`);default:return i(`cron.runs.deliveryUnknown`)}}function N(r,o,s){let c=typeof r.sessionKey==`string`&&r.sessionKey.trim().length>0?`${a(`chat`,o)}?session=${encodeURIComponent(r.sessionKey)}`:null,l=j(r.status??`unknown`),u=M(r.deliveryStatus??`not-requested`),d=r.usage,f=d&&typeof d.total_tokens==`number`?`${d.total_tokens} tokens`:d&&typeof d.input_tokens==`number`&&typeof d.output_tokens==`number`?`${d.input_tokens} in / ${d.output_tokens} out`:null;return e`
    <div class="list-item cron-run-entry">
      <div class="list-main cron-run-entry__main">
        <div class="list-title cron-run-entry__title">
          ${r.jobName??r.jobId}
          <span class="muted"> · ${l}</span>
        </div>
        <div class="list-sub cron-run-entry__summary">
          ${r.summary??r.error??i(`cron.runEntry.noSummary`)}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${u}</span>
          ${r.model?e`<span class="chip">${r.model}</span>`:t}
          ${r.provider?e`<span class="chip">${r.provider}</span>`:t}
          ${f?e`<span class="chip">${f}</span>`:t}
        </div>
      </div>
      <div class="list-meta cron-run-entry__meta">
        <div>${n(r.ts)}</div>
        ${typeof r.runAtMs==`number`?e`<div class="muted">${i(`cron.runEntry.runAt`)} ${n(r.runAtMs)}</div>`:t}
        <div class="muted">${r.durationMs??0}ms</div>
        ${typeof r.nextRunAtMs==`number`?e`<div class="muted">${k(r.nextRunAtMs)}</div>`:t}
        ${c?e`<div>
              <a
                class="session-link"
                href=${c}
                @click=${e=>{e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||s&&r.sessionKey&&(e.preventDefault(),s(r.sessionKey))}}
                >${i(`cron.runEntry.openRunChat`)}</a
              >
            </div>`:t}
        ${r.error?e`<div class="muted">${r.error}</div>`:t}
        ${r.deliveryError?e`<div class="muted">${r.deliveryError}</div>`:t}
      </div>
    </div>
  `}export{C as renderCron};
//# sourceMappingURL=cron-CaEC7Z9Z.js.map