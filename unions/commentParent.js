module.exports = {
  CommentParent: {
    __resolveType(obj) {
      if (obj.title) {
        return 'Post';
      }

      if (!obj.title) {
        return 'Comment';
      }

      return null;
    },
  },
};
