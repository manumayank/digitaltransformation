import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
            Digital Readiness &<br />
            <span className="text-primary-600">Legacy-Transfer Audit</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Comprehensive assessment platform for evaluating business digital maturity,
            operational organization, and succession readiness
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/auth/login"
              className="btn btn-outline px-8 py-3 text-base"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-24 grid max-w-6xl gap-8 md:grid-cols-3">
          <FeatureCard
            title="Digital Readiness Score"
            description="Get a comprehensive 0-100 score evaluating your business's digital maturity across 10 key modules"
            icon="📊"
          />
          <FeatureCard
            title="Legacy Transfer Assessment"
            description="Understand how easily a new owner can take over operations and identify key-person risks"
            icon="🔄"
          />
          <FeatureCard
            title="Actionable Roadmap"
            description="Receive detailed recommendations with 30-60-90 day plans to improve your scores"
            icon="🗺️"
          />
        </div>

        {/* Modules Section */}
        <div className="mx-auto mt-24 max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            10 Assessment Modules
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <ModuleBadge title="Digital Presence" weight={10} />
            <ModuleBadge title="Process Organization" weight={20} />
            <ModuleBadge title="CRM/ERP Systems" weight={15} />
            <ModuleBadge title="Financial Systems" weight={10} />
            <ModuleBadge title="Tech Infrastructure" weight={10} />
            <ModuleBadge title="Data Security" weight={10} />
            <ModuleBadge title="People & Training" weight={10} />
            <ModuleBadge title="Customer Experience" weight={5} />
            <ModuleBadge title="Scalability" weight={5} />
            <ModuleBadge title="Exit Readiness" weight={15} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="card card-hover text-center">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ModuleBadge({ title, weight }: { title: string; weight: number }) {
  return (
    <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
      <div className="mb-2 text-sm font-semibold text-primary-900">{title}</div>
      <div className="text-xs text-primary-700">{weight}% weight</div>
    </div>
  );
}
