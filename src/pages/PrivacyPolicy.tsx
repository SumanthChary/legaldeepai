import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-background via-primary/5 to-accent/5 min-h-screen">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">Privacy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 2024</p>
          </div>
          <Card className="p-8 md:p-12 shadow-xl border-border">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p className="mb-3">We collect several types of information to provide and improve our Service:</p>
              
              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Personal Information</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Company information (for business accounts)</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Document Data</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Documents you upload for analysis</li>
                <li>Analysis results and summaries</li>
                <li>Document metadata (file size, type, upload date)</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Usage Information</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>IP address and browser type</li>
                <li>Pages visited and features used</li>
                <li>Time spent on the Service</li>
                <li>Error logs and diagnostic data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p className="mb-2">We use collected information for the following purposes:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process document analysis requests</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send service-related notifications and updates</li>
                <li>Respond to customer support requests</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Data Storage and Security</h2>
              <p>
                We implement industry-standard security measures to protect your information. Your documents are encrypted in transit and at rest 
                using AES-256 encryption. We store data on secure servers provided by Supabase and use multiple layers of security including:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>End-to-end encryption for document uploads</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure authentication protocols</li>
                <li>Access controls and monitoring</li>
                <li>Regular data backups</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Data Retention</h2>
              <p>
                We retain your personal information and documents for as long as your account is active or as needed to provide you services. 
                You may request deletion of your data at any time. Upon request, we will delete or anonymize your personal information within 30 days, 
                except where we are required to retain it by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Sharing and Disclosure</h2>
              <p className="mb-2">We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>With your explicit consent</li>
                <li>With service providers who assist in operating our Service (under strict confidentiality agreements)</li>
                <li>To comply with legal obligations or valid legal requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a merger, acquisition, or sale of assets (with prior notice)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Third-Party Services</h2>
              <p className="mb-2">We use trusted third-party services to operate our platform:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Supabase for database and authentication</li>
                <li>Payment processors for subscription management</li>
                <li>AI providers for document analysis</li>
                <li>Email service providers for communications</li>
              </ul>
              <p className="mt-2">These services have their own privacy policies and security measures.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Your Rights and Choices</h2>
              <p className="mb-2">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Access: Request a copy of your personal information</li>
                <li>Correction: Update or correct inaccurate information</li>
                <li>Deletion: Request deletion of your account and data</li>
                <li>Export: Download your documents and data</li>
                <li>Opt-out: Unsubscribe from marketing communications</li>
                <li>Object: Object to certain data processing activities</li>
              </ul>
              <p className="mt-2">To exercise these rights, contact us at privacy@legaldeepai.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance user experience and analyze usage. You can control cookie settings through 
                your browser preferences. Note that disabling cookies may limit certain features of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. 
                If we become aware that we have collected information from a child, we will take steps to delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards 
                are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">11. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page 
                and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">12. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@legaldeepai.com<br />
                Address: [Your Company Address]
              </p>
            </section>

            <div className="mt-8 pt-6 border-t text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;
