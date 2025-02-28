// prisma/seed-data/actions.ts


export type ActionItem = {
  name: string;
  description: string;
  impactScale: number;
};

type SubCategory = {
  name: string;
  description: string;
  key: string;
  actions: ActionItem[];
};

type ActionParentCategory = {
  name: string;
  description: string;
  key?: string; // Optional in case some parent categories don't have keys set
  subcategories: SubCategory[];
};


export const actionParentCategories:ActionParentCategory[] = [
  {
    name: "General",
    description: "General activities and behaviors applicable across all roles",
    subcategories: [
      {
        name: "Cultural Behaviours & Values",
        description: "Activities related to company culture and values",
        key: "cultural-behaviours",
        actions: [
          {
            name: "Embraced transparency",
            description: "Embraced transparency and honesty in all interactions.",
            impactScale: 4
          },
          {
            name: "Valued diversity",
            description: "Valued diversity by promoting inclusive and equitable practices.",
            impactScale: 4
          },
          {
            name: "Modeled respect",
            description: "Modeled respect and kindness toward all colleagues.",
            impactScale: 3
          },
          {
            name: "Practiced empathy",
            description: "Practiced empathy and actively listened to different perspectives.",
            impactScale: 4
          },
          {
            name: "Encouraged open dialogue",
            description: "Encouraged open dialogue and constructive feedback.",
            impactScale: 3
          },
          {
            name: "Demonstrated growth mindset",
            description: "Demonstrated a growth mindset and willingness to learn.",
            impactScale: 4
          },
          {
            name: "Took responsibility",
            description: "Took responsibility for mistakes and learned from them.",
            impactScale: 4
          },
          {
            name: "Supported work-life balance",
            description: "Supported work-life balance and mental well-being.",
            impactScale: 3
          },
          {
            name: "Celebrated successes",
            description: "Celebrated successes and shared credit within the team.",
            impactScale: 3
          },
          {
            name: "Aligned with values",
            description: "Aligned personal actions with core organizational values.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Customer Centricity",
        description: "Focusing on customer needs and experience",
        key: "customer-centricity",
        actions: [
          {
            name: "Customer advocacy",
            description: "Regularly advocated for customer interests in cross-functional meetings and decision-making.",
            impactScale: 5
          },
          {
            name: "Journey mapping",
            description: "Analyzed customer journey maps to propose improvements in internal processes and policies.",
            impactScale: 4
          },
          {
            name: "Empathy sessions",
            description: "Facilitated empathy sessions, sharing real customer stories to align teams on user needs.",
            impactScale: 4
          },
          {
            name: "User pain resolution",
            description: "Influenced product or service updates by translating user pain points into actionable suggestions.",
            impactScale: 5
          },
          {
            name: "Feedback loop",
            description: "Encouraged a transparent feedback loop, ensuring customers felt heard and valued.",
            impactScale: 4
          },
          {
            name: "End-user accountability",
            description: "Promoted a culture of accountability for any impact on the end-user experience.",
            impactScale: 4
          },
          {
            name: "Trend identification",
            description: "Identified emerging trends and forecasted evolving customer expectations.",
            impactScale: 4
          },
          {
            name: "Friction elimination",
            description: "Collaborated with multiple teams to eliminate friction points throughout the customer lifecycle.",
            impactScale: 5
          },
          {
            name: "Operational improvements",
            description: "Led discussions on how operational changes could enhance customer satisfaction.",
            impactScale: 4
          },
          {
            name: "Impact tracking",
            description: "Tracked and communicated the tangible impact of customer-centric initiatives to the organization.",
            impactScale: 3
          }
        ]
      },
      {
        name: "Teamwork",
        description: "Collaboration and effective team participation",
        key: "teamwork",
        actions: [
          {
            name: "Active participation",
            description: "Actively participated in group tasks to reach shared goals.",
            impactScale: 3
          },
          {
            name: "Open communication",
            description: "Communicated openly to prevent misunderstandings or delays.",
            impactScale: 4
          },
          {
            name: "Solution contribution",
            description: "Contributed ideas and solutions during team problem-solving sessions.",
            impactScale: 4
          },
          {
            name: "Feedback integration",
            description: "Respected diverse viewpoints and integrated feedback effectively.",
            impactScale: 3
          },
          {
            name: "Equal participation",
            description: "Encouraged equal participation and recognized every member's input.",
            impactScale: 3
          },
          {
            name: "Adaptability",
            description: "Stayed flexible when adapting to shifting team priorities.",
            impactScale: 4
          },
          {
            name: "Team support",
            description: "Supported teammates by offering help when workloads were high.",
            impactScale: 4
          },
          {
            name: "Trust building",
            description: "Focused on trust-building to create a productive team environment.",
            impactScale: 4
          },
          {
            name: "Collective problem-solving",
            description: "Addressed challenges collectively rather than assigning blame.",
            impactScale: 4
          },
          {
            name: "Recognition",
            description: "Celebrated team achievements and highlighted individual contributions.",
            impactScale: 3
          }
        ]
      }
    ]
  },
  {
    name: "Core",
    description: "Core functional activities specific to different departments",
    subcategories: [
      {
        name: "Leadership",
        description: "Activities related to leadership and guiding teams",
        key: "leadership",
        actions: [
          {
            name: "Vision communication",
            description: "Defined a clear vision and communicated it consistently.",
            impactScale: 5
          },
          {
            name: "Ethical decision-making",
            description: "Demonstrated accountability and ethical decision-making.",
            impactScale: 5
          },
          {
            name: "Team empowerment",
            description: "Empowered teams through delegation and encouraging ownership.",
            impactScale: 4
          },
          {
            name: "Mentorship",
            description: "Facilitated career growth via mentorship and development.",
            impactScale: 4
          },
          {
            name: "Proactive leadership",
            description: "Addressed challenges proactively and fostered resilience.",
            impactScale: 4
          },
          {
            name: "Trust building",
            description: "Built trust through open, honest communication and empathy.",
            impactScale: 4
          },
          {
            name: "Values champion",
            description: "Championed organizational values and inclusivity initiatives.",
            impactScale: 4
          },
          {
            name: "Achievement recognition",
            description: "Recognized and celebrated individual and team achievements.",
            impactScale: 3
          },
          {
            name: "Cross-functional alignment",
            description: "Aligned cross-functional objectives to drive success.",
            impactScale: 5
          },
          {
            name: "Leading by example",
            description: "Led by example, modeling integrity and professionalism.",
            impactScale: 5
          }
        ]
      },
      {
        name: "Team Management",
        description: "Activities focused on managing team performance and development",
        key: "team-management",
        actions: [
          {
            name: "Goal definition",
            description: "Clearly defined team goals, responsibilities, and performance standards.",
            impactScale: 5
          },
          {
            name: "One-on-one meetings",
            description: "Held regular one-on-one meetings for individual progress updates.",
            impactScale: 4
          },
          {
            name: "Culture fostering",
            description: "Fostered a culture of trust, transparency, and accountability.",
            impactScale: 4
          },
          {
            name: "Professional development",
            description: "Encouraged professional development and growth opportunities.",
            impactScale: 4
          },
          {
            name: "Workload management",
            description: "Used data-driven methods to allocate tasks and manage workloads.",
            impactScale: 4
          },
          {
            name: "Conflict resolution",
            description: "Resolved conflicts constructively to maintain team cohesion.",
            impactScale: 4
          },
          {
            name: "Achievement recognition",
            description: "Celebrated team milestones and recognized achievements.",
            impactScale: 3
          },
          {
            name: "Communication coaching",
            description: "Coached team members on effective communication skills.",
            impactScale: 3
          },
          {
            name: "Performance improvement",
            description: "Implemented performance improvement plans when necessary.",
            impactScale: 4
          },
          {
            name: "Organizational alignment",
            description: "Ensured alignment of team objectives with broader organizational goals.",
            impactScale: 5
          }
        ]
      },
      {
        name: "Engineering",
        description: "Activities related to software engineering and development",
        key: "engineering",
        actions: [
          {
            name: "Code quality",
            description: "Developed reliable, high-quality code following best practices and coding standards.",
            impactScale: 4
          },
          {
            name: "Code reviews",
            description: "Performed thorough code reviews to enhance code quality and ensure standards compliance.",
            impactScale: 4
          },
          {
            name: "Technical troubleshooting",
            description: "Troubleshot and resolved complex technical issues with minimal downtime.",
            impactScale: 5
          },
          {
            name: "System optimization",
            description: "Optimized system performance through refactoring and resource management.",
            impactScale: 5
          },
          {
            name: "Architecture contribution",
            description: "Contributed to architecture decisions and design considerations.",
            impactScale: 5
          },
          {
            name: "Automated testing",
            description: "Implemented automated testing to ensure robust and maintainable features.",
            impactScale: 4
          },
          {
            name: "Requirements clarification",
            description: "Clarified requirements based on product specifications to meet user needs.",
            impactScale: 3
          },
          {
            name: "Documentation",
            description: "Ensured technical documentation was up to date for maintainability.",
            impactScale: 3
          },
          {
            name: "CI/CD maintenance",
            description: "Maintained and improved CI/CD pipelines for streamlined deployments.",
            impactScale: 4
          },
          {
            name: "Security maintenance",
            description: "Ensured security and data integrity through regular assessments and patches.",
            impactScale: 5
          }
        ]
      },
      {
        name: "Product",
        description: "Activities related to product management and development",
        key: "product",
        actions: [
          {
            name: "Market research",
            description: "Conducted market research to validate product ideas and prioritize features.",
            impactScale: 4
          },
          {
            name: "Requirements definition",
            description: "Defined clear product requirements based on input from design and engineering.",
            impactScale: 5
          },
          {
            name: "Roadmap development",
            description: "Developed and maintained a product roadmap to meet company objectives.",
            impactScale: 5
          },
          {
            name: "Customer feedback",
            description: "Gathered customer feedback through interviews, surveys, and usage analytics.",
            impactScale: 4
          },
          {
            name: "User insights translation",
            description: "Translated user insights into actionable features and enhancements.",
            impactScale: 5
          },
          {
            name: "Product communication",
            description: "Communicated product vision and updates to stakeholders regularly.",
            impactScale: 4
          },
          {
            name: "Data-driven iteration",
            description: "Used data-driven metrics to measure product success and iterate quickly.",
            impactScale: 4
          },
          {
            name: "Priority management",
            description: "Balanced competing priorities by managing scope and trade-offs.",
            impactScale: 4
          },
          {
            name: "Product positioning",
            description: "Positioned the product to satisfy both business strategy and user needs.",
            impactScale: 5
          },
          {
            name: "Feature launch",
            description: "Launched new features, monitored adoption, and iterated based on feedback.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Design & UX",
        description: "Activities related to design and user experience",
        key: "design",
        actions: [
          {
            name: "User-centered design",
            description: "Created intuitive, user-centered interfaces in accordance with brand guidelines.",
            impactScale: 5
          },
          {
            name: "User research",
            description: "Conducted user research to inform design decisions and validate solutions.",
            impactScale: 4
          },
          {
            name: "Prototype development",
            description: "Developed wireframes, prototypes, and high-fidelity mockups.",
            impactScale: 4
          },
          {
            name: "Visual consistency",
            description: "Ensured visual consistency and usability across digital products.",
            impactScale: 4
          },
          {
            name: "Stakeholder liaison",
            description: "Liaised with stakeholders to refine design requirements and constraints.",
            impactScale: 3
          },
          {
            name: "Accessibility compliance",
            description: "Applied accessibility standards (e.g., WCAG) for inclusive experiences.",
            impactScale: 4
          },
          {
            name: "Design iteration",
            description: "Iterated on designs based on user testing and feedback.",
            impactScale: 4
          },
          {
            name: "Design system",
            description: "Maintained a cohesive design system to streamline development handoffs.",
            impactScale: 5
          },
          {
            name: "Design presentation",
            description: "Presented design concepts to relevant stakeholders for feedback.",
            impactScale: 3
          },
          {
            name: "Design improvements",
            description: "Monitored product metrics to identify design improvement opportunities.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Marketing",
        description: "Activities related to marketing and brand promotion",
        key: "marketing",
        actions: [
          {
            name: "Campaign execution",
            description: "Planned and executed multi-channel campaigns to drive brand awareness.",
            impactScale: 5
          },
          {
            name: "Market segmentation",
            description: "Conducted market segmentation to refine messaging and targeting.",
            impactScale: 4
          },
          {
            name: "Performance analysis",
            description: "Analyzed campaign performance metrics and optimized for ROI.",
            impactScale: 4
          },
          {
            name: "Creative management",
            description: "Managed creative resources to produce high-quality marketing assets.",
            impactScale: 4
          },
          {
            name: "Content calendar",
            description: "Maintained an editorial calendar for consistent content output.",
            impactScale: 3
          },
          {
            name: "Lead nurturing",
            description: "Nurtured leads through email automation and targeted messaging.",
            impactScale: 4
          },
          {
            name: "A/B testing",
            description: "Conducted A/B testing to refine ad creatives and landing pages.",
            impactScale: 4
          },
          {
            name: "Strategic partnerships",
            description: "Built strategic partnerships and co-marketing opportunities.",
            impactScale: 5
          },
          {
            name: "Sales coordination",
            description: "Coordinated with sales for effective lead management and follow-up.",
            impactScale: 4
          },
          {
            name: "Social monitoring",
            description: "Monitored social sentiment and implemented feedback-driven changes.",
            impactScale: 3
          }
        ]
      },
      {
        name: "Data & Analytics",
        description: "Activities related to data analysis and insights",
        key: "data-analytics",
        actions: [
          {
            name: "Data preparation",
            description: "Gathered, cleaned, and transformed data sets for insightful analyses.",
            impactScale: 4
          },
          {
            name: "Dashboard creation",
            description: "Built dashboards and reports to track key performance metrics.",
            impactScale: 4
          },
          {
            name: "Statistical analysis",
            description: "Utilized statistical methods to identify trends and forecast outcomes.",
            impactScale: 5
          },
          {
            name: "A/B test analysis",
            description: "Conducted A/B tests and interpreted results for product decisions.",
            impactScale: 4
          },
          {
            name: "KPI tracking",
            description: "Defined and tracked actionable KPIs for business objectives.",
            impactScale: 5
          },
          {
            name: "Data validation",
            description: "Ensured data integrity through rigorous validation processes.",
            impactScale: 4
          },
          {
            name: "Predictive modeling",
            description: "Leveraged predictive modeling and ML for strategic insights.",
            impactScale: 5
          },
          {
            name: "Self-service analytics",
            description: "Created self-service analytics solutions for stakeholders.",
            impactScale: 4
          },
          {
            name: "Anomaly investigation",
            description: "Investigated data anomalies and implemented corrective actions.",
            impactScale: 4
          },
          {
            name: "Compliance maintenance",
            description: "Maintained compliance with data privacy regulations.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Customer Success & Support",
        description: "Activities related to customer success and support",
        key: "customer-success",
        actions: [
          {
            name: "Customer onboarding",
            description: "Delivered comprehensive onboarding experiences for new customers.",
            impactScale: 5
          },
          {
            name: "Relationship maintenance",
            description: "Maintained relationships through regular check-ins and health reviews.",
            impactScale: 4
          },
          {
            name: "Support resolution",
            description: "Provided quick solutions to inquiries via multiple support channels.",
            impactScale: 4
          },
          {
            name: "Feedback capture",
            description: "Captured customer feedback and relayed it to product teams.",
            impactScale: 4
          },
          {
            name: "Upsell identification",
            description: "Identified upsell opportunities by understanding customer goals.",
            impactScale: 5
          },
          {
            name: "Self-service resources",
            description: "Created and updated self-service resources (FAQs, tutorials).",
            impactScale: 3
          },
          {
            name: "Usage monitoring",
            description: "Monitored usage metrics to preempt churn risks.",
            impactScale: 4
          },
          {
            name: "Issue escalation",
            description: "Escalated complex challenges to relevant departments for swift resolution.",
            impactScale: 4
          },
          {
            name: "Best practices guidance",
            description: "Guided customers on best practices for maximum product value.",
            impactScale: 4
          },
          {
            name: "Satisfaction measurement",
            description: "Measured satisfaction (NPS, CSAT) and drove retention improvements.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Finance",
        description: "Activities related to financial management",
        key: "finance",
        actions: [
          {
            name: "Financial operations",
            description: "Managed billing, invoicing, and collections for timely cash flow.",
            impactScale: 4
          },
          {
            name: "Financial reporting",
            description: "Prepared monthly and annual financial statements and reports.",
            impactScale: 4
          },
          {
            name: "Spending analysis",
            description: "Analyzed spending trends to support cost optimization and budgeting.",
            impactScale: 4
          },
          {
            name: "Regulatory compliance",
            description: "Ensured compliance with accounting standards and regulations.",
            impactScale: 5
          },
          {
            name: "Payroll management",
            description: "Oversaw payroll and benefits administration in coordination with HR.",
            impactScale: 4
          },
          {
            name: "Financial forecasting",
            description: "Maintained accurate forecasting models for revenue and expenses.",
            impactScale: 5
          },
          {
            name: "Audit management",
            description: "Conducted audits to identify and mitigate financial risks.",
            impactScale: 5
          },
          {
            name: "External relations",
            description: "Liaised with external stakeholders like banks and auditors.",
            impactScale: 4
          },
          {
            name: "Financial controls",
            description: "Established financial controls to prevent fraud or misuse.",
            impactScale: 5
          },
          {
            name: "Strategic alignment",
            description: "Aligned financial strategies with overall business objectives.",
            impactScale: 5
          }
        ]
      },
      {
        name: "Legal",
        description: "Activities related to legal and compliance matters",
        key: "legal",
        actions: [
          {
            name: "Contract management",
            description: "Drafted and reviewed contracts, NDAs, and service-level agreements.",
            impactScale: 5
          },
          {
            name: "Regulatory guidance",
            description: "Provided counsel on regulatory compliance and risk management.",
            impactScale: 5
          },
          {
            name: "IP management",
            description: "Managed intellectual property filings and trademark registrations.",
            impactScale: 5
          },
          {
            name: "Legal research",
            description: "Conducted legal research to guide strategic decisions.",
            impactScale: 4
          },
          {
            name: "Privacy compliance",
            description: "Advised on privacy and data protection laws (GDPR, CCPA).",
            impactScale: 5
          },
          {
            name: "Corporate governance",
            description: "Enforced corporate governance policies and ensured alignment.",
            impactScale: 4
          },
          {
            name: "Risk mitigation",
            description: "Oversaw risk mitigation efforts across relevant departments.",
            impactScale: 5
          },
          {
            name: "Dispute handling",
            description: "Handled disputes, negotiations, and settlements with external parties.",
            impactScale: 5
          },
          {
            name: "Documentation",
            description: "Maintained comprehensive documentation of legal processes.",
            impactScale: 4
          },
          {
            name: "Legal monitoring",
            description: "Monitored legal developments to inform company strategy.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Human Resources",
        description: "Activities related to human resources and talent management",
        key: "human-resources",
        actions: [
          {
            name: "Recruitment strategy",
            description: "Developed and executed recruitment strategies to attract top talent.",
            impactScale: 5
          },
          {
            name: "Candidate management",
            description: "Screened candidates, conducted interviews, and managed hiring pipelines.",
            impactScale: 4
          },
          {
            name: "Onboarding programs",
            description: "Organized onboarding and orientation programs for new hires.",
            impactScale: 4
          },
          {
            name: "Benefits administration",
            description: "Administered payroll, benefits, and compensation plans.",
            impactScale: 4
          },
          {
            name: "Culture cultivation",
            description: "Mediated employee relations and cultivated a positive culture.",
            impactScale: 4
          },
          {
            name: "Training coordination",
            description: "Coordinated training and development initiatives.",
            impactScale: 4
          },
          {
            name: "Compliance enforcement",
            description: "Ensured compliance with labor laws and policies.",
            impactScale: 5
          },
          {
            name: "Performance management",
            description: "Conducted performance reviews and feedback sessions.",
            impactScale: 4
          },
          {
            name: "DEI promotion",
            description: "Promoted diversity, equity, and inclusion in the workplace.",
            impactScale: 4
          },
          {
            name: "Offboarding management",
            description: "Managed offboarding processes and exit interviews.",
            impactScale: 3
          }
        ]
      },
      {
        name: "IT & Security",
        description: "Activities related to IT infrastructure and security",
        key: "it-security",
        actions: [
          {
            name: "Infrastructure maintenance",
            description: "Installed and maintained hardware, software, and network systems.",
            impactScale: 4
          },
          {
            name: "System monitoring",
            description: "Monitored system performance, swiftly addressing outages.",
            impactScale: 5
          },
          {
            name: "Security implementation",
            description: "Implemented cybersecurity measures (firewalls, encryption).",
            impactScale: 5
          },
          {
            name: "Security auditing",
            description: "Conducted regular security audits and penetration tests.",
            impactScale: 5
          },
          {
            name: "Disaster recovery",
            description: "Led disaster recovery planning and data backup strategies.",
            impactScale: 5
          },
          {
            name: "Access control",
            description: "Maintained user access controls and identity management.",
            impactScale: 4
          },
          {
            name: "Incident response",
            description: "Investigated and remediated security breaches or incidents.",
            impactScale: 5
          },
          {
            name: "Policy development",
            description: "Developed IT policies for data protection and compliance.",
            impactScale: 4
          },
          {
            name: "Security training",
            description: "Provided user training on security awareness and best practices.",
            impactScale: 4
          },
          {
            name: "Threat adaptation",
            description: "Stayed updated on emerging threats and adapted defense strategies.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Research",
        description: "Activities related to research and development",
        key: "research",
        actions: [
          {
            name: "Research scoping",
            description: "Identified key questions to guide research project scopes.",
            impactScale: 4
          },
          {
            name: "Study execution",
            description: "Designed and executed studies using qualitative and quantitative methods.",
            impactScale: 5
          },
          {
            name: "Data analysis",
            description: "Analyzed data to uncover insights and inform strategic decisions.",
            impactScale: 5
          },
          {
            name: "Product integration",
            description: "Integrated findings into product development cycles.",
            impactScale: 5
          },
          {
            name: "Competitive analysis",
            description: "Conducted literature reviews and competitive benchmarking.",
            impactScale: 4
          },
          {
            name: "Research documentation",
            description: "Maintained detailed research documentation and repositories.",
            impactScale: 3
          },
          {
            name: "Participant management",
            description: "Recruited participants and handled ethics requirements.",
            impactScale: 3
          },
          {
            name: "Finding presentation",
            description: "Presented findings and recommended next steps to stakeholders.",
            impactScale: 4
          },
          {
            name: "Advanced analysis",
            description: "Used advanced data analysis tools to identify patterns and trends.",
            impactScale: 5
          },
          {
            name: "Research iteration",
            description: "Iterated on research plans based on ongoing feedback and goals.",
            impactScale: 4
          }
        ]
      },
      {
        name: "Operations",
        description: "Activities related to business operations and processes",
        key: "operations",
        actions: [
          {
            name: "Process optimization",
            description: "Streamlined processes to enhance efficiency and reduce costs.",
            impactScale: 5
          },
          {
            name: "Supply chain management",
            description: "Managed supply chain logistics, vendor relationships, and procurement.",
            impactScale: 4
          },
          {
            name: "Process documentation",
            description: "Created process documentation and standard operating procedures.",
            impactScale: 3
          },
          {
            name: "Operational metrics",
            description: "Established metrics to monitor operational effectiveness.",
            impactScale: 4
          },
          {
            name: "Resource optimization",
            description: "Optimized resource allocation based on data insights.",
            impactScale: 4
          },
          {
            name: "Compliance management",
            description: "Ensured compliance with health, safety, and industry regulations.",
            impactScale: 5
          },
          {
            name: "Process reviews",
            description: "Held regular reviews to identify improvement areas.",
            impactScale: 3
          },
          {
            name: "Budget oversight",
            description: "Oversaw budget management in partnership with finance.",
            impactScale: 4
          },
          {
            name: "Technology adoption",
            description: "Adopted new tools and technologies for continuous improvement.",
            impactScale: 4
          },
          {
            name: "Workflow maintenance",
            description: "Maintained consistency in day-to-day operational workflows.",
            impactScale: 3
          }
        ]
      },
      {
        name: "Education",
        description: "Activities related to training and education",
        key: "education",
        actions: [
          {
            name: "Training development",
            description: "Developed and delivered training programs for employees or clients.",
            impactScale: 4
          },
          {
            name: "Material creation",
            description: "Created instructional materials aligned with clear learning objectives.",
            impactScale: 4
          },
          {
            name: "E-learning management",
            description: "Leveraged e-learning platforms for accessible remote training.",
            impactScale: 4
          },
          {
            name: "Workshop facilitation",
            description: "Conducted workshops, seminars, and webinars to upskill learners.",
            impactScale: 4
          },
          {
            name: "Training evaluation",
            description: "Evaluated training effectiveness through feedback and performance metrics.",
            impactScale: 3
          },
          {
            name: "Content collaboration",
            description: "Worked with experts to ensure accurate, relevant course content.",
            impactScale: 4
          },
          {
            name: "Interactive learning",
            description: "Facilitated interactive learning sessions to enhance skill development.",
            impactScale: 4
          },
          {
            name: "Learning adaptation",
            description: "Adapted educational approaches for diverse learning styles.",
            impactScale: 4
          },
          {
            name: "Knowledge management",
            description: "Maintained updated resources in a centralized knowledge base.",
            impactScale: 3
          },
          {
            name: "Learning innovation",
            description: "Explored new tools and methods to enhance learning outcomes.",
            impactScale: 4
          }
        ]
      }
    ]
  }
];