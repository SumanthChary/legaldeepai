import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Server, Eye, FileCheck, Users } from "lucide-react";

const SecurityPolicy = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Security & Compliance</h1>
        </div>
        
        <Card className="p-8">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Data Encryption</h2>
              </div>
              <p className="mb-3">
                We employ military-grade encryption to protect your sensitive legal documents and data at every stage:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>End-to-end encryption for document uploads</li>
                <li>Encrypted database connections</li>
                <li>Secure key management using industry best practices</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Infrastructure Security</h2>
              </div>
              <p className="mb-3">
                Our infrastructure is built on secure, enterprise-grade cloud services:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Hosted on Supabase with SOC 2 Type II compliance</li>
                <li>Distributed denial-of-service (DDoS) protection</li>
                <li>Regular security patches and updates</li>
                <li>Automated backup systems with redundancy</li>
                <li>99.9% uptime SLA guarantee</li>
                <li>Geographically distributed data centers</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Access Controls</h2>
              </div>
              <p className="mb-3">
                We implement strict access controls to ensure only authorized users can access your data:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Multi-factor authentication (MFA) support</li>
                <li>Role-based access control (RBAC)</li>
                <li>Session management and automatic timeout</li>
                <li>IP whitelisting for enterprise accounts</li>
                <li>Audit logs for all access attempts</li>
                <li>Granular permission settings</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Compliance & Certifications</h2>
              </div>
              <p className="mb-3">
                We maintain compliance with international security and privacy standards:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>GDPR (General Data Protection Regulation) compliant</li>
                <li>CCPA (California Consumer Privacy Act) compliant</li>
                <li>SOC 2 Type II certified infrastructure</li>
                <li>ISO 27001 security standards</li>
                <li>HIPAA compliance available for healthcare clients</li>
                <li>Regular third-party security audits</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Data Privacy</h2>
              </div>
              <p className="mb-3">
                Your privacy is paramount. We follow strict data privacy principles:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>We never sell or share your data with third parties</li>
                <li>Your documents are isolated and encrypted</li>
                <li>Data minimization - we only collect what's necessary</li>
                <li>Right to deletion - you control your data</li>
                <li>Transparent data processing practices</li>
                <li>Regular privacy impact assessments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Application Security</h2>
              <p className="mb-3">
                We follow secure development practices throughout our application lifecycle:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Regular security code reviews</li>
                <li>Automated vulnerability scanning</li>
                <li>Penetration testing by certified professionals</li>
                <li>Input validation and sanitization</li>
                <li>Protection against OWASP Top 10 vulnerabilities</li>
                <li>Secure API design and implementation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Incident Response</h2>
              <p className="mb-3">
                We have a comprehensive incident response plan in place:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>24/7 security monitoring and alerts</li>
                <li>Dedicated incident response team</li>
                <li>Rapid response protocols for security events</li>
                <li>Clear communication channels for reporting issues</li>
                <li>Post-incident analysis and improvements</li>
                <li>Timely notification of affected users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Data Retention and Deletion</h2>
              <p className="mb-3">
                We maintain clear policies for data retention and deletion:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Documents stored only as long as necessary</li>
                <li>Automatic deletion of analysis after specified period</li>
                <li>Secure data wiping procedures</li>
                <li>User-initiated deletion honored within 30 days</li>
                <li>Backup data securely deleted after retention period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Employee Training</h2>
              <p>
                All team members undergo regular security training including data protection, phishing awareness, and secure handling of 
                sensitive information. We maintain strict confidentiality agreements and background checks for all personnel with system access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Reporting Security Issues</h2>
              <p>
                If you discover a security vulnerability, please report it immediately to security@legaldeepai.com. We take all reports seriously 
                and will respond promptly. We appreciate responsible disclosure and may offer recognition for valid findings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Our Security Team</h2>
              <p>
                For security-related questions or concerns, contact our security team at:
              </p>
              <p className="mt-2">
                Email: security@legaldeepai.com<br />
                For urgent security issues: security-urgent@legaldeepai.com
              </p>
            </section>

            <div className="mt-8 pt-6 border-t text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SecurityPolicy;
