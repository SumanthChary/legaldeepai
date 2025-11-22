import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";

const TermsAndConditions = () => {
  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-background via-primary/5 to-accent/5 min-h-screen">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms and Conditions</h1>
            <p className="text-muted-foreground">Last updated: March 2024</p>
          </div>
          <Card className="p-8 md:p-12 shadow-xl border-border">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using LegalDeep AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily access and use the Service for personal or commercial purposes. This is the grant of a license, 
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without proper subscription</li>
                <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Service Description</h2>
              <p>
                LegalDeep AI provides AI-powered legal document analysis services. The Service analyzes legal documents and provides summaries, 
                insights, and risk assessments. The Service is provided "as is" and should not replace professional legal advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. User Accounts</h2>
              <p>
                To access certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Payment Terms</h2>
              <p>
                Subscription fees are billed in advance on a monthly or annual basis. You agree to pay all fees associated with your subscription plan. 
                Fees are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Document Upload and Analysis</h2>
              <p>
                You retain all rights to documents you upload. By uploading documents, you grant us a license to process, analyze, and store them 
                solely for the purpose of providing the Service. We do not claim ownership of your documents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Acceptable Use</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Upload illegal, harmful, or fraudulent content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit viruses or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for any unlawful purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Disclaimer</h2>
              <p>
                The Service is provided for informational purposes only and does not constitute legal advice. You should consult with a qualified 
                attorney for legal advice specific to your situation. We make no warranties about the accuracy, completeness, or reliability of the 
                analysis provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
              <p>
                In no event shall LegalDeep AI be liable for any damages (including, without limitation, damages for loss of data or profit, or due to 
                business interruption) arising out of the use or inability to use the Service, even if we have been notified orally or in writing of 
                the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">10. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach the Terms. 
                Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">11. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. 
                Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which LegalDeep AI operates, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">13. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@legaldeepai.com
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

export default TermsAndConditions;
