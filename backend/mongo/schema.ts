import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  courseId: string;
  user: {
    id: string;
    name: string;
  };
  content: string;
  commentsCount: number;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    courseId: { type: String, required: true },

    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },

    content: { type: String, required: true },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PostSchema.index({ courseId: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>("Post", PostSchema);

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  user: {
    id: string;
    name: string;
  };
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },

    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },

    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

CommentSchema.index({ postId: 1, createdAt: 1 });

export const Comment = mongoose.model<IComment>(
  "Comment",
  CommentSchema
);


export interface ILessonRead extends Document {
  userId: string;
  courseId: string;
  lessonId: string;
  readAt: Date;
}

const LessonReadSchema = new Schema<ILessonRead>({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  lessonId: { type: String, required: true },
  readAt: { type: Date, default: Date.now },
});

LessonReadSchema.index(
  { userId: 1, lessonId: 1 },
  { unique: true }
);

export const LessonRead = mongoose.model<ILessonRead>(
  "LessonRead",
  LessonReadSchema
);


export interface IDashboard extends Document {
  userId: string;
  enrolledCourses: number;
  completedLessons: number;
  pendingAssignments: number;
  lastActiveAt: Date;
  updatedAt: Date;
}

const DashboardSchema = new Schema<IDashboard>(
  {
    userId: { type: String, required: true, unique: true },

    enrolledCourses: { type: Number, default: 0 },
    completedLessons: { type: Number, default: 0 },
    pendingAssignments: { type: Number, default: 0 },

    lastActiveAt: { type: Date },
  },
  { timestamps: true }
);

export const Dashboard = mongoose.model<IDashboard>(
  "Dashboard",
  DashboardSchema
);
