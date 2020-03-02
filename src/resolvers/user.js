const createUser = (parent , args, { Models }) => {
  Models.User.create(args);
};

const allUser = (parent , args, { Models }) => {
  Models.User.find()
}

const getUser = (parent , args, { Models }) => {
  Models.User.findOne(args)
}

const userResolver = {
  createUser,
  allUser,
  getUser
}

export default userResolver;
