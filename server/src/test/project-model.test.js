import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

const ProjectMock = dbMock.define("project", {
  projectId: "550e8400-e29b-41d4-a716-446655440000",
  orgId: "org-123",
  name: "Test Project",
  description: "This is a test project",
  priority: "Low",
  status: "Planning",
  start_date: new Date(),
  end_date: new Date(),
  project_manager: "manager-123",
  team_members: [],
  created_by: "user-123",
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("Project Model", () => {
  it("should create a new Project instance", async () => {
    const projectData = {
      name: "Test Project",
      description: "This is a test project",
      orgId: "org-123",
      project_manager: "manager-123",
      start_date: new Date(),
      end_date: new Date(),
      created_by: "user-123",
    };

    const project = await ProjectMock.create(projectData);

    expect(project.name).toBe("Test Project");
    expect(project.description).toBe("This is a test project");
    expect(project.projectId).toBeDefined();
  });

  it("should retrieve a Project instance", async () => {
    const retrievedProject = await ProjectMock.findOne({
      where: { name: "Test Project" },
    });

    expect(retrievedProject).toBeDefined();
    expect(retrievedProject.name).toBe("Test Project");
  });

  it("should have default values for priority and status", async () => {
    const project = await ProjectMock.create({
      name: "Defaults Test",
      orgId: "org-789",
      project_manager: "manager-789",
      start_date: new Date(),
      end_date: new Date(),
      created_by: "user-789",
    });

    expect(project.priority).toBe("Low");
    expect(project.status).toBe("Planning");
  });
});
