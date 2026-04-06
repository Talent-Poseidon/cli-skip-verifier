"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CompetencyDictionary {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  createdAt: string;
}

export default function CompetencyDictionaryPage() {
  const [dictionaries, setDictionaries] = useState<CompetencyDictionary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{ type: string; message: string }>({ type: "", message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/competency-dictionary")
      .then((r: Response) => r.json())
      .then((data: CompetencyDictionary[]) => {
        setDictionaries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAlert({ type: "", message: "" });

    try {
      const res = await fetch("/api/competency-dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          fileUrl: `/uploads/${file.name}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to upload template");
      }
      const created: CompetencyDictionary = await res.json();
      setDictionaries((prev: CompetencyDictionary[]) => [created, ...prev]);
      setAlert({ type: "success", message: "Template uploaded successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload template";
      setAlert({ type: "error", message });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <nav data-testid="competency-dictionary-page-nav">
        <h1 className="text-2xl font-bold tracking-tight">Competency Dictionary Management</h1>
        <p className="text-muted-foreground">Manage competency dictionaries and upload templates</p>
      </nav>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Upload Template</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
            data-testid="template-file-input"
          />
          <Button
            data-testid="upload-template-btn"
            onClick={handleUploadClick}
          >
            Upload Template
          </Button>

          {alert.message && (
            <div
              data-testid={alert.type === "success" ? "upload-success-alert" : "upload-error-alert"}
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
          <CardTitle>Dictionary List</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-testid="competency-dictionary-list-container">
            {loading ? (
              <p data-testid="competency-dictionary-list-loading">Loading...</p>
            ) : dictionaries.length > 0 ? (
              <div className="space-y-3" data-testid="competency-dictionary-list">
                {dictionaries.map((dict: CompetencyDictionary) => (
                  <div
                    key={dict.id}
                    data-testid={`competency-dictionary-item-${dict.id}`}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{dict.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dict.fileName} — Uploaded {new Date(dict.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p data-testid="competency-dictionary-list-empty" className="text-muted-foreground">
                No dictionaries found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
