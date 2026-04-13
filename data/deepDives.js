export const deepDiveTracks = [
  {
    id: 'track_etfs',
    title: 'ETFs in Depth',
    description: 'Costs, structure, and portfolio use.',
    available: true,
  },
  {
    id: 'track_risk',
    title: 'Understanding Risk',
    description: 'Biases, volatility, and discipline.',
    available: true,
  },
  {
    id: 'track_strategy',
    title: 'Building a Strategy',
    description: 'Rebalancing, style, and fit.',
    available: true,
  },
  {
    id: 'track_stocks',
    title: 'Stocks in Depth',
    description: 'Valuation, selection, and fit.',
    available: false,
  },
  {
    id: 'track_bonds',
    title: 'Bonds in Depth',
    description: 'Duration, yield, and allocation.',
    available: false,
  },
];

export const deepDiveLessons = [
  // ETFs track
  {
    id: 'deep_etf_1',
    trackId: 'track_etfs',
    order: 0,
    title: 'ETF Structure',
    shortDescription: 'How ETFs are built and why the structure matters.',
  },
  {
    id: 'deep_etf_2',
    trackId: 'track_etfs',
    order: 1,
    title: 'ETF Costs and Selection',
    shortDescription: 'What to look for before choosing an ETF.',
  },
  {
    id: 'deep_etf_3',
    trackId: 'track_etfs',
    order: 2,
    title: 'ETF Strategies in Practice',
    shortDescription: 'How ETFs fit into an actual portfolio.',
  },
  // Risk track
  {
    id: 'deep_risk_1',
    trackId: 'track_risk',
    order: 0,
    title: 'Behavioral Biases',
    shortDescription: 'How emotions and patterns distort investment decisions.',
  },
  {
    id: 'deep_risk_2',
    trackId: 'track_risk',
    order: 1,
    title: 'Portfolio Volatility',
    shortDescription: 'What volatility is — and what it is not.',
  },
  {
    id: 'deep_risk_3',
    trackId: 'track_risk',
    order: 2,
    title: 'Managing Risk Over Time',
    shortDescription: 'Strategies for staying on track through market cycles.',
  },
  // Strategy track
  {
    id: 'deep_strategy_1',
    trackId: 'track_strategy',
    order: 0,
    title: 'Rebalancing',
    shortDescription: 'Why and when to rebalance your portfolio.',
  },
  {
    id: 'deep_strategy_2',
    trackId: 'track_strategy',
    order: 1,
    title: 'Passive vs Active',
    shortDescription: 'The real trade-off between index and active funds.',
  },
  {
    id: 'deep_strategy_3',
    trackId: 'track_strategy',
    order: 2,
    title: 'Portfolio Construction',
    shortDescription: 'Putting the pieces together into one coherent whole.',
  },
];

export function getDeepDiveTrack(trackId) {
  return deepDiveTracks.find((t) => t.id === trackId);
}

export function getDeepDiveLessonsForTrack(trackId) {
  return deepDiveLessons
    .filter((l) => l.trackId === trackId)
    .sort((a, b) => a.order - b.order);
}

export function getDeepDiveLesson(lessonId) {
  return deepDiveLessons.find((l) => l.id === lessonId);
}

export function isDeepDiveLesson(lessonId) {
  return typeof lessonId === 'string' && lessonId.startsWith('deep_');
}
