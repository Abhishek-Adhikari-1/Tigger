import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

const CommentMock = dbMock.define("comment", {
  id: "550e8400-e29b-41d4-a716-446655440002",
  content: "This is a test comment",
  author: "John Doe",
  created_by: "user-123",
  taskId: "550e8400-e29b-41d4-a716-446655440001",
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("Comment Model", () => {
  it("should create a new Comment instance", async () => {
    const commentData = {
      content: "This is a test comment",
      author: "John Doe",
      created_by: "user-123",
      taskId: "550e8400-e29b-41d4-a716-446655440001",
    };

    const comment = await CommentMock.create(commentData);

    expect(comment.content).toBe("This is a test comment");
    expect(comment.author).toBe("John Doe");
    expect(comment.id).toBeDefined();
  });

  it("should retrieve a Comment instance", async () => {
    const retrievedComment = await CommentMock.findOne({
      where: { content: "This is a test comment" },
    });

    expect(retrievedComment).toBeDefined();
    expect(retrievedComment.content).toBe("This is a test comment");
  });

  it("should have a taskId reference", async () => {
    const comment = await CommentMock.create({
      content: "Reference Test Comment",
      author: "Jane Doe",
      created_by: "user-456",
      taskId: "550e8400-e29b-41d4-a716-446655440001",
    });

    expect(comment.taskId).toBeDefined();
  });

  it("should have author and created_by fields", async () => {
    const comment = await CommentMock.create({
      content: "Author Test",
      author: "Test Author",
      created_by: "user-789",
      taskId: "550e8400-e29b-41d4-a716-446655440001",
    });

    expect(comment.author).toBe("Test Author");
    expect(comment.created_by).toBe("user-789");
  });
});
