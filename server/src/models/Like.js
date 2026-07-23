import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
