module.exports = {
  LikeParent: {
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
