export const deepDiveContent = {
  // ─── ETF TRACK ──────────────────────────────────────────────────────────────

  deep_etf_1: {
    title: 'ETF Structure',
    shortDescription: 'How ETFs are built and why the structure matters.',
    steps: {
      concept: {
        title: 'An ETF is a basket, not a single asset',
        intro: 'An ETF holds many securities inside a single tradeable wrapper.',
        body: 'An Exchange-Traded Fund (ETF) tracks an index, sector, or theme by holding a collection of underlying assets. You buy one unit, but own a slice of everything inside. The structure separates the fund from the exchange price, which means the ETF can trade slightly above or below the actual value of its holdings.',
        visualHint: 'One trade, many holdings.',
      },
      visualization: {
        title: 'What an ETF contains',
        segments: [
          {
            id: 's1',
            label: 'Underlying assets',
            value: 0.4,
            description:
              'Stocks, bonds, or other securities the ETF actually holds.',
          },
          {
            id: 's2',
            label: 'Index tracking',
            value: 0.25,
            description:
              'Rules that determine which assets are included and how much weight each gets.',
          },
          {
            id: 's3',
            label: 'Fund structure',
            value: 0.2,
            description:
              'The legal wrapper that holds the assets and issues shares.',
          },
          {
            id: 's4',
            label: 'Market price',
            value: 0.15,
            description:
              'What you pay on the exchange — may differ slightly from the fund value (NAV).',
          },
        ],
      },
      scenario: {
        title: 'Choosing between a stock and an ETF',
        variants: {
          new: {
            prompt:
              'You want exposure to tech companies. What does an ETF offer that a single stock does not?',
            options: [
              'Lower price per share',
              'Instant diversification',
              'Guaranteed returns',
            ],
            insight:
              'An ETF spreads your exposure across many companies, reducing single-stock risk without requiring individual research.',
          },
          growing: {
            prompt:
              'You hold a few individual stocks. What does adding an ETF give you?',
            options: [
              'More concentration',
              'Built-in diversification',
              'Higher fees only',
            ],
            insight:
              'ETFs add breadth — your risk is distributed across the whole index, not on a single company\'s performance.',
          },
          seasoned: {
            prompt:
              'You know both products. When is an ETF structurally better than stock-picking?',
            options: [
              'When you want to outperform',
              'When you want to replicate a market return',
              'When you want maximum control',
            ],
            insight:
              'ETFs are most efficient when the goal is to capture a market return efficiently, not to beat it.',
          },
        },
      },
      exercise: {
        type: 'choice',
        title: 'Check your understanding',
        description:
          'What does the spread between an ETF\'s market price and its underlying value represent?',
        options: [
          {
            id: 'a',
            label: 'The ETF\'s annual management fee',
            reveal:
              'Annual fees are expressed as TER or expense ratio — they are not the market price spread.',
          },
          {
            id: 'b',
            label: 'The premium or discount to net asset value',
            reveal:
              'Correct. The price can trade above (premium) or below (discount) the actual value of the holdings inside the fund.',
          },
          {
            id: 'c',
            label: 'The dividend yield withheld',
            reveal:
              'Dividend treatment affects total returns but is not the cause of the price-to-NAV spread.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'What surprised you most about how ETFs are structured, compared to what you expected?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'The structure of an ETF is what makes it useful.',
        takeaways: [
          'An ETF holds a basket of assets inside a single tradeable unit.',
          'The index rules determine what goes in and how much weight each asset carries.',
          'Market price and underlying value (NAV) can differ slightly — this is the premium or discount.',
          'Structure provides diversification without needing to select individual securities.',
        ],
      },
    },
  },

  deep_etf_2: {
    title: 'ETF Costs and Selection',
    shortDescription: 'What to look for before choosing an ETF.',
    steps: {
      concept: {
        title: 'The right ETF is not always the cheapest — but costs matter',
        intro: 'Cost is one filter among several. The mistake is applying it first.',
        body: 'ETF selection involves several layers: what the index tracks, how the ETF replicates it (physical vs synthetic), the total expense ratio (TER), how dividends are handled (accumulating vs distributing), and how liquid the fund is. Selecting only on price often leads to poor tracking, illiquid exits, or unexpected behavior.',
        visualHint: 'TER is the cost. Tracking error is the result.',
      },
      visualization: {
        title: 'What to evaluate in an ETF',
        segments: [
          {
            id: 's1',
            label: 'Index',
            value: 0.3,
            description:
              'What the ETF tracks — the most important choice, because it defines your exposure.',
          },
          {
            id: 's2',
            label: 'TER',
            value: 0.25,
            description:
              'Total Expense Ratio: the annual management cost, deducted from fund value automatically.',
          },
          {
            id: 's3',
            label: 'Replication',
            value: 0.25,
            description:
              'Physical (holds assets) vs synthetic (uses swaps). Physical is more transparent.',
          },
          {
            id: 's4',
            label: 'Dividend policy',
            value: 0.2,
            description:
              'Accumulating: dividends reinvested inside the fund. Distributing: dividends paid out to you.',
          },
        ],
      },
      scenario: {
        title: 'Two ETFs, same index',
        variants: {
          new: {
            prompt:
              'Two ETFs track the same index. One has a lower TER. What else should you compare?',
            options: [
              'Nothing — cheapest always wins',
              'Tracking error and fund liquidity',
              'The fund manager\'s reputation',
            ],
            insight:
              'Tracking error tells you how closely the ETF actually follows its index. A low TER means little if the tracking is sloppy.',
          },
          growing: {
            prompt:
              'You want an accumulating ETF for long-term growth. What does "accumulating" mean?',
            options: [
              'You receive cash dividends quarterly',
              'Dividends are reinvested inside the fund automatically',
              'You pay higher fees for the compounding benefit',
            ],
            insight:
              'Accumulating ETFs reinvest dividends internally — no action needed, and compounding continues without interruption.',
          },
          seasoned: {
            prompt:
              'A synthetic ETF offers a lower TER than physical alternatives. What risk does synthetic replication add?',
            options: [
              'Higher trading costs per transaction',
              'Counterparty risk from the swap agreement',
              'Lower liquidity compared to physical ETFs',
            ],
            insight:
              'Synthetic ETFs use swap contracts with a counterparty. If that counterparty fails, there is exposure beyond the index itself.',
          },
        },
      },
      exercise: {
        type: 'choice',
        title: 'Check your understanding',
        description:
          'An ETF has a TER of 0.07%. Another ETF tracks the same index with a TER of 0.20%. Which factor should you also check before deciding?',
        options: [
          {
            id: 'a',
            label: 'The fund\'s branding and visual design',
            reveal: 'Branding does not affect returns or risk.',
          },
          {
            id: 'b',
            label: 'Tracking difference over the last 3 years',
            reveal:
              'Correct. Tracking difference shows the actual return gap between the ETF and its index — it includes TER but also other hidden costs.',
          },
          {
            id: 'c',
            label: 'The number of countries mentioned in the fund name',
            reveal:
              'Fund names can be misleading. What matters is what the index actually includes.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'Which ETF selection factor is most relevant to your own strategy and time horizon?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'ETF selection is a layer-by-layer decision, not a single metric.',
        takeaways: [
          'Start with the index — it defines exactly what you are buying.',
          'TER matters, but tracking difference reveals the real performance gap.',
          'Physical replication is more transparent; synthetic adds counterparty risk.',
          'Choose accumulating for long-term compounding, distributing if you need income now.',
        ],
      },
    },
  },

  deep_etf_3: {
    title: 'ETF Strategies in Practice',
    shortDescription: 'How ETFs fit into an actual portfolio.',
    steps: {
      concept: {
        title: 'ETFs are tools — strategy comes first',
        intro: 'How you combine ETFs matters more than which ones you pick.',
        body: 'ETFs implement the allocation you already decided on. A core-satellite approach uses broad market ETFs as the core (stable, low-cost exposure) and targeted ETFs as satellites (sectors, themes, regions). The core keeps costs low. The satellites allow conviction. Without a plan, you accumulate overlap, complexity, and cost.',
        visualHint: 'The portfolio comes before the product.',
      },
      visualization: {
        title: 'Core-satellite structure in practice',
        segments: [
          {
            id: 's1',
            label: 'Core',
            value: 0.7,
            description:
              'Broad global equity and bond ETFs covering most of the allocation at low cost.',
          },
          {
            id: 's2',
            label: 'Sector satellite',
            value: 0.15,
            description:
              'Targeted themes or regions where you have a specific view or conviction.',
          },
          {
            id: 's3',
            label: 'Diversifier satellite',
            value: 0.15,
            description:
              'REITs, commodities, or other low-correlation assets that add balance.',
          },
        ],
      },
      scenario: {
        title: 'Core vs satellite decisions',
        variants: {
          new: {
            prompt:
              'You want a simple, low-maintenance ETF portfolio. What is the simplest coherent setup?',
            options: [
              'Many sector ETFs to cover everything',
              'One global equity ETF + one bond ETF',
              'As many ETFs as possible for coverage',
            ],
            insight:
              'A two-ETF portfolio with a global equity and a global bond ETF covers the most ground with the least complexity and the lowest cost.',
          },
          growing: {
            prompt:
              'You already have a broad market ETF. You want exposure to sustainable energy. Where does it fit?',
            options: [
              'Replace the core ETF with a sustainable energy ETF',
              'Add it as a satellite position alongside the core',
              'Drop bonds to free up capital for it',
            ],
            insight:
              'Themed ETFs belong in the satellite layer — they add conviction without displacing the broad market exposure of your core.',
          },
          seasoned: {
            prompt:
              'Your core ETF already holds 3,000 stocks globally. You add a tech ETF. What risk does this introduce?',
            options: [
              'Lower total returns over time',
              'Hidden concentration through sector overlap',
              'More diversification across the portfolio',
            ],
            insight:
              'Adding a sector ETF to a broad market ETF increases the weight of that sector beyond the index. This concentrates the portfolio more than it appears.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'You build a portfolio: global equity ETF (70%) + global bond ETF (30%). What is the main structural advantage?',
        options: [
          {
            id: 'a',
            label: 'You eliminate all market risk',
            reveal:
              'No portfolio eliminates market risk. This structure manages it through diversification, but does not remove it.',
          },
          {
            id: 'b',
            label: 'Low cost, broad exposure, and a defined asset split',
            reveal:
              'Correct. Simple portfolios have fewer failure points and lower total costs, while still covering the main asset categories.',
          },
          {
            id: 'c',
            label: 'You will consistently outperform active funds',
            reveal:
              'Lower costs improve long-run odds, but outperformance versus active funds is probable over long periods — not guaranteed in any given year.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'If you were to build a portfolio using only ETFs today, what would the structure look like and why?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'Strategy first — then choose which ETFs implement it.',
        takeaways: [
          'Use broad-market ETFs as the core for stable, low-cost market exposure.',
          'Add satellite ETFs selectively for themes or regions with specific conviction.',
          'Overlap between ETFs creates hidden concentration — more is not always more diversified.',
          'Simple portfolios have fewer failure points and lower total costs.',
        ],
      },
    },
  },

  // ─── RISK TRACK ─────────────────────────────────────────────────────────────

  deep_risk_1: {
    title: 'Behavioral Biases',
    shortDescription: 'How emotions and patterns distort investment decisions.',
    steps: {
      concept: {
        title: 'Biases are not flaws — they are predictable patterns',
        intro: 'Behavioral biases follow consistent, recognizable shapes.',
        body: 'Investors systematically make the same types of mistakes. Loss aversion makes losses feel twice as painful as equivalent gains. Confirmation bias leads us to seek information that supports existing beliefs. Recency bias weights recent events more than the long-term record. Recognizing these patterns is the first step to designing a process that limits their influence.',
        visualHint: 'The process protects you from your own patterns.',
      },
      visualization: {
        title: 'Common biases in investing',
        segments: [
          {
            id: 's1',
            label: 'Loss aversion',
            value: 0.3,
            description:
              'Losses feel about twice as powerful as equivalent gains. Leads to holding losers too long and selling winners too early.',
          },
          {
            id: 's2',
            label: 'Recency bias',
            value: 0.25,
            description:
              'Overweighting what just happened. Leads to buying high after long runs and selling after drops.',
          },
          {
            id: 's3',
            label: 'Confirmation bias',
            value: 0.25,
            description:
              'Seeking evidence that confirms existing beliefs. Leads to missing contradictory information.',
          },
          {
            id: 's4',
            label: 'Overconfidence',
            value: 0.2,
            description:
              'Overestimating ability to predict or outperform. Leads to excessive trading and unintended risk.',
          },
        ],
      },
      scenario: {
        title: 'Recognizing bias in action',
        variants: {
          new: {
            prompt:
              'A stock you own drops 20%. You feel paralyzed and cannot bring yourself to sell. Which bias is most likely at work?',
            options: ['Overconfidence', 'Loss aversion', 'Recency bias'],
            insight:
              'Loss aversion makes realizing a loss feel more painful than holding a paper loss — even when selling is the more rational decision.',
          },
          growing: {
            prompt:
              'Markets have risen for 18 months. You feel increasingly confident and add more equity. Which bias is most likely influencing this?',
            options: [
              'Confirmation bias',
              'Recency bias',
              'Loss aversion',
            ],
            insight:
              'Recency bias projects a recent trend forward. Rising markets start to feel like the default — which is when the risk of adding at peak increases.',
          },
          seasoned: {
            prompt:
              'You consistently seek out positive analysis on a stock you hold. What are you most likely doing?',
            options: [
              'Conducting thorough balanced research',
              'Inadvertently falling into confirmation bias',
              'Correctly following expert consensus',
            ],
            insight:
              'Confirmation bias is hard to avoid even with experience. Actively seeking out disconfirming evidence is the most effective counter-measure.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'Which portfolio design principle best protects against behavioral biases over the long term?',
        options: [
          {
            id: 'a',
            label: 'Monitor the portfolio daily to stay well-informed',
            reveal:
              'Frequent monitoring increases the chance of reacting to noise instead of signal — the opposite of bias protection.',
          },
          {
            id: 'b',
            label: 'Define rules in advance and rebalance on a schedule',
            reveal:
              'Correct. Pre-defined rules reduce the number of in-the-moment decisions, which is where biases strike hardest.',
          },
          {
            id: 'c',
            label: 'Follow the moves of experienced investors',
            reveal:
              'Following others adds herd behavior to your own biases — it does not remove them.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'Which behavioral bias do you recognize most in your own thinking? What could you do to reduce its influence?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'Understanding bias is the beginning of managing it.',
        takeaways: [
          'Loss aversion makes losses feel disproportionately painful — a predictable and well-documented bias.',
          'Recency bias causes recent trends to dominate long-term thinking.',
          'Confirmation bias leads to ignoring evidence that contradicts your position.',
          'Pre-defined rules and scheduled rebalancing reduce in-the-moment bias exposure.',
        ],
      },
    },
  },

  deep_risk_2: {
    title: 'Portfolio Volatility',
    shortDescription: 'What volatility is — and what it is not.',
    steps: {
      concept: {
        title: 'Volatility measures movement, not direction',
        intro: 'High volatility does not mean an investment is bad. It means it moves more.',
        body: 'Volatility is typically measured as standard deviation — how much a return series deviates from its average. A highly volatile asset can still be a strong long-term performer. What matters is whether the volatility is appropriate for your time horizon and goal. Short time horizons tolerate less volatility. Long ones can absorb more without causing permanent damage.',
        visualHint: 'Volatility is a feature you manage — not just a flaw to avoid.',
      },
      visualization: {
        title: 'Volatility across asset types',
        segments: [
          {
            id: 's1',
            label: 'Cash',
            value: 0.15,
            description:
              'Lowest price volatility. But purchasing power erodes over time — a different kind of risk.',
          },
          {
            id: 's2',
            label: 'Bonds',
            value: 0.25,
            description:
              'Low to moderate volatility. Prices move with changes in interest rates.',
          },
          {
            id: 's3',
            label: 'Equities',
            value: 0.35,
            description:
              'Higher volatility. More movement in both directions, but historically stronger long-term returns.',
          },
          {
            id: 's4',
            label: 'Alternatives',
            value: 0.25,
            description:
              'Variable and often high volatility. Crypto, commodities, and private assets each carry their own risk profile.',
          },
        ],
      },
      scenario: {
        title: 'Volatility in context',
        variants: {
          new: {
            prompt:
              'An equity fund drops 18% in three months, then recovers. How should you interpret the drop?',
            options: [
              'Sell — the fund is clearly broken',
              'It is volatility, not necessarily a permanent loss',
              'Switch to a bond fund immediately',
            ],
            insight:
              'Short-term drops in long-term investments are usually volatility — not a verdict on quality. Exiting at a loss converts a temporary move into a permanent one.',
          },
          growing: {
            prompt:
              'Your portfolio dropped 12% last quarter. Your time horizon is 20 years. What matters most right now?',
            options: [
              'The exact size of the current loss',
              'Whether your allocation still matches your long-term goal',
              'The number of funds you hold',
            ],
            insight:
              'With a 20-year horizon, the allocation\'s fit with your goal matters more than the current quarter\'s number.',
          },
          seasoned: {
            prompt:
              'You want to reduce portfolio volatility without reducing your equity exposure. What is the most direct approach?',
            options: [
              'Sell equities temporarily during volatile periods',
              'Add assets with low correlation to equities',
              'Reduce rebalancing frequency',
            ],
            insight:
              'Adding uncorrelated assets — like bonds or certain alternatives — reduces total portfolio volatility without cutting the equity position itself.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'Standard deviation is used to measure volatility. What does a higher standard deviation tell you?',
        options: [
          {
            id: 'a',
            label: 'The investment will lose money',
            reveal:
              'Standard deviation measures the spread of returns — not their direction. High standard deviation does not predict losses.',
          },
          {
            id: 'b',
            label: 'Returns are spread more widely above and below the average',
            reveal:
              'Correct. High standard deviation means both large gains and large losses are more likely — the range of outcomes is wider in both directions.',
          },
          {
            id: 'c',
            label: 'The fund manager lacks experience',
            reveal:
              'Volatility is primarily a characteristic of the asset class and market conditions, not the manager\'s skill level.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'How does understanding volatility change the way you interpret short-term market moves in your own portfolio?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'Volatility is movement — not a verdict on quality.',
        takeaways: [
          'Volatility measures how much returns deviate from the average — not whether they are good or bad.',
          'A volatile asset can still be the right choice if your time horizon is long enough to absorb the swings.',
          'Short-term drops in long-term investments are usually volatility, not permanent loss.',
          'Adding uncorrelated assets reduces portfolio volatility without cutting equity exposure.',
        ],
      },
    },
  },

  deep_risk_3: {
    title: 'Managing Risk Over Time',
    shortDescription: 'Strategies for staying on track through market cycles.',
    steps: {
      concept: {
        title: 'Risk management is a continuous activity',
        intro: 'Your allocation drifts. Your goal evolves. Risk must be managed — not set once.',
        body: 'A portfolio that was well-allocated two years ago may no longer be. When equities outperform, they become a larger share of the portfolio than intended. Goals move closer, reducing recovery time. Life events change risk capacity. Managing risk over time means checking whether the portfolio still reflects your intentions — and adjusting when it does not.',
        visualHint: 'Your plan needs maintenance, not just setup.',
      },
      visualization: {
        title: 'How risk evolves over time',
        segments: [
          {
            id: 's1',
            label: 'Goal proximity',
            value: 0.3,
            description:
              'As you get closer to your goal, the cost of a drawdown increases — less time to recover.',
          },
          {
            id: 's2',
            label: 'Market drift',
            value: 0.25,
            description:
              'Strong markets push equities higher than intended, increasing risk without a deliberate decision.',
          },
          {
            id: 's3',
            label: 'Life changes',
            value: 0.25,
            description:
              'Income shifts, new goals, or family changes alter your actual risk capacity.',
          },
          {
            id: 's4',
            label: 'Threshold rebalancing',
            value: 0.2,
            description:
              'Acting when allocations exceed a defined drift limit keeps risk aligned with the plan.',
          },
        ],
      },
      scenario: {
        title: 'When to act on risk',
        variants: {
          new: {
            prompt:
              'Markets rose 30% over two years. Your equities now make up more of your portfolio than planned. What should you do?',
            options: [
              'Enjoy the growth and hold everything',
              'Rebalance back toward the original target allocation',
              'Add more equities while the trend continues',
            ],
            insight:
              'Market drift is an unintentional risk increase. Rebalancing restores your intended risk level — not because the market is wrong, but because your allocation no longer matches your plan.',
          },
          growing: {
            prompt:
              'Your goal is now 4 years away instead of 12. What does this change about your risk posture?',
            options: [
              'Nothing — risk capacity is the same regardless of timeline',
              'Less tolerance for drawdowns — more need for capital stability',
              'More flexibility, because markets will recover eventually',
            ],
            insight:
              'Shorter time horizons shrink the recovery window. Reducing equity exposure as a goal approaches protects capital you need on a known date.',
          },
          seasoned: {
            prompt:
              'You rebalance on a fixed annual schedule. What is the main limitation of this approach?',
            options: [
              'It is too complex to track consistently',
              'Allocation may drift significantly between rebalance dates',
              'It rebalances more frequently than needed',
            ],
            insight:
              'Time-based rebalancing can allow large drift between scheduled dates. Threshold-based rebalancing — acting when allocations deviate beyond a set percentage — is often more precise.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'You are 3 years from your goal. Your equity allocation drifted from 60% to 78% due to strong markets. What is the most risk-aware action?',
        options: [
          {
            id: 'a',
            label: 'Hold — markets might keep rising',
            reveal:
              'Holding amplifies concentration risk as the goal approaches. The time to recover shrinks every year.',
          },
          {
            id: 'b',
            label: 'Rebalance back toward the original target',
            reveal:
              'Correct. Rebalancing reduces unintended risk from market drift and realigns the portfolio with the proximity of your goal.',
          },
          {
            id: 'c',
            label: 'Add bonds to a separate account to compensate',
            reveal:
              'Adding to a separate account does not fix the drift in your main portfolio.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'What life event or change would most likely prompt you to revisit your risk allocation?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'Risk management is active, not passive.',
        takeaways: [
          'Portfolios drift over time — strong equity markets increase allocation beyond the intended target.',
          'As goals approach, the cost of drawdowns increases and tolerance should decrease.',
          'Life events change risk capacity and should trigger an allocation review.',
          'Threshold-based rebalancing keeps the portfolio more precisely aligned than fixed calendar rules.',
        ],
      },
    },
  },

  // ─── STRATEGY TRACK ─────────────────────────────────────────────────────────

  deep_strategy_1: {
    title: 'Rebalancing',
    shortDescription: 'Why and when to rebalance your portfolio.',
    steps: {
      concept: {
        title: 'Rebalancing restores the allocation you chose',
        intro:
          'Without rebalancing, market movements change your risk level without your consent.',
        body: 'When one asset class outperforms, its share of the portfolio grows beyond the target. A portfolio designed as 60% equities / 40% bonds may drift to 75% / 25% after a strong equity year. Rebalancing sells the over-weighted asset and buys the under-weighted one to restore the original split. This is a disciplined maintenance process — not a market prediction.',
        visualHint: 'Rebalancing is a maintenance task, not a market call.',
      },
      visualization: {
        title: 'How drift happens and how rebalancing corrects it',
        segments: [
          {
            id: 's1',
            label: 'Target allocation',
            value: 0.33,
            description:
              'The intended split you decided before markets moved.',
          },
          {
            id: 's2',
            label: 'Drifted allocation',
            value: 0.34,
            description:
              'What the portfolio looks like after an equity run — more concentrated in the winner.',
          },
          {
            id: 's3',
            label: 'After rebalancing',
            value: 0.33,
            description:
              'The restored allocation — reduced equity concentration, restored bond weight.',
          },
        ],
      },
      scenario: {
        title: 'Rebalancing in practice',
        variants: {
          new: {
            prompt:
              'Equities gained 25% this year. Your portfolio is now 80% equities instead of 60%. What is the rebalancing action?',
            options: [
              'Buy more equities to stay with the trend',
              'Sell some equities and buy bonds to restore the target',
              'Do nothing — let the gains compound',
            ],
            insight:
              'Rebalancing sells the winner to restore proportions. It enforces a "buy relatively cheaper, sell relatively pricier" discipline — without requiring a market prediction.',
          },
          growing: {
            prompt:
              'You rebalance once a year. Markets barely moved for 11 months, then rose 20% in month 12. Is annual rebalancing enough?',
            options: [
              'Yes — annual is always sufficient',
              'Maybe not — a threshold-based trigger would catch this',
              'Rebalancing frequency never matters',
            ],
            insight:
              'Large moves in a short period can cause significant drift. Threshold-based triggers — rebalancing when allocation deviates by 5% or more — respond to actual drift rather than the calendar.',
          },
          seasoned: {
            prompt:
              'What is the main cost consideration when rebalancing frequently?',
            options: [
              'Greater complexity in tracking positions',
              'Transaction costs and potential tax events on gains',
              'Lower short-term returns from the trades themselves',
            ],
            insight:
              'Frequent rebalancing generates transaction costs and, in taxable accounts, triggers capital gains events. Threshold-based rebalancing reduces unnecessary trades while still managing drift.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'You set a target of 60% equities / 40% bonds. After a strong year, equities are at 72%. What is rebalancing designed to do?',
        options: [
          {
            id: 'a',
            label: 'Predict when equities will fall next',
            reveal:
              'Rebalancing does not predict markets. It restores a pre-decided allocation regardless of what markets will do.',
          },
          {
            id: 'b',
            label: 'Restore the intended risk level by trimming the over-weighted asset',
            reveal:
              'Correct. Rebalancing sells what grew beyond target and buys what shrank — no market timing required.',
          },
          {
            id: 'c',
            label: 'Maximize returns by following the winning asset class',
            reveal:
              'Following winners increases concentration — the opposite of what rebalancing is designed to do.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'How often would you realistically rebalance? What trigger — calendar or threshold — fits your situation best?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'Rebalancing keeps your risk level aligned with your plan.',
        takeaways: [
          'Market drift changes your allocation without any decision from you.',
          'Rebalancing sells over-weighted assets and buys under-weighted ones to restore the target.',
          'This enforces discipline: buying relatively cheaper assets, selling relatively pricier ones.',
          'Threshold-based rebalancing is more responsive to actual drift than fixed annual rules.',
        ],
      },
    },
  },

  deep_strategy_2: {
    title: 'Passive vs Active',
    shortDescription: 'The real trade-off between index and active funds.',
    steps: {
      concept: {
        title: 'The debate is about what you are paying for',
        intro:
          'Active funds aim to beat the market. Passive funds aim to replicate it. Both have real costs and trade-offs.',
        body: 'Passive investing (index funds, ETFs) replicates a market index at very low cost. Active investing employs managers who select securities to outperform. Research consistently shows that most active funds underperform their benchmark after fees over long periods. However, active management can add value in specific conditions: less efficient markets, niche sectors, or strategies with a genuine edge.',
        visualHint: 'Cost is the headwind. Outperformance must exceed it to add value.',
      },
      visualization: {
        title: 'What you pay for in each approach',
        segments: [
          {
            id: 's1',
            label: 'Index cost',
            value: 0.1,
            description:
              'Typically 0.05%–0.20% TER. You pay for market replication at low cost.',
          },
          {
            id: 's2',
            label: 'Active cost',
            value: 0.4,
            description:
              'Typically 0.75%–2.0%+ TER. You pay for the manager\'s research and selection process.',
          },
          {
            id: 's3',
            label: 'Required outperformance',
            value: 0.25,
            description:
              'The return above the index the active manager must deliver just to break even after fees.',
          },
          {
            id: 's4',
            label: 'Long-run success rate',
            value: 0.25,
            description:
              'About 10–20% of active funds consistently outperform their index over 15+ years, after all costs.',
          },
        ],
      },
      scenario: {
        title: 'Choosing the right approach',
        variants: {
          new: {
            prompt:
              'You want broad market exposure without researching individual companies. Which approach fits?',
            options: [
              'An actively managed fund for broader exposure',
              'An index ETF tracking a global market',
              'A diversified mix of individual stocks',
            ],
            insight:
              'A global index ETF gives you exposure to hundreds of companies at minimal cost — exactly what passive investing is built for.',
          },
          growing: {
            prompt:
              'You believe emerging markets are systematically mispriced. Is this a case for active or passive management?',
            options: [
              'Passive — all markets are equally efficient',
              'Active — less efficient markets can reward skilled analysis',
              'Neither — avoid emerging markets entirely',
            ],
            insight:
              'Less efficient markets create more opportunity for skilled active managers to add value. This is one of the genuine use cases for paying the active premium.',
          },
          seasoned: {
            prompt:
              'Your core is passive. You want to add an active position. What should you evaluate first?',
            options: [
              'The fund\'s past 12-month returns',
              'Long-term performance vs benchmark after fees over 10+ years',
              'The portfolio manager\'s media presence',
            ],
            insight:
              'Active funds must be evaluated on long-term, after-fee outperformance versus their specific benchmark. Short-term returns are too noisy to be meaningful.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'An active fund returned 12% last year. The benchmark returned 10%. The fund\'s annual TER is 1.5%. What is the real net outperformance?',
        options: [
          {
            id: 'a',
            label: '2% — because the fund beat the benchmark',
            reveal:
              'That is the gross gap. Fees are deducted from returns. 12% − 10% = 2% gross, minus 1.5% TER = 0.5% net. A thin margin that is hard to sustain long-term.',
          },
          {
            id: 'b',
            label: '0.5% after fees are deducted',
            reveal:
              'Correct. Always subtract fees from the gross return difference. 2% gross outperformance minus 1.5% TER = 0.5% net. Thin, and not enough to justify active fees long-term.',
          },
          {
            id: 'c',
            label: '−1.5% — the fund underperformed because of fees',
            reveal:
              'The fund did outperform gross (12% vs 10%). After fees the margin shrinks to 0.5% — still positive, but very slim.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'In which part of your strategy, if any, would you consider paying for active management? What would justify the cost?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'Passive vs active is a cost and conviction decision.',
        takeaways: [
          'Passive funds replicate the market at very low cost — best suited for efficient markets.',
          'Active funds aim to beat the market but must overcome higher fees to deliver net value.',
          'Most active funds underperform their benchmark over 15+ years after all costs.',
          'Active management can add value in less efficient markets or niche strategies with genuine edge.',
        ],
      },
    },
  },

  deep_strategy_3: {
    title: 'Portfolio Construction',
    shortDescription: 'Putting the pieces together into one coherent whole.',
    steps: {
      concept: {
        title: 'Construction translates strategy into holdings',
        intro: 'Your strategy says what you want. Construction says how you get there.',
        body: 'Portfolio construction turns strategic decisions — allocation targets, asset roles, risk limits — into specific holdings. It involves choosing which instruments fill each role, how many positions to hold, and how to ensure the whole is coherent. The goal is a portfolio where every position has a reason, not just a name.',
        visualHint: 'Every position should have a role before it has a name.',
      },
      visualization: {
        title: 'Layers of portfolio construction',
        segments: [
          {
            id: 's1',
            label: 'Asset allocation',
            value: 0.35,
            description:
              'What percentage goes to equities, bonds, alternatives, and cash.',
          },
          {
            id: 's2',
            label: 'Geographic spread',
            value: 0.25,
            description:
              'How the equity portion is distributed across regions, markets, and styles.',
          },
          {
            id: 's3',
            label: 'Instrument selection',
            value: 0.25,
            description:
              'Which specific ETFs or funds implement each part of the allocation.',
          },
          {
            id: 's4',
            label: 'Position sizing',
            value: 0.15,
            description:
              'How much of each instrument, within the constraints of the allocation targets.',
          },
        ],
      },
      scenario: {
        title: 'Building vs accumulating',
        variants: {
          new: {
            prompt:
              'You start with €5,000. Is it better to build a full portfolio immediately or start simple and expand?',
            options: [
              'Build the full portfolio now with many positions',
              'Start simple with one or two ETFs and add later',
              'Wait until you have significantly more capital',
            ],
            insight:
              'A simple two-ETF portfolio — global equity + global bond — is coherent and cost-efficient from day one. Complexity should be added when it genuinely serves the strategy, not for its own sake.',
          },
          growing: {
            prompt:
              'You hold 6 ETFs that significantly overlap in their underlying holdings. What does this mean?',
            options: [
              'The portfolio is well-diversified',
              'There is hidden concentration from the overlap',
              'More positions always reduce risk',
            ],
            insight:
              'Overlap creates hidden concentration. More positions do not reduce risk if they track the same underlying assets. Simplify by checking what each fund actually holds.',
          },
          seasoned: {
            prompt:
              'You want to tilt toward small-cap equities while keeping global broad exposure. How do you add this cleanly?',
            options: [
              'Replace the global ETF with a small-cap ETF',
              'Add a small-cap ETF as a partial satellite position',
              'Use leverage to increase small-cap exposure',
            ],
            insight:
              'A satellite allocation to small-caps — 10–15% of the equity bucket — adds the tilt without disrupting the core global coverage.',
          },
        },
      },
      exercise: {
        type: 'choice',
        description:
          'You have decided on a 70% equity / 30% bond allocation. What should you define next before selecting instruments?',
        options: [
          {
            id: 'a',
            label: 'Which ETFs look most popular right now',
            reveal:
              'Popularity is not a selection criterion. Define what each allocation bucket covers first — then find the instrument that implements it.',
          },
          {
            id: 'b',
            label: 'How to break the equity bucket across regions and styles',
            reveal:
              'Correct. Define the sub-allocation within each asset class first — global equity, regional tilt, large vs small-cap — then select the instruments that match.',
          },
          {
            id: 'c',
            label: 'How to minimize the number of holdings at all costs',
            reveal:
              'Simplicity is valuable, but the goal is coherence. Sometimes two ETFs are genuinely needed to implement an allocation properly.',
          },
        ],
      },
      reflection: {
        title: 'Reflection',
        question:
          'If you reviewed your current or hypothetical portfolio, which position would you find hardest to justify with a clear reason?',
        placeholder: 'Write your answer here...',
      },
      summary: {
        title: 'What you learned',
        subtitle: 'A portfolio is a system — every part should serve the whole.',
        takeaways: [
          'Construction translates your strategy into specific holdings — allocation first, instruments second.',
          'Every position should have a defined role before you choose its name.',
          'Overlap between funds creates hidden concentration — more ETFs does not always mean more diversification.',
          'Start simple; add complexity only when it genuinely serves the strategy.',
        ],
      },
    },
  },
};
