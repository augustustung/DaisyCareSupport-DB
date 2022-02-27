const users = [];

const addUser = ({ id, name, room }) => {
  if (!name || !room) return { error: 'Username and room are required.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
}

module.exports = { addUser };