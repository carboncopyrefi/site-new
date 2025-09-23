---
title: Examining the Potential of Prediction Markets as a Funding Source for Impact
description: Trinity Morphy explores one of the hottest trends in Web3 and how it might be used to help solve the biggest problem in ReFi.
category: Analysis
mainImage: "/content/assets/prediction-market-article-title.jpg"
date: "December 26th, 2024"
sortDate: 2024-12-26
author: "Trinity Morphy"
authorSlug: "trinity-morphy"
---

Although Web3 prediction markets have existed since 2016, the 2024 US Presidential election brought more momentum, attention, and acceptance. Polymarket, for one, saw its numbers [shoot up](https://research.mintventures.fund/2024/10/09/Unveiling-Polymarket-The-Positioning-Expansion-and-Shadows-of-Crypto-Prediction-Markets/) from $500+ million trading volume and 80,000+ active users in September 2024 to $1.9+ billion trading volume and 190,000+ active users in October 2024.

What amazes me the most is the evolution of gambling and traditional betting to prediction markets — a transition from a vice to an acceptable norm. Having grown up in a family where gambling was culturally taboo, this change didn’t sit well with me. However, I grudgingly accepted the trend, not wanting to fall behind.

After participating in different prediction markets, I could see their potential as an information aggregation tool. Hence, I began to research how prediction markets could be used for good. One use case that piqued my interest was a [study](https://www.nature.com/articles/s41558-023-01679-4) that showed the potential of prediction markets in dispelling false beliefs about climate change. The study involved participants betting on climate-related events. It turned out that those who lost money due to inaccurate beliefs gradually accepted the existence of the climate crisis. The results intrigued me, so I began scheming net positive ways to apply prediction markets to the ReFi context. What I came to realise is that we are being presented with a perfect opportunity to leverage the hottest trend in Web3.

## Understanding prediction markets

Prediction markets are financial platforms for trading anticipated outcomes of future events. They harness collective intelligence to forecast outcomes effectively and are a unique and valuable tool for decision-making because they enable us to assess predictive insights from the majority, which more often than not, leads to a correct forecast. These insights are usually accurate because participants are motivated by their financial stakes to provide informed assessments.

A prediction market begins with a specific question about a future event. Participants buy and sell contracts that represent different outcomes. The price of these contracts reflects the market's consensus on the probability of an event occurring. Once the trading period ends, an oracle verifies the actual outcome of the event. This ensures that the market's predictions are settled fairly and accurately, determining which contracts pay out based on the realized outcome.

An example of a prediction market could be "***Will Gladiator 2 gross the most in 2024?***" with two outcomes: **YES** and **NO**. If a **YES** contract for the market is priced at $0.70, it suggests that traders believe there is a 70% chance that Gladiator 2 will gross the most in 2024. Once the trading period ends, the UMA oracle verifies the actual outcome. If Gladiator 2 grosses the most in 2024, the **YES** contract will pay out $1 to all its buyers, while the **NO** contract buyers will lose their investment.

It's worth noting that prediction markets often struggle with forecasting conditional scenarios and events that are far in the future. For distant events, the prediction accuracy decreases primarily due to inherent uncertainty and the potential for changing circumstances over time. For conditional scenarios, the challenge arises because prediction markets tend to focus on correlations rather than causation.

## A funding mechanism for impact

Prediction markets can serve as a funding mechanism for ReFi projects through something called an impact outcome markets, where bettors can stake funds on the likelihood of ReFi project grantees reaching their milestones. A portion of the funds from losing bettors is allocated to the project as a mini-grant - an award for completing its milestones.

ReFi projects grantees have Karma GAP profiles they update with new milestones for grants they have received. However, some projects may have no real intention of achieving these milestones. Impact outcome markets would create economic incentives for bettors (ReFi enthusiasts) to identify these bad actors by recognizing patterns of repeated failure.

Why do we need this? Two reasons: collective intelligence and making false beliefs costly.

Collective intelligence is a form of knowledge creation that emerges when large groups of people collaborate. Because the individualistic intelligence of ReFi enthusiasts is subject to positivity bias about the sector, we need to aggregate collective intelligence to know what narratives to correct, what information to draw more attention to, and what we are doing wrong. 

As the ReFi sector grows, we will get our share of false opinions and mindshare. We can make these opinions costly through prediction markets. For example, Rene Reinsberg mentioned in an [X post](https://twitter.com/RegenRene/status/1860199009023066355) last month that ReFi will make a comeback in 2025 because we now have functioning on/off ramps.

Let's say I disagree with that prediction, and stick to it in the face of countless comments trying to make me see reason. The best way to regret having such conviction is if I bet substantial capital against Rene's prediction and lose. I can choose not to bet, of course, but I wouldn't be able to avoid the social consequences if Rene's prediction comes true.

What would the benefits be of implementing prediction markets for impact outcomes?

- **Increased accountability** - Impact outcome markets elevate accountability standards for ReFi projects, prompting supporters to question why projects failed to meet their milestones, especially when financial losses are involved.  
- **Rigorous planning for milestone execution** - Some ReFi projects list milestones on their Karma GAP profiles solely to apply for grants or accelerator programs. To avoid public scrutiny, they prioritize developing well-thought-out execution strategies before listing prospective milestones rather than relying on vague or unplanned commitments.
- **Grant routing to high-performing ReFi projects** - ReFi grants leverage community signaling to allocate funds to grantees. By incorporating prediction markets, the ReFi community could identify and support projects that consistently complete milestones on time and generate financial returns for bettors.

At the same time, some potential issues may emerge:

- **Excessive market scrutiny** - Predicting whether ReFi projects can achieve their impact milestones might generate excessive focus on the project to support various prediction narratives. While this could be perceived as marketing, the backlash that may arise if most bettors lose can be highly damaging.
- **Prioritisation of short-term milestones with little to no value** - Instead of reassessing how to achieve meaningful milestones, some projects may choose to pursue "trivial" milestones to avoid market scrutiny while maintaining the appearance of rapid progress.

## How an impact outcome market would work

There are three core steps: market creation, market resolution, and earnings distribution.

#### Market creation

Impact outcome markets would be created based on the reported milestones from projects listed on Karma GAP. The image below is CARBON Copy’s [page](https://gap.karmahq.xyz/project/carbon-copy-1) showing two milestones to be accomplished. Our impact outcome market with binary outcomes **YES** and **NO** could be: ***Would CARBON Copy release the ReFi Impact Dashboard v1 before Q2 2025?***

<br>

![Prediction market screenshot](/content/assets/prediction-market-article-1.png)

<br>

#### Market resolution

An impact outcome market resolution is based on the status of milestones listed on the Karma GAP page of the involved project. To resolve this market with a **YES** outcome, the milestone status should show "Complete" and the milestone update should include authentic proof of completion. If one condition is met without the other, the market outcome will be **NO**. All resolutions will be carried out through the [Universal Market Access (UMA)](https://uma.xyz/) protocol.

<br>

![Prediction market screenshot](/content/assets/prediction-market-article-2.png)

<br>

#### Earnings distribution

Projects that successfully deliver their impact milestones as predicted will receive a percentage of the funds distributed to bettors who predicted correctly. Typically, if the market resolves to **YES**, a bettor who purchased $YES at $0.20 would receive $1, making a $0.80 profit.

However, with impact outcome markets, the bettor would receive $0.90 ($0.70 profit), while CARBON Copy would receive $0.10. This system ensures that projects are financially incentivised against the short-seller potential of impact outcome markets. Conversely, if the market resolves to **NO**, there will be no reward for the projects.

## Potential challenges

Although prediction markets have had mainstream success, implementing them in ReFi is a completely different ballgame, one that requires dedicated effort to avoid failure. I’ll tell you why.

One of the biggest challenges is low participation and resistance. The ReFi community is typically collaborative and highly positive. As a result, it may be resistant to impact outcome markets because of the short-seller feature, which carries a negative connotation of profiting from the failure of ReFi projects. The challenge is framing this mechanism as a trust-building tool, not a destructive one.

Other challenges include:

- **Low liquidity** - Impact outcome markets are niche markets within a small but growing sector. Liquidity providers may not view these as a favorable investment option.
- **Coordinated betting** - In betting, most people tend to follow the opinion of the majority. In such cases, bad actors could manipulate the system by dispersing funds to promote a false opinion. Once there is significant buy-in, they can gradually sell off their prediction shares.
- **Verification risk** - Impact outcome markets resolve based on a single information source, Karma GAP. Relying on one source creates the risk of manipulation. Single-source resolution reduces transparency, as it limits the ability to dispute or audit the outcome.

## Conclusion

I think prediction markets are the second coolest innovation of this cycle after AI agents. Quoting [Emily Lai](https://x.com/emilyxlai/status/1871471959361597706), “The more chaotic the world gets, the more people want fun, to be unserious, to gamble. Breakout apps this cycle prove just that. The masses want to trade trends, bet on world events, test drugs on worms, spin out their AI sims neopets.”

Would ReFi prediction markets work? Absolutely yes. Inasmuch as we are regens, I’m sure we want to bet on Jimi Cohen and the [Treegens](/project/treegens/) planting a billion trees in 2025, predict the project to get the lowest funding in the GG23 climate round, speculate whether [Littercoin](https://x.com/littercoin) will yap about citizen science everyday in 2025, and so on.

Although they come with their challenges, we can utilise prediction markets as an accountability tool, a funding mechanism, and even a community signalling tool for grant funding. My prediction for ReFi in 2025 is that we get to see more developers innovating solutions like this to bring net positive growth to the ReFi space.

{{Editorial}}
