"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

export default function SyllabusManagement() {
  const [syllabusData, setSyllabusData] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const { toast } = useToast();

  const classes = [
    "10th Grade (SSLC)",
    "11th Grade (1st PUC)",
    "12th Grade (2nd PUC)"
  ];

  const validateSyllabusData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.class || !parsed.subjects || !Array.isArray(parsed.subjects)) {
        throw new Error("Invalid syllabus format");
      }
      return parsed;
    } catch (error) {
      throw new Error("Invalid JSON format");
    }
  };

  const handlePreview = () => {
    try {
      const parsed = validateSyllabusData(syllabusData);
      setPreview(parsed);
      toast({
        title: "Preview Generated",
        description: `Found ${parsed.subjects.length} subjects for ${parsed.class}`,
      });
    } catch (error) {
      toast({
        title: "Validation Error",
        description: error instanceof Error ? error.message : "Invalid data",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const parsed = validateSyllabusData(syllabusData);
      
      const response = await fetch("/api/syllabus/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Syllabus Uploaded",
          description: `Successfully uploaded syllabus for ${parsed.class}`,
        });
        setSyllabusData("");
        setPreview(null);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleSyllabus = {
    class: "10th Grade (SSLC)",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          {
            number: 1,
            name: "Real Numbers",
            topics: ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrational Numbers"],
            learning_objectives: ["Understand real number system", "Apply division algorithm", "Prove irrationality"],
            duration_hours: 12
          },
          {
            number: 2,
            name: "Polynomials",
            topics: ["Zeroes of Polynomials", "Division Algorithm", "Geometric Meaning"],
            learning_objectives: ["Find zeroes of polynomials", "Understand polynomial division", "Graph polynomials"],
            duration_hours: 15
          }
        ]
      },
      {
        name: "Science",
        chapters: [
          {
            number: 1,
            name: "Chemical Reactions and Equations",
            topics: ["Chemical Equations", "Types of Reactions", "Oxidation and Reduction"],
            learning_objectives: ["Balance chemical equations", "Identify reaction types", "Understand redox reactions"],
            duration_hours: 10
          }
        ]
      }
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Syllabus Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Syllabus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="syllabus">Syllabus JSON</Label>
              <Textarea
                id="syllabus"
                placeholder="Paste your syllabus JSON here..."
                value={syllabusData}
                onChange={(e) => setSyllabusData(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePreview} variant="outline">
                Preview
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={loading || !syllabusData.trim()}
              >
                {loading ? "Uploading..." : "Upload Syllabus"}
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => setSyllabusData(JSON.stringify(sampleSyllabus, null, 2))}
              className="text-sm"
            >
              Load Sample Data
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {preview ? (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    {preview.class}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    {preview.subjects.length} subjects
                  </p>
                </div>

                <div className="space-y-3">
                  {preview.subjects.map((subject: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <h4 className="font-medium">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {subject.chapters.length} chapters
                      </p>
                      <div className="mt-2 space-y-1">
                        {subject.chapters.map((chapter: any, chIdx: number) => (
                          <div key={chIdx} className="text-sm">
                            <span className="font-medium">Ch. {chapter.number}:</span> {chapter.chapter_name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "Preview" to see the syllabus structure</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Format Your Syllabus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Required Structure:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <code>class</code>: Class name (e.g., "10th Grade (SSLC)")</li>
                <li>• <code>subjects</code>: Array of subjects</li>
                <li>• <code>chapters</code>: Array of chapters per subject</li>
                <li>• <code>topics</code>: Array of topics per chapter</li>
                <li>• <code>learning_objectives</code>: Array of objectives</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Supported Classes:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 10th Grade (SSLC)</li>
                <li>• 11th Grade (1st PUC)</li>
                <li>• 12th Grade (2nd PUC)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 