import React from 'react';
import { Code, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://nhmhqhhxlcmhufxxifbn.supabase.co/functions/v1';

export const ApiDocumentation = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const CodeBlock = ({ language, code }: { language: string; code: string }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(code)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="bg-card border border-t-0 rounded-b-lg p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );

  const curlExample = `curl -X POST ${API_BASE_URL}/api-analyze-document \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@/path/to/document.pdf"`;

  const javascriptExample = `const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('${API_BASE_URL}/api-analyze-document', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const result = await response.json();
console.log(result);`;

  const pythonExample = `import requests

url = '${API_BASE_URL}/api-analyze-document'
headers = {'Authorization': 'Bearer YOUR_API_KEY'}
files = {'file': open('document.pdf', 'rb')}

response = requests.post(url, headers=headers, files=files)
result = response.json()
print(result)`;

  const responseExample = `{
  "success": true,
  "analysis_id": "uuid-here",
  "message": "Document analysis started",
  "status": "processing",
  "estimated_completion": "2024-01-01T12:00:00Z",
  "processing_time_ms": 1200
}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API Documentation</h2>
        <p className="text-muted-foreground">
          Complete guide to integrating with the LegalDeep AI API
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Base URL and authentication for the LegalDeep AI API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Base URL</h4>
              <code className="bg-muted px-3 py-1 rounded">{API_BASE_URL}</code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Authentication</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Include your API key in the Authorization header:
              </p>
              <code className="bg-muted px-3 py-1 rounded text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Analysis</CardTitle>
            <CardDescription>
              Analyze legal documents and extract key insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default">POST</Badge>
              <code className="text-sm">/api-analyze-document</code>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Request Parameters</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-4 py-2 border-b">
                  <span className="font-medium">Parameter</span>
                  <span className="font-medium">Type</span>
                  <span className="font-medium">Description</span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2">
                  <code>file</code>
                  <span>File</span>
                  <span>PDF or Word document to analyze</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Examples</h4>
              <Tabs defaultValue="curl" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="curl">
                  <CodeBlock language="bash" code={curlExample} />
                </TabsContent>
                <TabsContent value="javascript">
                  <CodeBlock language="javascript" code={javascriptExample} />
                </TabsContent>
                <TabsContent value="python">
                  <CodeBlock language="python" code={pythonExample} />
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Response</h4>
              <CodeBlock language="json" code={responseExample} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>
              API usage limits and pricing tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Pay Per Use</h4>
                  <p className="text-sm text-muted-foreground">$24 per contract</p>
                  <Badge variant="secondary" className="mt-2">No minimums</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Pro Unlimited</h4>
                  <p className="text-sm text-muted-foreground">Unlimited requests</p>
                  <Badge variant="default" className="mt-2">$97/month</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Enterprise</h4>
                  <p className="text-sm text-muted-foreground">Custom SLAs & integrations</p>
                  <Badge variant="default" className="mt-2">Starts at $299/month</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Handling</CardTitle>
            <CardDescription>
              Common error responses and how to handle them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <code className="text-sm">400 Bad Request</code>
                    <p className="text-xs text-muted-foreground">Invalid file format or missing parameters</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <code className="text-sm">401 Unauthorized</code>
                    <p className="text-xs text-muted-foreground">Invalid or missing API key</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <code className="text-sm">429 Too Many Requests</code>
                    <p className="text-xs text-muted-foreground">Rate limit exceeded</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <code className="text-sm">500 Internal Server Error</code>
                    <p className="text-xs text-muted-foreground">Processing error, please retry</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>
              Need help integrating the API?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Our team is here to help you integrate successfully. Reach out for technical support,
                feature requests, or general questions about the API.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <a href="mailto:support@legaldeep.ai" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Email Support
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://docs.legaldeep.ai" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Full Documentation
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};