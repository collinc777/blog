---
title: "Build vs Buy in the AI Era: A New Framework for Modern Tech Decisions"
excerpt: "One of the most challenging decisions tech leaders face is whether to build or buy software solutions. But this calculation has changed dramatically in the past year as LLMs have transformed how we build software."
coverImage: "/assets/blog/build-vs-buy/cover.jpg"
date: "2024-12-12T12:00:00.000Z"
author:
  name: Collin Caram
  picture: "/assets/blog/authors/collin.jpeg"
ogImage:
  url: "/assets/blog/build-vs-buy/cover.jpg"
features: ["build-vs-buy-doc-generator"]
---

One of the most challenging decisions tech leaders face is whether to build or buy software solutions. But this calculation has changed dramatically in the past year as LLMs have transformed how we build software.

Today, many traditional barriers to building in-house solutions have fallen:

- Research time has been slashed - LLMs make it easier to explore technical approaches and best practices
- Implementation is faster - code writing and debugging are significantly accelerated
- Testing and validation are more straightforward
- Complex features that once required specialized expertise can now be prototyped quickly

Yet interestingly, this hasn't made all build decisions easier. Some aspects of software development remain just as challenging as before - particularly around state management and distributed systems.

This creates a fascinating dynamic: Why is it still immediately obvious that we should buy a database or blob storage solution, but when it comes to implementing RAG or LLM Evals, the decision becomes much less clear? After recently facing this exact scenario at our company with two different AI tooling decisions, I've developed a framework that helps cut through this complexity - one that emphasizes not just what to build, but when.

Through analyzing our decisions around LLM Eval Dev Tools and RAG Dev Tools, three crucial factors emerged that drive modern build vs. buy decisions:

- The complexity of state management
- The clarity of requirements and evolution path
- The maturity of the product category

But perhaps more importantly, we learned that applying these factors isn't enough - you need to ensure you're solving problems in the right sequence. Let's dive into our recent experiences to understand why.

## LLM Workload Evals

Our journey into LLM evaluation tooling began with a familiar pain point: features that worked perfectly in testing but showed inconsistencies in production. Despite LLMs making development faster, we were still facing the classic challenge of production reliability - our AI features would pass local testing, ship successfully, but then face scattered customer complaints.

At first glance, this seemed like a perfect opportunity to leverage LLMs for a build solution. After all, LLMs had made development so much faster - surely we could build an eval system quickly? After discovering discussions about evals on technical blogs and social media, we dug deeper into what building such a system would require.

Our investigation process was thorough:

1. Used LLMs to rapidly research and analyze eval approaches
2. Quickly prototyped simple eval patterns
3. Evaluated recommended solutions against our emerging requirements

Through this process, we identified our core requirements:

- Quick capture of customer samples and traces
- Ability to run evals on those traces
- Capability to redrive those traces through modified versions of our AI workload

This is where things got interesting. While LLMs could help us write the evaluation code quickly, they couldn't simplify the fundamental complexity of what we were trying to build. When we applied our framework, a different picture emerged:

1. State Management Complexity
    - Despite LLMs making code writing easier, trace collection still required robust infrastructure
    - Dataset curation and management needed careful state handling - something LLMs couldn't simplify
    - The scale of trace storage and processing presented significant complexity
    - Similar to tools like Datadog, the data ingestion requirements were substantial and couldn't be solved with faster development alone
2. Requirements Clarity & Evolution Path
    - We had a crucial realization: we didn't even have basic integration tests
    - While LLMs could help us build faster, they couldn't tell us what to build
    - The path from basic testing to full eval capabilities wasn't clear
    - We needed to walk before we could run - no amount of development acceleration could change this
3. Product Category Maturity
    - LLM evaluation is still an emerging field
    - Even with LLMs' help, best practices are actively evolving
    - Vendor features are comprehensive but unproven
    - The "right" feature set isn't yet established in the industry

Our decision? Start small with basic integration tests that we owned ourselves. This was a case where LLMs' ability to accelerate development actually helped us see the right path more clearly - we could quickly build basic integration tests and learn from them before committing to a larger solution.

However, we recognized that we'd likely end up purchasing a solution in the future. Why? While LLMs make writing code easier, they don't simplify the complex state management required for robust trace collection and analysis. Some problems remain fundamentally complex, regardless of how quickly we can write code.

## RAG Development Tools

Our second major build vs buy decision came when we needed to implement AI-enhanced search across our platform. Five years ago, this would have been an obvious "buy" decision - building search and document processing infrastructure was a massive undertaking. But in the LLM era, the calculation has shifted dramatically.

Our core requirements were straightforward:

1. Index text content from diverse document types (PDFs, Word docs, PowerPoint files)
2. Provide both keyword search and AI-powered overview capabilities
3. Support our proprietary library items alongside customer documents

During our vendor evaluation, we found a comprehensive platform that offered these features plus built-in evaluation tools. Pre-LLM, this would have been compelling: a mature solution handling all the complex document processing, search relevancy, and infrastructure needs.

However, as we dug deeper, we realized how LLMs had fundamentally changed the build equation:

- Document processing code that once required weeks of research could now be prototyped in days
- Search relevancy tuning, previously a specialized skill, became more approachable with LLM assistance
- Infrastructure patterns were easily discoverable and implementable
- We could iterate on features rapidly with LLM-aided development

Most importantly, we discovered we could deliver immediate value with keyword search alone. The AI-powered features, while valuable, weren't critical for our initial release. This realization, combined with LLMs reducing development complexity, shifted our thinking dramatically.

Applying our build vs buy framework to this decision:

1. State Management Complexity
    - Unlike our LLM evals case, the state management here was relatively straightforward
    - Document ingestion could be handled through proven patterns that LLMs helped us discover and implement
    - The core functionality could be built on top of existing database and search capabilities
    - LLMs didn't reduce state complexity, but they made implementing these patterns much easier
2. Requirements Clarity & Evolution Path
    - We had a clear "minimum viable product" with keyword search
    - LLMs enabled rapid prototyping of each feature increment
    - The evolution path was clear, and our enhanced development capabilities made it less daunting
    - We could iterate quickly on user feedback with LLM-assisted development
3. Product Category Maturity
    - While RAG is an emerging space, our core needs (document processing, search) are well-understood
    - The vendor offered many features, but LLMs made building our focused solution more feasible
    - The rapid evolution of LLM capabilities meant some vendor features might soon be easier to build
    - We had confidence in our ability to maintain and evolve the solution given our new development capabilities

This analysis led us to build rather than buy. Five years ago, the vendor's feature set would have been too compelling to pass up. But in the LLM era, we could confidently build a focused solution that met our needs, knowing we could evolve it rapidly as requirements changed.

# Rethinking Build vs Buy in the AI Era

Our journey through these two decisions - LLM Evals and RAG implementation - reveals how fundamentally LLMs have reshaped the build vs. buy calculation, while simultaneously highlighting what hasn't changed.

What's Changed:

- Development speed is dramatically faster
- Complex features are more approachable
- Research and implementation costs have plummeted
- The barrier to entry for sophisticated functionality is lower

What Hasn't Changed:

- Maintaining complex state at scale remains expensive
- You can't skip foundational steps just because advanced solutions exist
- The challenges of distributed systems persist

This leads us to a framework built on three key pillars, with sequencing as a critical prerequisite:

First, evaluate your readiness:

- Have you established necessary foundational capabilities?
- Is there a clear path of incremental value?
- Are you solving problems in the right order?

Then, analyze through our three factors:

1. State Management Complexity
    - While LLMs make code development faster, they don't simplify state management
    - This is why solutions like Datadog and S3 remain clear "buy" decisions
    - But simpler state management (like our initial RAG implementation) can now be confidently built in-house
2. Requirements Clarity & Evolution Path
    - LLMs make iterative development faster than ever
    - Can you start simple and add complexity incrementally?
    - Have you done the work to clarify these requirements?
3. Product Category Maturity
    - In mature categories, feature richness remains a strong "buy" signal
    - In emerging categories, LLMs enable rapid custom development
    - Don't let feature-rich solutions tempt you into skipping steps

This framework explains both our successes and our learning moments. With RAG, we leveraged LLMs to quickly build a focused solution that met our needs. With LLM evals, we recognized that even in an AI-accelerated world, you can't skip the fundamentals.

The build vs. buy decision in 2024 isn't just about capabilities - it's about understanding where LLMs have truly changed the equation and where fundamental complexities remain. As AI continues to reshape software development, this framework helps us navigate when to leverage our newly enhanced building capabilities and when to rely on proven solutions.