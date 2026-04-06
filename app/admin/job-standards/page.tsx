"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface JobStandard {
  id: string;
  jobTitle: string;
  scoreExpectation: number;
  createdAt: string;
}

export default function JobStandardsPage() {
  const [standards, setStandards] = useState<JobStandard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [scoreExpectation, setScoreExpectation] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: "", message: "" });

  useEffect(() => {
    fetch("/api/job-standards")
      .then((r: Response) => r.json())
      .then((data: JobStandard[]) => {
        setStandards(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!jobTitle || !scoreExpectation) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }

    const score = Number(scoreExpectation);
    if (isNaN(score)) {
      setAlert({ type: "error", message: "Score expectation must be a number" });
      return;
    }

    try {
      const res = await fetch("/api/job-standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, scoreExpectation: score }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save expectations");
      }
      const created: JobStandard = await res.json();
      setStandards((prev: JobStandard[]) => [created, ...prev]);
      setAlert({ type: "success", message: "Score expectations saved successfully" });
      setJobTitle("");
      setScoreExpectation("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save expectations";
      setAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <nav data-testid="job-standards-page-nav">
        <h1 className="text-2xl font-bold tracking-tight">Job Standards Setup</h1>
        <p className="text-muted-foreground">Set score expectations for job standards</p>
      </nav>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Set Score Expectations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="job-title" className="text-sm font-medium">
                Job Title
              </label>
              <Input
                id="job-title"
                data-testid="job-title-input"
                name="jobTitle"
                placeholder="Enter job title"
                value={jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="score-expectation" className="text-sm font-medium">
                Score Expectation
              </label>
              <Input
                id="score-expectation"
                data-testid="score-expectation-input"
                name="scoreExpectation"
                type="number"
                placeholder="Enter score expectation"
                value={scoreExpectation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreExpectation(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="save-score-btn">
              Save Expectations
            </Button>
          </form>

          {alert.message && (
            <div
              data-testid={alert.type === "success" ? "job-standards-created-alert" : "job-standards-error-alert"}
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
          <CardTitle>Job Standards List</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-testid="job-standards-list-container">
            {loading ? (
              <p data-testid="job-standards-list-loading">Loading...</p>
            ) : standards.length > 0 ? (
              <div className="space-y-3" data-testid="job-standards-list">
                {standards.map((standard: JobStandard) => (
                  <div
                    key={standard.id}
                    data-testid={`job-standard-item-${standard.id}`}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{standard.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Score Expectation: {standard.scoreExpectation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p data-testid="job-standards-list-empty" className="text-muted-foreground">
                No job standards found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
