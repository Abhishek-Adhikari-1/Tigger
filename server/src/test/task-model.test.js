import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

const TaskMock = dbMock.define("task", {
  id: "550e8400-e29b-41d4-a716-446655440001",
  title: "Test Task",
  description: "This is a test task",
  due_date: new Date(),
  status: "Todo",
  type: "Task",
  priority: "Medium",
  assignee: "user-123",
  created_by: "user-456",
  projectId: "550e8400-e29b-41d4-a716-446655440000",
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("Task Model", () => {
  it("should create a new Task instance", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      created_by: "user-456",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
    };

    const task = await TaskMock.create(taskData);

    expect(task.title).toBe("Test Task");
    expect(task.description).toBe("This is a test task");
    expect(task.id).toBeDefined();
  });

  it("should retrieve a Task instance", async () => {
    const retrievedTask = await TaskMock.findOne({
      where: { title: "Test Task" },
    });

    expect(retrievedTask).toBeDefined();
    expect(retrievedTask.title).toBe("Test Task");
  });

  it("should have default values for status, type, and priority", async () => {
    const task = await TaskMock.create({
      title: "Defaults Test",
      created_by: "user-789",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(task.status).toBe("Todo");
    expect(task.type).toBe("Task");
    expect(task.priority).toBe("Medium");
  });

  it("should have a projectId reference", async () => {
    const task = await TaskMock.create({
      title: "Reference Test",
      created_by: "user-123",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(task.projectId).toBeDefined();
  });
});
