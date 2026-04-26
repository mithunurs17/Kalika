"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Loader2, AlertCircle } from "lucide-react";
import BackToDashboardButton from "@/components/ui/back-to-dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StudyContent {
  id: number;
  title: string;
  content: string;
  content_type: string;
  difficulty: string;
  duration_minutes: number;
  created_at: string;
}

export default function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<StudyContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [error, setError] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<StudyContent | null>(null);

  // Form state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const subjects = [
    { name: "Mathematics", chapters: ["Real Numbers", "Polynomials", "Linear Equations", "Quadratic Equations"] },
    { name: "Physics", chapters: ["Motion", "Forces", "Energy", "Waves"] },
    { name: "Chemistry", chapters: ["Atomic Structure", "Chemical Bonding", "Reactions", "States of Matter"] },
    { name: "Biology", chapters: ["Cell Biology", "Genetics", "Evolution", "Ecology"] },
  ];

  async function handleGenerateContent() {
    if (!selectedSubject || !selectedChapter) {
      setError("Please select subject and chapter");
      return;
    }

    setGeneratingContent(true);
    setError("");

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          chapter: selectedChapter,
          topic: selectedTopic,
          difficulty,
          content_type: "text",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await res.json();
      await fetchMaterials();
      setError("Content generated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content");
    } finally {
      setGeneratingContent(false);
    }
  }

  async function fetchMaterials() {
    if (!selectedSubject || !selectedChapter) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        subject: selectedSubject,
        chapter: selectedChapter,
        ...(selectedTopic && { topic: selectedTopic }),
      });

      const res = await fetch(`/api/content?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.content || []);
      }
    } catch (err) {
      console.error("Error fetching materials:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (selectedSubject && selectedChapter) {
      fetchMaterials();
    }
  }, [selectedSubject, selectedChapter, selectedTopic]);

  return (
    <div>
      <BackToDashboardButton />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Study Materials</h1>
        </div>

        {error && (
          <Alert variant={error.includes("successfully") ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Content Generation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Study Material</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="chapter">Chapter</Label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects
                      .find((s) => s.name === selectedSubject)
                      ?.chapters.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="topic">Topic (Optional)</Label>
                <Input
                  id="topic"
                  placeholder="Specific topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerateContent}
              disabled={generatingContent || !selectedSubject || !selectedChapter}
              className="w-full"
            >
              {generatingContent ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Content...
                </>
              ) : (
                "Generate Study Material"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Study Materials Display */}
        {materials.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Materials</h2>

            {!selectedMaterial ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {materials.map((material) => (
                  <Card
                    key={material.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">{material.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{material.duration_minutes} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Difficulty:</span>
                          <span className="capitalize">{material.difficulty}</span>
                        </div>
                        <Button className="w-full mt-4" size="sm">
                          Read Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedMaterial.title}</CardTitle>
                    <Button variant="outline" onClick={() => setSelectedMaterial(null)}>
                      ← Back to Materials
                    </Button>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>⏱️ {selectedMaterial.duration_minutes} minutes</span>
                    <span>📊 {selectedMaterial.difficulty.toUpperCase()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      className="whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: selectedMaterial.content
                          .replace(/\n\n/g, "</p><p>")
                          .replace(/^/, "<p>")
                          .replace(/$/, "</p>"),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {selectedSubject && selectedChapter && !loading && materials.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Materials Available</h3>
                <p className="text-muted-foreground mb-4">
                  Generate study materials for {selectedChapter} to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading materials...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
