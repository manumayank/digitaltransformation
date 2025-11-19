import { PrismaClient, ModuleCategory, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedQuestions() {
  console.log('🌱 Seeding questions...');

  // Get all modules
  const modules = await prisma.module.findMany();
  const moduleMap = new Map(modules.map((m) => [m.category, m]));

  // ============================================
  // MODULE 1: DIGITAL PRESENCE & VISIBILITY
  // ============================================
  const digitalPresence = moduleMap.get(ModuleCategory.DIGITAL_PRESENCE);
  if (digitalPresence) {
    const dpQuestions = [
      {
        moduleId: digitalPresence.id,
        questionText: 'Does your business have a professional website?',
        questionType: QuestionType.YES_NO,
        weight: 2.0,
        orderIndex: 1,
        isRequired: true,
        helpText: 'A professional website is essential for establishing digital credibility and reaching customers online.',
      },
      {
        moduleId: digitalPresence.id,
        questionText: 'How would you rate your website\'s mobile responsiveness?',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 1.5,
        orderIndex: 2,
        isRequired: true,
        helpText: 'Mobile responsiveness is critical as over 60% of web traffic comes from mobile devices.',
        conditionalLogic: {
          showIf: { questionOrder: 1, answer: true },
        },
      },
      {
        moduleId: digitalPresence.id,
        questionText: 'Which of the following digital marketing channels does your business actively use?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'social_media', label: 'Social Media (Facebook, Instagram, LinkedIn, Twitter)' },
          { id: 'email', label: 'Email Marketing' },
          { id: 'seo', label: 'Search Engine Optimization (SEO)' },
          { id: 'paid_ads', label: 'Paid Advertising (Google Ads, Facebook Ads)' },
          { id: 'content', label: 'Content Marketing (Blog, Videos, Podcasts)' },
          { id: 'none', label: 'None of the above' },
        ],
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
      },
      {
        moduleId: digitalPresence.id,
        questionText: 'Do you actively monitor and respond to online reviews?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_system', label: 'Yes, we have a systematic process in place' },
          { id: 'yes_adhoc', label: 'Yes, but only occasionally' },
          { id: 'no_monitor', label: 'No, we don\'t monitor reviews' },
          { id: 'no_reviews', label: 'We don\'t have any online reviews' },
        ],
        weight: 1.5,
        orderIndex: 4,
        isRequired: true,
        helpText: 'Online reviews significantly impact customer trust and purchasing decisions.',
      },
      {
        moduleId: digitalPresence.id,
        questionText: 'How often do you update your website content?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'weekly', label: 'Weekly' },
          { id: 'monthly', label: 'Monthly' },
          { id: 'quarterly', label: 'Quarterly' },
          { id: 'rarely', label: 'Rarely or never' },
        ],
        weight: 1.0,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: digitalPresence.id,
        questionText: 'Does your website have clear calls-to-action (CTAs) for customers?',
        questionType: QuestionType.YES_NO,
        weight: 1.0,
        orderIndex: 6,
        isRequired: true,
        helpText: 'CTAs guide customers toward desired actions like purchases, sign-ups, or contact.',
      },
      {
        moduleId: digitalPresence.id,
        questionText: 'Do you use analytics tools to track website performance?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_active', label: 'Yes, we actively analyze the data' },
          { id: 'yes_installed', label: 'Yes, but we rarely check it' },
          { id: 'no', label: 'No analytics tools installed' },
        ],
        weight: 1.5,
        orderIndex: 7,
        isRequired: true,
      },
      {
        moduleId: digitalPresence.id,
        questionText: 'Rate your overall online visibility (ease of finding your business online)',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 1.5,
        orderIndex: 8,
        isRequired: true,
        helpText: 'Consider search engine rankings, social media presence, and online directories.',
      },
    ];

    for (const q of dpQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${dpQuestions.length} questions for Digital Presence`);
  }

  // ============================================
  // MODULE 2: PROCESS ORGANIZATION
  // ============================================
  const processOrg = moduleMap.get(ModuleCategory.PROCESS_ORGANIZATION);
  if (processOrg) {
    const poQuestions = [
      {
        moduleId: processOrg.id,
        questionText: 'Do you have documented Standard Operating Procedures (SOPs)?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_comprehensive', label: 'Yes, comprehensive SOPs for all major processes' },
          { id: 'yes_some', label: 'Yes, for some key processes' },
          { id: 'informal', label: 'No formal SOPs, but informal documentation exists' },
          { id: 'no', label: 'No documentation' },
        ],
        weight: 3.0,
        orderIndex: 1,
        isRequired: true,
        helpText: 'SOPs are critical for consistency, training, and business transferability.',
      },
      {
        moduleId: processOrg.id,
        questionText: 'Where are your SOPs and process documentation stored?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'centralized_digital', label: 'Centralized digital knowledge base (e.g., Notion, Confluence)' },
          { id: 'shared_drive', label: 'Shared drive or folder' },
          { id: 'scattered', label: 'Scattered across emails and documents' },
          { id: 'nowhere', label: 'Not stored anywhere' },
        ],
        weight: 2.0,
        orderIndex: 2,
        isRequired: true,
        conditionalLogic: {
          showIf: { questionOrder: 1, answerNot: 'no' },
        },
      },
      {
        moduleId: processOrg.id,
        questionText: 'How often are your processes documented and updated?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'regularly', label: 'Regularly (quarterly or more frequent)' },
          { id: 'annually', label: 'Annually' },
          { id: 'rarely', label: 'Rarely' },
          { id: 'never', label: 'Never updated' },
        ],
        weight: 1.5,
        orderIndex: 3,
        isRequired: true,
      },
      {
        moduleId: processOrg.id,
        questionText: 'Have you mapped out your core business processes?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_all', label: 'Yes, all core processes are mapped' },
          { id: 'yes_some', label: 'Yes, some processes are mapped' },
          { id: 'informal', label: 'Informal understanding, but not mapped' },
          { id: 'no', label: 'No process mapping' },
        ],
        weight: 2.5,
        orderIndex: 4,
        isRequired: true,
        helpText: 'Process mapping helps identify inefficiencies and dependencies.',
      },
      {
        moduleId: processOrg.id,
        questionText: 'Are there backup personnel trained for critical roles?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_all', label: 'Yes, for all critical roles' },
          { id: 'yes_some', label: 'Yes, for some roles' },
          { id: 'no', label: 'No backup personnel' },
        ],
        weight: 2.5,
        orderIndex: 5,
        isRequired: true,
        helpText: 'Redundancy reduces key-person risk and ensures business continuity.',
      },
      {
        moduleId: processOrg.id,
        questionText: 'Can your business operate for a week without owner involvement?',
        questionType: QuestionType.YES_NO,
        weight: 3.0,
        orderIndex: 6,
        isRequired: true,
        helpText: 'This tests the independence of operations from the owner.',
      },
      {
        moduleId: processOrg.id,
        questionText: 'Do you have a centralized knowledge management system?',
        questionType: QuestionType.YES_NO,
        weight: 1.5,
        orderIndex: 7,
        isRequired: true,
        helpText: 'A knowledge base ensures information is accessible and preserved.',
      },
      {
        moduleId: processOrg.id,
        questionText: 'How would you rate the overall organization of your business processes?',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 2.0,
        orderIndex: 8,
        isRequired: true,
      },
    ];

    for (const q of poQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${poQuestions.length} questions for Process Organization`);
  }

  // ============================================
  // MODULE 3: CRM / ERP / CORE SYSTEMS
  // ============================================
  const crmErp = moduleMap.get(ModuleCategory.CRM_ERP_SYSTEMS);
  if (crmErp) {
    const ceQuestions = [
      {
        moduleId: crmErp.id,
        questionText: 'Does your business use a CRM (Customer Relationship Management) system?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_full', label: 'Yes, fully implemented and actively used' },
          { id: 'yes_partial', label: 'Yes, but partially used' },
          { id: 'basic', label: 'Basic tools (spreadsheets, contacts)' },
          { id: 'no', label: 'No CRM system' },
        ],
        weight: 3.0,
        orderIndex: 1,
        isRequired: true,
        helpText: 'CRMs centralize customer data and improve relationship management.',
      },
      {
        moduleId: crmErp.id,
        questionText: 'Which CRM or business management system do you use?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'salesforce', label: 'Salesforce' },
          { id: 'hubspot', label: 'HubSpot' },
          { id: 'zoho', label: 'Zoho CRM' },
          { id: 'monday', label: 'Monday.com' },
          { id: 'custom', label: 'Custom-built system' },
          { id: 'spreadsheet', label: 'Spreadsheets' },
          { id: 'other', label: 'Other' },
        ],
        weight: 1.0,
        orderIndex: 2,
        isRequired: true,
        conditionalLogic: {
          showIf: { questionOrder: 1, answerNot: 'no' },
        },
      },
      {
        moduleId: crmErp.id,
        questionText: 'How would you rate the quality and completeness of data in your CRM?',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
        helpText: 'Data quality is crucial for accurate reporting and decision-making.',
        conditionalLogic: {
          showIf: { questionOrder: 1, answerIn: ['yes_full', 'yes_partial'] },
        },
      },
      {
        moduleId: crmErp.id,
        questionText: 'Are your core business systems integrated with each other?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_auto', label: 'Yes, fully automated integration' },
          { id: 'yes_manual', label: 'Yes, but requires manual data transfer' },
          { id: 'no', label: 'No integration' },
        ],
        weight: 2.5,
        orderIndex: 4,
        isRequired: true,
        helpText: 'Integration reduces manual work and data inconsistencies.',
      },
      {
        moduleId: crmErp.id,
        questionText: 'Do you have automated workflows or processes in your systems?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_extensive', label: 'Yes, extensive automation' },
          { id: 'yes_some', label: 'Yes, some automation' },
          { id: 'no', label: 'No automation' },
        ],
        weight: 2.0,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: crmErp.id,
        questionText: 'Can you generate reports from your systems easily?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_automated', label: 'Yes, automated and scheduled reports' },
          { id: 'yes_manual', label: 'Yes, but requires manual generation' },
          { id: 'difficult', label: 'Difficult to generate reports' },
          { id: 'no', label: 'No reporting capability' },
        ],
        weight: 2.0,
        orderIndex: 6,
        isRequired: true,
      },
      {
        moduleId: crmErp.id,
        questionText: 'How accessible is your business data to authorized personnel?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'cloud_anywhere', label: 'Cloud-based, accessible from anywhere' },
          { id: 'office_only', label: 'Accessible only from office' },
          { id: 'limited', label: 'Limited access, requires specific software/hardware' },
        ],
        weight: 1.5,
        orderIndex: 7,
        isRequired: true,
      },
    ];

    for (const q of ceQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${ceQuestions.length} questions for CRM/ERP Systems`);
  }

  // ============================================
  // MODULE 4: FINANCIAL SYSTEMS & REPORTING
  // ============================================
  const financial = moduleMap.get(ModuleCategory.FINANCIAL_SYSTEMS);
  if (financial) {
    const fQuestions = [
      {
        moduleId: financial.id,
        questionText: 'Which accounting software does your business use?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'quickbooks', label: 'QuickBooks' },
          { id: 'xero', label: 'Xero' },
          { id: 'sage', label: 'Sage' },
          { id: 'freshbooks', label: 'FreshBooks' },
          { id: 'tally', label: 'Tally' },
          { id: 'spreadsheet', label: 'Spreadsheets' },
          { id: 'none', label: 'No accounting software' },
        ],
        weight: 2.5,
        orderIndex: 1,
        isRequired: true,
      },
      {
        moduleId: financial.id,
        questionText: 'How frequently do you reconcile your accounts?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'daily', label: 'Daily' },
          { id: 'weekly', label: 'Weekly' },
          { id: 'monthly', label: 'Monthly' },
          { id: 'quarterly', label: 'Quarterly' },
          { id: 'rarely', label: 'Rarely or never' },
        ],
        weight: 2.0,
        orderIndex: 2,
        isRequired: true,
        helpText: 'Regular reconciliation ensures financial accuracy and detects issues early.',
      },
      {
        moduleId: financial.id,
        questionText: 'Do you have a Management Information System (MIS) for financial reporting?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_automated', label: 'Yes, automated real-time reports' },
          { id: 'yes_manual', label: 'Yes, manually compiled reports' },
          { id: 'basic', label: 'Basic reports from accounting software' },
          { id: 'no', label: 'No MIS' },
        ],
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
      },
      {
        moduleId: financial.id,
        questionText: 'Which Key Performance Indicators (KPIs) do you track regularly?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'revenue', label: 'Revenue and Sales Growth' },
          { id: 'profit', label: 'Profit Margins' },
          { id: 'cashflow', label: 'Cash Flow' },
          { id: 'customer', label: 'Customer Acquisition Cost (CAC)' },
          { id: 'retention', label: 'Customer Retention Rate' },
          { id: 'none', label: 'None of the above' },
        ],
        weight: 2.0,
        orderIndex: 4,
        isRequired: true,
        helpText: 'KPIs help measure business performance and guide decision-making.',
      },
      {
        moduleId: financial.id,
        questionText: 'Do you create financial forecasts or projections?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_regular', label: 'Yes, regularly updated (monthly/quarterly)' },
          { id: 'yes_annual', label: 'Yes, annually' },
          { id: 'no', label: 'No forecasting' },
        ],
        weight: 2.0,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: financial.id,
        questionText: 'How would you rate the accuracy of your financial records?',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 2.5,
        orderIndex: 6,
        isRequired: true,
        helpText: 'Accurate financial records are critical for valuation and due diligence.',
      },
      {
        moduleId: financial.id,
        questionText: 'Do you have a dedicated finance or accounting team/person?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_team', label: 'Yes, a dedicated team' },
          { id: 'yes_person', label: 'Yes, one dedicated person' },
          { id: 'outsourced', label: 'Outsourced to accountant/firm' },
          { id: 'owner', label: 'Handled by owner' },
        ],
        weight: 1.5,
        orderIndex: 7,
        isRequired: true,
      },
    ];

    for (const q of fQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${fQuestions.length} questions for Financial Systems`);
  }

  // ============================================
  // MODULE 5: TECH INFRASTRUCTURE
  // ============================================
  const techInfra = moduleMap.get(ModuleCategory.TECH_INFRASTRUCTURE);
  if (techInfra) {
    const tiQuestions = [
      {
        moduleId: techInfra.id,
        questionText: 'Where is your business data primarily hosted?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'cloud', label: 'Cloud (AWS, Google Cloud, Azure, etc.)' },
          { id: 'local_server', label: 'Local servers (on-premises)' },
          { id: 'hybrid', label: 'Hybrid (cloud + local)' },
          { id: 'devices', label: 'Individual computers/devices' },
        ],
        weight: 2.0,
        orderIndex: 1,
        isRequired: true,
        helpText: 'Cloud hosting improves accessibility, scalability, and disaster recovery.',
      },
      {
        moduleId: techInfra.id,
        questionText: 'Do you have a regular data backup system?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_automated', label: 'Yes, automated daily backups' },
          { id: 'yes_weekly', label: 'Yes, weekly backups' },
          { id: 'yes_manual', label: 'Yes, manual/irregular backups' },
          { id: 'no', label: 'No backup system' },
        ],
        weight: 3.0,
        orderIndex: 2,
        isRequired: true,
        helpText: 'Regular backups are critical for disaster recovery and business continuity.',
      },
      {
        moduleId: techInfra.id,
        questionText: 'Where are your backups stored?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'cloud_offsite', label: 'Cloud or off-site location' },
          { id: 'same_location', label: 'Same physical location as primary data' },
          { id: 'external', label: 'External hard drives' },
          { id: 'none', label: 'No backups' },
        ],
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
        conditionalLogic: {
          showIf: { questionOrder: 2, answerNot: 'no' },
        },
      },
      {
        moduleId: techInfra.id,
        questionText: 'How do you manage employee devices (laptops, phones)?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'mdm', label: 'Mobile Device Management (MDM) solution' },
          { id: 'it_dept', label: 'IT department manually manages' },
          { id: 'byod', label: 'Bring Your Own Device (BYOD) policy' },
          { id: 'no_management', label: 'No device management' },
        ],
        weight: 1.5,
        orderIndex: 4,
        isRequired: true,
      },
      {
        moduleId: techInfra.id,
        questionText: 'Do you have an IT support system or help desk?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_internal', label: 'Yes, internal IT team' },
          { id: 'yes_outsourced', label: 'Yes, outsourced IT support' },
          { id: 'adhoc', label: 'Ad-hoc support when needed' },
          { id: 'no', label: 'No IT support' },
        ],
        weight: 1.5,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: techInfra.id,
        questionText: 'How often do you update your software and systems?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'automated', label: 'Automated updates' },
          { id: 'regular', label: 'Regularly scheduled (monthly/quarterly)' },
          { id: 'occasional', label: 'Occasionally' },
          { id: 'rarely', label: 'Rarely or never' },
        ],
        weight: 1.5,
        orderIndex: 6,
        isRequired: true,
        helpText: 'Regular updates protect against security vulnerabilities.',
      },
      {
        moduleId: techInfra.id,
        questionText: 'Rate your overall technology infrastructure maturity',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 2.0,
        orderIndex: 7,
        isRequired: true,
      },
    ];

    for (const q of tiQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${tiQuestions.length} questions for Tech Infrastructure`);
  }

  // ============================================
  // MODULE 6: DATA SECURITY & COMPLIANCE
  // ============================================
  const dataSecurity = moduleMap.get(ModuleCategory.DATA_SECURITY);
  if (dataSecurity) {
    const dsQuestions = [
      {
        moduleId: dataSecurity.id,
        questionText: 'Do you have a password policy for your organization?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_enforced', label: 'Yes, enforced with password requirements' },
          { id: 'yes_recommended', label: 'Yes, recommended but not enforced' },
          { id: 'no', label: 'No password policy' },
        ],
        weight: 2.0,
        orderIndex: 1,
        isRequired: true,
        helpText: 'Strong password policies are the first line of defense against unauthorized access.',
      },
      {
        moduleId: dataSecurity.id,
        questionText: 'Do you use Two-Factor Authentication (2FA) for business systems?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_all', label: 'Yes, for all critical systems' },
          { id: 'yes_some', label: 'Yes, for some systems' },
          { id: 'no', label: 'No 2FA implemented' },
        ],
        weight: 2.5,
        orderIndex: 2,
        isRequired: true,
        helpText: '2FA significantly reduces the risk of account compromise.',
      },
      {
        moduleId: dataSecurity.id,
        questionText: 'Do you maintain access control logs (audit trails)?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_reviewed', label: 'Yes, and regularly reviewed' },
          { id: 'yes_stored', label: 'Yes, but rarely reviewed' },
          { id: 'no', label: 'No audit logs' },
        ],
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
        helpText: 'Audit logs help detect and investigate security incidents.',
      },
      {
        moduleId: dataSecurity.id,
        questionText: 'How do you control employee access to sensitive data?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'role_based', label: 'Role-based access control (RBAC)' },
          { id: 'manager_approval', label: 'Manager approval required' },
          { id: 'open', label: 'Open access to most employees' },
          { id: 'no_control', label: 'No access control' },
        ],
        weight: 2.5,
        orderIndex: 4,
        isRequired: true,
      },
      {
        moduleId: dataSecurity.id,
        questionText: 'Is your customer data encrypted?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_all', label: 'Yes, all data encrypted at rest and in transit' },
          { id: 'yes_partial', label: 'Yes, partially encrypted' },
          { id: 'no', label: 'No encryption' },
          { id: 'unsure', label: 'Unsure' },
        ],
        weight: 2.5,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: dataSecurity.id,
        questionText: 'Are you compliant with data protection regulations (GDPR, CCPA, etc.)?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_certified', label: 'Yes, certified compliant' },
          { id: 'yes_working', label: 'Working towards compliance' },
          { id: 'no', label: 'Not compliant' },
          { id: 'not_applicable', label: 'Not applicable to our business' },
        ],
        weight: 2.0,
        orderIndex: 6,
        isRequired: true,
        applicableIndustry: ['TECHNOLOGY', 'HEALTHCARE', 'FINANCE', 'RETAIL'],
      },
      {
        moduleId: dataSecurity.id,
        questionText: 'Do you have a documented incident response plan for data breaches?',
        questionType: QuestionType.YES_NO,
        weight: 2.0,
        orderIndex: 7,
        isRequired: true,
        helpText: 'An incident response plan minimizes damage from security breaches.',
      },
      {
        moduleId: dataSecurity.id,
        questionText: 'Do employees receive regular security awareness training?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_regular', label: 'Yes, regular training (quarterly or more)' },
          { id: 'yes_annual', label: 'Yes, annual training' },
          { id: 'onboarding', label: 'Only during onboarding' },
          { id: 'no', label: 'No security training' },
        ],
        weight: 1.5,
        orderIndex: 8,
        isRequired: true,
      },
    ];

    for (const q of dsQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${dsQuestions.length} questions for Data Security`);
  }

  // ============================================
  // MODULE 7: PEOPLE, ROLES & TRAINING
  // ============================================
  const peopleTraining = moduleMap.get(ModuleCategory.PEOPLE_TRAINING);
  if (peopleTraining) {
    const ptQuestions = [
      {
        moduleId: peopleTraining.id,
        questionText: 'Are all employee roles clearly defined with written job descriptions?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_all', label: 'Yes, for all positions' },
          { id: 'yes_key', label: 'Yes, for key positions only' },
          { id: 'informal', label: 'Informal definitions, not documented' },
          { id: 'no', label: 'No defined roles' },
        ],
        weight: 2.5,
        orderIndex: 1,
        isRequired: true,
        helpText: 'Clear role definitions improve accountability and succession planning.',
      },
      {
        moduleId: peopleTraining.id,
        questionText: 'How dependent is your business on the owner for daily operations?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'independent', label: 'Fully independent - operates without owner' },
          { id: 'mostly', label: 'Mostly independent - minimal owner involvement' },
          { id: 'moderate', label: 'Moderate dependence - owner involved in key decisions' },
          { id: 'high', label: 'High dependence - owner makes all decisions' },
        ],
        weight: 3.0,
        orderIndex: 2,
        isRequired: true,
        helpText: 'High owner dependence is a major risk factor for business transfer.',
      },
      {
        moduleId: peopleTraining.id,
        questionText: 'Do you have a structured onboarding process for new employees?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_comprehensive', label: 'Yes, comprehensive documented process' },
          { id: 'yes_basic', label: 'Yes, basic onboarding' },
          { id: 'informal', label: 'Informal, varies by hire' },
          { id: 'no', label: 'No onboarding process' },
        ],
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
      },
      {
        moduleId: peopleTraining.id,
        questionText: 'How do you provide training to employees?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'formal', label: 'Formal training programs (internal or external)' },
          { id: 'on_job', label: 'On-the-job training by peers' },
          { id: 'self_learn', label: 'Self-learning/as needed' },
          { id: 'no_training', label: 'No formal training' },
        ],
        weight: 2.0,
        orderIndex: 4,
        isRequired: true,
      },
      {
        moduleId: peopleTraining.id,
        questionText: 'Do you have an organizational chart?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_updated', label: 'Yes, regularly updated' },
          { id: 'yes_outdated', label: 'Yes, but outdated' },
          { id: 'no', label: 'No organizational chart' },
        ],
        weight: 1.5,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: peopleTraining.id,
        questionText: 'Do you conduct regular performance reviews?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_quarterly', label: 'Yes, quarterly' },
          { id: 'yes_annual', label: 'Yes, annually' },
          { id: 'informal', label: 'Informal feedback only' },
          { id: 'no', label: 'No performance reviews' },
        ],
        weight: 1.5,
        orderIndex: 6,
        isRequired: true,
      },
      {
        moduleId: peopleTraining.id,
        questionText: 'Do you have a succession plan for key positions?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_documented', label: 'Yes, documented succession plan' },
          { id: 'yes_informal', label: 'Yes, informal plan' },
          { id: 'no', label: 'No succession plan' },
        ],
        weight: 2.5,
        orderIndex: 7,
        isRequired: true,
        helpText: 'Succession planning ensures continuity during transitions.',
      },
      {
        moduleId: peopleTraining.id,
        questionText: 'What is your employee retention rate?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'high', label: 'High (>90% annual retention)' },
          { id: 'moderate', label: 'Moderate (70-90% retention)' },
          { id: 'low', label: 'Low (<70% retention)' },
          { id: 'unsure', label: 'Unsure' },
        ],
        weight: 1.5,
        orderIndex: 8,
        isRequired: true,
      },
    ];

    for (const q of ptQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${ptQuestions.length} questions for People & Training`);
  }

  // ============================================
  // MODULE 8: CUSTOMER EXPERIENCE
  // ============================================
  const customerExp = moduleMap.get(ModuleCategory.CUSTOMER_EXPERIENCE);
  if (customerExp) {
    const ceQuestions = [
      {
        moduleId: customerExp.id,
        questionText: 'Do you have a dedicated customer support system?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_platform', label: 'Yes, ticketing system/platform (Zendesk, Freshdesk, etc.)' },
          { id: 'yes_email', label: 'Yes, email-based support' },
          { id: 'yes_phone', label: 'Yes, phone support only' },
          { id: 'no', label: 'No dedicated system' },
        ],
        weight: 2.5,
        orderIndex: 1,
        isRequired: true,
      },
      {
        moduleId: customerExp.id,
        questionText: 'Do you have defined Service Level Agreements (SLAs)?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_met', label: 'Yes, and we consistently meet them' },
          { id: 'yes_not_met', label: 'Yes, but we struggle to meet them' },
          { id: 'no', label: 'No SLAs defined' },
        ],
        weight: 2.0,
        orderIndex: 2,
        isRequired: true,
        helpText: 'SLAs set clear expectations and measure customer service quality.',
      },
      {
        moduleId: customerExp.id,
        questionText: 'Do you actively collect customer feedback?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_systematic', label: 'Yes, systematic surveys/feedback system' },
          { id: 'yes_adhoc', label: 'Yes, ad-hoc collection' },
          { id: 'no', label: 'No formal feedback collection' },
        ],
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
      },
      {
        moduleId: customerExp.id,
        questionText: 'What is your Net Promoter Score (NPS) or customer satisfaction score?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'high', label: 'High (NPS >50 or >80% satisfaction)' },
          { id: 'moderate', label: 'Moderate (NPS 20-50 or 60-80% satisfaction)' },
          { id: 'low', label: 'Low (NPS <20 or <60% satisfaction)' },
          { id: 'dont_measure', label: 'We don\'t measure this' },
        ],
        weight: 2.0,
        orderIndex: 4,
        isRequired: true,
      },
      {
        moduleId: customerExp.id,
        questionText: 'Do you have a customer feedback loop to implement improvements?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_systematic', label: 'Yes, systematic review and implementation' },
          { id: 'yes_occasional', label: 'Yes, occasional implementation' },
          { id: 'no', label: 'No feedback loop' },
        ],
        weight: 2.0,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: customerExp.id,
        questionText: 'How do you measure customer journey touchpoints?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'mapped', label: 'Customer journey is mapped and monitored' },
          { id: 'partial', label: 'Some touchpoints are tracked' },
          { id: 'no', label: 'Not measured' },
        ],
        weight: 1.5,
        orderIndex: 6,
        isRequired: true,
      },
    ];

    for (const q of ceQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${ceQuestions.length} questions for Customer Experience`);
  }

  // ============================================
  // MODULE 9: SCALABILITY
  // ============================================
  const scalability = moduleMap.get(ModuleCategory.SCALABILITY);
  if (scalability) {
    const sQuestions = [
      {
        moduleId: scalability.id,
        questionText: 'Can your business processes scale without proportional cost increases?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_easily', label: 'Yes, easily scalable' },
          { id: 'yes_some', label: 'Yes, with some modifications' },
          { id: 'difficult', label: 'Difficult to scale' },
          { id: 'no', label: 'Not scalable' },
        ],
        weight: 3.0,
        orderIndex: 1,
        isRequired: true,
        helpText: 'Scalability indicates growth potential and operational efficiency.',
      },
      {
        moduleId: scalability.id,
        questionText: 'To what extent have you automated repetitive tasks?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'high', label: 'Most tasks automated' },
          { id: 'moderate', label: 'Some automation in place' },
          { id: 'low', label: 'Minimal automation' },
          { id: 'none', label: 'No automation' },
        ],
        weight: 2.5,
        orderIndex: 2,
        isRequired: true,
      },
      {
        moduleId: scalability.id,
        questionText: 'Can you easily delegate tasks to team members?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_documented', label: 'Yes, processes are documented and delegable' },
          { id: 'yes_training', label: 'Yes, with training' },
          { id: 'difficult', label: 'Difficult due to lack of documentation' },
          { id: 'no', label: 'Most tasks require owner involvement' },
        ],
        weight: 2.5,
        orderIndex: 3,
        isRequired: true,
      },
      {
        moduleId: scalability.id,
        questionText: 'Are your core processes repeatable and consistent?',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 2.0,
        orderIndex: 4,
        isRequired: true,
        helpText: '1 = Highly variable, 5 = Perfectly consistent',
      },
      {
        moduleId: scalability.id,
        questionText: 'Do you have systems in place to handle increased customer volume?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_ready', label: 'Yes, systems are ready to scale' },
          { id: 'yes_upgrades', label: 'Yes, with minor upgrades' },
          { id: 'no', label: 'No, would require significant changes' },
        ],
        weight: 2.0,
        orderIndex: 5,
        isRequired: true,
      },
    ];

    for (const q of sQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${sQuestions.length} questions for Scalability`);
  }

  // ============================================
  // MODULE 10: SUCCESSION & EXIT READINESS
  // ============================================
  const succession = moduleMap.get(ModuleCategory.SUCCESSION_READINESS);
  if (succession) {
    const srQuestions = [
      {
        moduleId: succession.id,
        questionText: 'What is your expected timeline for exit or ownership transfer?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: '1year', label: '0-1 year' },
          { id: '1-3years', label: '1-3 years' },
          { id: '3-5years', label: '3-5 years' },
          { id: '5plus', label: '5+ years' },
          { id: 'no_plan', label: 'No exit plan' },
        ],
        weight: 2.0,
        orderIndex: 1,
        isRequired: true,
      },
      {
        moduleId: succession.id,
        questionText: 'How well-documented is your business for ownership transfer?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'comprehensive', label: 'Comprehensive documentation ready' },
          { id: 'partial', label: 'Partial documentation, needs completion' },
          { id: 'minimal', label: 'Minimal documentation' },
          { id: 'none', label: 'No documentation' },
        ],
        weight: 3.0,
        orderIndex: 2,
        isRequired: true,
        helpText: 'Documentation is critical for smooth ownership transition.',
      },
      {
        moduleId: succession.id,
        questionText: 'Do you have a business valuation?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_recent', label: 'Yes, recent professional valuation (<1 year)' },
          { id: 'yes_old', label: 'Yes, but outdated (>1 year)' },
          { id: 'estimate', label: 'Only rough estimate' },
          { id: 'no', label: 'No valuation' },
        ],
        weight: 2.0,
        orderIndex: 3,
        isRequired: true,
      },
      {
        moduleId: succession.id,
        questionText: 'How dependent is the business on key personnel (including owner)?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'independent', label: 'Independent - no key person risk' },
          { id: 'low', label: 'Low dependency - backup for all roles' },
          { id: 'moderate', label: 'Moderate - some key person dependencies' },
          { id: 'high', label: 'High - heavily dependent on owner/key person' },
        ],
        weight: 3.0,
        orderIndex: 4,
        isRequired: true,
        helpText: 'Key person risk significantly affects business value.',
      },
      {
        moduleId: succession.id,
        questionText: 'Are customer relationships transferable to a new owner?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_systemic', label: 'Yes, managed through systems not personalities' },
          { id: 'yes_transition', label: 'Yes, with proper transition' },
          { id: 'difficult', label: 'Difficult - tied to current owner' },
          { id: 'no', label: 'Not transferable' },
        ],
        weight: 2.5,
        orderIndex: 5,
        isRequired: true,
      },
      {
        moduleId: succession.id,
        questionText: 'Do you have legal and financial documents organized for due diligence?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_ready', label: 'Yes, ready for due diligence' },
          { id: 'yes_work', label: 'Yes, but needs organization' },
          { id: 'partial', label: 'Partially available' },
          { id: 'no', label: 'Not organized' },
        ],
        weight: 2.0,
        orderIndex: 6,
        isRequired: true,
        helpText: 'Organized documents speed up due diligence and build buyer confidence.',
      },
      {
        moduleId: succession.id,
        questionText: 'Have you identified potential successors (internal or external)?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_ready', label: 'Yes, identified and ready' },
          { id: 'yes_potential', label: 'Yes, potential candidates identified' },
          { id: 'no', label: 'No successors identified' },
        ],
        weight: 2.0,
        orderIndex: 7,
        isRequired: true,
      },
      {
        moduleId: succession.id,
        questionText: 'Rate your overall exit readiness',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 2.5,
        orderIndex: 8,
        isRequired: true,
        helpText: '1 = Not ready, 5 = Fully prepared for ownership transfer',
      },
    ];

    for (const q of srQuestions) {
      await prisma.question.create({ data: q });
    }
    console.log(`✓ Created ${srQuestions.length} questions for Succession & Exit Readiness`);
  }

  console.log('✅ All questions seeded successfully!');
}
