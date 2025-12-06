
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfUsePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-3xl">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Last updated: December 06, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to Fitness Hub ("we", "our", "us"). These Terms of Use govern your access to and use of our website and services. By accessing or using the service, you agree to be bound by these terms.
            </p>

            <h2>2. Use of Our Service</h2>
            <p>
              You agree to use our service for lawful purposes only. You must be at least 13 years old to use our service. You are responsible for maintaining the confidentiality of your account and password.
            </p>

            <h2>3. AI-Generated Content</h2>
            <p>
              The workout plans and health tips provided by our AI are for informational purposes only and are not a substitute for professional medical advice. Always consult with a qualified healthcare provider before beginning any new fitness program. We do not guarantee the accuracy, completeness, or effectiveness of any AI-generated content.
            </p>
            
            <h2>4. User Content</h2>
            <p>
              You are responsible for any content you post or upload. By posting content, you grant us a non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the service.
            </p>

            <h2>5. Prohibited Activities</h2>
            <p>
              You may not access or use the service for any purpose other than that for which we make the service available. Prohibited activities include, but are not limited to: engaging in any automated use of the system, interfering with security-related features, or harassing any other user.
            </p>

            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend your account at any time, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall Fitness Hub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us through our contact page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
