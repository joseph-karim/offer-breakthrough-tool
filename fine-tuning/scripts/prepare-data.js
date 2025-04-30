// prepare-data.js
// Script to prepare training data for OpenAI fine-tuning

const fs = require('fs');
const path = require('path');

// Paths
const dataDir = path.join(__dirname, '../data');
const outputDir = path.join(__dirname, '../output');

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// System prompt that will be used for all examples
const systemPrompt = `You are JTBD-Bot, an expert assistant trained in Jobs-to-be-Done methodology. Your task is to analyze user input (Product/Service, Desired Outcomes, Trigger Events) and generate exactly one Overarching Job Statement (OJS) and three to five Supporting Job Statements (SJS).

# Task Description
Generate one OJS and 3-5 SJS representing the customer's desired progress.

# Input Context
You will receive user input structured like this:
* Product/Service: [User's description]
* Desired Outcomes: [User's description]
* Trigger Events: [List of user's triggers]

# Methodology & Constraints
- **Progress Focus:** Statements MUST describe customer progress, NOT product features.
- **Format:** Strictly adhere to: "Help me [VERB] my [OBJECT] [CONTEXT]". Use strong, active verbs (see Verb Bank).
- **Context:** Incorporate relevant constraints or emotions (time, risk, resources, feelings like 'without anxiety', 'despite limited time').
- **Job Types:** Clearly label "Overarching Job Statement" and "Supporting Job Statements".
- **Validation (Internal):** Ensure statements pass the Five Tests (Switch, Progress, Specificity, Solution-Agnostic, Emotional).
- **No Extras:** Output ONLY the formatted statements unless asked for explanation.
- **Pitfall Avoidance:** Automatically correct statements mentioning solutions/features, using weak verbs, combining jobs, or lacking context.

# Verb Bank (Preferred)
Achieve, Accelerate, Align, Alleviate, Boost, Build, Capture, Clarify, Create, Eliminate, Enhance, Establish, Free, Improve, Increase, Maintain, Navigate, Protect, Reduce, Secure, Simplify, Streamline, Transform, Validate.

# Output Format
Provide the output EXACTLY as follows:

**Overarching Job Statement:**
* Help me [VERB] my [OBJECT] [CONTEXT]

**Supporting Job Statements:**
1. Help me [VERB] my [OBJECT] [CONTEXT]
2. Help me [VERB] my [OBJECT] [CONTEXT]
3. Help me [VERB] my [OBJECT] [CONTEXT]
4. (Optional) Help me [VERB] my [OBJECT] [CONTEXT]
5. (Optional) Help me [VERB] my [OBJECT] [CONTEXT]`;

// Training examples from the provided data - Batch 1
const trainingExamplesBatch1 = [
  {
    user: `Here's the information about my offer:

* Product/Service: A conversion rate optimization (CRO) audit and implementation package for e-commerce websites.
* Desired Outcomes: Higher website conversion rates, increased sales from existing traffic, better understanding of visitor behavior, improved ROI on marketing spend.
* Trigger Events: Seeing high website traffic numbers but stagnant sales figures; spending significantly on ads but not seeing proportional revenue growth; noticing visitors drop off at specific points in the online funnel; feeling frustrated that marketing efforts aren't translating into actual customers.`,
    assistant: `**Overarching Job Statement:**
* Help me turn interested visitors into paying customers without increasing my traffic costs

**Supporting Job Statements:**
1. Help me identify why website visitors leave without purchasing.
2. Help me communicate product value on my pages so visitors feel confident checking out.
3. Help me streamline my checkout process to reduce friction and abandonment.
4. Help me guide visitors toward purchase using clear, compelling prompts.
5. Help me build trust and credibility with website visitors early in their journey.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A "Pitch Deck Polishing" service including message refinement, deck design, and presentation coaching for startup founders.
* Desired Outcomes: A compelling and clear pitch deck, increased confidence presenting to investors, better articulation of business value, higher chance of securing funding.
* Trigger Events: Invited to pitch to investors but feeling the current deck/pitch is weak; received feedback that their business value wasn't clear in a previous meeting; feeling overwhelmed preparing for a critical funding round; recognizing the need for a professional narrative to secure capital.`,
    assistant: `**Overarching Job Statement:**
* Help me secure investment funding by clearly communicating my business value in high-stakes situations

**Supporting Job Statements:**
1. Help me craft a compelling narrative about my business vision and market opportunity for investors.
2. Help me present a pitch deck that investors can grasp quickly and recall afterwards.
3. Help me anticipate and confidently answer tough questions from potential investors.
4. Help me structure my financial projections clearly to demonstrate ROI potential.
5. Help me refine my presentation delivery to appear confident and credible during investor meetings.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A high-intensity, fixed-duration (e.g., 90-day) personal fitness and nutrition coaching program tailored for event preparation.
* Desired Outcomes: Significant improvement in physique/appearance, increased confidence for the event, feeling proud of achieving a transformation goal, receiving compliments.
* Trigger Events: A major life event (wedding, milestone reunion) is approaching quickly; feeling dissatisfied with current appearance and wanting a focused change for the event; wanting expert guidance and accountability to ensure visible results before the specific date; past attempts at self-improvement for events were unsuccessful.`,
    assistant: `**Overarching Job Statement:**
* Help me transform my appearance for a once-in-a-lifetime event with guaranteed results

**Supporting Job Statements:**
1. Help me follow a structured fitness plan that fits my schedule leading up to the event.
2. Help me adopt sustainable eating habits that support my transformation goals before the event date.
3. Help me stay motivated and accountable throughout the event preparation period.
4. Help me address specific areas of concern (e.g., toning arms, losing belly fat) before the event.
5. Help me feel confident and proud of my appearance on the day of the event.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A standardized team leadership workshop product focused on improving communication, setting clear expectations, and boosting morale for managers.
* Desired Outcomes: Improved team productivity, reduced project delays, higher team morale and engagement scores, better manager-employee relationships, lower employee turnover.
* Trigger Events: Noticing increased missed deadlines or team conflicts; receiving negative feedback on employee engagement surveys; key team members seem disengaged or have resigned; feeling frustrated with team performance and unsure how to improve the dynamics; promoted to lead a struggling team.`,
    assistant: `**Overarching Job Statement:**
* Help me create a productive team environment that delivers results while rebuilding employee engagement

**Supporting Job Statements:**
1. Help me diagnose the root causes of low morale and missed deadlines within my team.
2. Help me learn how to give constructive feedback effectively to improve performance.
3. Help me establish clear goals and expectations that motivate my team members.
4. Help me facilitate better communication and collaboration within the team.
5. Help me recognize and reward team contributions appropriately to boost engagement.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A marketing channel optimization service that analyzes current spend and results, then implements strategies (like SEO, referral programs, retention marketing) to acquire customers more cost-effectively.
* Desired Outcomes: Lower average customer acquisition cost (CAC), improved marketing ROI, diversified customer acquisition channels, sustainable business growth without proportionally increasing ad spend.
* Trigger Events: Realizing paid ad costs are becoming unsustainably high; seeing diminishing returns from current marketing channels; needing to improve profitability by reducing marketing expenses; wanting to scale growth but concerned about the rising cost per customer; noticing competitors acquiring customers more efficiently.`,
    assistant: `**Overarching Job Statement:**
* Help me reduce my customer acquisition costs while maintaining growth momentum

**Supporting Job Statements:**
1. Help me identify which marketing channels are providing the best ROI currently.
2. Help me optimize my existing marketing campaigns for better cost-efficiency.
3. Help me develop and implement lower-cost acquisition strategies like referral programs or SEO.
4. Help me improve customer retention to increase lifetime value and reduce the need for constant acquisition.
5. Help me track my CAC accurately across different channels to make informed budget decisions.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A lightweight, pre-configured project management template system (e.g., Notion or Asana based) designed for small service agencies.
* Desired Outcomes: Better project tracking and visibility, fewer missed deadlines, improved budget adherence, smoother client communication, reduced project-related stress.
* Trigger Events: Recently had a major project go significantly over budget or past its deadline; feeling overwhelmed trying to manage multiple complex client projects simultaneously; receiving client complaints about project delays or lack of updates; recognizing spreadsheets are no longer sufficient for project tracking; team members are confused about priorities and tasks.`,
    assistant: `**Overarching Job Statement:**
* Help me deliver complex projects on time and within budget

**Supporting Job Statements:**
1. Help me accurately estimate timelines and resources required for complex projects upfront.
2. Help me break down large projects into manageable tasks and milestones.
3. Help me track project progress and identify potential roadblocks proactively.
4. Help me manage scope creep effectively without damaging client relationships.
5. Help me improve communication with clients and team members regarding project status.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A corporate membership providing employees with priority access to virtual doctor appointments and prescription delivery services.
* Desired Outcomes: Convenient access to healthcare, less time taken off work for appointments, quicker treatment for minor ailments, reduced productivity loss due to illness/appointments.
* Trigger Events: Difficulty scheduling doctor's appointments around work hours; having to use valuable paid time off for routine check-ups; avoiding seeking medical care due to the hassle involved; wanting faster access to medical advice for common issues without leaving the office/home.`,
    assistant: `**Overarching Job Statement:**
* Help me receive medical care without disrupting my work schedule

**Supporting Job Statements:**
1. Help me find qualified doctors or specialists who offer appointments outside standard work hours.
2. Help me leverage virtual consultations effectively for routine check-ups or minor issues.
3. Help me efficiently manage appointment scheduling and reminders.
4. Help me get prescriptions filled and delivered conveniently without taking time off.
5. Help me consolidate my medical records for easier access during consultations.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A robo-advisor investment platform with pre-built portfolios based on risk tolerance and retirement goals, coupled with basic financial planning tools.
* Desired Outcomes: A diversified investment portfolio aligned with goals, automated investing and rebalancing, peace of mind about retirement planning, easy tracking of financial progress without needing deep market knowledge.
* Trigger Events: Realizing they have significant savings sitting in a low-interest account; feeling confused or overwhelmed by investment options; approaching a major life milestone (like starting a family or nearing retirement age); worrying about not saving enough for the future; wanting a simpler, automated way to manage investments.`,
    assistant: `**Overarching Job Statement:**
* Help me secure my financial future without becoming a financial expert

**Supporting Job Statements:**
1. Help me understand my current financial situation and define clear long-term goals (e.g., retirement).
2. Help me choose an appropriate investment strategy based on my risk tolerance and timeline.
3. Help me automate my savings and investments consistently.
4. Help me easily track my investment performance and progress towards goals.
5. Help me make basic financial decisions (like budgeting or debt management) with confidence.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: An e-commerce checkout optimization service that analyzes and improves the online buying process, from cart to confirmation, possibly including setup of post-purchase follow-up sequences.
* Desired Outcomes: Reduced cart abandonment rates, increased repeat customer purchases, higher customer lifetime value, improved customer satisfaction with the buying process, seamless online transactions.
* Trigger Events: Noticing a high cart abandonment rate in their e-commerce analytics; receiving customer complaints about the checkout process; wanting to increase customer loyalty and repeat business; realizing the current online purchase experience is clunky or confusing; seeing competitors offer a much smoother online buying experience.`,
    assistant: `**Overarching Job Statement:**
* Help me create a frictionless purchasing experience that encourages repeat buying

**Supporting Job Statements:**
1. Help me simplify my online checkout steps to minimize clicks and required information.
2. Help me offer payment methods my customers already trust and prefer.
3. Help me ensure clear communication throughout the purchase process.
4. Help me enable effortless repeat purchases for returning customers.
5. Help me gather feedback on the checkout experience to identify points of friction.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A subscription-based lawn care and basic landscaping maintenance service with scheduled visits.
* Desired Outcomes: A consistently well-maintained lawn and yard, more free time on weekends, increased curb appeal, avoiding physical strain of yard work.
* Trigger Events: Feeling overwhelmed by the amount of time yard work requires; physical limitations making yard work difficult; receiving comments from neighbors or HOA about property upkeep; wanting to enjoy their yard rather than constantly working on it; realizing they lack the equipment or knowledge for proper lawn care.`,
    assistant: `**Overarching Job Statement:**
* Help me maintain an attractive property without spending my weekends on yard work

**Supporting Job Statements:**
1. Help me ensure my lawn is consistently mowed and healthy during the growing season.
2. Help me keep garden beds weed-free and looking tidy.
3. Help me manage seasonal tasks like leaf removal or pruning without manual effort.
4. Help me find reliable service providers for regular property maintenance.
5. Help me free up my weekend time previously spent on demanding yard chores.`
  }
];

// Training examples from the provided data - Batch 2
const trainingExamplesBatch2 = [
  {
    user: `Here's the information about my offer:

* Product/Service: A targeted lead generation package including market research, ideal customer profile definition, and setup of initial outreach campaigns specifically for entering a new niche.
* Desired Outcomes: A pipeline of qualified leads in the new target market, reduced risk and uncertainty of market entry, faster traction in the new segment, validated market demand.
* Trigger Events: Deciding to expand their business into a new industry or customer type but unsure where to start finding clients; current lead generation methods aren't effective for the new target segment; experiencing slow initial results after attempting to enter the new market; needing to demonstrate traction in the new segment to secure resources or justify the expansion.`,
    assistant: `**Overarching Job Statement:**
* Help me attract qualified leads when entering a new market segment

**Supporting Job Statements:**
1. Help me understand the specific needs and buying triggers of customers in the new market segment.
2. Help me identify the most effective channels to reach potential buyers in this niche.
3. Help me craft messaging that resonates with the target audience.
4. Help me launch initial outreach that resonates with prospects in the new market.
5. Help me qualify leads effectively to ensure they fit the new market focus.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A curated family vacation planning service that offers pre-vetted, activity-packed itineraries focused on specific destinations or themes, maximizing limited time off.
* Desired Outcomes: Stress-free vacation planning, unique and engaging experiences for the whole family, making the most of limited vacation days, creating lasting positive memories.
* Trigger Events: Feeling overwhelmed trying to plan a family vacation that satisfies everyone with limited time; past vacations felt rushed or disorganized; wanting to ensure precious vacation time isn't wasted on poor planning or bad choices; lacking time or knowledge to research and book unique family-friendly activities.`,
    assistant: `**Overarching Job Statement:**
* Help me create memorable family experiences during limited vacation time

**Supporting Job Statements:**
1. Help me discover unique destinations or activities suitable for my family's interests.
2. Help me plan a balanced itinerary that maximizes enjoyment without feeling rushed.
3. Help me handle the logistics of booking flights, accommodations, and activities efficiently.
4. Help me find experiences that will engage different age groups within the family.
5. Help me reduce the stress typically associated with planning family travel.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: On-demand access to specialized manufacturing equipment or skilled temporary labor specifically designed to handle overflow during peak production seasons for small manufacturers.
* Desired Outcomes: Ability to meet high seasonal demand, avoid turning down large orders, maintain delivery timelines during busy periods, avoid costly investments in equipment used only part-time, flexible scaling of operations.
* Trigger Events: Anticipating a busy season known to strain current production capacity; having to turn down large orders during peak times last year; struggling to meet delivery deadlines during the high season; wanting to capitalize on seasonal demand without the risk of buying expensive new machinery or hiring permanent staff.`,
    assistant: `**Overarching Job Statement:**
* Help me increase production capacity during seasonal peaks without capital investment

**Supporting Job Statements:**
1. Help me accurately forecast seasonal demand to plan capacity needs in advance.
2. Help me identify reliable partners for overflow production or temporary staffing.
3. Help me streamline my existing production processes to maximize throughput during peak times.
4. Help me manage temporary increases in inventory and logistics smoothly.
5. Help me fulfill large seasonal orders on time without sacrificing quality.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A business development system product including lead generation tactics, outreach templates, and CRM setup guidance specifically for service businesses needing to rebuild their client base quickly.
* Desired Outcomes: Diversified lead sources, consistent flow of new client opportunities, reduced reliance on any single client, increased confidence in business development efforts, faster recovery from client loss.
* Trigger Events: A large client representing a significant portion of revenue suddenly terminated their contract; realizing their client base is too concentrated and risky; experiencing a sudden drop in income due to client loss; feeling panicked about finding new clients quickly to fill the revenue gap.`,
    assistant: `**Overarching Job Statement:**
* Help me build a reliable client pipeline after losing a major account

**Supporting Job Statements:**
1. Help me identify new potential client segments or niches to target.
2. Help me develop consistent lead generation activities (e.g., outreach, content marketing).
3. Help me craft compelling proposals or pitches for new potential clients.
4. Help me diversify my client base to reduce future revenue risk.
5. Help me quickly replace the lost revenue stream with new, quality clients.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A done-for-you implementation service for specific, high-impact business software (e.g., marketing automation, scheduling tools) tailored for non-technical small business owners.
* Desired Outcomes: Leveraging powerful software without needing technical skills, automating key business processes, achieving measurable results (time savings, increased leads) quickly from the software investment, avoiding implementation headaches.
* Trigger Events: Feeling overwhelmed by manual processes that could be automated; knowing certain software could help but feeling intimidated by the setup and learning curve; having tried implementing a tool previously but failed to get it working correctly; wanting the benefits of technology without hiring dedicated IT staff or expensive consultants.`,
    assistant: `**Overarching Job Statement:**
* Help me implement technology solutions that deliver quick ROI without IT expertise

**Supporting Job Statements:**
1. Help me identify the specific software tools best suited to solve my key business bottlenecks.
2. Help me start benefiting from new software immediately without technical struggles.
3. Help me integrate new tools with my existing systems smoothly.
4. Help me train my team to use new technology effectively.
5. Help me track the impact of the technology to confirm its value and ROI.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A fitness app subscription providing short, effective workout routines that can be done anywhere, anytime, combined with flexible meal planning guidance.
* Desired Outcomes: Improved fitness and body composition, ability to maintain a consistent (though flexible) health routine, increased energy levels, reduced stress about fitting workouts in.
* Trigger Events: Work or travel schedule constantly changes, making regular gym times impossible; feeling frustrated by lack of progress due to inconsistent routines; wanting to prioritize health but struggling to find time; needing workouts and nutrition advice that adapts to a busy, unpredictable lifestyle.`,
    assistant: `**Overarching Job Statement:**
* Help me achieve a healthier physique despite my unpredictable schedule

**Supporting Job Statements:**
1. Help me find quick, effective workout routines I can do with minimal time/equipment.
2. Help me make healthier food choices when eating on the go or traveling.
3. Help me plan workouts flexibly around changing work or travel commitments.
4. Help me stay consistent with exercise even when my schedule is chaotic.
5. Help me manage energy levels better through appropriate fitness and nutrition for a busy lifestyle.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A specialized real estate buyer's agent service focused on hyper-local market knowledge, off-market opportunities, and strategic offer negotiation for families in high-demand neighborhoods.
* Desired Outcomes: Successfully purchasing a suitable family home, avoiding overpaying in bidding wars, gaining access to more listings, reduced stress during the home buying process, confidence in making a sound investment.
* Trigger Events: Repeatedly losing out on homes in bidding wars; feeling frustrated by the lack of available homes within their budget in the desired area; needing to move by a specific deadline (e.g., start of school year); overwhelmed by the speed and competitiveness of the local real estate market; needing expert guidance to navigate a complex purchase.`,
    assistant: `**Overarching Job Statement:**
* Help me find and secure a family home in a competitive market within my budget

**Supporting Job Statements:**
1. Help me identify suitable neighborhoods that meet my family's needs (schools, safety, commute) and budget.
2. Help me get early access to new listings, potentially before they hit the open market.
3. Help me craft competitive offers quickly when the right property appears.
4. Help me navigate bidding wars strategically to increase my chances of success.
5. Help me understand the true market value of properties to avoid overpaying.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A fixed-price "Profitability Diagnostic" service for established small businesses, involving financial analysis, process review, and identification of key areas for cost reduction or revenue enhancement.
* Desired Outcomes: Clear understanding of factors impacting profit, actionable recommendations to improve profitability, data-driven insights into business performance, increased bottom line.
* Trigger Events: Noticing profit margins shrinking despite stable or growing revenue; feeling unsure why the business isn't as profitable as it used to be; experiencing cash flow challenges; needing to improve financial performance before seeking investment or selling the business; suspecting operational inefficiencies but unsure where to find them.`,
    assistant: `**Overarching Job Statement:**
* Help me identify and eliminate the hidden causes of declining profitability

**Supporting Job Statements:**
1. Help me analyze my financial statements to pinpoint areas of high cost or low margin.
2. Help me understand the profitability of different products, services, or customer segments.
3. Help me review my operational processes to find inefficiencies that waste resources.
4. Help me evaluate my pricing strategy to ensure it supports profitability goals.
5. Help me implement changes to cut unnecessary costs or boost high-margin activities.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: An e-commerce post-purchase optimization service analyzing and improving the experience *after* the sale, focusing on things like shipping communication, returns, and encouraging repeat business.
* Desired Outcomes: Increased customer loyalty and repeat purchases, higher customer lifetime value, improved customer satisfaction post-purchase, positive reviews and word-of-mouth.
* Trigger Events: Receiving customer complaints about shipping delays or return hassles; noticing low repeat purchase rates despite good products; wanting to build stronger customer relationships beyond the initial sale; seeing competitors excel at post-purchase engagement.`,
    assistant: `**Overarching Job Statement:**
* Help me turn first-time buyers into loyal repeat customers through a positive post-purchase experience

**Supporting Job Statements:**
1. Help me ensure clear and proactive communication about order fulfillment and shipping.
2. Help me implement a hassle-free return or exchange process.
3. Help me gather customer feedback effectively after the purchase.
4. Help me create targeted follow-up campaigns to encourage repeat business.
5. Help me build a stronger relationship with customers after their initial purchase.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: An employer branding package including development of an employee value proposition (EVP), career page optimization, and guidance on implementing retention-focused HR practices for companies in competitive industries.
* Desired Outcomes: Stronger employer brand reputation, increased number of qualified job applicants, improved employee retention rates, becoming an employer of choice in their industry, reduced recruitment costs.
* Trigger Events: Struggling to fill open positions with qualified candidates; losing key employees to competitors; receiving feedback that their company isn't perceived as a great place to work; recognizing the high cost of employee turnover; needing to build a strong talent pipeline for future growth in a competitive market.`,
    assistant: `**Overarching Job Statement:**
* Help me attract and retain top talent in a skills-shortage environment

**Supporting Job Statements:**
1. Help me define and communicate what makes my company a unique and attractive place to work.
2. Help me optimize my job descriptions and application process to attract the right candidates.
3. Help me improve my interview and selection process to identify the best fits.
4. Help me implement practices that improve employee satisfaction and reduce turnover.
5. Help me build a positive company culture that top performers value.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A tech-enabled bookkeeping service using automation and a client dashboard to provide clear financial reporting with minimal client time required.
* Desired Outcomes: Accurate and up-to-date financial records, clear visibility into business finances (profit, loss, cash flow), less time spent on bookkeeping tasks, tax-ready financials, informed business decisions.
* Trigger Events: Falling behind on bookkeeping tasks due to lack of time; feeling unsure about the business's true financial health; making business decisions based on gut feel rather than data; facing stress or penalties during tax season due to disorganized records; realizing bookkeeping is taking too much valuable time away from revenue-generating activities.`,
    assistant: `**Overarching Job Statement:**
* Help me maintain financial clarity without diverting time from core business activities

**Supporting Job Statements:**
1. Help me receive complete financial data automatically, without manual effort.
2. Help me categorize income and expenses accurately with minimal input.
3. Help me generate easy-to-understand financial reports regularly.
4. Help me ensure my books are accurate and ready for tax preparation.
5. Help me access key financial metrics quickly to inform decisions.`
  }
];

// Training examples from the provided data - Batch 3
const trainingExamplesBatch3 = [
  {
    user: `Here's the information about my offer:

* Product/Service: A legal compliance subscription service for a specific industry, providing regular updates, template documents, and access to expert consultations regarding relevant regulations.
* Desired Outcomes: Reduced legal risk, maintained compliance with changing regulations, peace of mind regarding legal obligations, access to expert advice when needed, avoidance of fines or lawsuits.
* Trigger Events: Becoming aware of new industry regulations that impact their business; experiencing a compliance issue or fine; feeling overwhelmed trying to keep up with complex legal requirements; expanding the business into areas with different regulations; wanting proactive legal protection rather than reactive problem-solving.`,
    assistant: `**Overarching Job Statement:**
* Help me protect my business interests while navigating complex regulatory changes

**Supporting Job Statements:**
1. Help me stay informed about new laws or regulations impacting my specific industry.
2. Help me update my contracts and policies to ensure ongoing compliance.
3. Help me implement necessary operational changes required by new regulations.
4. Help me access expert legal advice when facing specific compliance questions.
5. Help me minimize the risk of fines or legal action due to non-compliance.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A social media content strategy and management package focused on building community and engagement on specific platforms relevant to the client's niche.
* Desired Outcomes: Increased brand visibility and engagement on relevant social platforms, stronger relationships with potential and current customers, improved brand perception, generation of qualified leads from social media.
* Trigger Events: Feeling their social media posts aren't getting engagement or reaching the right people; unsure which social platforms their ideal customers use; lacking a consistent strategy for online content; wanting to build a community around their brand but not knowing how; seeing competitors effectively connecting with the target audience online.`,
    assistant: `**Overarching Job Statement:**
* Help me build meaningful connections with my target audience where they spend time online

**Supporting Job Statements:**
1. Help me identify the specific online platforms (social media, forums, etc.) where my ideal customers are most active.
2. Help me create content that genuinely interests and engages my target audience on those platforms.
3. Help me participate in online conversations authentically to build relationships.
4. Help me manage online community interactions effectively.
5. Help me convert online engagement into actual leads or customers over time.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A project management service for homeowners undertaking renovations, coordinating contractors, tracking progress, and managing budgets.
* Desired Outcomes: Reduced stress during renovations, projects completed on time and within budget, assurance of quality workmanship, effective communication with contractors, avoidance of common renovation pitfalls.
* Trigger Events: Planning a major home renovation and feeling overwhelmed by the process; having had a negative experience with contractors or renovation delays in the past; lacking the time or expertise to manage a complex home improvement project effectively; wanting an advocate to ensure their interests are protected during the renovation.`,
    assistant: `**Overarching Job Statement:**
* Help me complete home improvements with quality results, on schedule and within budget

**Supporting Job Statements:**
1. Help me find and vet reliable, high-quality contractors for my specific project.
2. Help me establish clear contracts and expectations with contractors before work begins.
3. Help me monitor the progress and quality of work throughout the renovation.
4. Help me manage payments to contractors based on milestones achieved.
5. Help me handle unexpected issues or changes during the renovation smoothly.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A structured business coaching program (group or 1-on-1) with regular check-ins, strategic frameworks, and accountability mechanisms for established business owners feeling stuck.
* Desired Outcomes: Identification of key growth blockers, clear action plans to overcome obstacles, increased accountability leading to execution, objective perspective on business challenges, renewed motivation and strategic direction.
* Trigger Events: Business growth has stalled despite effort; feeling isolated and lacking objective feedback on strategic decisions; repeatedly hitting the same roadblocks; knowing *what* needs to be done but struggling with execution or accountability; wanting expert guidance tailored to their specific business challenges.`,
    assistant: `**Overarching Job Statement:**
* Help me overcome business growth obstacles through objective guidance and accountability

**Supporting Job Statements:**
1. Help me identify the key internal or external factors currently limiting my business growth.
2. Help me brainstorm and prioritize potential solutions or strategies to address these obstacles.
3. Help me set clear, measurable goals and action steps for implementing chosen strategies.
4. Help me stay accountable for executing my action plan through regular check-ins.
5. Help me gain an unbiased perspective on my business challenges and opportunities.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A healthcare navigation service or app that helps patients find specialists, schedule appointments quickly, and manage medical records across different providers.
* Desired Outcomes: Faster access to needed medical specialists, reduced administrative burden of managing healthcare, less time spent waiting for appointments or navigating referrals, feeling more in control of one's healthcare journey.
* Trigger Events: Facing long wait times for specialist appointments; feeling frustrated trying to coordinate care between multiple doctors or facilities; spending hours on the phone trying to schedule appointments or get information; needing urgent care but unsure of the quickest appropriate channel; dealing with a complex health issue requiring coordinated care.`,
    assistant: `**Overarching Job Statement:**
* Help me receive appropriate medical care quickly without navigating complex systems or excessive waiting

**Supporting Job Statements:**
1. Help me understand my symptoms and identify the right type of medical professional to see.
2. Help me find doctors or clinics with the shortest wait times for appointments.
3. Help me efficiently handle referral processes between different medical providers.
4. Help me manage appointment scheduling and communication with multiple clinics easily.
5. Help me utilize urgent care or virtual options appropriately for faster access when needed.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: An actively managed investment portfolio service with different risk levels, emphasizing downside protection strategies and offering flexible withdrawal options.
* Desired Outcomes: Potential for wealth growth adjusted for risk tolerance, reduced anxiety during market downturns, confidence that capital is relatively protected, ability to access funds if needed without significant penalties.
* Trigger Events: Experiencing significant losses in a previous market crash; feeling anxious about market volatility impacting their savings; needing their investments to grow but also prioritizing capital preservation; wanting expert management to navigate uncertain economic times; needing a balance between long-term growth and short/medium-term access to capital.`,
    assistant: `**Overarching Job Statement:**
* Help me grow my wealth consistently while protecting against market volatility and maintaining access to funds

**Supporting Job Statements:**
1. Help me build a diversified investment portfolio appropriate for my risk tolerance.
2. Help me implement strategies designed to reduce losses during market downturns.
3. Help me understand the liquidity options within my investment portfolio.
4. Help me regularly review and rebalance my portfolio to stay aligned with goals.
5. Help me avoid making emotional investment decisions during periods of market stress.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: Done-for-you implementation and management service for specific business software (e.g., CRM, marketing automation) focused on demonstrating and tracking clear ROI metrics for non-technical owners.
* Desired Outcomes: Leveraging technology for clear business results (increased leads, saved time, higher revenue), understanding the financial return of software investments, avoiding technical setup/maintenance, focusing on business outcomes not software features.
* Trigger Events: Skeptical about the value of investing in new technology due to past experiences; needing to justify software expenses with clear ROI data; wanting the benefits of specific tools but lacking technical skills or resources; feeling overwhelmed by software options and wanting a solution focused on results; needing to automate processes to improve efficiency and profitability.`,
    assistant: `**Overarching Job Statement:**
* Help me implement business technologies that deliver measurable ROI without requiring specialized technical knowledge

**Supporting Job Statements:**
1. Help me clearly define the business outcomes I expect from new technology.
2. Help me select technology that is easy to adopt and clearly reports performance.
3. Help me activate the technology so it tracks the KPIs that prove ROI.
4. Help me understand reports showing the technology's impact on my goals.
5. Help me leverage the technology effectively without needing to become a technical expert.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: Part-time, online executive education programs or micro-credential courses designed for working professionals with evening/weekend schedules and practical, immediately applicable learning.
* Desired Outcomes: Gained specific skills/credentials for career advancement, ability to balance learning with work and personal life, enhanced professional network, increased confidence and marketability.
* Trigger Events: Recognizing the need for upskilling to get promoted or change careers but unable to quit current job; having limited time due to work and family obligations; looking for flexible learning options that fit a busy schedule; wanting practical skills applicable immediately, not just theory; needing a credential to validate expertise.`,
    assistant: `**Overarching Job Statement:**
* Help me develop career-advancing skills while maintaining my current job and family responsibilities

**Supporting Job Statements:**
1. Help me find learning programs with flexible scheduling (self-paced, evenings, weekends).
2. Help me choose courses focused on practical skills immediately applicable in the workplace.
3. Help me create a realistic study plan that fits around my existing commitments.
4. Help me connect with instructors or peers for support without rigid time requirements.
5. Help me efficiently acquire skills and credentials needed for my next career step.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A weekly meal kit subscription service offering quick, family-friendly recipes with pre-portioned ingredients and options catering to common dietary restrictions or preferences.
* Desired Outcomes: Reduced stress around meal planning and grocery shopping, ability to cook healthy meals quickly on weeknights, less food waste, introduction of new meals accepted by picky eaters, more quality family time instead of cooking time.
* Trigger Events: Feeling stressed every day figuring out what to cook for dinner; relying too much on unhealthy takeout due to lack of time; struggling to find recipes the whole family (especially kids) will eat; spending too much time grocery shopping and meal prepping; wanting to eat healthier as a family but finding it difficult to manage.`,
    assistant: `**Overarching Job Statement:**
* Help me provide healthy, appealing meals for my family despite limited preparation time and picky eaters

**Supporting Job Statements:**
1. Help me find quick recipes (e.g., under 30 minutes) using simple ingredients.
2. Help me get meal ideas or ingredients delivered conveniently to save shopping time.
3. Help me find ways to adapt recipes to accommodate picky eaters without making separate meals.
4. Help me plan weekly meals efficiently to reduce daily decision fatigue.
5. Help me involve my family in meal prep or selection to increase acceptance.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A business process improvement consulting package focused on identifying and streamlining internal workflows (e.g., client onboarding, project management) with minimal interruption to ongoing client work.
* Desired Outcomes: Smoother internal operations, reduced wasted time or resources, improved team productivity, enhanced service quality/consistency, ability to scale operations without adding proportional overhead.
* Trigger Events: Realizing internal processes are clunky, manual, or error-prone; experiencing bottlenecks that slow down client work; team members expressing frustration with inefficient workflows; wanting to improve profitability by optimizing operations; needing to standardize processes to scale the business or onboard new team members effectively without causing chaos.`,
    assistant: `**Overarching Job Statement:**
* Help me reduce operational inefficiencies in my business without disrupting current service delivery

**Supporting Job Statements:**
1. Help me map out my current workflows to identify bottlenecks or redundant steps.
2. Help me introduce process changes incrementally to minimize disruption to clients and team.
3. Help me eliminate time-consuming manual tasks through automation.
4. Help me train my team on new, more efficient processes smoothly.
5. Help me measure the impact of process improvements on efficiency and cost savings.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A recurring home cleaning and tidying service customizable to focus on key areas, perhaps combined with organizational tips or products.
* Desired Outcomes: A consistently clean and less cluttered home, reduced stress related to household chores, more free time and energy for other activities, feeling more relaxed and comfortable at home.
* Trigger Events: Feeling constantly behind on housework due to work/family demands; feeling embarrassed by the state of their home when guests visit; arguing with family members about chores; lacking the physical energy for thorough cleaning; wanting the benefits of a clean home without investing significant personal time/effort.`,
    assistant: `**Overarching Job Statement:**
* Help me maintain a clean, organized home environment despite a busy schedule and limited energy

**Supporting Job Statements:**
1. Help me automate regular cleaning tasks (e.g., vacuuming, mopping).
2. Help me establish simple routines for tidying up key areas daily or weekly.
3. Help me declutter effectively to reduce the amount of stuff needing organization.
4. Help me find reliable help for deeper cleaning tasks I don't have time/energy for.
5. Help me create organizational systems that are easy to maintain even when busy.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: An online course or group coaching program focused on practical social skills, conversation techniques, and managing social anxiety, emphasizing authenticity.
* Desired Outcomes: Increased confidence in networking or social events, ability to initiate and maintain conversations naturally, reduced social anxiety, forming genuine connections, feeling more comfortable being oneself around others.
* Trigger Events: Avoiding social or professional networking events due to anxiety; feeling awkward or unsure what to say in conversations; wanting to build better relationships but feeling held back by shyness; receiving feedback about seeming unapproachable; feeling drained or uncomfortable after social interactions.`,
    assistant: `**Overarching Job Statement:**
* Help me build confidence in social situations without feeling inauthentic or uncomfortable

**Supporting Job Statements:**
1. Help me understand the common causes of my social anxiety or discomfort.
2. Help me learn simple techniques for starting and continuing conversations naturally.
3. Help me practice social skills in low-stakes, supportive environments.
4. Help me manage negative thoughts or self-consciousness during social interactions.
5. Help me identify ways to socialize that align with my personality and comfort level.`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A personal styling subscription box or online consultation service specializing in professional wear for specific body types and price points.
* Desired Outcomes: A curated wardrobe of professional clothing that fits well and looks good, increased confidence in professional appearance, saved time shopping, discovering new brands/styles within budget, looking polished and appropriate for work.
* Trigger Events: Starting a new job with a different dress code; feeling current work wardrobe is outdated or ill-fitting; struggling to find professional clothes that flatter their body shape; feeling frustrated spending hours shopping with little success; wanting to elevate their professional image but unsure how or constrained by budget.`,
    assistant: `**Overarching Job Statement:**
* Help me find clothing that enhances my professional image while accommodating my body type and budget

**Supporting Job Statements:**
1. Help me understand what clothing styles best flatter my specific body shape.
2. Help me identify brands or stores offering quality professional wear within my price range.
3. Help me build a versatile capsule wardrobe for work with key pieces.
4. Help me accessorize appropriately to complete a professional look.
5. Help me easily find specific items online or in stores that meet my criteria (style, size, budget).`
  },
  {
    user: `Here's the information about my offer:

* Product/Service: A travel agency service specializing in planning complex family trips involving multiple age groups (grandparents, parents, kids), balancing activities, pacing, and budgets.
* Desired Outcomes: A well-planned trip enjoyable for all age groups, reduced stress of coordinating logistics for a large group, activities catering to diverse interests, staying within budget, creating shared positive memories across generations.
* Trigger Events: Planning a large family reunion trip or a vacation with grandparents and children; feeling overwhelmed trying to find activities/accommodations suitable for vastly different ages and mobility levels; past multi-generational trips involved stress or dissatisfaction from some family members; difficulty managing budget and logistics for a large group; wanting an expert to handle the complexity.`,
    assistant: `**Overarching Job Statement:**
* Help me create memorable vacation experiences that accommodate multi-generational preferences within time and budget constraints

**Supporting Job Statements:**
1. Help me choose destinations and accommodations suitable for various ages and mobility levels.
2. Help me plan a mix of activities that appeal to different generations (kids, parents, grandparents).
3. Help me structure the itinerary with appropriate pacing, allowing for both group time and downtime.
4. Help me manage the budget effectively across lodging, food, and activities for a large group.
5. Help me handle complex travel logistics (flights, transport) for multiple family units smoothly.`
  }
];

// Combine all training examples
const trainingExamples = [
  ...trainingExamplesBatch1,
  ...trainingExamplesBatch2,
  ...trainingExamplesBatch3
];

// Log the number of examples in each batch
console.log(`Batch 1: ${trainingExamplesBatch1.length} examples`);
console.log(`Batch 2: ${trainingExamplesBatch2.length} examples`);
console.log(`Batch 3: ${trainingExamplesBatch3.length} examples`);
console.log(`Total: ${trainingExamples.length} examples`);

// Function to convert examples to JSONL format
function convertToJsonl(examples, outputFile) {
  const jsonlData = examples.map(example => {
    return JSON.stringify({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: example.user
        },
        {
          role: 'assistant',
          content: example.assistant
        }
      ]
    });
  }).join('\n');

  fs.writeFileSync(outputFile, jsonlData);
  console.log(`Created ${outputFile} with ${examples.length} examples`);
}

// Main function to prepare the data
function prepareTrainingData() {
  // Ensure we have at least 10 examples in the training set
  const totalExamples = trainingExamples.length;
  const minTrainingCount = 10; // OpenAI requires at least 10 examples for training

  // If we have fewer than 10 examples total, use all for training
  if (totalExamples < minTrainingCount) {
    console.warn(`Warning: Only ${totalExamples} examples available. All will be used for training.`);

    // Create training data file with all examples
    const trainingDataPath = path.join(outputDir, 'training_data.jsonl');
    convertToJsonl(trainingExamples, trainingDataPath);

    // Create validation data file with the same examples (not ideal but necessary)
    const validationDataPath = path.join(outputDir, 'validation_data.jsonl');
    convertToJsonl(trainingExamples, validationDataPath);

    console.log(`Training data: ${trainingExamples.length} examples`);
    console.log(`Validation data: ${trainingExamples.length} examples (same as training)`);
    console.log('Training and validation data prepared successfully');
    return;
  }

  // Calculate validation count ensuring at least 10 examples for training
  const maxValidationCount = Math.max(0, totalExamples - minTrainingCount);
  const validationCount = Math.min(Math.floor(totalExamples * 0.2), maxValidationCount);
  const trainingCount = totalExamples - validationCount;

  // Shuffle the examples to ensure random distribution
  const shuffledExamples = [...trainingExamples].sort(() => Math.random() - 0.5);

  // Split into training and validation sets
  const trainingSet = shuffledExamples.slice(0, trainingCount);
  const validationSet = validationCount > 0 ?
    shuffledExamples.slice(trainingCount) :
    shuffledExamples.slice(0, 1); // Use at least one example for validation

  // Create training data file
  const trainingDataPath = path.join(outputDir, 'training_data.jsonl');
  convertToJsonl(trainingSet, trainingDataPath);

  // Create validation data file
  const validationDataPath = path.join(outputDir, 'validation_data.jsonl');
  convertToJsonl(validationSet, validationDataPath);

  console.log(`Training data: ${trainingSet.length} examples`);
  console.log(`Validation data: ${validationSet.length} examples`);
  console.log('Training and validation data prepared successfully');
}

// Run the data preparation
prepareTrainingData();
