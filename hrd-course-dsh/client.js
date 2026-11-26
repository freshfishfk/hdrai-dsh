window.__ModuleLoader__.load({
  id: '@local/hrd-course-dsh',
  factory(require) {
    const styles = String.raw`
:is([data-hrd-course-landing], [data-hrd-course-answer], .hrd-sidebar-actions, .hrd-credit-dialog, .hrd-account-trigger) {
  --hrd-accent: light-dark(#285ec9, #94b5ff);
  --hrd-surface: light-dark(#fbfcff, #222632);
  --hrd-soft: light-dark(#ebf2ff, #242e43);
  --hrd-line: light-dark(#dfe6f0, #384050);
}

[data-hrd-course-app] [data-home-whale] {
  display: none;
}

/* The native hero options share a row with the hardcoded workspace button. */
[data-composer-seat] div:has(> div > [data-slot="conversation.hero.options"] > [data-hrd-course-landing]) {
  display: block;
  margin: 0 0 12px;
  padding-inline: var(--dsh-composer-side-clearance, 16px);
}
[data-composer-seat] div:has(> [data-slot="conversation.hero.options"] > [data-hrd-course-landing]) {
  display: block;
  margin: 0;
}
[data-composer-seat] div:has(> div > [data-slot="conversation.hero.options"] > [data-hrd-course-landing]) > button[aria-haspopup="menu"],
[data-composer-seat] div:has(+ div > div > [data-slot="conversation.hero.options"] > [data-hrd-course-landing]) {
  display: none;
}

[data-hrd-course-app] nav:has([data-slot="sidebar.panellist"]),
[data-hrd-course-app] [data-sidebar-workspace-header] button:is([aria-label="添加工作区"], [aria-label="Add workspace"]) {
  display: none;
}

[data-hrd-course-landing] {
  color: inherit;
  padding: 4px 0 6px;
}
.hrd-course-intro {
  margin: 0 0 30px;
}
.hrd-course-intro::before {
  content: '';
  display: block;
  inline-size: 32px;
  block-size: 3px;
  margin-bottom: 14px;
  border-radius: 3px;
  background: var(--hrd-accent);
}
.hrd-course-intro h1 {
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 650;
  line-height: 1.22;
  letter-spacing: -.035em;
  margin: 0;
}
.hrd-course-intro p {
  margin: 10px 0 0;
  color: light-dark(#536176, #a6b0c0);
  font-size: 15px;
  line-height: 1.7;
}
.hrd-suggestions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.hrd-suggestions-header h2,
.hrd-followups h3 {
  font-size: 14px;
  font-weight: 650;
  line-height: 1.5;
  margin: 0;
}
.hrd-refresh {
  padding: 5px 4px;
  border: 0;
  background: none;
  color: var(--hrd-accent);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}
.hrd-refresh:hover {
  text-decoration: underline;
}
.hrd-question-list {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.hrd-question-list > li {
  min-width: 0;
}
.hrd-starters {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.hrd-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  inline-size: 100%;
  min-block-size: 44px;
  height: 100%;
  padding: 9px 13px;
  color: inherit;
  background: var(--hrd-surface);
  border: 1px solid var(--hrd-line);
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  text-align: start;
  cursor: pointer;
}
.hrd-question:hover {
  color: var(--hrd-accent);
  background: var(--hrd-soft);
  border-color: color-mix(in srgb, var(--hrd-accent) 36%, var(--hrd-line));
}
.hrd-question-arrow {
  flex: none;
  color: var(--hrd-accent);
  font-size: 15px;
}

.hrd-sidebar-actions {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}
.hrd-course-nav {
  display: grid;
  gap: 4px;
}
.hrd-course-nav-label {
  padding: 8px 9px 2px;
  font-size: 12px;
  color: light-dark(#536176, #a6b0c0);
}
.hrd-course-link {
  display: flex;
  align-items: center;
  gap: 8px;
  inline-size: 100%;
  min-block-size: 37px;
  padding: 5px 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  text-align: start;
  font: inherit;
  cursor: pointer;
}
.hrd-course-nav[data-compact] .hrd-course-link {
  justify-content: center;
  padding-inline: 2px;
}
.hrd-course-link:hover,
.hrd-course-link[aria-current="true"] {
  background: var(--hrd-soft);
  color: var(--hrd-accent);
}
.hrd-course-link:hover {
  border-color: color-mix(in srgb, var(--hrd-accent) 36%, transparent);
}
.hrd-course-initial {
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: color-mix(in srgb, var(--hrd-accent) 12%, transparent);
  min-inline-size: 23px;
  block-size: 23px;
  font-size: 12px;
  font-weight: 650;
}
.hrd-question:focus-visible,
.hrd-refresh:focus-visible,
.hrd-course-link:focus-visible,
.hrd-sources summary:focus-visible {
  outline: 2px solid var(--hrd-accent);
  outline-offset: -2px;
}

/* Keep the native streaming Markdown renderer and give its blocks room. */
[data-hrd-course-app] [data-chat-flow] [data-streaming] {
  line-height: 1.8;
}
[data-hrd-course-app] [data-chat-flow] [data-streaming] :is(p, li),
[data-hrd-course-app] [data-chat-flow] [data-chat-group-part="response"] :is(p, li) {
  line-height: 1.8;
}
[data-hrd-course-app] [data-chat-flow] [data-chat-group-part="response"] p + p {
  margin-top: .85em;
}

[data-hrd-course-answer] {
  --hrd-summary-inset: 12px;
  margin: 14px 0 16px;
  padding-top: 13px;
  border-top: 1px solid var(--hrd-line);
  overflow-wrap: anywhere;
  font-size: 14px;
}
.hrd-sources summary {
  display: grid;
  align-items: baseline;
  gap: 7px;
  min-height: 32px;
  padding: 8px var(--hrd-summary-inset);
  border-radius: 8px;
  line-height: 1.55;
  list-style: none;
  cursor: pointer;
}
.hrd-sources summary::-webkit-details-marker {
  display: none;
}
.hrd-sources > summary {
  grid-template-columns: 12px minmax(0, 1fr);
  color: var(--hrd-accent);
  background: var(--hrd-soft);
  font-weight: 600;
}
.hrd-source > summary {
  grid-template-columns: 12px auto minmax(0, 1fr) auto;
}
.hrd-sources summary::before {
  content: '›';
  display: inline-block;
  justify-self: center;
  font-size: 18px;
  line-height: 1;
  transform-origin: 50% 55%;
}
.hrd-sources details[open] > summary::before,
.hrd-sources[open] > summary::before {
  transform: rotate(90deg);
}
.hrd-source-list {
  display: grid;
  gap: 6px;
  margin-top: 8px;
}
.hrd-source {
  background: var(--hrd-surface);
  border: 1px solid var(--hrd-line);
  border-radius: 8px;
}
.hrd-source summary:hover {
  background: var(--hrd-soft);
}
.hrd-source-ref {
  color: var(--hrd-accent);
  white-space: nowrap;
  font-size: 12px;
}
.hrd-source-page {
  color: light-dark(#536176, #a6b0c0);
  white-space: nowrap;
  font-size: 12px;
}
.hrd-source-passage {
  margin: 0 var(--hrd-summary-inset);
  border-top: 1px solid var(--hrd-line);
}
.hrd-source-passage p {
  white-space: pre-line;
  line-height: 1.85;
  margin: 10px 0;
}
.hrd-source-status {
  margin: 0;
  color: light-dark(#536176, #a6b0c0);
}
.hrd-followups {
  margin-top: 16px;
}
.hrd-followups h3 {
  margin-bottom: 7px;
}
.hrd-followups .hrd-question {
  min-block-size: 38px;
  padding-block: 6px;
}


.hrd-account-trigger {
  justify-content: flex-start;
}
.hrd-account-trigger[data-compact] {
  justify-content: center;
  padding-inline: 2px;
}
.hrd-account-trigger svg {
  flex: none;
}
.hrd-credit-dialog {
  inline-size: min(480px, calc(100% - 32px));
  max-block-size: calc(100dvh - 32px);
  padding: 0;
  color: light-dark(#172033, #edf1fa);
  background: var(--hrd-surface);
  border: 1px solid var(--hrd-line);
  border-radius: 16px;
  box-shadow: 0 16px 60px #0b19333a;
}
.hrd-credit-dialog::backdrop {
  background: #101c3266;
}
.hrd-credit-panel {
  display: grid;
  gap: 20px;
  padding: clamp(16px, 5vw, 24px);
}
.hrd-credit-header,
.hrd-credit-history-header,
.hrd-credit-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.hrd-credit-header h2,
.hrd-credit-history-header h3,
.hrd-credit-panel p {
  margin: 0;
}
.hrd-credit-header h2 {
  font-size: 20px;
  font-weight: 650;
}
.hrd-credit-history-header h3 {
  font-size: 15px;
  font-weight: 650;
}
.hrd-credit-close {
  min-inline-size: 36px;
  min-block-size: 36px;
  color: inherit;
  background: transparent;
  border: 1px solid var(--hrd-line);
  border-radius: 8px;
  font: inherit;
  font-size: 20px;
  cursor: pointer;
}
.hrd-credit-close:hover {
  background: var(--hrd-soft);
}
.hrd-credit-balance {
  padding: 16px 18px;
  border-radius: 10px;
  background: var(--hrd-soft);
}
.hrd-credit-balance p,
.hrd-credit-entry time,
.hrd-credit-status {
  color: light-dark(#536176, #a6b0c0);
  font-size: 13px;
}
.hrd-credit-amount,
.hrd-credit-entry strong {
  font-variant-numeric: tabular-nums;
}
.hrd-credit-amount {
  display: block;
  font-size: clamp(26px, 8vw, 36px);
  line-height: 1.25;
  font-weight: 650;
  overflow-wrap: anywhere;
}
.hrd-credit-list {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
}
.hrd-credit-entry {
  border-top: 1px solid var(--hrd-line);
  padding: 10px 0;
  font-size: 14px;
}
.hrd-credit-entry > div {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}
.hrd-credit-entry time {
  display: block;
  margin-top: 2px;
}
.hrd-credit-entry strong {
  white-space: nowrap;
}
.hrd-credit-entry[data-incoming] strong {
  color: var(--hrd-accent);
}
.hrd-credit-status {
  padding-block: 10px;
}
.hrd-credit-dialog button:focus-visible,
.hrd-account-trigger:focus-visible {
  outline: 2px solid var(--hrd-accent);
  outline-offset: 2px;
}
[data-hrd-course-app] [data-composer-stat],
[data-hrd-course-app] [data-composer-dock] span[style*="--dsh-context-"],
[data-hrd-course-app] [data-turn-tail] [data-clock="end"] span:has(> button[aria-haspopup="dialog"]) {
  display: none;
}

@media (max-width: 600px) {
  .hrd-course-intro {
    margin-bottom: 17px;
  }
  .hrd-starters {
    grid-template-columns: minmax(0, 1fr);
    gap: 5px;
  }
  .hrd-question {
    font-size: 13px;
    padding-block: 7px;
  }
  .hrd-source > summary {
    grid-template-columns: 9px auto minmax(0, 1fr);
  }
  .hrd-source-page {
    grid-column: 3;
  }
}
`

    const { createElement: h, useEffect, useRef, useState, useSyncExternalStore } = require('react')
    const kind = 'hrd-course-answer'
    const defaultCourse = 'module-one-qa'
    const courses = {
      [defaultCourse]: {
        title: '哲学经营',
        description: '围绕经营哲学、企业战略与组织发展，结合课程资料解答你的问题。',
        questions: [
          '如何科学提炼和运用自己企业的经营理念？',
          '企业如何做大、做强、做久？',
          '如何设计产业战略和行业战略？',
          '企业如何从本质上提升绩效？',
          '经营管理者如何进行自我诊断？',
          '如何实现以人为根本的经营？',
          '企业文化瓶颈如何突破？',
          '如何把握企业的内在运作原理？',
          '如何参与横向竞争和纵向竞争？',
          '企业的四大要素如何运用？',
          '如何对自己企业进行自我诊断？',
          '如何实现企业全员价值观的共通？',
        ],
      },
      'module-two-qa': {
        title: '全局经营',
        description: '围绕经营全局、组织体制、战略执行与事业发展，结合课程资料答疑。',
        questions: [
          '如何科学掌控企业的经营管理全局？',
          '如何正确处理董事长与总经理的关系？',
          '战略如何通过组织去分解和执行？',
          '如何正确建立企业体制与经营体制？',
          '如何制定人力资源战略、设计薪酬？',
          '如何从系统上全面提升企业绩效？',
          '如何提高经营管理的速度和精度？',
          '事业如何科学建立并不断扩大？',
          '如何选择和培养事业部负责人？',
          '如何科学设计事业结构战略？',
          '企业的生态组织如何科学设计？',
          '如何把握事业的生命周期？',
        ],
      },
      'module-three-qa': {
        title: '战略经营',
        description: '围绕市场战略、竞争策略、企业扩张与转型升级，结合课程资料答疑。',
        questions: [
          '顾客战略如何设计？',
          '商品力战略如何设计？',
          '业态战略如何设计？',
          '如何定位自己企业的市场战略？',
          '如何进入市场和退出市场？',
          '如何打造自己企业的格差竞争力？',
          '如何把握现实市场、显在市场和潜在市场？',
          '如何在市场成长中快速扩张？',
          '如何参与低谷期和成长期竞争？',
          '如何实施七大战略与升级转型？',
          '不同规模企业的战略路径如何选择？',
          '如何避开多元化战略陷阱？',
        ],
      },
      'module-four-qa': {
        title: '体制经营',
        description: '围绕组织成长、集团治理、干部分工与集权分权，结合课程资料答疑。',
        questions: [
          '企业组织的成长方式有哪几种？',
          '如何实现企业组织的三级跨越？',
          '如何规避企业快速扩大的陷阱？',
          '高度化组织如何对应企业战略？',
          '集团公司如何进行五个高度集权？',
          '集团公司如何进行不同层次分权？',
          '企业组织如何快速单纯性扩大？',
          '单纯性组织如何对应企业战略？',
          '如何成长为大型和超大型企业集团？',
          '经营组织如何高度化成长？',
          '中大型企业快速扩张原理是什么？',
          '如何扩大市场规模、提高占有率？',
        ],
      },
      'module-five-qa': {
        title: '综合经营管理',
        description: '围绕经营计划、核心团队、企业文化与战略落地，结合课程资料答疑。',
        questions: [
          '企业年度经营计划如何科学制定？',
          '如何建立企业的核心团队？',
          '如何塑造和传播企业文化？',
          '如何把长中期计划分解为年度和月度计划？',
          '经营理念如何衔接月周日计划？',
          '如何解决企业百年成长发展难题？',
          '企业宏观经营计划如何制定？',
          '企业微观经营计划如何制定？',
          '企业经营的七大方向计划是什么？',
          '企业经营的七个具体计划是什么？',
          '企业如何仰望星空并活在当下？',
          '如何打通企业的任督二脉？',
        ],
      },
    }
    const batchSize = 6
    const statusLabels = {
      found: '本轮参考资料',
      empty: '本轮未检索到课程资料',
      unavailable: '课程资料检索暂不可用',
    }
    const sentences = new Intl.Segmenter('zh', { granularity: 'sentence' })

    function passageParagraphs(content) {
      return content.trim().split(/\r?\n\s*\r?\n/).flatMap(block => {
        const paragraphs = []
        let paragraph = ''
        for (const { segment } of sentences.segment(block)) {
          paragraph += segment
          if (paragraph.length >= 170) {
            paragraphs.push(paragraph.trim())
            paragraph = ''
          }
        }
        if (paragraph.trim()) paragraphs.push(paragraph.trim())
        return paragraphs
      })
    }

    function QuestionButton({ question, onPick }) {
      return h('button', { type: 'button', className: 'hrd-question', onClick: () => onPick(question) },
        h('span', null, question),
        h('span', { 'aria-hidden': true, className: 'hrd-question-arrow' }, '↗'))
    }

    function CourseHome({ inputActions, useProjection }) {
      const preset = useProjection('agentPreset') ?? defaultCourse
      const course = Object.hasOwn(courses, preset) ? courses[preset] : undefined
      return course ? h(CourseWelcome, { key: preset, course, inputActions }) : null
    }

    function CourseWelcome({ course, inputActions }) {
      const [batch, setBatch] = useState(0)
      const batches = Math.ceil(course.questions.length / batchSize)
      const questions = course.questions.slice(batch * batchSize, (batch + 1) * batchSize)
      return h('section', { 'data-hrd-course-landing': '', 'aria-labelledby': 'hrd-course-title' },
        h('header', { className: 'hrd-course-intro' },
          h('h1', { id: 'hrd-course-title' }, course.title),
          h('p', null, course.description)),
        questions.length > 0 && h('section', { 'aria-labelledby': 'hrd-suggestions-title' },
          h('div', { className: 'hrd-suggestions-header' },
            h('h2', { id: 'hrd-suggestions-title' }, '试着这样问'),
            batches > 1 && h('button', {
              type: 'button',
              className: 'hrd-refresh',
              onClick: () => setBatch(current => (current + 1) % batches),
            }, '换一批')),
          h('ul', { className: 'hrd-question-list hrd-starters' },
            ...questions.map(question => h('li', { key: question },
              h(QuestionButton, { question, onPick: inputActions.setDraft }))))))
    }

    function CourseSidebar({ children, wide, startCourse, useSessionList }) {
      const { byId } = useSessionList()
      const main = Object.values(byId).find(session => (session.retainedBy.mainView ?? 0) > 0)
      const selected = main?.projectionValues?.agentPreset ?? defaultCourse
      return h('div', { className: 'hrd-sidebar-actions' },
        h('nav', { 'aria-label': '课程智能体', className: 'hrd-course-nav', 'data-compact': wide ? undefined : '' },
          wide && h('div', { className: 'hrd-course-nav-label' }, '课程智能体'),
          ...Object.entries(courses).map(([id, course]) => h('button', {
            key: id,
            type: 'button',
            className: 'hrd-course-link',
            'aria-label': course.title,
            'aria-current': selected === id ? 'true' : undefined,
            title: course.title,
            onClick: () => startCourse(id),
          },
          h('span', { className: 'hrd-course-initial', 'aria-hidden': true }, course.title[0]),
          wide && h('span', null, course.title)))),
        children)
    }

    const pointFormat = new Intl.NumberFormat('zh-CN')
    const dateFormat = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short' })

    function MyCredits({ wide, useSessionList }) {
      const { byId } = useSessionList()
      const currentSession = Object.values(byId).find(session => (session.retainedBy.mainView ?? 0) > 0 && !session.blank)
      const dialog = useRef(null)
      const inFlight = useRef(null)
      const [wallet, setWallet] = useState(null)
      const [loading, setLoading] = useState(false)
      const [failed, setFailed] = useState(false)
      useEffect(() => () => inFlight.current?.abort(), [])

      async function load(before = null) {
        inFlight.current?.abort()
        const controller = new AbortController()
        inFlight.current = controller
        setLoading(true)
        setFailed(false)
        try {
          const params = new URLSearchParams()
          if (currentSession) params.set('session', currentSession.id)
          if (before !== null) params.set('before', String(before))
          const response = await fetch(`/api/hrd/credits?${params}`, { signal: controller.signal, cache: 'no-store' })
          if (!response.ok) throw new Error('Credit history is unavailable')
          const page = await response.json()
          if (!controller.signal.aborted) {
            setWallet(previous => before === null ? page : {
              ...page, entries: [...(previous?.entries ?? []), ...page.entries],
            })
          }
        } catch {
          if (!controller.signal.aborted) setFailed(true)
        } finally {
          if (inFlight.current === controller) setLoading(false)
        }
      }

      function open() {
        setWallet(null)
        dialog.current.showModal()
        void load()
      }

      function close() {
        inFlight.current?.abort()
        dialog.current.close()
      }

      return h('div', { className: 'hrd-sidebar-actions' },
        h('button', {
          type: 'button', className: 'hrd-course-link hrd-account-trigger',
          'aria-label': '我的', 'aria-haspopup': 'dialog', title: '我的',
          'data-compact': wide ? undefined : '', onClick: open,
        },
        h('svg', {
          width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
          stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', 'aria-hidden': true,
        }, h('circle', { cx: 12, cy: 8, r: 3.2 }),
        h('path', { d: 'M5 20v-1a7 7 0 0 1 14 0v1' })),
        wide && h('span', null, '我的')),
        h('dialog', {
          ref: dialog, className: 'hrd-credit-dialog', 'aria-labelledby': 'hrd-credit-title',
          onClose: () => inFlight.current?.abort(),
        },
        h('div', { className: 'hrd-credit-panel' },
          h('header', { className: 'hrd-credit-header' },
            h('h2', { id: 'hrd-credit-title' }, '我的积分'),
            h('button', { type: 'button', className: 'hrd-credit-close', 'aria-label': '关闭', onClick: close }, '×')),
          h('div', { className: 'hrd-credit-balance', 'aria-live': 'polite' },
            h('p', null, '当前可用积分'),
            h('strong', { className: 'hrd-credit-amount' }, wallet ? pointFormat.format(wallet.balance) : '—'),
            wallet?.sessionSpent > 0 && h('p', null, `当前会话累计消耗 ${pointFormat.format(wallet.sessionSpent)} 积分`)),
          h('section', { 'aria-labelledby': 'hrd-credit-history', 'aria-busy': loading },
            h('div', { className: 'hrd-credit-history-header' },
              h('h3', { id: 'hrd-credit-history' }, '积分历史'),
              h('button', { type: 'button', className: 'hrd-refresh', disabled: loading, onClick: () => load() }, '刷新')),
            wallet?.entries.length > 0 && h('ol', { className: 'hrd-credit-list' },
              ...wallet.entries.map(entry => h('li', {
                key: entry.id, className: 'hrd-credit-entry', 'data-incoming': entry.points > 0 ? '' : undefined,
              }, h('div', null,
                h('span', null, entry.kind === 'grant'
                  ? '初始赠送'
                  : `${courses[entry.course]?.title ?? '课程答疑'} · 第 ${entry.turn} 轮`),
                h('time', { dateTime: new Date(entry.time).toISOString() },
                  [byId[entry.sessionId]?.title, dateFormat.format(entry.time)].filter(Boolean).join(' · '))),
              h('strong', null, `${entry.points > 0 ? '+' : ''}${pointFormat.format(entry.points)}`)))),
            wallet?.entries.length === 0 && h('p', { className: 'hrd-credit-status' }, '暂无积分记录'),
            failed && h('p', { className: 'hrd-credit-status', role: 'alert' }, '积分记录暂时无法加载，请刷新重试。'),
            loading && h('p', { className: 'hrd-credit-status', role: 'status' }, '正在加载…'),
            wallet?.nextCursor != null && h('button', {
              type: 'button', className: 'hrd-refresh', disabled: loading, onClick: () => load(wallet.nextCursor),
            }, '加载更多')))))
    }

    function Source({ source }) {
      return h('details', { className: 'hrd-source' },
        h('summary', null,
          h('span', { className: 'hrd-source-ref' }, source.ref),
          h('span', { className: 'hrd-source-title' }, source.title),
          source.page !== null && h('span', { className: 'hrd-source-page' }, `第 ${source.page} 页`)),
        h('div', { className: 'hrd-source-passage' },
          ...passageParagraphs(source.content).map((paragraph, index) => h('p', { key: index }, paragraph))))
    }

    function AnswerDetails({ node, inputActions }) {
      const { status, sources, questions } = node.data
      return h('section', {
        'aria-label': '课程参考资料和追问',
        'data-hrd-course-answer': status,
      },
      sources.length > 0
        ? h('details', { className: 'hrd-sources' },
          h('summary', null, `查看 ${sources.length} 条参考资料`),
          h('div', { className: 'hrd-source-list' },
            ...sources.map(source => h(Source, { key: source.ref, source }))))
        : h('p', { className: 'hrd-source-status' }, statusLabels[status]),
      questions.length > 0 && h('div', { className: 'hrd-followups' },
        h('h3', null, '继续追问'),
        h('ul', { className: 'hrd-question-list' },
          ...questions.map(question => h('li', { key: question },
            h(QuestionButton, { question, onPick: inputActions.setDraft }))))))
    }

    function readRecord(event) {
      const data = event.data
      if (!data || !Object.hasOwn(statusLabels, data.status)) return null
      if (!Array.isArray(data.sources) || data.sources.length > 5 || !Array.isArray(data.questions)) return null
      if (!data.sources.every(source => source &&
        /^资料[1-5]$/.test(source.ref) && typeof source.title === 'string' &&
        typeof source.content === 'string' && (source.page === null || Number.isSafeInteger(source.page)))) return null
      if (!data.questions.every(question => typeof question === 'string' && question.length <= 80)) return null
      return data
    }

    const hideControl = () => null
    const promptPlaceholder = () => '输入你的课程问题…'

    return {
      inject: ['uiConversation', 'slots'],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style')
          style.textContent = styles
          document.head.append(style)
          document.documentElement.setAttribute('data-hrd-course-app', '')
          return () => {
            style.remove()
            document.documentElement.removeAttribute('data-hrd-course-app')
          }
        }, 'HRD course styles')

        for (const name of ['conversation.hero.agentPreset', 'conversation.input.permission', 'conversation.input.model']) {
          ctx.slots.inject(name, () => ctx.slots.register({ name, priority: -100 }, hideControl))
        }
        ctx.slots.inject('sidebar.brand.name', () => ctx.slots.register({
          name: 'sidebar.brand.name', priority: -100,
        }, () => 'HRD-AI'))
        ctx.slots.inject('conversation.hero.options', () => ctx.slots.register({
          name: 'conversation.hero.options', id: 'hrd-course-home',
        }, CourseHome))
        ctx.slots.inject('conversation.input.placeholder', () => ctx.slots.register({
          name: 'conversation.input.placeholder', id: 'hrd-course-question', priority: -100,
          select: () => true,
        }, promptPlaceholder))
        ctx.inject(['uiWorkspace', 'sessions'], scope => {
          const sessionList = scope.sessions.list
          const useSessionList = () => useSyncExternalStore(sessionList.subscribe, sessionList.getSnapshot)
          scope.slots.inject('sidebar.settings', () => scope.slots.register({
            name: 'sidebar.settings', priority: -100, inject: () => ({ useSessionList }),
          }, MyCredits))
          scope.slots.inject('sidebar.session.action', () => scope.slots.register({
            name: 'sidebar.session.action', id: 'hrd-course-nav',
            inject: () => ({
              useSessionList,
              startCourse: id => scope.uiWorkspace.startSession(undefined, {
                clearPreviousDraft: false, agentPreset: id,
              }),
            }),
          }, CourseSidebar))
        })

        ctx.uiConversation.events.register({
          kind,
          target: 'chat',
          match: event => event.type === 'plugin:hrd-course/answer' && readRecord(event)
            ? { id: String(event.seq), role: 'start' }
            : null,
          start: (_context, match) => readRecord(match.event),
          update: context => context.state,
          publication: () => 'immediate',
          buildViewNode: context => !context.start || !context.state ? null : {
            key: context.key,
            kind,
            id: context.id,
            target: 'chat',
            anchorSeq: context.start.event.seq,
            location: context.start.location,
            groupTree: 'turn',
            visibility: 'visible',
            data: context.state,
          },
        })
        ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
          name: 'conversation.chat.node', key: kind,
        }, AnswerDetails))
      },
    }
  },
})
