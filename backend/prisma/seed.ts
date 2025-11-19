import { PrismaClient, ModuleCategory, QuestionType, Industry } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@drltas.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@drltas.com',
      passwordHash: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✓ Admin user created');

  // Create modules based on PRD
  const modules = [
    {
      name: 'Digital Presence & Visibility',
      category: ModuleCategory.DIGITAL_PRESENCE,
      description: 'Evaluates website quality, SEO, online reviews, and digital communication touchpoints',
      weight: 10.0,
      orderIndex: 1,
    },
    {
      name: 'Internal Process Organization',
      category: ModuleCategory.PROCESS_ORGANIZATION,
      description: 'Assesses SOPs, knowledge management, process mapping, and operational redundancy',
      weight: 20.0,
      orderIndex: 2,
    },
    {
      name: 'CRM / ERP / Core Systems',
      category: ModuleCategory.CRM_ERP_SYSTEMS,
      description: 'Evaluates data quality, automation level, system integration, and reporting capabilities',
      weight: 15.0,
      orderIndex: 3,
    },
    {
      name: 'Financial Systems & Reporting',
      category: ModuleCategory.FINANCIAL_SYSTEMS,
      description: 'Reviews accounting software, reconciliation processes, MIS, KPIs, and forecasting',
      weight: 10.0,
      orderIndex: 4,
    },
    {
      name: 'Technology Stack & Infrastructure',
      category: ModuleCategory.TECH_INFRASTRUCTURE,
      description: 'Assesses cloud/server setup, backup systems, device management, and access control',
      weight: 10.0,
      orderIndex: 5,
    },
    {
      name: 'Data Security & Compliance',
      category: ModuleCategory.DATA_SECURITY,
      description: 'Evaluates password policies, 2FA, audit logs, data residency, and legal compliance',
      weight: 10.0,
      orderIndex: 6,
    },
    {
      name: 'People, Roles & Training',
      category: ModuleCategory.PEOPLE_TRAINING,
      description: 'Reviews role definitions, owner dependency, and training maturity',
      weight: 10.0,
      orderIndex: 7,
    },
    {
      name: 'Customer Experience Maturity',
      category: ModuleCategory.CUSTOMER_EXPERIENCE,
      description: 'Assesses support systems, SLAs, and customer feedback loops',
      weight: 5.0,
      orderIndex: 8,
    },
    {
      name: 'Business Scalability & Repeatability',
      category: ModuleCategory.SCALABILITY,
      description: 'Evaluates delegation capability, process replicability, and automation potential',
      weight: 5.0,
      orderIndex: 9,
    },
    {
      name: 'Succession & Exit Readiness',
      category: ModuleCategory.SUCCESSION_READINESS,
      description: 'Assesses documentation quality, ownership transfer ease, and key-person risk',
      weight: 15.0,
      orderIndex: 10,
    },
  ];

  for (const moduleData of modules) {
    await prisma.module.upsert({
      where: { category: moduleData.category },
      update: {},
      create: moduleData,
    });
  }
  console.log('✓ Modules created');

  // Create sample questions for Digital Presence module
  const digitalPresenceModule = await prisma.module.findUnique({
    where: { category: ModuleCategory.DIGITAL_PRESENCE },
  });

  if (digitalPresenceModule) {
    const sampleQuestions = [
      {
        moduleId: digitalPresenceModule.id,
        questionText: 'Does your business have a professional website?',
        questionType: QuestionType.YES_NO,
        weight: 1.0,
        orderIndex: 1,
        helpText: 'A professional website is essential for digital presence and credibility',
      },
      {
        moduleId: digitalPresenceModule.id,
        questionText: 'How would you rate your website\'s mobile responsiveness?',
        questionType: QuestionType.SCALE,
        scaleMin: 1,
        scaleMax: 5,
        weight: 1.0,
        orderIndex: 2,
        helpText: 'Mobile responsiveness is critical as most users browse on mobile devices',
        conditionalLogic: {
          showIf: {
            questionId: 'previous', // Reference to previous question
            answer: true,
          },
        },
      },
      {
        moduleId: digitalPresenceModule.id,
        questionText: 'Which digital marketing channels does your business actively use?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'social_media', label: 'Social Media (Facebook, Instagram, LinkedIn)' },
          { id: 'email', label: 'Email Marketing' },
          { id: 'seo', label: 'Search Engine Optimization (SEO)' },
          { id: 'paid_ads', label: 'Paid Advertising (Google Ads, Facebook Ads)' },
          { id: 'content', label: 'Content Marketing (Blog, Videos)' },
          { id: 'none', label: 'None of the above' },
        ],
        weight: 1.5,
        orderIndex: 3,
      },
      {
        moduleId: digitalPresenceModule.id,
        questionText: 'Do you actively monitor and respond to online reviews?',
        questionType: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'yes_system', label: 'Yes, we have a system in place' },
          { id: 'yes_adhoc', label: 'Yes, but only occasionally' },
          { id: 'no', label: 'No, we don\'t monitor reviews' },
          { id: 'no_reviews', label: 'We don\'t have any reviews' },
        ],
        weight: 1.0,
        orderIndex: 4,
      },
    ];

    for (const question of sampleQuestions) {
      await prisma.question.create({
        data: question,
      });
    }
    console.log('✓ Sample questions created for Digital Presence module');
  }

  // Create industry templates
  const industries = Object.values(Industry);
  for (const industry of industries) {
    await prisma.industryTemplate.upsert({
      where: {
        industry_templateName: {
          industry,
          templateName: 'Default',
        },
      },
      update: {},
      create: {
        industry,
        templateName: 'Default',
        questionSetConfig: {
          includedModules: Object.values(ModuleCategory),
        },
        scoringWeights: {
          digitalPresence: 10,
          processOrganization: 20,
          crmERP: 15,
          financial: 10,
          techInfrastructure: 10,
          dataSecurity: 10,
          peopleTraining: 10,
          customerExperience: 5,
          scalability: 5,
          succession: 15,
        },
        benchmarkData: {
          averageDigitalScore: 65,
          averageLegacyScore: 55,
        },
      },
    });
  }
  console.log('✓ Industry templates created');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
