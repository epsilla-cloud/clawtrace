export type DocPage = {
  slug: string;
  title: string;
  file: string;
  description: string;
  keywords: string[];
};

export type DocSection = {
  title: string;
  pages: DocPage[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    title: 'Overview',
    pages: [
      {
        slug: 'overview',
        title: 'The Vision',
        file: 'overview.md',
        description: 'ClawTrace is observability for AI agents — the foundation for self-evolving, reliable, and cost-efficient autonomous systems.',
        keywords: ['AI agent observability', 'self-evolving agents', 'agent debugging', 'OpenClaw monitoring'],
      },
    ],
  },
  {
    title: 'Getting Started',
    pages: [
      {
        slug: 'getting-started/connect-to-openclaw',
        title: 'Connect to OpenClaw',
        file: 'getting-started-connect.md',
        description: 'Create a connection in ClawTrace to link your OpenClaw AI agent instance and generate an observe key.',
        keywords: ['OpenClaw setup', 'ClawTrace connection', 'observe key', 'agent monitoring setup'],
      },
      {
        slug: 'getting-started/install-plugin',
        title: 'Install the Plugin',
        file: 'getting-started-install.md',
        description: 'Install and configure the ClawTrace plugin for OpenClaw to start streaming agent telemetry data.',
        keywords: ['ClawTrace plugin', 'OpenClaw plugin install', 'agent telemetry', 'trace collection'],
      },
      {
        slug: 'getting-started/connections',
        title: 'View Connections',
        file: 'getting-started-connections.md',
        description: 'View and manage all connected OpenClaw agent instances from the ClawTrace dashboard.',
        keywords: ['agent connections', 'ClawTrace dashboard', 'manage agents', 'OpenClaw instances'],
      },
    ],
  },
  {
    title: 'Trajectory Analysis',
    pages: [
      {
        slug: 'trajectory-analysis/dashboard',
        title: 'Trajectory Dashboard',
        file: 'trajectory-dashboard.md',
        description: 'Analyze agent run metrics, trends, and individual trajectories with the ClawTrace trajectory dashboard.',
        keywords: ['trajectory dashboard', 'agent metrics', 'run analysis', 'LLM cost tracking', 'token usage'],
      },
      {
        slug: 'trajectory-analysis/detail-views',
        title: 'Detail Views',
        file: 'trajectory-detail.md',
        description: 'Inspect individual agent trajectories with trace view, call graph, timeline, and efficiency analysis.',
        keywords: ['trace view', 'call graph', 'timeline analysis', 'agent debugging', 'span inspection'],
      },
    ],
  },
  {
    title: 'Ask Tracy',
    pages: [
      {
        slug: 'ask-tracy',
        title: 'Your OpenClaw Doctor Agent',
        file: 'ask-tracy.md',
        description: 'Tracy is ClawTrace\'s AI observability analyst — ask questions about your agent trajectories, costs, errors, and get actionable optimization advice through natural conversation.',
        keywords: ['Tracy AI', 'AI observability', 'agent doctor', 'cost analysis', 'performance debugging', 'OpenClaw optimization', 'conversational analytics'],
      },
    ],
  },
  {
    title: 'Billing & Credits',
    pages: [
      {
        slug: 'billing/credits',
        title: 'Credit System',
        file: 'billing-credits.md',
        description: 'Understand ClawTrace consumption-based billing, credit packages, pricing, and how credits are consumed.',
        keywords: ['ClawTrace pricing', 'credit system', 'billing', 'consumption billing', 'AI agent costs'],
      },
      {
        slug: 'billing/usage',
        title: 'Usage History',
        file: 'billing-usage.md',
        description: 'Track your ClawTrace credit usage over time with detailed breakdowns by category and time period.',
        keywords: ['usage history', 'credit usage', 'cost breakdown', 'storage costs', 'query costs'],
      },
    ],
  },
  {
    title: 'Account',
    pages: [
      {
        slug: 'account/referrals',
        title: 'Account & Referrals',
        file: 'account-referral.md',
        description: 'Manage your ClawTrace account, sign in options, and referral program to earn free credits.',
        keywords: ['account management', 'referral program', 'free credits', 'sign in', 'Google OAuth', 'GitHub OAuth'],
      },
    ],
  },
];

export function findDocBySlug(slug: string): DocPage | null {
  for (const section of DOC_SECTIONS) {
    const page = section.pages.find((p) => p.slug === slug);
    if (page) return page;
  }
  return null;
}

export function getAllDocSlugs(): string[] {
  return DOC_SECTIONS.flatMap((s) => s.pages.map((p) => p.slug));
}

export function getPrevNextDocs(slug: string): { prev: DocPage | null; next: DocPage | null } {
  const allPages = DOC_SECTIONS.flatMap((s) => s.pages);
  const idx = allPages.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? allPages[idx - 1] : null,
    next: idx >= 0 && idx < allPages.length - 1 ? allPages[idx + 1] : null,
  };
}
