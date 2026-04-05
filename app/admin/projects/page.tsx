"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: "", message: "" });

  useEffect(() => {
    fetch("/api/projects")
      .then((r: Response) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!name || !startDate || !endDate) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setAlert({ type: "error", message: "End date must be after start date" });
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, startDate, endDate }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create project");
      }
      const created: Project = await res.json();
      setProjects((prev: Project[]) => [created, ...prev]);
      setAlert({ type: "success", message: "Project created successfully" });
      setName("");
      setStartDate("");
      setEndDate("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create project";
      setAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <nav data-testid="projects-menu">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage your projects</p>
      </nav>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                data-testid="project-name-input"
                name="name"
                placeholder="Enter project name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="start-date" className="text-sm font-medium">
                  Start Date
                </label>
                <Input
                  id="start-date"
                  data-testid="start-date-input"
                  name="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end-date" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="end-date"
                  data-testid="end-date-input"
                  name="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" data-testid="save-project-btn">
              Save
            </Button>
          </form>

          {alert.message && (
            <div
              data-testid={alert.type === "success" ? "project-created-alert" : "project-error-alert"}
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
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-testid="project-list">
            {loading ? (
              <p data-testid="project-list-loading">Loading...</p>
            ) : projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project: Project) => (
                  <div
                    key={project.id}
                    data-testid={`project-item-${project.id}`}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.startDate).toLocaleDateString()} —{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p data-testid="project-list-empty" className="text-muted-foreground">
                No projects found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
