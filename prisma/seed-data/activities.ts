// prisma/seed-data/activities.ts

export const seedActivities = {
    general: {
      name: "General",
      description: "General business activities and operations",
      activities: [
        {
          name: "Strategy Planning",
          description: "Develop and implement strategic plans to achieve organizational goals",
          impactScale: 4
        },
        {
          name: "Resource Allocation",
          description: "Optimize distribution of resources across projects and teams",
          impactScale: 5
        },
        {
          name: "Performance Review",
          description: "Conduct regular performance evaluations and provide constructive feedback",
          impactScale: 3
        },
        {
          name: "Risk Assessment",
          description: "Identify and evaluate potential risks to project success",
          impactScale: 4
        },
        {
          name: "Team Building",
          description: "Foster team collaboration and positive work environment",
          impactScale: 3
        },
        {
          name: "Process Improvement",
          description: "Streamline workflows and enhance operational efficiency",
          impactScale: 4
        },
        {
          name: "Budget Management",
          description: "Monitor and control project expenses within budget constraints",
          impactScale: 5
        },
        {
          name: "Stakeholder Communication",
          description: "Maintain effective communication with all project stakeholders",
          impactScale: 4
        },
        {
          name: "Quality Assurance",
          description: "Ensure deliverables meet quality standards and requirements",
          impactScale: 4
        },
        {
          name: "Knowledge Transfer",
          description: "Facilitate sharing of information and best practices across teams",
          impactScale: 3
        },
        {
          name: "Vendor Management",
          description: "Manage relationships with external vendors and service providers",
          impactScale: 4
        },
        {
          name: "Change Management",
          description: "Guide organizational transitions and process changes effectively",
          impactScale: 5
        },
        {
          name: "Data Analysis",
          description: "Analyze and interpret data to support decision-making",
          impactScale: 4
        },
        {
          name: "Documentation",
          description: "Create and maintain comprehensive project documentation",
          impactScale: 3
        },
        {
          name: "Training Coordination",
          description: "Organize and facilitate team training and development programs",
          impactScale: 4
        },
        {
          name: "Compliance Monitoring",
          description: "Ensure adherence to regulations and internal policies",
          impactScale: 5
        },
        {
          name: "Project Planning",
          description: "Develop detailed project plans and timelines",
          impactScale: 4
        },
        {
          name: "Client Relationship",
          description: "Build and maintain strong relationships with clients",
          impactScale: 4
        },
        {
          name: "Meeting Facilitation",
          description: "Plan and lead effective team meetings and workshops",
          impactScale: 3
        },
        {
          name: "Resource Optimization",
          description: "Maximize efficiency of team resources and tools",
          impactScale: 4
        }
      ]
    },
    product: {
      name: "Product Management",
      description: "Product development and management activities",
      activities: [
        {
          name: "Product Strategy",
          description: "Define and execute product vision and roadmap",
          impactScale: 5
        },
        {
          name: "User Research",
          description: "Conduct user research and gather product requirements",
          impactScale: 4
        }
      ]
    },
    engineering: {
      name: "Engineering",
      description: "Engineering and technical activities",
      activities: [
        {
          name: "Code Review",
          description: "Review and provide feedback on code changes",
          impactScale: 4
        },
        {
          name: "Technical Architecture",
          description: "Design and implement technical solutions",
          impactScale: 5
        }
      ]
    },
    design: {
      name: "Design",
      description: "Design and user experience activities",
      activities: [
        {
          name: "UI Design",
          description: "Create user interface designs and prototypes",
          impactScale: 4
        },
        {
          name: "Design System",
          description: "Maintain and evolve design system components",
          impactScale: 4
        }
      ]
    },
    research: {
      name: "Research",
      description: "Research and analysis activities",
      activities: [
        {
          name: "Market Research",
          description: "Research market trends and competitor analysis",
          impactScale: 4
        },
        {
          name: "Data Analysis",
          description: "Analyze research data and create insights",
          impactScale: 4
        }
      ]
    }
  }