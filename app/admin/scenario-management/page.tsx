"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Scenario {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function ScenarioManagementPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: "", message: "" });

  useEffect(() => {
    fetch("/api/scenarios")
      .then((r: Response) => r.json())
      .then((data: Scenario[]) => {
        setScenarios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!name) {
      setAlert({ type: "error", message: "Scenario name is required" });
      return;
    }

    try {
      const res = await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || null }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save scenario");
      }
      const created: Scenario = await res.json();
      setScenarios((prev: Scenario[]) => [created, ...prev]);
      setAlert({ type: "success", message: "Scenario saved successfully" });
      setName("");
      setDescription("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save scenario";
      setAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <nav data-testid="scenario-management-page-nav">
        <h1 className="text-2xl font-bold tracking-tight">Scenario Management</h1>
        <p className="text-muted-foreground">Configure and manage exam scenarios</p>
      </nav>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Configure New Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="scenario-name" className="text-sm font-medium">
                Scenario Name
              </label>
              <Input
                id="scenario-name"
                data-testid="scenario-name-input"
                name="name"
                placeholder="Enter scenario name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="scenario-description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="scenario-description"
                data-testid="scenario-description-input"
                name="description"
                placeholder="Enter scenario description (optional)"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="save-scenario-btn">
              Save Scenario
            </Button>
          </form>

          {alert.message && (
            <div
              data-testid={alert.type === "success" ? "scenario-created-alert" : "scenario-error-alert"}
              className={`mt-4 rounded-md p-3 text-sm ${
                alert.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {alert.message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scenarios List</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-testid="scenario-list-container">
            {loading ? (
              <p data-testid="scenario-list-loading">Loading...</p>
            ) : scenarios.length > 0 ? (
              <div className="space-y-3" data-testid="scenario-list">
                {scenarios.map((scenario: Scenario) => (
                  <div
                    key={scenario.id}
                    data-testid={`scenario-item-${scenario.id}`}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{scenario.name}</p>
                      {scenario.description && (
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p data-testid="scenario-list-empty" className="text-muted-foreground">
                No scenarios found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
