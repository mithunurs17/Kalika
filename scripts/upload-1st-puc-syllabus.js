const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Database connection
console.log('🔍 Environment check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('Current directory:', __dirname);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 1st PUC Syllabus Data
const syllabusData = {
  "class": "11th Grade (1st PUC)",
  "subjects": [
    {
      "name": "Physics",
      "chapters": [
        {
          "number": 1,
          "name": "Physical World",
          "topics": [
            "Nature of Physical Laws",
            "Physics, Technology and Society",
            "Fundamental Forces in Nature",
            "Scope and Excitement of Physics"
          ],
          "learning_objectives": [
            "Understand the nature of physical laws",
            "Explore the relationship between physics, technology and society",
            "Learn about fundamental forces in nature",
            "Appreciate the scope and excitement of physics"
          ],
          "duration_hours": 8
        },
        {
          "number": 2,
          "name": "Units & Measurements",
          "topics": [
            "International System of Units",
            "Measurement of Length, Mass and Time",
            "Accuracy and Precision of Measuring Instruments",
            "Errors in Measurement",
            "Significant Figures"
          ],
          "learning_objectives": [
            "Understand the International System of Units",
            "Learn measurement techniques for length, mass and time",
            "Understand accuracy and precision concepts",
            "Learn about measurement errors and significant figures"
          ],
          "duration_hours": 12
        },
        {
          "number": 3,
          "name": "Motion in a Straight Line",
          "topics": [
            "Position, Path Length and Displacement",
            "Average Velocity and Average Speed",
            "Instantaneous Velocity and Speed",
            "Acceleration",
            "Kinematic Equations for Uniformly Accelerated Motion"
          ],
          "learning_objectives": [
            "Understand position, path length and displacement",
            "Learn about average and instantaneous velocity",
            "Understand acceleration concepts",
            "Apply kinematic equations for uniformly accelerated motion"
          ],
          "duration_hours": 15
        },
        {
          "number": 4,
          "name": "Motion in a Plane",
          "topics": [
            "Scalars and Vectors",
            "Multiplication of Vectors by Real Numbers",
            "Addition and Subtraction of Vectors",
            "Motion in a Plane with Constant Acceleration",
            "Projectile Motion",
            "Uniform Circular Motion"
          ],
          "learning_objectives": [
            "Understand scalars and vectors",
            "Learn vector operations",
            "Study motion in a plane with constant acceleration",
            "Understand projectile motion and uniform circular motion"
          ],
          "duration_hours": 18
        },
        {
          "number": 5,
          "name": "Laws of Motion",
          "topics": [
            "Aristotle's Fallacy",
            "The Law of Inertia",
            "Newton's First Law of Motion",
            "Newton's Second Law of Motion",
            "Newton's Third Law of Motion",
            "Conservation of Momentum"
          ],
          "learning_objectives": [
            "Understand Aristotle's fallacy",
            "Learn the law of inertia",
            "Master Newton's three laws of motion",
            "Understand conservation of momentum"
          ],
          "duration_hours": 16
        },
        {
          "number": 6,
          "name": "Work, Power, Energy",
          "topics": [
            "Work Done by a Constant Force",
            "Work Done by a Variable Force",
            "Kinetic Energy",
            "Work-Energy Theorem",
            "Potential Energy",
            "Conservation of Mechanical Energy",
            "Power"
          ],
          "learning_objectives": [
            "Understand work done by constant and variable forces",
            "Learn about kinetic and potential energy",
            "Apply work-energy theorem",
            "Understand conservation of mechanical energy and power"
          ],
          "duration_hours": 16
        },
        {
          "number": 7,
          "name": "System of Particles & Rotational Motion",
          "topics": [
            "Centre of Mass",
            "Motion of Centre of Mass",
            "Linear Momentum of a System of Particles",
            "Angular Velocity and Angular Acceleration",
            "Torque and Angular Momentum",
            "Conservation of Angular Momentum"
          ],
          "learning_objectives": [
            "Understand centre of mass concept",
            "Study motion of centre of mass",
            "Learn about linear momentum of particle systems",
            "Understand angular motion concepts and conservation laws"
          ],
          "duration_hours": 18
        },
        {
          "number": 8,
          "name": "Gravitation",
          "topics": [
            "Kepler's Laws",
            "Universal Law of Gravitation",
            "The Gravitational Constant",
            "Acceleration Due to Gravity",
            "Gravitational Potential Energy",
            "Escape Speed"
          ],
          "learning_objectives": [
            "Understand Kepler's laws of planetary motion",
            "Learn universal law of gravitation",
            "Study gravitational constant and acceleration due to gravity",
            "Understand gravitational potential energy and escape speed"
          ],
          "duration_hours": 14
        },
        {
          "number": 9,
          "name": "Mechanical Properties of Solids",
          "topics": [
            "Elastic Behaviour of Solids",
            "Stress and Strain",
            "Hooke's Law",
            "Young's Modulus",
            "Bulk Modulus",
            "Shear Modulus"
          ],
          "learning_objectives": [
            "Understand elastic behaviour of solids",
            "Learn about stress and strain",
            "Apply Hooke's law",
            "Understand various elastic moduli"
          ],
          "duration_hours": 12
        },
        {
          "number": 10,
          "name": "Mechanical Properties of Fluids",
          "topics": [
            "Pressure Due to a Fluid Column",
            "Pascal's Law",
            "Archimedes' Principle",
            "Streamline Flow",
            "Bernoulli's Principle",
            "Viscosity"
          ],
          "learning_objectives": [
            "Understand pressure due to fluid columns",
            "Learn Pascal's law and Archimedes' principle",
            "Study streamline flow and Bernoulli's principle",
            "Understand viscosity concepts"
          ],
          "duration_hours": 14
        },
        {
          "number": 11,
          "name": "Thermal Properties of Matter",
          "topics": [
            "Temperature and Heat",
            "Measurement of Temperature",
            "Ideal Gas Equation",
            "Thermal Expansion",
            "Specific Heat Capacity",
            "Calorimetry"
          ],
          "learning_objectives": [
            "Understand temperature and heat concepts",
            "Learn temperature measurement techniques",
            "Apply ideal gas equation",
            "Study thermal expansion and specific heat capacity"
          ],
          "duration_hours": 12
        },
        {
          "number": 12,
          "name": "Thermodynamics",
          "topics": [
            "Thermal Equilibrium",
            "Zeroth Law of Thermodynamics",
            "Heat, Internal Energy and Work",
            "First Law of Thermodynamics",
            "Second Law of Thermodynamics",
            "Reversible and Irreversible Processes"
          ],
          "learning_objectives": [
            "Understand thermal equilibrium",
            "Learn zeroth law of thermodynamics",
            "Study heat, internal energy and work",
            "Master first and second laws of thermodynamics"
          ],
          "duration_hours": 14
        },
        {
          "number": 13,
          "name": "Kinetic Theory",
          "topics": [
            "Molecular Nature of Matter",
            "Behaviour of Gases",
            "Kinetic Theory of an Ideal Gas",
            "Law of Equipartition of Energy",
            "Specific Heat Capacity",
            "Mean Free Path"
          ],
          "learning_objectives": [
            "Understand molecular nature of matter",
            "Study gas behaviour",
            "Learn kinetic theory of ideal gases",
            "Understand equipartition of energy and mean free path"
          ],
          "duration_hours": 12
        },
        {
          "number": 14,
          "name": "Oscillations",
          "topics": [
            "Periodic and Oscillatory Motions",
            "Simple Harmonic Motion",
            "Simple Harmonic Motion and Uniform Circular Motion",
            "Velocity and Acceleration in Simple Harmonic Motion",
            "Energy in Simple Harmonic Motion",
            "Damped and Forced Oscillations"
          ],
          "learning_objectives": [
            "Understand periodic and oscillatory motions",
            "Learn simple harmonic motion concepts",
            "Study relationship with uniform circular motion",
            "Understand energy in SHM and damped oscillations"
          ],
          "duration_hours": 16
        },
        {
          "number": 15,
          "name": "Waves",
          "topics": [
            "Transverse and Longitudinal Waves",
            "Displacement Relation for a Progressive Wave",
            "The Speed of a Travelling Wave",
            "Principle of Superposition of Waves",
            "Reflection of Waves",
            "Beats"
          ],
          "learning_objectives": [
            "Understand transverse and longitudinal waves",
            "Learn displacement relations for progressive waves",
            "Study wave speed and superposition principle",
            "Understand wave reflection and beats"
          ],
          "duration_hours": 16
        }
      ]
    },
    {
      "name": "Chemistry",
      "chapters": [
        {
          "number": 1,
          "name": "Some Basic Concepts of Chemistry",
          "topics": [
            "Importance of Chemistry",
            "Nature of Matter",
            "Properties of Matter and their Measurement",
            "Uncertainty in Measurement",
            "Laws of Chemical Combinations",
            "Dalton's Atomic Theory"
          ],
          "learning_objectives": [
            "Understand the importance of chemistry",
            "Learn about nature and properties of matter",
            "Understand measurement uncertainties",
            "Master laws of chemical combinations and atomic theory"
          ],
          "duration_hours": 12
        },
        {
          "number": 2,
          "name": "Structure of Atom",
          "topics": [
            "Discovery of Electron, Proton and Neutron",
            "Atomic Number, Mass Number, Isotopes",
            "Thomson's Model and its Limitations",
            "Rutherford's Model and its Limitations",
            "Bohr's Model and its Limitations",
            "Quantum Mechanical Model of Atom"
          ],
          "learning_objectives": [
            "Understand discovery of subatomic particles",
            "Learn about atomic number, mass number and isotopes",
            "Study various atomic models and their limitations",
            "Understand quantum mechanical model"
          ],
          "duration_hours": 16
        },
        {
          "number": 3,
          "name": "Classification of Elements & Periodicity in Properties",
          "topics": [
            "Why do we need to Classify Elements?",
            "Genesis of Periodic Classification",
            "Modern Periodic Law and the Present Form of Periodic Table",
            "Nomenclature of Elements with Atomic Numbers > 100",
            "Electronic Configurations of Elements and the Periodic Table",
            "Electronic Configurations and Types of Elements"
          ],
          "learning_objectives": [
            "Understand the need for element classification",
            "Learn about genesis of periodic classification",
            "Master modern periodic law and table structure",
            "Study electronic configurations and element types"
          ],
          "duration_hours": 14
        },
        {
          "number": 4,
          "name": "Chemical Bonding & Molecular Structure",
          "topics": [
            "Kossel-Lewis Approach to Chemical Bonding",
            "Ionic or Electrovalent Bond",
            "Bond Parameters",
            "The Valence Shell Electron Pair Repulsion (VSEPR) Theory",
            "Valence Bond Theory",
            "Hybridisation"
          ],
          "learning_objectives": [
            "Understand Kossel-Lewis approach to bonding",
            "Learn about ionic bonds and bond parameters",
            "Study VSEPR theory and valence bond theory",
            "Understand hybridisation concepts"
          ],
          "duration_hours": 18
        },
        {
          "number": 5,
          "name": "States of Matter (Gases & Liquids)",
          "topics": [
            "Intermolecular Forces",
            "Thermal Energy",
            "Intermolecular Forces vs Thermal Interactions",
            "The Gaseous State",
            "The Gas Laws",
            "Ideal Gas Equation"
          ],
          "learning_objectives": [
            "Understand intermolecular forces",
            "Learn about thermal energy and interactions",
            "Study gaseous state and gas laws",
            "Apply ideal gas equation"
          ],
          "duration_hours": 14
        },
        {
          "number": 6,
          "name": "Thermodynamics",
          "topics": [
            "Thermodynamic Terms",
            "Applications",
            "Measurement of ΔU and ΔH: Calorimetry",
            "Enthalpy Change, ΔrH of a Reaction",
            "Enthalpies for Different Types of Reactions",
            "Spontaneity"
          ],
          "learning_objectives": [
            "Understand thermodynamic terms",
            "Learn about applications and measurements",
            "Study enthalpy changes for different reactions",
            "Understand spontaneity concepts"
          ],
          "duration_hours": 16
        },
        {
          "number": 7,
          "name": "Equilibrium",
          "topics": [
            "Equilibrium in Physical Processes",
            "Equilibrium in Chemical Processes",
            "Law of Chemical Equilibrium and Equilibrium Constant",
            "Homogeneous Equilibria",
            "Heterogeneous Equilibria",
            "Applications of Equilibrium Constants"
          ],
          "learning_objectives": [
            "Understand equilibrium in physical and chemical processes",
            "Learn law of chemical equilibrium",
            "Study homogeneous and heterogeneous equilibria",
            "Apply equilibrium constants"
          ],
          "duration_hours": 16
        },
        {
          "number": 8,
          "name": "Redox Reactions",
          "topics": [
            "Classical Idea of Redox Reactions",
            "Redox Reactions in Terms of Electron Transfer Reactions",
            "Oxidation Number",
            "Redox Reactions and Electrode Processes",
            "Balancing Redox Reactions"
          ],
          "learning_objectives": [
            "Understand classical redox concepts",
            "Learn electron transfer in redox reactions",
            "Study oxidation numbers",
            "Balance redox reactions"
          ],
          "duration_hours": 12
        },
        {
          "number": 9,
          "name": "Hydrogen",
          "topics": [
            "Position of Hydrogen in the Periodic Table",
            "Dihydrogen, H2",
            "Preparation of Dihydrogen",
            "Properties of Dihydrogen",
            "Hydrides",
            "Water"
          ],
          "learning_objectives": [
            "Understand hydrogen's position in periodic table",
            "Learn about dihydrogen preparation and properties",
            "Study hydrides and water properties"
          ],
          "duration_hours": 10
        },
        {
          "number": 10,
          "name": "s-Block Elements",
          "topics": [
            "Group 1 Elements: Alkali Metals",
            "General Characteristics of the Compounds of the Alkali Metals",
            "Anomalous Properties of Lithium",
            "Some Important Compounds of Sodium",
            "Biological Importance of Sodium and Potassium",
            "Group 2 Elements: Alkaline Earth Metals"
          ],
          "learning_objectives": [
            "Study alkali metals and their compounds",
            "Understand anomalous properties of lithium",
            "Learn about important sodium compounds",
            "Study alkaline earth metals"
          ],
          "duration_hours": 14
        },
        {
          "number": 11,
          "name": "Some p-Block Elements",
          "topics": [
            "Group 13 Elements: The Boron Family",
            "Important Trends and Anomalous Properties of Boron",
            "Some Important Compounds of Boron",
            "Uses of Boron and Aluminium and their Compounds",
            "Group 14 Elements: The Carbon Family",
            "Important Trends and Anomalous Properties of Carbon"
          ],
          "learning_objectives": [
            "Study boron family elements and trends",
            "Learn about boron compounds and uses",
            "Understand carbon family elements and trends"
          ],
          "duration_hours": 16
        },
        {
          "number": 12,
          "name": "Organic Chemistry: Basic Principles & Techniques",
          "topics": [
            "General Introduction",
            "Tetravalence of Carbon: Shapes of Organic Compounds",
            "Structural Representations of Organic Compounds",
            "Classification of Organic Compounds",
            "Nomenclature of Organic Compounds",
            "Isomerism"
          ],
          "learning_objectives": [
            "Understand basic principles of organic chemistry",
            "Learn about carbon tetravalence and compound shapes",
            "Study structural representations and classification",
            "Master nomenclature and isomerism"
          ],
          "duration_hours": 18
        },
        {
          "number": 13,
          "name": "Hydrocarbons",
          "topics": [
            "Classification",
            "Alkanes",
            "Alkenes",
            "Alkynes",
            "Aromatic Hydrocarbon",
            "Carcinogenicity and Toxicity"
          ],
          "learning_objectives": [
            "Understand hydrocarbon classification",
            "Study alkanes, alkenes and alkynes",
            "Learn about aromatic hydrocarbons",
            "Understand carcinogenicity and toxicity"
          ],
          "duration_hours": 16
        },
        {
          "number": 14,
          "name": "Environmental Chemistry",
          "topics": [
            "Environmental Pollution",
            "Atmospheric Pollution",
            "Water Pollution",
            "Soil Pollution",
            "Industrial Waste",
            "Strategies to Control Environmental Pollution"
          ],
          "learning_objectives": [
            "Understand environmental pollution types",
            "Study atmospheric, water and soil pollution",
            "Learn about industrial waste",
            "Understand pollution control strategies"
          ],
          "duration_hours": 10
                 }
       ]
     },
     {
       "name": "Biology",
       "chapters": [
         {
           "number": 1,
           "name": "Living World",
           "topics": [
             "What is Living?",
             "Biodiversity",
             "Need for Classification",
             "Three Domains of Life",
             "Taxonomy and Systematics",
             "Taxonomical Aids"
           ],
           "learning_objectives": [
             "Understand what constitutes living organisms",
             "Learn about biodiversity and classification",
             "Study three domains of life",
             "Understand taxonomy and systematics"
           ],
           "duration_hours": 10
         },
         {
           "number": 2,
           "name": "Biological Classification",
           "topics": [
             "Kingdom Monera",
             "Kingdom Protista",
             "Kingdom Fungi",
             "Kingdom Plantae",
             "Kingdom Animalia",
             "Viruses, Viroids and Lichens"
           ],
           "learning_objectives": [
             "Understand the five kingdom classification",
             "Study characteristics of each kingdom",
             "Learn about viruses, viroids and lichens"
           ],
           "duration_hours": 12
         },
         {
           "number": 3,
           "name": "Plant Kingdom",
           "topics": [
             "Algae",
             "Bryophytes",
             "Pteridophytes",
             "Gymnosperms",
             "Angiosperms",
             "Plant Life Cycles and Alternation of Generations"
           ],
           "learning_objectives": [
             "Study different plant groups",
             "Understand plant life cycles",
             "Learn about alternation of generations"
           ],
           "duration_hours": 14
         },
         {
           "number": 4,
           "name": "Animal Kingdom",
           "topics": [
             "Basis of Classification",
             "Classification of Animals",
             "Phylum Porifera",
             "Phylum Coelenterata",
             "Phylum Platyhelminthes",
             "Phylum Nematoda",
             "Phylum Annelida",
             "Phylum Arthropoda",
             "Phylum Mollusca",
             "Phylum Echinodermata",
             "Phylum Chordata"
           ],
           "learning_objectives": [
             "Understand basis of animal classification",
             "Study major animal phyla",
             "Learn characteristics of each phylum"
           ],
           "duration_hours": 16
         },
         {
           "number": 5,
           "name": "Morphology of Flowering Plants",
           "topics": [
             "The Root",
             "The Stem",
             "The Leaf",
             "The Inflorescence",
             "The Flower",
             "The Fruit",
             "The Seed",
             "Semi-technical Description of a Typical Flowering Plant"
           ],
           "learning_objectives": [
             "Understand plant morphology",
             "Study different plant parts",
             "Learn technical descriptions"
           ],
           "duration_hours": 18
         },
         {
           "number": 6,
           "name": "Anatomy of Flowering Plants",
           "topics": [
             "The Tissues",
             "The Tissue System",
             "Anatomy of Dicotyledonous and Monocotyledonous Plants",
             "Secondary Growth"
           ],
           "learning_objectives": [
             "Understand plant tissue structure",
             "Study tissue systems",
             "Learn about secondary growth"
           ],
           "duration_hours": 14
         },
         {
           "number": 7,
           "name": "Structural Organisation in Animals",
           "topics": [
             "Animal Tissues",
             "Organ and Organ System",
             "Earthworm",
             "Cockroach",
             "Frog"
           ],
           "learning_objectives": [
             "Understand animal tissue organization",
             "Study organ systems",
             "Learn about specific animals"
           ],
           "duration_hours": 16
         },
         {
           "number": 8,
           "name": "Cell: The Unit of Life",
           "topics": [
             "What is a Cell?",
             "Cell Theory",
             "An Overview of Cell",
             "Prokaryotic Cells",
             "Eukaryotic Cells"
           ],
           "learning_objectives": [
             "Understand cell as basic unit of life",
             "Learn cell theory",
             "Study prokaryotic and eukaryotic cells"
           ],
           "duration_hours": 12
         },
         {
           "number": 9,
           "name": "Biomolecules",
           "topics": [
             "How to Analyse Chemical Composition?",
             "Primary and Secondary Metabolites",
             "Biomacromolecules",
             "Proteins",
             "Polysaccharides",
             "Nucleic Acids",
             "Structure of Proteins",
             "Nature of Bond Linking Monomers in a Polymer",
             "Dynamic State of Body Constituents",
             "Metabolic Basis for Living",
             "The Living State"
           ],
           "learning_objectives": [
             "Understand chemical composition of living matter",
             "Study biomacromolecules",
             "Learn about proteins, carbohydrates and nucleic acids"
           ],
           "duration_hours": 18
         },
         {
           "number": 10,
           "name": "Cell Cycle and Cell Division",
           "topics": [
             "Cell Cycle",
             "M Phase",
             "Significance of Mitosis",
             "Meiosis",
             "Significance of Meiosis"
           ],
           "learning_objectives": [
             "Understand cell cycle phases",
             "Study mitosis and meiosis",
             "Learn significance of cell division"
           ],
           "duration_hours": 14
         },
         {
           "number": 11,
           "name": "Transport in Plants",
           "topics": [
             "Means of Transport",
             "Plant-Water Relations",
             "Long Distance Transport of Water",
             "Transpiration",
             "Uptake and Transport of Mineral Nutrients",
             "Phloem Transport: Flow from Source to Sink"
           ],
           "learning_objectives": [
             "Understand plant transport mechanisms",
             "Study water and mineral transport",
             "Learn about transpiration and phloem transport"
           ],
           "duration_hours": 16
         },
         {
           "number": 12,
           "name": "Mineral Nutrition",
           "topics": [
             "Methods to Study the Mineral Requirements of Plants",
             "Essential Mineral Elements",
             "Mechanism of Absorption of Elements",
             "Translocation of Solutes",
             "Soil as Reservoir of Essential Elements",
             "Metabolism of Nitrogen"
           ],
           "learning_objectives": [
             "Understand plant mineral requirements",
             "Study essential elements",
             "Learn about absorption and translocation"
           ],
           "duration_hours": 14
         },
         {
           "number": 13,
           "name": "Photosynthesis in Higher Plants",
           "topics": [
             "What do we Know?",
             "Early Experiments",
             "Where does Photosynthesis take place?",
             "How many Types of Pigments are involved in Photosynthesis?",
             "What is Light Reaction?",
             "The Electron Transport",
             "Where are the ATP and NADPH Used?",
             "The C4 Pathway",
             "Photorespiration",
             "Factors affecting Photosynthesis"
           ],
           "learning_objectives": [
             "Understand photosynthesis process",
             "Study light and dark reactions",
             "Learn about C4 pathway and photorespiration"
           ],
           "duration_hours": 18
         },
         {
           "number": 14,
           "name": "Respiration in Plants",
           "topics": [
             "Do Plants Breathe?",
             "Glycolysis",
             "Fermentation",
             "Aerobic Respiration",
             "The Respiratory Balance Sheet",
             "Amphibolic Pathway",
             "Respiratory Quotient"
           ],
           "learning_objectives": [
             "Understand plant respiration",
             "Study glycolysis and fermentation",
             "Learn about aerobic respiration"
           ],
           "duration_hours": 16
         },
         {
           "number": 15,
           "name": "Plant Growth and Development",
           "topics": [
             "Growth",
             "Differentiation, Dedifferentiation and Redifferentiation",
             "Development",
             "Plant Growth Regulators",
             "Photoperiodism",
             "Vernalisation"
           ],
           "learning_objectives": [
             "Understand plant growth and development",
             "Study plant growth regulators",
             "Learn about photoperiodism and vernalisation"
           ],
           "duration_hours": 14
         },
         {
           "number": 16,
           "name": "Digestion and Absorption",
           "topics": [
             "Digestive System",
             "Digestion of Food",
             "Absorption of Digested Products",
             "Disorders of Digestive System"
           ],
           "learning_objectives": [
             "Understand digestive system structure",
             "Study food digestion process",
             "Learn about absorption and disorders"
           ],
           "duration_hours": 12
         },
         {
           "number": 17,
           "name": "Breathing and Exchange of Gases",
           "topics": [
             "Respiratory Organs",
             "Mechanism of Breathing",
             "Exchange of Gases",
             "Transport of Gases",
             "Regulation of Respiration",
             "Disorders of Respiratory System"
           ],
           "learning_objectives": [
             "Understand respiratory system",
             "Study breathing mechanism",
             "Learn about gas exchange and transport"
           ],
           "duration_hours": 14
         },
         {
           "number": 18,
           "name": "Body Fluids and Circulation",
           "topics": [
             "Blood",
             "Lymph (Tissue Fluid)",
             "Circulatory Pathways",
             "Double Circulation",
             "Regulation of Cardiac Activity",
             "Disorders of Circulatory System"
           ],
           "learning_objectives": [
             "Understand blood and lymph",
             "Study circulatory pathways",
             "Learn about cardiac regulation"
           ],
           "duration_hours": 16
         },
         {
           "number": 19,
           "name": "Excretory Products and their Elimination",
           "topics": [
             "Human Excretory System",
             "Urine Formation",
             "Function of the Tubules",
             "Mechanism of Concentration of the Filtrate",
             "Regulation of Kidney Function",
             "Micturition",
             "Role of other Organs in Excretion",
             "Disorders of the Excretory System"
           ],
           "learning_objectives": [
             "Understand excretory system",
             "Study urine formation",
             "Learn about kidney function regulation"
           ],
           "duration_hours": 14
         },
         {
           "number": 20,
           "name": "Locomotion and Movement",
           "topics": [
             "Types of Movement",
             "Muscle",
             "Skeletal System",
             "Joints",
             "Disorders of Muscular and Skeletal System"
           ],
           "learning_objectives": [
             "Understand types of movement",
             "Study muscle and skeletal system",
             "Learn about joints and disorders"
           ],
           "duration_hours": 12
         },
         {
           "number": 21,
           "name": "Neural Control and Coordination",
           "topics": [
             "Neural System",
             "Human Neural System",
             "Neural Coordination",
             "Reflex Action and Reflex Arc",
             "Sensory Reception and Processing"
           ],
           "learning_objectives": [
             "Understand neural system",
             "Study human neural system",
             "Learn about neural coordination"
           ],
           "duration_hours": 16
         },
         {
           "number": 22,
           "name": "Chemical Coordination and Integration",
           "topics": [
             "Endocrine Glands and Hormones",
             "Human Endocrine System",
             "Hormones of Heart, Kidney and Gastrointestinal Tract",
             "Mechanism of Hormone Action"
           ],
           "learning_objectives": [
             "Understand endocrine system",
             "Study human endocrine glands",
             "Learn about hormone action mechanisms"
           ],
           "duration_hours": 14
         }
       ]
     },
     {
       "name": "Mathematics",
       "chapters": [
         {
           "number": 1,
           "name": "Sets",
           "topics": [
             "Sets and their Representations",
             "The Empty Set",
             "Finite and Infinite Sets",
             "Equal Sets",
             "Subsets",
             "Power Set",
             "Universal Set",
             "Venn Diagrams",
             "Operations on Sets",
             "Complement of a Set",
             "Practical Problems on Union and Intersection of Two Sets"
           ],
           "learning_objectives": [
             "Understand sets and their representations",
             "Learn about different types of sets",
             "Master set operations and Venn diagrams",
             "Solve practical problems using sets"
           ],
           "duration_hours": 16
         },
         {
           "number": 2,
           "name": "Relations and Functions",
           "topics": [
             "Cartesian Product of Sets",
             "Relations",
             "Functions",
             "Some Functions and their Graphs",
             "Algebra of Real Functions"
           ],
           "learning_objectives": [
             "Understand Cartesian product of sets",
             "Learn about relations and functions",
             "Study function graphs and algebra"
           ],
           "duration_hours": 18
         },
         {
           "number": 3,
           "name": "Trigonometric Functions",
           "topics": [
             "Angles",
             "Degree Measure",
             "Radian Measure",
             "Relation between Degree and Radian",
             "Notation for Angles",
             "Trigonometric Functions",
             "Sign of Trigonometric Functions",
             "Domain and Range of Trigonometric Functions",
             "Trigonometric Functions of Sum and Difference of Two Angles",
             "Trigonometric Equations"
           ],
           "learning_objectives": [
             "Understand angle measurement systems",
             "Learn trigonometric functions",
             "Master trigonometric identities and equations"
           ],
           "duration_hours": 20
         },
         {
           "number": 4,
           "name": "Complex Numbers and Quadratic Equations",
           "topics": [
             "Complex Numbers",
             "Algebra of Complex Numbers",
             "The Modulus and the Conjugate of a Complex Number",
             "Argand Plane and Polar Representation",
             "Quadratic Equations",
             "Nature of Roots"
           ],
           "learning_objectives": [
             "Understand complex numbers",
             "Learn complex number algebra",
             "Study quadratic equations and roots"
           ],
           "duration_hours": 16
         },
         {
           "number": 5,
           "name": "Linear Inequalities",
           "topics": [
             "Linear Inequalities",
             "Algebraic Solutions of Linear Inequalities in One Variable and their Graphical Representation",
             "Graphical Solution of Linear Inequalities in Two Variables",
             "Solution of System of Linear Inequalities in Two Variables"
           ],
           "learning_objectives": [
             "Understand linear inequalities",
             "Learn algebraic and graphical solutions",
             "Solve systems of linear inequalities"
           ],
           "duration_hours": 14
         },
         {
           "number": 6,
           "name": "Permutations and Combinations",
           "topics": [
             "Fundamental Principle of Counting",
             "Factorial n",
             "Permutations",
             "Combinations"
           ],
           "learning_objectives": [
             "Understand fundamental counting principle",
             "Learn about permutations and combinations",
             "Apply counting principles to solve problems"
           ],
           "duration_hours": 12
         },
         {
           "number": 7,
           "name": "Binomial Theorem",
           "topics": [
             "Binomial Theorem for Positive Integral Indices",
             "General and Middle Terms"
           ],
           "learning_objectives": [
             "Understand binomial theorem",
             "Learn to find general and middle terms"
           ],
           "duration_hours": 10
         },
         {
           "number": 8,
           "name": "Sequences and Series",
           "topics": [
             "Sequences",
             "Series",
             "Arithmetic Progression (A.P.)",
             "Geometric Progression (G.P.)",
             "Relationship Between A.M. and G.M.",
             "Sum to n Terms of Special Series"
           ],
           "learning_objectives": [
             "Understand sequences and series",
             "Study arithmetic and geometric progressions",
             "Learn about special series"
           ],
           "duration_hours": 18
         },
         {
           "number": 9,
           "name": "Straight Lines",
           "topics": [
             "Slope of a Line",
             "Various Forms of the Equation of a Line",
             "General Equation of a Line",
             "Distance of a Point From a Line"
           ],
           "learning_objectives": [
             "Understand slope of a line",
             "Learn different forms of line equations",
             "Calculate distance from point to line"
           ],
           "duration_hours": 16
         },
         {
           "number": 10,
           "name": "Conic Sections",
           "topics": [
             "Sections of a Cone",
             "Circle",
             "Parabola",
             "Ellipse",
             "Hyperbola"
           ],
           "learning_objectives": [
             "Understand conic sections",
             "Study circle, parabola, ellipse and hyperbola",
             "Learn their properties and equations"
           ],
           "duration_hours": 20
         },
         {
           "number": 11,
           "name": "Introduction to Three Dimensional Geometry",
           "topics": [
             "Coordinate Axes and Coordinate Planes in Three Dimensional Space",
             "Coordinates of a Point in Space",
             "Distance between Two Points",
             "Section Formula"
           ],
           "learning_objectives": [
             "Understand 3D coordinate system",
             "Learn to find coordinates and distances",
             "Apply section formula in 3D"
           ],
           "duration_hours": 14
         },
         {
           "number": 12,
           "name": "Limits and Derivatives",
           "topics": [
             "Intuitive Idea of Derivatives",
             "Limits",
             "Limits of Trigonometric Functions",
             "Derivatives",
             "Algebra of Derivatives of Functions",
             "Derivatives of Composite Functions",
             "Derivatives of Implicit Functions",
             "Derivatives of Inverse Trigonometric Functions",
             "Exponential and Logarithmic Functions",
             "Logarithmic Differentiation",
             "Derivatives of Functions in Parametric Forms",
             "Second Order Derivative"
           ],
           "learning_objectives": [
             "Understand intuitive idea of derivatives",
             "Learn limits and their properties",
             "Master derivative rules and techniques"
           ],
           "duration_hours": 24
         },
         {
           "number": 13,
           "name": "Mathematical Reasoning",
           "topics": [
             "Statements",
             "New Statements from Old",
             "Special Words/Phrases",
             "Validating Statements",
             "Conjectures"
           ],
           "learning_objectives": [
             "Understand mathematical statements",
             "Learn logical reasoning",
             "Validate statements and make conjectures"
           ],
           "duration_hours": 12
         },
         {
           "number": 14,
           "name": "Statistics",
           "topics": [
             "Measures of Dispersion",
             "Range",
             "Mean Deviation",
             "Variance and Standard Deviation",
             "Analysis of Frequency Distributions"
           ],
           "learning_objectives": [
             "Understand measures of dispersion",
             "Learn to calculate variance and standard deviation",
             "Analyze frequency distributions"
           ],
           "duration_hours": 14
         },
         {
           "number": 15,
           "name": "Probability",
           "topics": [
             "Random Experiments",
             "Events",
             "Axiomatic Approach to Probability"
           ],
           "learning_objectives": [
             "Understand random experiments",
             "Learn about events and probability",
             "Apply axiomatic approach to probability"
           ],
           "duration_hours": 12
         },
         {
           "number": 16,
           "name": "Mathematical Modelling",
           "topics": [
             "Introduction",
             "Why Mathematical Modelling?",
             "Principles of Mathematical Modelling",
             "Flow Chart",
             "Types of Mathematical Models",
             "Construction of Mathematical Models"
           ],
           "learning_objectives": [
             "Understand mathematical modelling",
             "Learn principles and types of models",
             "Construct mathematical models"
           ],
           "duration_hours": 10
         }
       ]
     },
     {
       "name": "Computer Science",
       "chapters": [
         {
           "number": 1,
           "name": "Computer System",
           "topics": [
             "Introduction to Computer System",
             "Evolution of Computer",
             "Computer Memory",
             "Data Transfer between Memory and CPU",
             "Data Transfer between I/O devices and CPU",
             "Inside the CPU"
           ],
           "learning_objectives": [
             "Understand computer system architecture",
             "Learn about computer evolution",
             "Study memory and data transfer mechanisms",
             "Explore CPU internal structure"
           ],
           "duration_hours": 12
         },
         {
           "number": 2,
           "name": "Encoding Schemes and Number System",
           "topics": [
             "Introduction to Number System",
             "Decimal Number System",
             "Binary Number System",
             "Octal Number System",
             "Hexadecimal Number System",
             "Conversion between Number Systems",
             "Binary Arithmetic",
             "Signed and Unsigned Numbers",
             "Binary Fractions",
             "ASCII",
             "ISCII",
             "Unicode"
           ],
           "learning_objectives": [
             "Understand different number systems",
             "Learn number system conversions",
             "Master binary arithmetic",
             "Study encoding schemes"
           ],
           "duration_hours": 18
         },
         {
           "number": 3,
           "name": "Emerging Trends",
           "topics": [
             "Artificial Intelligence (AI)",
             "Machine Learning",
             "Natural Language Processing (NLP)",
             "Immersion",
             "Robotics",
             "Big Data",
             "Internet of Things (IoT)",
             "Cloud Computing (SaaS, PaaS, IaaS)",
             "Grid Computing",
             "Blockchain Technology"
           ],
           "learning_objectives": [
             "Understand emerging technologies",
             "Learn about AI and machine learning",
             "Study IoT and cloud computing",
             "Explore blockchain technology"
           ],
           "duration_hours": 16
         },
         {
           "number": 4,
           "name": "Introduction to Problem Solving",
           "topics": [
             "Problem Solving",
             "Problem Solving Cycle",
             "Problem Analysis",
             "Algorithm Development",
             "Flowchart",
             "Pseudocode",
             "Program Design",
             "Program Implementation",
             "Program Testing and Debugging",
             "Documentation"
           ],
           "learning_objectives": [
             "Understand problem solving cycle",
             "Learn algorithm development",
             "Master flowchart and pseudocode",
             "Study program design and testing"
           ],
           "duration_hours": 20
         },
         {
           "number": 5,
           "name": "Getting Started with Python",
           "topics": [
             "Introduction to Python",
             "Python Keywords",
             "Identifiers",
             "Variables",
             "Constants",
             "Literals",
             "Operators",
             "Operator Precedence",
             "Expressions",
             "Statement",
             "Input and Output",
             "Debugging"
           ],
           "learning_objectives": [
             "Understand Python basics",
             "Learn Python keywords and identifiers",
             "Master operators and expressions",
             "Study input/output and debugging"
           ],
           "duration_hours": 16
         },
         {
           "number": 6,
           "name": "Python Fundamentals",
           "topics": [
             "Data Types",
             "Variables",
             "Operators",
             "Expressions",
             "Input and Output",
             "Debugging",
             "Type Conversion",
             "Comments"
           ],
           "learning_objectives": [
             "Understand Python data types",
             "Learn variable declaration and usage",
             "Master operators and expressions",
             "Study input/output operations"
           ],
           "duration_hours": 14
         },
         {
           "number": 7,
           "name": "Data Handling",
           "topics": [
             "Data Types",
             "Variables",
             "Constants",
             "Literals",
             "Operators",
             "Operator Precedence",
             "Expressions",
             "Statement",
             "Input and Output",
             "Debugging"
           ],
           "learning_objectives": [
             "Understand data handling concepts",
             "Learn about data types and variables",
             "Master operators and expressions",
             "Study input/output operations"
           ],
           "duration_hours": 16
         },
         {
           "number": 8,
           "name": "Flow of Control",
           "topics": [
             "Selection",
             "if Statement",
             "if-else Statement",
             "if-elif-else Statement",
             "Nested if Statement",
             "Repetition",
             "for Loop",
             "while Loop",
             "Nested Loops",
             "Jump Statements",
             "break Statement",
             "continue Statement",
             "pass Statement"
           ],
           "learning_objectives": [
             "Understand control flow structures",
             "Learn selection statements",
             "Master loop structures",
             "Study jump statements"
           ],
           "duration_hours": 18
         },
         {
           "number": 9,
           "name": "Functions",
           "topics": [
             "Introduction to Functions",
             "Function Definition",
             "Function Call",
             "Function Parameters",
             "Function Arguments",
             "Default Arguments",
             "Keyword Arguments",
             "Variable Length Arguments",
             "Return Statement",
             "Scope of Variables",
             "Local Variables",
             "Global Variables",
             "Lambda Functions"
           ],
           "learning_objectives": [
             "Understand function concepts",
             "Learn function definition and calling",
             "Master different types of arguments",
             "Study variable scope and lambda functions"
           ],
           "duration_hours": 20
         },
         {
           "number": 10,
           "name": "String Manipulation",
           "topics": [
             "String",
             "String Operations",
             "String Methods",
             "String Slicing",
             "String Formatting",
             "Escape Sequences"
           ],
           "learning_objectives": [
             "Understand string concepts",
             "Learn string operations and methods",
             "Master string slicing and formatting",
             "Study escape sequences"
           ],
           "duration_hours": 14
         },
         {
           "number": 11,
           "name": "List Manipulation",
           "topics": [
             "List",
             "List Operations",
             "List Methods",
             "List Slicing",
             "List Comprehension",
             "Nested Lists"
           ],
           "learning_objectives": [
             "Understand list concepts",
             "Learn list operations and methods",
             "Master list slicing and comprehension",
             "Study nested lists"
           ],
           "duration_hours": 16
         },
         {
           "number": 12,
           "name": "Tuples and Dictionaries",
           "topics": [
             "Tuples",
             "Tuple Operations",
             "Tuple Methods",
             "Tuple Slicing",
             "Dictionaries",
             "Dictionary Operations",
             "Dictionary Methods",
             "Dictionary Comprehension"
           ],
           "learning_objectives": [
             "Understand tuples and dictionaries",
             "Learn their operations and methods",
             "Master slicing and comprehension",
             "Study practical applications"
           ],
           "duration_hours": 16
         },
         {
           "number": 13,
           "name": "Exception Handling",
           "topics": [
             "Exception",
             "Exception Handling",
             "try-except Statement",
             "try-except-else Statement",
             "try-except-finally Statement",
             "Raising Exceptions",
             "User-defined Exceptions"
           ],
           "learning_objectives": [
             "Understand exception concepts",
             "Learn exception handling mechanisms",
             "Master different try-except structures",
             "Study user-defined exceptions"
           ],
           "duration_hours": 14
         },
         {
           "number": 14,
           "name": "File Handling",
           "topics": [
             "File",
             "File Operations",
             "Opening a File",
             "Reading from a File",
             "Writing to a File",
             "Closing a File",
             "File Modes",
             "File Methods",
             "File Attributes"
           ],
           "learning_objectives": [
             "Understand file handling concepts",
             "Learn file operations",
             "Master reading and writing files",
             "Study file modes and methods"
           ],
           "duration_hours": 16
         },
         {
           "number": 15,
           "name": "Recursion",
           "topics": [
             "Recursion",
             "Recursive Functions",
             "Base Case",
             "Recursive Case",
             "Recursion vs Iteration",
             "Examples of Recursion"
           ],
           "learning_objectives": [
             "Understand recursion concepts",
             "Learn recursive function design",
             "Master base and recursive cases",
             "Compare recursion with iteration"
           ],
           "duration_hours": 12
         },
         {
           "number": 16,
           "name": "Data Structures",
           "topics": [
             "Introduction to Data Structures",
             "Linear Data Structures",
             "Non-linear Data Structures",
             "Stack",
             "Queue",
             "Linked List",
             "Tree",
             "Graph"
           ],
           "learning_objectives": [
             "Understand data structure concepts",
             "Learn linear and non-linear structures",
             "Study stack, queue, and linked list",
             "Explore tree and graph structures"
           ],
           "duration_hours": 18
         },
         {
           "number": 17,
           "name": "Computer Networks",
           "topics": [
             "Introduction to Computer Networks",
             "Evolution of Networking",
             "Types of Networks",
             "Network Topologies",
             "Network Devices",
             "Network Protocols",
             "Internet",
             "World Wide Web",
             "Web Browsers",
             "Web Servers",
             "URL",
             "DNS",
             "HTTP",
             "HTTPS"
           ],
           "learning_objectives": [
             "Understand computer network concepts",
             "Learn network types and topologies",
             "Study network protocols and devices",
             "Explore internet and web technologies"
           ],
           "duration_hours": 20
         }
       ]
     }
   ]
 };

async function uploadSyllabus() {
  try {
    console.log('🚀 Starting 1st PUC syllabus upload...');
    
    // Clear existing 1st PUC syllabus
    await pool.query('DELETE FROM syllabus WHERE class = $1', ['11th Grade (1st PUC)']);
    console.log('✅ Cleared existing 1st PUC syllabus');
    
    let totalChapters = 0;
    
    // Upload each subject and its chapters
    for (const subject of syllabusData.subjects) {
      console.log(`📚 Uploading ${subject.name}...`);
      
      for (const chapter of subject.chapters) {
        const query = `
          INSERT INTO syllabus (class, subject, chapter_name, chapter_number, topics, learning_objectives, duration_hours)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        
        const values = [
          syllabusData.class,
          subject.name,
          chapter.name,
          chapter.number,
          JSON.stringify(chapter.topics),
          JSON.stringify(chapter.learning_objectives),
          chapter.duration_hours
        ];
        
        await pool.query(query, values);
        totalChapters++;
      }
      
      console.log(`✅ ${subject.name} uploaded successfully`);
    }
    
    console.log(`🎉 1st PUC syllabus upload completed!`);
    console.log(`📊 Total subjects: ${syllabusData.subjects.length}`);
    console.log(`📊 Total chapters: ${totalChapters}`);
    
  } catch (error) {
    console.error('❌ Error uploading syllabus:', error);
  } finally {
    await pool.end();
  }
}

uploadSyllabus();
