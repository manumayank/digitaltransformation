import { PrismaClient, RiskLevel, ModuleCategory } from '@prisma/client';

const prisma = new PrismaClient();

interface RiskRule {
  category: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  impact: string;
  mitigation: string;
  condition: (score: number) => boolean;
}

/**
 * RiskAnalysisService
 *
 * Analyzes assessment results and generates risk flags based on:
 * - Low module scores (below thresholds)
 * - Specific answer patterns
 * - Critical gaps in readiness
 */
export class RiskAnalysisService {
  /**
   * Risk detection rules based on module scores
   */
  private readonly moduleRiskRules: Map<ModuleCategory, RiskRule[]> = new Map([
    [ModuleCategory.DIGITAL_PRESENCE, [
      {
        category: 'Digital Presence',
        title: 'Critical Digital Presence Gap',
        description: 'Business has minimal to no digital presence, severely limiting market reach and customer acquisition.',
        riskLevel: RiskLevel.CRITICAL,
        impact: 'Unable to compete with digitally-enabled competitors. Missing significant revenue opportunities. Poor visibility to modern buyers who expect online presence.',
        mitigation: 'Immediately establish basic digital footprint: professional website, Google Business Profile, and presence on 2-3 relevant social platforms. Budget: $5K-15K for initial setup.',
        condition: (score) => score < 30,
      },
      {
        category: 'Digital Presence',
        title: 'Weak Digital Presence',
        description: 'Digital presence exists but is outdated, inconsistent, or ineffective.',
        riskLevel: RiskLevel.HIGH,
        impact: 'Reduced customer trust and credibility. Difficulty attracting new customers. Lower valuation due to weak market positioning.',
        mitigation: 'Audit and upgrade all digital channels. Implement consistent branding, regular content updates, and SEO optimization. Budget: $10K-25K.',
        condition: (score) => score >= 30 && score < 50,
      },
    ]],

    [ModuleCategory.CRM_ERP_SYSTEMS, [
      {
        category: 'CRM/ERP Systems',
        title: 'No Customer/Operations Management System',
        description: 'Business lacks centralized CRM or ERP system, relying on spreadsheets and manual processes.',
        riskLevel: RiskLevel.CRITICAL,
        impact: 'Customer data scattered and inaccessible. Unable to track sales pipeline. Operational inefficiencies causing revenue leakage. Major red flag for acquirers.',
        mitigation: 'Implement cloud-based CRM (HubSpot, Salesforce) and basic ERP/operations system. Migrate existing data. Train staff. Budget: $15K-40K + monthly SaaS fees.',
        condition: (score) => score < 25,
      },
      {
        category: 'CRM/ERP Systems',
        title: 'Fragmented Business Systems',
        description: 'Systems exist but are disconnected, creating data silos and inefficiencies.',
        riskLevel: RiskLevel.HIGH,
        impact: 'Duplicate data entry. Inconsistent reporting. Difficulty scaling operations. Lower operational efficiency impacts margins.',
        mitigation: 'Evaluate system integration options. Implement middleware or migrate to unified platform. Establish single source of truth for customer/operational data.',
        condition: (score) => score >= 25 && score < 45,
      },
    ]],

    [ModuleCategory.FINANCIAL_SYSTEMS, [
      {
        category: 'Financial Systems',
        title: 'Inadequate Financial Controls',
        description: 'Financial tracking is manual, incomplete, or lacks proper controls and reporting.',
        riskLevel: RiskLevel.CRITICAL,
        impact: 'Unable to provide accurate financials to buyers. Audit risk. Cash flow blind spots. May prevent deal closure or significantly reduce valuation.',
        mitigation: 'Implement cloud accounting system (QuickBooks, Xero, NetSuite). Hire fractional CFO. Establish monthly close process. Implement financial controls. Budget: $20K-50K.',
        condition: (score) => score < 30,
      },
      {
        category: 'Financial Systems',
        title: 'Limited Financial Visibility',
        description: 'Basic financial systems exist but lack real-time reporting, forecasting, or advanced analytics.',
        riskLevel: RiskLevel.MEDIUM,
        impact: 'Difficulty making data-driven decisions. Limited ability to forecast. Buyers will require financial system upgrade as condition of sale.',
        mitigation: 'Upgrade to advanced accounting platform. Implement financial dashboards. Add forecasting and budgeting capabilities.',
        condition: (score) => score >= 30 && score < 55,
      },
    ]],

    [ModuleCategory.DATA_SECURITY, [
      {
        category: 'Data Security',
        title: 'Critical Security Vulnerabilities',
        description: 'Business has major security gaps: no data backups, weak access controls, no security policies.',
        riskLevel: RiskLevel.CRITICAL,
        impact: 'High risk of data breach, ransomware, or data loss. Legal/compliance exposure. Deal-breaker for many acquirers. Potential for catastrophic business loss.',
        mitigation: 'IMMEDIATE: Implement automated backups, password manager, MFA. Develop security policies. Conduct security audit. Consider cyber insurance. Budget: $10K-30K + ongoing.',
        condition: (score) => score < 35,
      },
      {
        category: 'Data Security',
        title: 'Moderate Security Gaps',
        description: 'Basic security measures in place but gaps exist in compliance, employee training, or incident response.',
        riskLevel: RiskLevel.HIGH,
        impact: 'Vulnerable to sophisticated attacks. Compliance gaps may delay sale. Insurance premiums may be high.',
        mitigation: 'Conduct penetration testing. Implement SIEM/monitoring. Develop incident response plan. Provide security training. Achieve compliance certifications if relevant.',
        condition: (score) => score >= 35 && score < 55,
      },
    ]],

    [ModuleCategory.TECH_INFRASTRUCTURE, [
      {
        category: 'Tech Infrastructure',
        title: 'Legacy/Outdated Technology',
        description: 'Critical systems running on outdated, unsupported, or end-of-life technology.',
        riskLevel: RiskLevel.HIGH,
        impact: 'System failure risk. Security vulnerabilities. Unable to integrate with modern tools. Significant tech debt that buyer must assume.',
        mitigation: 'Audit all tech infrastructure. Develop modernization roadmap. Prioritize customer-facing and revenue-critical systems. Budget: $30K-100K+ depending on scope.',
        condition: (score) => score < 35,
      },
      {
        category: 'Tech Infrastructure',
        title: 'Infrastructure Scalability Concerns',
        description: 'Current infrastructure adequate for current scale but unable to handle 2-3x growth.',
        riskLevel: RiskLevel.MEDIUM,
        impact: 'Limits growth potential. Buyer may discount valuation due to required infrastructure investment.',
        mitigation: 'Migrate to cloud-based, scalable infrastructure. Implement auto-scaling where applicable. Document capacity planning.',
        condition: (score) => score >= 35 && score < 60,
      },
    ]],

    [ModuleCategory.PROCESS_ORGANIZATION, [
      {
        category: 'Process & Organization',
        title: 'Lack of Documented Processes',
        description: 'Critical business processes undocumented and dependent on key individuals.',
        riskLevel: RiskLevel.HIGH,
        impact: 'Extreme key person risk. Operational knowledge loss if employees leave. Difficult to scale or transfer to new owner. Valuation discount of 20-40%.',
        mitigation: 'Document all core processes (SOPs). Implement process management system. Cross-train staff. Create operations manual. Allocate 3-6 months.',
        condition: (score) => score < 40,
      },
      {
        category: 'Process & Organization',
        title: 'Inconsistent Process Execution',
        description: 'Processes documented but not consistently followed or enforced.',
        riskLevel: RiskLevel.MEDIUM,
        impact: 'Quality inconsistency. Training difficulties. Operational inefficiencies reducing margins.',
        mitigation: 'Implement process monitoring and compliance checks. Regular training. Process improvement initiatives.',
        condition: (score) => score >= 40 && score < 60,
      },
    ]],

    [ModuleCategory.PEOPLE_TRAINING, [
      {
        category: 'People & Training',
        title: 'No Formal Training Program',
        description: 'Ad-hoc training only. No onboarding program, skills development, or succession planning.',
        riskLevel: RiskLevel.HIGH,
        impact: 'High turnover risk. Inconsistent service quality. Knowledge gaps. Difficulty scaling team. Talent retention issues post-sale.',
        mitigation: 'Develop formal onboarding program. Create training library. Implement LMS. Document role competencies. Budget: $15K-35K initial investment.',
        condition: (score) => score < 35,
      },
      {
        category: 'People & Training',
        title: 'Limited Development Opportunities',
        description: 'Basic training exists but lacks career development paths or advanced skill building.',
        riskLevel: RiskLevel.MEDIUM,
        impact: 'Difficulty retaining top talent. Limited internal promotion opportunities. Skills gap as technology evolves.',
        mitigation: 'Create career development frameworks. Allocate training budget per employee. Implement mentorship programs.',
        condition: (score) => score >= 35 && score < 55,
      },
    ]],

    [ModuleCategory.CUSTOMER_EXPERIENCE, [
      {
        category: 'Customer Experience',
        title: 'Poor Customer Experience Management',
        description: 'No formal customer feedback system, CX metrics, or service standards.',
        riskLevel: RiskLevel.HIGH,
        impact: 'Customer churn risk. Poor reviews damaging brand. Revenue vulnerability. Buyer will question sustainability of customer base.',
        mitigation: 'Implement customer feedback system (NPS, surveys). Define service standards. Create customer journey maps. Monitor satisfaction metrics.',
        condition: (score) => score < 40,
      },
      {
        category: 'Customer Experience',
        title: 'Reactive Customer Service',
        description: 'Customer service is reactive rather than proactive, with limited personalization.',
        riskLevel: RiskLevel.MEDIUM,
        impact: 'Missed upsell opportunities. Lower customer lifetime value. Competitive disadvantage.',
        mitigation: 'Implement proactive outreach programs. Add customer success function. Enhance personalization capabilities.',
        condition: (score) => score >= 40 && score < 60,
      },
    ]],

    [ModuleCategory.SCALABILITY, [
      {
        category: 'Scalability',
        title: 'Major Scalability Barriers',
        description: 'Business model, systems, or processes cannot support 2x growth without major changes.',
        riskLevel: RiskLevel.CRITICAL,
        impact: 'Growth ceiling reached. Unable to capitalize on market opportunities. Buyer sees limited upside potential, significantly impacting valuation multiple.',
        mitigation: 'Conduct scalability audit. Identify top 3 bottlenecks. Develop scaling roadmap. May require system upgrades, process automation, or organizational restructuring.',
        condition: (score) => score < 35,
      },
      {
        category: 'Scalability',
        title: 'Limited Automation',
        description: 'Heavy reliance on manual processes that limit efficiency and growth.',
        riskLevel: RiskLevel.MEDIUM,
        impact: 'High labor costs as percentage of revenue. Slower execution. Margin compression as you scale.',
        mitigation: 'Identify high-volume manual processes. Implement RPA or workflow automation. Focus on customer-facing and operational processes.',
        condition: (score) => score >= 35 && score < 55,
      },
    ]],

    [ModuleCategory.SUCCESSION_READINESS, [
      {
        category: 'Succession Readiness',
        title: 'Owner-Dependent Operations',
        description: 'Business heavily dependent on owner for daily operations, customer relationships, or critical decisions.',
        riskLevel: RiskLevel.CRITICAL,
        impact: 'Business may not survive ownership transition. Extreme valuation discount (40-60%). Many buyers will pass entirely. Post-sale failure risk.',
        mitigation: 'URGENT: Delegate operational responsibilities. Hire/promote management team. Transfer customer relationships. Document decision-making frameworks. Plan 12-24 month transition.',
        condition: (score) => score < 30,
      },
      {
        category: 'Succession Readiness',
        title: 'Weak Management Depth',
        description: 'Some management in place but key roles or skills missing. Limited bench strength.',
        riskLevel: RiskLevel.HIGH,
        impact: 'Transition risk. Buyer may require owner involvement post-sale. Limits buyer pool to those with operational expertise.',
        mitigation: 'Fill critical management gaps. Develop second-tier leadership. Create clear org chart and responsibilities. Implement management KPIs.',
        condition: (score) => score >= 30 && score < 50,
      },
    ]],
  ]);

  /**
   * Generate risk flags for an assessment based on module scores
   */
  async generateRiskFlags(assessmentId: string): Promise<void> {
    try {
      // Get all module scores for this assessment
      const moduleScores = await prisma.moduleScore.findMany({
        where: { assessmentId },
        include: {
          module: {
            select: { category: true },
          },
        },
      });

      // Delete existing risk flags for this assessment
      await prisma.riskFlag.deleteMany({
        where: { assessmentId },
      });

      const risksToCreate: Array<{
        assessmentId: string;
        title: string;
        description: string;
        riskLevel: RiskLevel;
        category: string;
        impact: string;
        mitigation: string;
      }> = [];

      // Evaluate each module score against risk rules
      for (const moduleScore of moduleScores) {
        const rules = this.moduleRiskRules.get(moduleScore.module.category);

        if (rules) {
          for (const rule of rules) {
            // Check if this rule's condition is met
            if (rule.condition(moduleScore.score)) {
              risksToCreate.push({
                assessmentId,
                title: rule.title,
                description: rule.description,
                riskLevel: rule.riskLevel,
                category: rule.category,
                impact: rule.impact,
                mitigation: rule.mitigation,
              });

              // Only apply one risk rule per module (highest severity)
              break;
            }
          }
        }
      }

      // Add cross-module risks based on overall patterns
      const overallRisks = await this.detectCrossModuleRisks(assessmentId, moduleScores);
      risksToCreate.push(...overallRisks);

      // Create all risk flags
      if (risksToCreate.length > 0) {
        await prisma.riskFlag.createMany({
          data: risksToCreate,
        });
      }

      console.log(`Generated ${risksToCreate.length} risk flags for assessment ${assessmentId}`);
    } catch (error) {
      console.error('Error generating risk flags:', error);
      throw error;
    }
  }

  /**
   * Detect risks that span multiple modules
   */
  private async detectCrossModuleRisks(
    assessmentId: string,
    moduleScores: Array<{ score: number; module: { category: ModuleCategory } }>
  ): Promise<Array<{
    assessmentId: string;
    title: string;
    description: string;
    riskLevel: RiskLevel;
    category: string;
    impact: string;
    mitigation: string;
  }>> {
    const crossModuleRisks = [];

    // Get average scores for digital vs legacy categories
    const digitalModules = [
      ModuleCategory.DIGITAL_PRESENCE,
      ModuleCategory.CRM_ERP_SYSTEMS,
      ModuleCategory.FINANCIAL_SYSTEMS,
      ModuleCategory.TECH_INFRASTRUCTURE,
      ModuleCategory.DATA_SECURITY,
    ];

    const legacyModules = [
      ModuleCategory.PROCESS_ORGANIZATION,
      ModuleCategory.PEOPLE_TRAINING,
      ModuleCategory.CUSTOMER_EXPERIENCE,
      ModuleCategory.SCALABILITY,
      ModuleCategory.SUCCESSION_READINESS,
    ];

    const digitalScores = moduleScores
      .filter((ms) => digitalModules.includes(ms.module.category))
      .map((ms) => ms.score);

    const legacyScores = moduleScores
      .filter((ms) => legacyModules.includes(ms.module.category))
      .map((ms) => ms.score);

    const avgDigital = digitalScores.reduce((a, b) => a + b, 0) / digitalScores.length;
    const avgLegacy = legacyScores.reduce((a, b) => a + b, 0) / legacyScores.length;

    // Risk: Both digital and legacy are critically low
    if (avgDigital < 35 && avgLegacy < 35) {
      crossModuleRisks.push({
        assessmentId,
        title: 'Comprehensive Readiness Gap',
        description: 'Business scores low in both digital readiness and legacy transfer readiness, indicating fundamental preparation gaps.',
        riskLevel: RiskLevel.CRITICAL,
        category: 'Overall Readiness',
        impact: 'Business is not ready for sale or transfer. Likely to receive very low offers (if any) or fail due diligence. May require 18-24 months of preparation before viable exit.',
        mitigation: 'Recommend engaging M&A advisor or business consultant to develop comprehensive 18-24 month readiness plan. Prioritize highest-impact, quickest-win improvements first.',
      });
    }

    // Risk: Large gap between digital and legacy (>30 points)
    const gap = Math.abs(avgDigital - avgLegacy);
    if (gap > 30) {
      const stronger = avgDigital > avgLegacy ? 'digital systems' : 'operational processes';
      const weaker = avgDigital > avgLegacy ? 'operational processes' : 'digital systems';

      crossModuleRisks.push({
        assessmentId,
        title: 'Imbalanced Readiness Profile',
        description: `Significant gap between digital and operational readiness. Strong ${stronger} but weak ${weaker}.`,
        riskLevel: RiskLevel.HIGH,
        category: 'Overall Readiness',
        impact: `While ${stronger} are strong, the weakness in ${weaker} creates transition risk. Buyers will discount for this imbalance or pass entirely.`,
        mitigation: `Focus improvement efforts on ${weaker} to create more balanced readiness profile. Target bringing both categories above 60 within 6-12 months.`,
      });
    }

    // Risk: Low scalability + low succession = major exit barrier
    const scalabilityScore = moduleScores.find(
      (ms) => ms.module.category === ModuleCategory.SCALABILITY
    )?.score || 0;
    const successionScore = moduleScores.find(
      (ms) => ms.module.category === ModuleCategory.SUCCESSION_READINESS
    )?.score || 0;

    if (scalabilityScore < 40 && successionScore < 40) {
      crossModuleRisks.push({
        assessmentId,
        title: 'Limited Growth and Transition Potential',
        description: 'Business shows both scalability limitations and succession challenges, severely restricting exit options.',
        riskLevel: RiskLevel.CRITICAL,
        category: 'Exit Readiness',
        impact: 'Very limited buyer pool. Financial buyers need scalability; strategic buyers need smooth transition. Current state eliminates most potential acquirers.',
        mitigation: 'Priority 1: Address owner dependency (hire/empower management). Priority 2: Remove top 3 scalability bottlenecks. These are prerequisites for viable exit.',
      });
    }

    return crossModuleRisks;
  }

  /**
   * Get all risk flags for an assessment
   */
  async getRiskFlags(assessmentId: string) {
    return await prisma.riskFlag.findMany({
      where: { assessmentId },
      orderBy: [
        { riskLevel: 'desc' }, // CRITICAL first, then HIGH, MEDIUM, LOW
        { createdAt: 'asc' },
      ],
    });
  }

  /**
   * Get risk flag counts by severity
   */
  async getRiskFlagStats(assessmentId: string) {
    const flags = await this.getRiskFlags(assessmentId);

    return {
      total: flags.length,
      critical: flags.filter((f) => f.riskLevel === RiskLevel.CRITICAL).length,
      high: flags.filter((f) => f.riskLevel === RiskLevel.HIGH).length,
      medium: flags.filter((f) => f.riskLevel === RiskLevel.MEDIUM).length,
      low: flags.filter((f) => f.riskLevel === RiskLevel.LOW).length,
    };
  }
}
