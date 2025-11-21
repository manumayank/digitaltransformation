import { PrismaClient } from '@prisma/client';
import { RecommendationPriority, ModuleCategory } from '@shared/types';

const prisma = new PrismaClient();

interface RecommendationTemplate {
  title: string;
  description: string;
  priority: RecommendationPriority;
  estimatedCost: string;
  estimatedTimeframe: string;
  expectedImpact: string;
  valuationImpact: string;
  implementationSteps: string[];
  resources: Array<{ title: string; url?: string; description: string }>;
  condition: (score: number) => boolean;
}

/**
 * RecommendationService
 *
 * Generates personalized recommendations based on assessment scores.
 * Recommendations are prioritized by urgency and include implementation guidance.
 */
export class RecommendationService {
  /**
   * Recommendation templates per module based on score ranges
   */
  private readonly moduleRecommendations: Map<ModuleCategory, RecommendationTemplate[]> = new Map([
    [ModuleCategory.DIGITAL_PRESENCE, [
      {
        title: 'Establish Professional Digital Presence',
        description: 'Build foundational digital presence with professional website, Google Business Profile, and key social media channels.',
        priority: RecommendationPriority.IMMEDIATE,
        estimatedCost: 'Medium ($5K-$15K)',
        estimatedTimeframe: '4-8 weeks',
        expectedImpact: 'Increase online visibility, improve customer trust, enable digital marketing, support SEO efforts.',
        valuationImpact: 'Increases valuation by 10-20%. Digital presence is baseline expectation for modern businesses.',
        implementationSteps: [
          'Hire web designer/developer or use platform like Squarespace/WordPress',
          'Create Google Business Profile and optimize with photos, hours, services',
          'Establish presence on 2-3 platforms where target customers are active',
          'Develop content calendar for regular updates',
          'Implement basic SEO (keywords, meta tags, mobile optimization)',
          'Set up analytics (Google Analytics, social insights)',
        ],
        resources: [
          { title: 'Google Business Profile', url: 'https://business.google.com', description: 'Free business listing on Google' },
          { title: 'Squarespace', url: 'https://squarespace.com', description: 'Easy website builder for small businesses' },
          { title: 'Buffer', description: 'Social media management and scheduling tool' },
        ],
        condition: (score) => score < 50,
      },
      {
        title: 'Optimize Digital Channels for Lead Generation',
        description: 'Enhance existing digital presence with SEO, content marketing, and conversion optimization.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Medium ($8K-$20K)',
        estimatedTimeframe: '8-12 weeks',
        expectedImpact: 'Increase organic traffic 30-50%, improve lead quality, reduce customer acquisition cost.',
        valuationImpact: 'Demonstrates scalable, low-cost customer acquisition channel. Can increase valuation 5-15%.',
        implementationSteps: [
          'Conduct SEO audit and implement technical fixes',
          'Develop content strategy aligned with customer journey',
          'Create 10-15 high-quality pieces of content (blogs, guides, videos)',
          'Implement conversion rate optimization (CTAs, forms, landing pages)',
          'Set up email capture and nurture sequences',
          'Run A/B tests on key pages',
        ],
        resources: [
          { title: 'SEMrush or Ahrefs', description: 'SEO and content marketing tools' },
          { title: 'HubSpot Free CRM', description: 'Marketing automation and lead tracking' },
          { title: 'Hotjar', description: 'User behavior analytics and heatmaps' },
        ],
        condition: (score) => score >= 50 && score < 75,
      },
    ]],

    [ModuleCategory.CRM_ERP_SYSTEMS, [
      {
        title: 'Implement Cloud-Based CRM System',
        description: 'Deploy modern CRM to centralize customer data, track sales pipeline, and improve customer relationships.',
        priority: RecommendationPriority.IMMEDIATE,
        estimatedCost: 'Medium ($10K-$30K setup + $100-$500/mo)',
        estimatedTimeframe: '6-10 weeks',
        expectedImpact: 'Centralize customer data, track all interactions, forecast revenue accurately, improve sales efficiency 20-40%.',
        valuationImpact: 'Critical for business sale. Demonstrates organized customer data and predictable revenue. Can increase valuation 15-25%.',
        implementationSteps: [
          'Evaluate CRM options (HubSpot, Salesforce, Pipedrive) based on needs and budget',
          'Design data structure (contacts, companies, deals, custom fields)',
          'Migrate existing customer data from spreadsheets/old systems',
          'Configure sales pipeline stages matching your process',
          'Set up automations (email sequences, task creation, notifications)',
          'Train team and establish data entry standards',
          'Integrate with email, calendar, and other tools',
        ],
        resources: [
          { title: 'HubSpot CRM', url: 'https://hubspot.com', description: 'Free starter CRM, paid tiers for advanced features' },
          { title: 'Pipedrive', description: 'Sales-focused CRM with intuitive pipeline management' },
          { title: 'Salesforce Essentials', description: 'Enterprise CRM for small businesses' },
        ],
        condition: (score) => score < 40,
      },
      {
        title: 'Integrate Business Systems for Unified Data',
        description: 'Connect CRM with accounting, operations, and marketing tools to eliminate data silos.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Medium-High ($15K-$40K)',
        estimatedTimeframe: '8-16 weeks',
        expectedImpact: 'Eliminate duplicate data entry, improve data accuracy, enable cross-functional reporting, increase operational efficiency.',
        valuationImpact: 'Demonstrates mature systems and scalable operations. Reduces operational risk for buyer.',
        implementationSteps: [
          'Map current systems and data flows',
          'Identify integration points (CRM-to-accounting, CRM-to-marketing, etc.)',
          'Evaluate integration platforms (Zapier, Make, native integrations)',
          'Implement priority integrations first (CRM-to-QuickBooks, CRM-to-email)',
          'Test data sync and establish monitoring',
          'Create data governance policies',
          'Document integrations and dependencies',
        ],
        resources: [
          { title: 'Zapier', url: 'https://zapier.com', description: 'No-code integration platform connecting 5000+ apps' },
          { title: 'Make (Integromat)', description: 'Advanced integration platform with visual builder' },
        ],
        condition: (score) => score >= 40 && score < 70,
      },
    ]],

    [ModuleCategory.FINANCIAL_SYSTEMS, [
      {
        title: 'Implement Professional Accounting System',
        description: 'Move to cloud accounting platform with proper chart of accounts, controls, and reporting.',
        priority: RecommendationPriority.IMMEDIATE,
        estimatedCost: 'Medium ($15K-$40K setup)',
        estimatedTimeframe: '4-8 weeks',
        expectedImpact: 'Accurate financial reporting, real-time visibility, easier tax preparation, audit-ready records.',
        valuationImpact: 'Essential for business sale. Clean financials can increase valuation 20-30%. Messy books can kill deals.',
        implementationSteps: [
          'Select accounting platform (QuickBooks Online, Xero, NetSuite)',
          'Engage accountant/bookkeeper to set up chart of accounts',
          'Migrate historical data (1-3 years)',
          'Connect bank/credit card feeds',
          'Set up invoice and bill pay workflows',
          'Implement monthly close process',
          'Train staff on system and establish policies',
          'Set up management reports (P&L, balance sheet, cash flow)',
        ],
        resources: [
          { title: 'QuickBooks Online', description: 'Leading small business accounting software' },
          { title: 'Xero', description: 'Cloud accounting with strong automation features' },
          { title: 'Bench or Pilot', description: 'Outsourced bookkeeping services' },
        ],
        condition: (score) => score < 45,
      },
      {
        title: 'Add Financial Forecasting and Dashboards',
        description: 'Implement rolling forecasts, budgets, and real-time financial dashboards for better decision-making.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Low-Medium ($5K-$15K)',
        estimatedTimeframe: '4-6 weeks',
        expectedImpact: 'Proactive financial management, better cash flow planning, identify trends early, impress buyers with sophistication.',
        valuationImpact: 'Shows financial maturity and planning capability. Buyers pay premium for predictable businesses.',
        implementationSteps: [
          'Set up financial dashboard tool (Fathom, Baremetrics, or accounting platform built-in)',
          'Define key financial KPIs to track',
          'Create 12-month rolling forecast model',
          'Implement monthly forecast vs. actual reviews',
          'Develop scenario planning (best/worst/likely cases)',
          'Share KPI dashboard with management team',
        ],
        resources: [
          { title: 'Fathom', description: 'Financial reporting and analysis for SMBs' },
          { title: 'LivePlan', description: 'Business planning and financial forecasting' },
          { title: 'Jirav', description: 'FP&A platform for growing businesses' },
        ],
        condition: (score) => score >= 45 && score < 70,
      },
    ]],

    [ModuleCategory.DATA_SECURITY, [
      {
        title: 'Implement Essential Security Controls',
        description: 'Deploy foundational security measures: backups, password management, MFA, and endpoint protection.',
        priority: RecommendationPriority.IMMEDIATE,
        estimatedCost: 'Low-Medium ($5K-$15K + $200-$500/mo)',
        estimatedTimeframe: '2-4 weeks',
        expectedImpact: 'Protect against 90% of common threats, prevent data loss, ensure business continuity, meet basic compliance requirements.',
        valuationImpact: 'Security breach can destroy business value. Strong security reduces risk and builds buyer confidence.',
        implementationSteps: [
          'Implement automated cloud backups (daily) for all critical data',
          'Deploy password manager (1Password, LastPass) to all employees',
          'Enable multi-factor authentication (MFA) on all critical accounts',
          'Install endpoint protection (antivirus, anti-malware) on all devices',
          'Implement email security (spam filter, phishing protection)',
          'Create basic security policies (password requirements, acceptable use)',
          'Conduct employee security awareness training',
        ],
        resources: [
          { title: '1Password Business', description: 'Enterprise password management' },
          { title: 'Backblaze or Datto', description: 'Cloud backup solutions' },
          { title: 'Duo or Authy', description: 'Multi-factor authentication' },
          { title: 'KnowBe4', description: 'Security awareness training platform' },
        ],
        condition: (score) => score < 50,
      },
      {
        title: 'Achieve Security Compliance Certification',
        description: 'Work toward SOC 2, ISO 27001, or industry-specific compliance to demonstrate mature security practices.',
        priority: RecommendationPriority.MEDIUM_TERM,
        estimatedCost: 'High ($40K-$100K)',
        estimatedTimeframe: '6-12 months',
        expectedImpact: 'Meet enterprise customer requirements, reduce insurance costs, streamline buyer due diligence, competitive advantage.',
        valuationImpact: 'Certification can increase valuation 10-20% and expand buyer pool significantly.',
        implementationSteps: [
          'Determine relevant certification (SOC 2 Type II most common for SaaS/tech)',
          'Conduct gap assessment against certification requirements',
          'Implement missing controls (access management, monitoring, incident response)',
          'Document all policies and procedures',
          'Conduct internal audit',
          'Engage third-party auditor for certification',
          'Maintain ongoing compliance program',
        ],
        resources: [
          { title: 'Vanta or Drata', description: 'Compliance automation platforms' },
          { title: 'Tugboat Logic', description: 'Security and compliance management' },
        ],
        condition: (score) => score >= 50 && score < 75,
      },
    ]],

    [ModuleCategory.TECH_INFRASTRUCTURE, [
      {
        title: 'Migrate to Cloud Infrastructure',
        description: 'Move critical systems from on-premise or legacy hosting to modern cloud platforms.',
        priority: RecommendationPriority.MEDIUM_TERM,
        estimatedCost: 'High ($30K-$100K+)',
        estimatedTimeframe: '3-6 months',
        expectedImpact: 'Improve reliability, enable scalability, reduce maintenance burden, modernize technology stack.',
        valuationImpact: 'Cloud migration reduces technical debt and shows growth readiness. Can increase valuation 10-15%.',
        implementationSteps: [
          'Audit current infrastructure and dependencies',
          'Select cloud provider (AWS, Azure, Google Cloud)',
          'Design cloud architecture (scalability, security, cost optimization)',
          'Develop migration plan (prioritize by criticality)',
          'Migrate non-production environments first',
          'Test thoroughly before production migration',
          'Migrate production with rollback plan',
          'Optimize costs and implement monitoring',
        ],
        resources: [
          { title: 'AWS Migration Hub', description: 'Migration planning and tracking tools' },
          { title: 'CloudEndure', description: 'Automated migration tool' },
        ],
        condition: (score) => score < 50,
      },
      {
        title: 'Implement Infrastructure Monitoring and Automation',
        description: 'Add comprehensive monitoring, alerting, and infrastructure-as-code for operational excellence.',
        priority: RecommendationPriority.MEDIUM_TERM,
        estimatedCost: 'Medium ($15K-$35K)',
        estimatedTimeframe: '6-10 weeks',
        expectedImpact: 'Reduce downtime, faster issue detection, enable auto-scaling, improve developer productivity.',
        valuationImpact: 'Demonstrates operational maturity and reduced technical risk for buyer.',
        implementationSteps: [
          'Implement APM tool (Datadog, New Relic, or cloud-native)',
          'Set up logging aggregation and analysis',
          'Create alerting rules for critical issues',
          'Implement infrastructure-as-code (Terraform, CloudFormation)',
          'Set up CI/CD pipelines for automated deployments',
          'Create runbooks for common issues',
          'Conduct regular performance reviews',
        ],
        resources: [
          { title: 'Datadog', description: 'Full-stack monitoring and analytics' },
          { title: 'Terraform', description: 'Infrastructure as code tool' },
          { title: 'PagerDuty', description: 'Incident management platform' },
        ],
        condition: (score) => score >= 50 && score < 75,
      },
    ]],

    [ModuleCategory.PROCESS_ORGANIZATION, [
      {
        title: 'Document Core Business Processes',
        description: 'Create comprehensive SOPs (Standard Operating Procedures) for all critical business processes.',
        priority: RecommendationPriority.IMMEDIATE,
        estimatedCost: 'Medium ($10K-$25K)',
        estimatedTimeframe: '8-16 weeks',
        expectedImpact: 'Reduce key person risk, enable training and scaling, improve consistency, facilitate business transfer.',
        valuationImpact: 'Critical for exit. Well-documented processes can increase valuation 20-40% by reducing buyer risk.',
        implementationSteps: [
          'Identify all core processes (sales, operations, finance, customer service)',
          'Prioritize processes to document (highest impact or risk first)',
          'Interview process owners and observe workflows',
          'Create step-by-step documented procedures with screenshots/videos',
          'Store in accessible knowledge base (Notion, Confluence, Process Street)',
          'Train team members using documented processes',
          'Establish process for updating documentation',
          'Cross-train staff to reduce single points of failure',
        ],
        resources: [
          { title: 'Process Street', description: 'Process documentation and workflow management' },
          { title: 'Scribe', description: 'Auto-generate process documentation with screenshots' },
          { title: 'Trainual', description: 'Business playbook and training platform' },
        ],
        condition: (score) => score < 50,
      },
      {
        title: 'Implement Process Improvement and Automation',
        description: 'Identify inefficiencies and automate repetitive processes to improve margins.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Medium ($15K-$40K)',
        estimatedTimeframe: '12-20 weeks',
        expectedImpact: 'Reduce costs 15-30%, improve quality, increase capacity without adding headcount.',
        valuationImpact: 'Improved margins directly increase valuation. Automation shows scalability.',
        implementationSteps: [
          'Map current workflows and identify bottlenecks',
          'Measure baseline metrics (time, cost, error rate)',
          'Identify top 10 automation opportunities',
          'Prioritize by ROI and implement quick wins first',
          'Use tools like Zapier, Make, or custom development',
          'Test automation thoroughly before full rollout',
          'Measure improvement and iterate',
        ],
        resources: [
          { title: 'Zapier', description: 'No-code automation platform' },
          { title: 'Process Street', description: 'Workflow automation with checklists' },
        ],
        condition: (score) => score >= 50 && score < 70,
      },
    ]],

    [ModuleCategory.PEOPLE_TRAINING, [
      {
        title: 'Create Formal Onboarding and Training Program',
        description: 'Develop structured onboarding process and ongoing training curriculum for all roles.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Medium ($10K-$25K)',
        estimatedTimeframe: '8-12 weeks',
        expectedImpact: 'Reduce time-to-productivity 30-50%, improve retention, ensure consistent quality, enable scaling.',
        valuationImpact: 'Shows ability to grow team without quality degradation. Reduces post-sale integration risk.',
        implementationSteps: [
          'Create role-based onboarding checklists (30/60/90 day plans)',
          'Develop training content library (videos, docs, quizzes)',
          'Implement learning management system (LMS)',
          'Create certification requirements for each role',
          'Assign mentors/buddies for new hires',
          'Collect feedback and iterate on program',
          'Track time-to-productivity metrics',
        ],
        resources: [
          { title: 'Trainual', description: 'Small business training and onboarding platform' },
          { title: 'Lessonly', description: 'Team training and coaching software' },
          { title: 'Loom', description: 'Video messaging for training content' },
        ],
        condition: (score) => score < 50,
      },
      {
        title: 'Implement Career Development Framework',
        description: 'Create clear career paths, skill development programs, and succession planning.',
        priority: RecommendationPriority.MEDIUM_TERM,
        estimatedCost: 'Medium ($15K-$35K)',
        estimatedTimeframe: '12-20 weeks',
        expectedImpact: 'Improve retention, develop internal leadership bench, increase employee engagement and productivity.',
        valuationImpact: 'Reduces talent risk post-acquisition. Buyers value companies with strong culture and retention.',
        implementationSteps: [
          'Define career levels and competencies for each role',
          'Create individual development plans (IDPs) for all employees',
          'Allocate training budget per employee ($1K-$3K/year)',
          'Implement performance review process (quarterly or biannual)',
          'Create internal promotion pathways',
          'Identify and develop high-potential employees',
          'Implement mentorship or coaching programs',
        ],
        resources: [
          { title: 'Lattice or 15Five', description: 'Performance management and development platforms' },
          { title: 'LinkedIn Learning', description: 'Online training courses' },
        ],
        condition: (score) => score >= 50 && score < 70,
      },
    ]],

    [ModuleCategory.CUSTOMER_EXPERIENCE, [
      {
        title: 'Implement Customer Feedback System',
        description: 'Deploy NPS surveys, feedback collection, and customer satisfaction tracking.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Low-Medium ($5K-$15K)',
        estimatedTimeframe: '4-6 weeks',
        expectedImpact: 'Understand customer sentiment, identify improvement areas, reduce churn, increase referrals.',
        valuationImpact: 'Demonstrates customer-centricity and provides data on revenue retention for buyer.',
        implementationSteps: [
          'Select feedback tool (Delighted, SurveyMonkey, Typeform)',
          'Design NPS survey and automate sending (after purchase, quarterly, etc.)',
          'Create feedback loops (support tickets, post-service, cancellations)',
          'Set up dashboard to track NPS, CSAT, and trends',
          'Establish process for responding to negative feedback',
          'Share results with team and celebrate wins',
          'Implement quarterly action plans based on feedback',
        ],
        resources: [
          { title: 'Delighted', description: 'NPS and customer feedback platform' },
          { title: 'Typeform', description: 'Beautiful surveys and forms' },
        ],
        condition: (score) => score < 55,
      },
      {
        title: 'Build Proactive Customer Success Program',
        description: 'Move from reactive support to proactive customer success with health scoring and expansion plays.',
        priority: RecommendationPriority.MEDIUM_TERM,
        estimatedCost: 'Medium-High ($25K-$60K)',
        estimatedTimeframe: '12-20 weeks',
        expectedImpact: 'Reduce churn 20-40%, increase upsell/cross-sell, improve customer lifetime value.',
        valuationImpact: 'Higher retention and expansion rates directly increase recurring revenue multiples.',
        implementationSteps: [
          'Hire or assign customer success manager(s)',
          'Implement customer health scoring (usage, engagement, satisfaction)',
          'Create customer journey map and touchpoint strategy',
          'Develop QBR (Quarterly Business Review) template',
          'Build playbooks for onboarding, adoption, renewal, expansion',
          'Set up automated customer outreach based on triggers',
          'Track retention and expansion metrics',
        ],
        resources: [
          { title: 'Gainsight or ChurnZero', description: 'Customer success platforms' },
          { title: 'Intercom', description: 'Customer messaging and engagement' },
        ],
        condition: (score) => score >= 55 && score < 75,
      },
    ]],

    [ModuleCategory.SCALABILITY, [
      {
        title: 'Identify and Remove Top Scalability Bottlenecks',
        description: 'Conduct scalability audit and address the top 3 constraints limiting 2-3x growth.',
        priority: RecommendationPriority.IMMEDIATE,
        estimatedCost: 'High ($40K-$100K+)',
        estimatedTimeframe: '3-6 months',
        expectedImpact: 'Enable 2-3x growth without proportional cost increase, improve margins, reduce operational stress.',
        valuationImpact: 'Demonstrates growth potential. Buyers pay premium for scalable businesses (can add 20-50% to valuation).',
        implementationSteps: [
          'Conduct bottleneck analysis (where would business break at 2x revenue?)',
          'Categorize constraints (systems, processes, people, capital)',
          'Prioritize top 3 bottlenecks by impact',
          'Develop solution for each (automation, hiring, outsourcing, technology)',
          'Implement solutions sequentially or in parallel',
          'Test scalability improvements with growth scenarios',
          'Document scalable processes and systems',
        ],
        resources: [
          { title: 'Scaling Up (Book)', description: 'Framework for scaling businesses' },
          { title: 'EOS (Entrepreneurial Operating System)', description: 'Business management system' },
        ],
        condition: (score) => score < 50,
      },
      {
        title: 'Build Repeatable Growth Model',
        description: 'Create documented, repeatable customer acquisition and delivery processes that can scale predictably.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Medium ($20K-$50K)',
        estimatedTimeframe: '8-16 weeks',
        expectedImpact: 'Predictable customer acquisition, consistent delivery quality, ability to forecast growth accurately.',
        valuationImpact: 'Predictability increases buyer confidence and can add 15-30% to valuation multiple.',
        implementationSteps: [
          'Document customer acquisition process (all channels)',
          'Calculate unit economics (CAC, LTV, payback period)',
          'Identify most scalable acquisition channels',
          'Standardize delivery/fulfillment process',
          'Create capacity planning model',
          'Test growth assumptions with small expansions',
          'Build 12-month growth forecast with staffing/resource plan',
        ],
        resources: [
          { title: 'Traction (Book)', description: 'Framework for customer acquisition' },
          { title: 'ProfitWell', description: 'Subscription analytics and metrics' },
        ],
        condition: (score) => score >= 50 && score < 70,
      },
    ]],

    [ModuleCategory.SUCCESSION_READINESS, [
      {
        title: 'Build Management Team and Delegate Operations',
        description: 'Hire key management roles and systematically transfer operational responsibilities from owner.',
        priority: RecommendationPriority.IMMEDIATE,
        estimatedCost: 'High ($100K-$300K+ annually for salaries)',
        estimatedTimeframe: '6-12 months',
        expectedImpact: 'Reduce owner dependency, enable business growth, create smooth transition for sale or retirement.',
        valuationImpact: 'CRITICAL for exit. Can increase valuation 50-100% by removing owner dependency and expanding buyer pool.',
        implementationSteps: [
          'Identify critical management roles (COO, Sales Director, Finance Manager)',
          'Hire or promote into key positions (start with most critical)',
          'Create clear role descriptions and decision-making authority',
          'Transfer operational responsibilities systematically',
          'Implement management team meetings and KPI tracking',
          'Document institutional knowledge before transitioning',
          'Give management team real autonomy and accountability',
          'Transition customer relationships to management team',
        ],
        resources: [
          { title: 'Built to Sell (Book)', description: 'Creating a business that can thrive without you' },
          { title: 'Topgrading', description: 'Hiring methodology for key roles' },
        ],
        condition: (score) => score < 50,
      },
      {
        title: 'Develop Comprehensive Transition Plan',
        description: 'Create detailed transition documentation, train successors, and establish clear handoff process.',
        priority: RecommendationPriority.SHORT_TERM,
        estimatedCost: 'Medium ($15K-$40K)',
        estimatedTimeframe: '8-16 weeks',
        expectedImpact: 'Smooth ownership transition, preserve business value post-sale, reduce buyer risk.',
        valuationImpact: 'Shows professionalism and planning. Can add 10-20% to valuation by reducing transition risk.',
        implementationSteps: [
          'Document all owner responsibilities and relationships',
          'Create knowledge transfer plan for each area',
          'Identify key customer/vendor relationships to transition',
          'Develop 90-day transition plan post-sale',
          'Cross-train team on owner-dependent tasks',
          'Create decision-making frameworks for common scenarios',
          'Establish metrics to track transition success',
        ],
        resources: [
          { title: 'Exit Planning Institute', description: 'Resources and training for business exits' },
          { title: 'Notion or Confluence', description: 'Knowledge documentation platforms' },
        ],
        condition: (score) => score >= 50 && score < 75,
      },
    ]],
  ]);

  /**
   * Generate recommendations for an assessment based on module scores
   */
  async generateRecommendations(assessmentId: string): Promise<void> {
    try {
      // Get all module scores for this assessment
      const moduleScores = await prisma.moduleScore.findMany({
        where: { assessmentId },
        include: {
          module: {
            select: { id: true, category: true },
          },
        },
      });

      // Delete existing recommendations for this assessment
      await prisma.recommendation.deleteMany({
        where: { assessmentId },
      });

      const recommendationsToCreate = [];

      // Generate recommendations for each module based on score
      for (const moduleScore of moduleScores) {
        const templates = this.moduleRecommendations.get(moduleScore.module.category);

        if (templates) {
          for (const template of templates) {
            // Check if this template's condition is met
            if (template.condition(moduleScore.score)) {
              recommendationsToCreate.push({
                assessmentId,
                moduleId: moduleScore.module.id,
                title: template.title,
                description: template.description,
                priority: template.priority,
                estimatedCost: template.estimatedCost,
                estimatedTimeframe: template.estimatedTimeframe,
                expectedImpact: template.expectedImpact,
                valuationImpact: template.valuationImpact,
                implementationSteps: template.implementationSteps,
                resources: template.resources,
              });

              // Only one recommendation per module
              break;
            }
          }
        }
      }

      // Create all recommendations
      if (recommendationsToCreate.length > 0) {
        await prisma.recommendation.createMany({
          data: recommendationsToCreate,
        });
      }

      console.log(`Generated ${recommendationsToCreate.length} recommendations for assessment ${assessmentId}`);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Get all recommendations for an assessment
   */
  async getRecommendations(assessmentId: string) {
    return await prisma.recommendation.findMany({
      where: { assessmentId },
      include: {
        module: {
          select: { name: true, category: true },
        },
      },
      orderBy: [
        { priority: 'asc' }, // IMMEDIATE first
        { createdAt: 'asc' },
      ],
    });
  }

  /**
   * Get recommendation counts by priority
   */
  async getRecommendationStats(assessmentId: string) {
    const recommendations = await this.getRecommendations(assessmentId);

    return {
      total: recommendations.length,
      immediate: recommendations.filter((r) => r.priority === RecommendationPriority.IMMEDIATE).length,
      shortTerm: recommendations.filter((r) => r.priority === RecommendationPriority.SHORT_TERM).length,
      mediumTerm: recommendations.filter((r) => r.priority === RecommendationPriority.MEDIUM_TERM).length,
      longTerm: recommendations.filter((r) => r.priority === RecommendationPriority.LONG_TERM).length,
    };
  }
}
