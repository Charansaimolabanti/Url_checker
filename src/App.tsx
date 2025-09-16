import { useState } from 'react';
import { Shield, ShieldAlert, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

 
import unnamed from './components/unnamed.png';

type CheckResult = {
  safe: boolean;
  score: number;
  threats: string[];
  details: {
    malware: boolean;
    phishing: boolean;
    suspicious: boolean;
    unwantedSoftware: boolean;
  };
};

function App() {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [history, setHistory] = useState<Array<{ url: string; safe: boolean; date: string }>>([]);

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const checkUrl = async () => {
    if (!url) {
      toast.error('Please enter a URL to check');
      return;
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsChecking(true);

    // Simulate API call
    setTimeout(() => {
      const isSafe =
        !url.includes('malware') &&
        !url.includes('phishing') &&
        !url.includes('virus') &&
        !url.includes('hack');

      const mockResult: CheckResult = {
        safe: isSafe,
        score: isSafe
          ? Math.floor(Math.random() * 20) + 80
          : Math.floor(Math.random() * 40) + 10,
        threats: isSafe ? [] : ['Suspicious domain', 'Potential phishing'],
        details: {
          malware: !isSafe && Math.random() > 0.5,
          phishing: !isSafe && Math.random() > 0.3,
          suspicious: !isSafe,
          unwantedSoftware: !isSafe && Math.random() > 0.7,
        },
      };

      setResult(mockResult);

      setHistory((prev) => [
        { url, safe: mockResult.safe, date: new Date().toLocaleString() },
        ...prev,
      ].slice(0, 10));

      setIsChecking(false);

      if (mockResult.safe) {
        toast.success('URL is safe to visit');
      } else {
        toast.error('URL may be unsafe! Be careful!');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href='#'>
             <div className="flex items-end justify-end">
        <img src={unnamed} alt="Logo" className="h-30%  w-auto" />
      </div></a>
        <div>
            <h1 className="text-2xl font-bold p-1">URL Safety Checker</h1>
            <div>
        <p className="text-muted-foreground mt-2 ">
  
          Check if a URL is safe before visiting it
        </p></div></div>
        </div></div>
      </header>

      <main className="container mx-auto flex-1 py-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>

            <CardTitle className="text-xl">Check URL Safety</CardTitle>
            <CardDescription>
              Enter a URL to check if it's safe to visit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={checkUrl} disabled={isChecking}>
                {isChecking ? 'Checking...' : 'Check'}
              </Button>
            </div>

            {result && (
              <div className="mt-6 space-y-4">
                <Alert variant={result.safe ? 'default' : 'destructive'}>
                  {result.safe ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {result.safe ? 'Safe URL' : 'Potentially Unsafe URL'}
                  </AlertTitle>
                  <AlertDescription>
                    {result.safe
                      ? 'This URL appears to be safe to visit.'
                      : 'This URL may be unsafe. Proceed with caution.'}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Safety Score
                    </div>
                    <div className="text-3xl font-bold flex items-center gap-2">
                      {result.score}
                      <span className="text-sm font-normal text-muted-foreground">
                        /100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary mt-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          result.score > 70
                            ? 'bg-green-500'
                            : result.score > 40
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Threat Detection
                    </div>
                    {result.threats.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No threats detected
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {result.threats.map((threat, i) => (
                          <li
                            key={i}
                            className="text-sm flex items-center gap-1"
                          >
                            <ShieldAlert className="h-3 w-3 text-destructive" />
                            {threat}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border">
                  <div className="text-sm font-medium mb-2">Detailed Analysis</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Malware</span>
                      <Badge
                        variant={result.details.malware ? 'destructive' : 'outline'}
                      >
                        {result.details.malware ? 'Detected' : 'Clean'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phishing</span>
                      <Badge
                        variant={result.details.phishing ? 'destructive' : 'outline'}
                      >
                        {result.details.phishing ? 'Detected' : 'Clean'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Suspicious</span>
                      <Badge
                        variant={result.details.suspicious ? 'destructive' : 'outline'}
                      >
                        {result.details.suspicious ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unwanted Software</span>
                      <Badge
                        variant={
                          result.details.unwantedSoftware ? 'destructive' : 'outline'
                        }
                      >
                        {result.details.unwantedSoftware ? 'Detected' : 'Clean'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div>
              {result && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:underline ${
                      !result.safe ? 'text-destructive' : ''
                    }`}
                  >
                    {url}
                  </a>
                </div>
              )}
            </div>
            <div>Last checked: {result ? new Date().toLocaleString() : 'Never'}</div>
          </CardFooter>
        </Card>

        {history.length > 0 && (
          <div className="mt-8 max-w-3xl mx-auto">
            <Tabs defaultValue="history">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Checks</h2>
                <TabsList>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="history">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {history.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-3 px-4"
                        >
                          <div className="flex items-center gap-2">
                            {item.safe ? (
                              <Shield className="h-4 w-4 text-green-500" />
                            ) : (
                              <ShieldAlert className="h-4 w-4 text-destructive" />
                            )}
                            <span className="text-sm font-medium truncate max-w-[300px]">
                              {item.url}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={item.safe ? 'outline' : 'destructive'}>
                              {item.safe ? 'Safe' : 'Unsafe'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {item.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardContent className="py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card rounded-lg p-4 border">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Total URLs Checked
                        </div>
                        <div className="text-3xl font-bold">{history.length}</div>
                      </div>
                      <div className="bg-card rounded-lg p-4 border">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Safe vs Unsafe
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="text-sm mb-1">
                              <span className="font-medium">Safe:</span>{' '}
                              {history.filter((h) => h.safe).length}
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{
                                  width: `${
                                    (history.filter((h) => h.safe).length /
                                      history.length) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm mb-1">
                              <span className="font-medium">Unsafe:</span>{' '}
                              {history.filter((h) => !h.safe).length}
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500"
                                style={{
                                  width: `${
                                    (history.filter((h) => !h.safe).length /
                                      history.length) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* ✅ fixed justify-end */}
     
      <footer className="container mx-auto py-6">
        <Separator className="mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">URL Safety Checker</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Developed By 10x Devss -
            <a
              href="https://www.linkedin.com/in/charan-sai-molabanti-49a022263/"
              target="_blank"
              className="ml-1 text-primary hover:underline"
            >
              Charan Sai Molabanti
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} URL Safety Checker
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
