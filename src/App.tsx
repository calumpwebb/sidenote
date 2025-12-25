import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold font-mono text-primary mb-2">
            Sidenote
          </h1>
          <p className="text-muted-foreground">
            A powerful note-taking app for developers
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Theme Test</h2>
          <div className="flex gap-2 flex-wrap">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>

          <div className="flex gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">+</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
