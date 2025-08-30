import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoke } from '@tauri-apps/api/core';
import { useTeamConfig, useUpdateTeamConfig } from './hooks/useTeamConfig';
import { teamConfigSchema, TeamConfigFormData } from './lib/schemas';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import "./App.css";

function App() {
  const { data: teamConfig, isLoading } = useTeamConfig();
  const updateTeamConfig = useUpdateTeamConfig();

  const form = useForm<TeamConfigFormData>({
    resolver: zodResolver(teamConfigSchema),
    defaultValues: {
      ctName: "Counter-Terrorists",
      tName: "Terrorists",
      ctLogoUrl: "",
      tLogoUrl: "",
    },
  });

  // Update form when teamConfig loads
  React.useEffect(() => {
    if (teamConfig) {
      form.reset({
        ctName: teamConfig.ctName,
        tName: teamConfig.tName,
        ctLogoUrl: teamConfig.ctLogoUrl || "",
        tLogoUrl: teamConfig.tLogoUrl || "",
      });
    }
  }, [teamConfig, form]);

  const handleFileSelect = (team: 'ct' | 't', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      const fieldName = team === 'ct' ? 'ctLogoUrl' : 'tLogoUrl';
      form.setValue(fieldName, logoUrl);
    }
  };

  const onSubmit = (data: TeamConfigFormData) => {
    updateTeamConfig.mutate(data);
  };

  const resetForm = () => {
    if (teamConfig) {
      form.reset(teamConfig);
    }
  };

  const createOverlayWindow = async () => {
    try {
      await invoke('create_overlay_window');
    } catch (error) {
      console.error('Failed to create overlay window:', error);
    }
  };

const toggleCondensedMode = async () => {
  if (teamConfig) {
    updateTeamConfig.mutate({
      ...teamConfig,
      isCondensed: !teamConfig.isCondensed
    });
  }
};

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          CS2 HUD Team Configuration
        </h1>

        <div className="bg-card rounded-lg p-6 border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* CT Team Configuration */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-500">Counter-Terrorists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ctName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter CT team name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="ct-logo">Team Logo</Label>
                    <Input
                      id="ct-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect('ct', e)}
                    />
                    {form.watch('ctLogoUrl') && (
                      <img 
                        src={form.watch('ctLogoUrl')} 
                        alt="CT Logo" 
                        className="mt-2 w-20 h-20 object-contain bg-muted rounded p-2" 
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* T Team Configuration */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-orange-500">Terrorists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter T team name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="t-logo">Team Logo</Label>
                    <Input
                      id="t-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect('t', e)}
                    />
                    {form.watch('tLogoUrl') && (
                      <img 
                        src={form.watch('tLogoUrl')} 
                        alt="T Logo" 
                        className="mt-2 w-20 h-20 object-contain bg-muted rounded p-2" 
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  type="submit" 
                  disabled={updateTeamConfig.isPending || !form.formState.isDirty}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updateTeamConfig.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={!form.formState.isDirty}
                >
                  Reset
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={createOverlayWindow}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Show Overlay
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={toggleCondensedMode}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Toggle Condensed Mode
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Chroma Key Instructions */}
        <div className="bg-card rounded-lg p-6 border mt-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Chroma Key Setup</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              The overlay window uses a bright green background (#00FF00) for chroma keying in streaming software like OBS Studio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">OBS Studio Setup:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Add "Window Capture" source</li>
                  <li>Select "CS2 HUD Overlay" window</li>
                  <li>Right-click source → Filters → Add "Chroma Key"</li>
                  <li>Set Key Color Type to "Green"</li>
                  <li>Adjust Similarity and Smoothness as needed</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Window Controls:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Window is always on top</li>
                  <li>Can be resized and repositioned</li>
                  <li>Green background = transparent in stream</li>
                  <li>Click "Show Overlay" to open/focus window</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;