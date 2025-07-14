# Syllabus Data Format Guide

## 📚 **How to Provide Syllabus Information**

There are several ways you can provide the NCERT syllabus data to integrate into Kalika:

## 🎯 **Method 1: JSON Upload (Recommended)**

### Step 1: Prepare Your Data
Create a JSON file with the following structure:

```json
{
  "class": "10th Grade (SSLC)",
  "subjects": [
    {
      "name": "Mathematics",
      "chapters": [
        {
          "number": 1,
          "name": "Real Numbers",
          "topics": [
            "Euclid's Division Lemma",
            "Fundamental Theorem of Arithmetic", 
            "Irrational Numbers",
            "Decimal Expansions"
          ],
          "learning_objectives": [
            "Understand the real number system",
            "Apply Euclid's division algorithm",
            "Prove irrationality of numbers",
            "Understand decimal expansions"
          ],
          "duration_hours": 12
        },
        {
          "number": 2,
          "name": "Polynomials",
          "topics": [
            "Zeroes of Polynomials",
            "Division Algorithm",
            "Geometric Meaning of Zeroes",
            "Relationship between Zeroes and Coefficients"
          ],
          "learning_objectives": [
            "Find zeroes of polynomials",
            "Understand polynomial division",
            "Graph polynomials",
            "Understand zero-coefficient relationships"
          ],
          "duration_hours": 15
        }
      ]
    },
    {
      "name": "Science",
      "chapters": [
        {
          "number": 1,
          "name": "Chemical Reactions and Equations",
          "topics": [
            "Chemical Equations",
            "Balancing Chemical Equations",
            "Types of Chemical Reactions",
            "Oxidation and Reduction"
          ],
          "learning_objectives": [
            "Write and balance chemical equations",
            "Identify different types of reactions",
            "Understand redox reactions",
            "Apply conservation of mass"
          ],
          "duration_hours": 10
        }
      ]
    }
  ]
}
```

### Step 2: Upload via Admin Interface
1. Go to `/admin/syllabus` in your application
2. Paste the JSON data
3. Click "Preview" to validate
4. Click "Upload Syllabus"

## 📋 **Method 2: Manual Entry**

### For Each Subject, Provide:
- **Subject Name** (e.g., "Mathematics", "Physics", "Chemistry")
- **Chapter List** with:
  - Chapter number
  - Chapter name
  - Topics covered
  - Learning objectives
  - Estimated duration

### Example Format:
```
Subject: Mathematics (10th Grade)

Chapter 1: Real Numbers
Topics: Euclid's Division Lemma, Fundamental Theorem of Arithmetic, Irrational Numbers
Objectives: Understand real number system, Apply division algorithm
Duration: 12 hours

Chapter 2: Polynomials  
Topics: Zeroes of Polynomials, Division Algorithm, Geometric Meaning
Objectives: Find zeroes, Understand division, Graph polynomials
Duration: 15 hours
```

## 📖 **Method 3: NCERT Textbook Reference**

### Provide Textbook Information:
- **Class**: 10th/11th/12th
- **Subject**: Name of subject
- **Textbook Chapters**: List of chapters from NCERT textbook
- **Topics per Chapter**: Main topics covered
- **Learning Outcomes**: What students should learn

## 🎯 **Method 4: Spreadsheet Format**

### Create an Excel/CSV with columns:
| Class | Subject | Chapter_Number | Chapter_Name | Topics | Learning_Objectives | Duration_Hours |
|-------|---------|----------------|--------------|--------|-------------------|----------------|
| 10th Grade | Mathematics | 1 | Real Numbers | Euclid's Division Lemma; Fundamental Theorem | Understand real numbers; Apply algorithm | 12 |
| 10th Grade | Mathematics | 2 | Polynomials | Zeroes; Division Algorithm | Find zeroes; Graph polynomials | 15 |

## 📚 **Supported Classes & Subjects**

### 10th Grade (SSLC):
- Mathematics
- Science (Physics, Chemistry, Biology)
- Social Science (History, Geography, Civics, Economics)
- English
- Hindi/Kannada

### 11th Grade (1st PUC):
- Mathematics
- Physics
- Chemistry
- Biology
- Computer Science
- English
- Hindi/Kannada

### 12th Grade (2nd PUC):
- Mathematics
- Physics
- Chemistry
- Biology
- Computer Science
- English
- Hindi/Kannada

## 🔧 **What Happens After Upload**

Once you upload the syllabus:

1. **Database Storage**: All syllabus data is stored in the database
2. **Quiz Generation**: AI can generate relevant quizzes for each topic
3. **Study Content**: Create study materials for each chapter
4. **Progress Tracking**: Students can track progress through chapters
5. **Personalized Learning**: Content is tailored to student's class

## 📝 **Sample Data for Different Classes**

### 10th Grade Mathematics:
```json
{
  "class": "10th Grade (SSLC)",
  "subjects": [
    {
      "name": "Mathematics",
      "chapters": [
        {"number": 1, "name": "Real Numbers", "topics": ["Euclid's Division Lemma", "Fundamental Theorem"], "learning_objectives": ["Understand real numbers"], "duration_hours": 12},
        {"number": 2, "name": "Polynomials", "topics": ["Zeroes", "Division Algorithm"], "learning_objectives": ["Find zeroes"], "duration_hours": 15},
        {"number": 3, "name": "Pair of Linear Equations", "topics": ["Graphical Method", "Algebraic Method"], "learning_objectives": ["Solve equations"], "duration_hours": 18},
        {"number": 4, "name": "Quadratic Equations", "topics": ["Factorization", "Completing Square"], "learning_objectives": ["Solve quadratics"], "duration_hours": 16},
        {"number": 5, "name": "Arithmetic Progressions", "topics": ["AP", "Sum of AP"], "learning_objectives": ["Understand AP"], "duration_hours": 14},
        {"number": 6, "name": "Triangles", "topics": ["Similarity", "Pythagoras"], "learning_objectives": ["Prove similarity"], "duration_hours": 20},
        {"number": 7, "name": "Coordinate Geometry", "topics": ["Distance Formula", "Section Formula"], "learning_objectives": ["Find distances"], "duration_hours": 12},
        {"number": 8, "name": "Introduction to Trigonometry", "topics": ["Trigonometric Ratios", "Identities"], "learning_objectives": ["Use trig ratios"], "duration_hours": 18},
        {"number": 9, "name": "Applications of Trigonometry", "topics": ["Heights and Distances"], "learning_objectives": ["Apply trigonometry"], "duration_hours": 10},
        {"number": 10, "name": "Circles", "topics": ["Tangent", "Secant"], "learning_objectives": ["Understand circles"], "duration_hours": 16},
        {"number": 11, "name": "Constructions", "topics": ["Geometric Constructions"], "learning_objectives": ["Construct figures"], "duration_hours": 12},
        {"number": 12, "name": "Areas Related to Circles", "topics": ["Area", "Perimeter"], "learning_objectives": ["Calculate areas"], "duration_hours": 14},
        {"number": 13, "name": "Surface Areas and Volumes", "topics": ["Cubes", "Cylinders", "Cones"], "learning_objectives": ["Calculate volumes"], "duration_hours": 20},
        {"number": 14, "name": "Statistics", "topics": ["Mean", "Median", "Mode"], "learning_objectives": ["Calculate statistics"], "duration_hours": 16},
        {"number": 15, "name": "Probability", "topics": ["Theoretical Probability", "Experimental Probability"], "learning_objectives": ["Calculate probability"], "duration_hours": 12}
      ]
    }
  ]
}
```

## 🚀 **Next Steps**

1. **Choose your preferred method** (JSON upload recommended)
2. **Prepare your syllabus data** in the chosen format
3. **Upload via the admin interface** at `/admin/syllabus`
4. **Test the integration** by creating a student account
5. **Generate quizzes and content** based on the syllabus

## 📞 **Need Help?**

If you need assistance with:
- Converting your syllabus to the correct format
- Uploading large amounts of data
- Customizing the syllabus structure
- Adding specific topics or objectives

Just let me know and I can help you format the data correctly! 