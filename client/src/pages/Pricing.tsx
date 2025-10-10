import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.free'),
      price: '$0',
      features: [
        t('pricing.features.practice'),
        t('pricing.features.quizlet'),
        t('pricing.features.youtube'),
      ],
      cta: t('pricing.joinFree'),
      variant: 'outline' as const,
    },
    {
      name: t('pricing.pro'),
      price: t('pricing.comingSoon'),
      features: [
        t('pricing.features.practice'),
        t('pricing.features.quizlet'),
        t('pricing.features.youtube'),
        t('pricing.features.ai'),
        t('pricing.features.events'),
        t('pricing.features.work'),
      ],
      cta: t('pricing.comingSoon'),
      variant: 'default' as const,
      badge: t('pricing.comingSoon'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">
              {t('pricing.title')}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                    {plan.badge && (
                      <Badge variant="secondary">{plan.badge}</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.variant}
                  className="w-full"
                  disabled={plan.badge === t('pricing.comingSoon')}
                  data-testid={`button-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
