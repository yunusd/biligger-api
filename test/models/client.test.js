const mongoose = require('mongoose');
const { Client } = require('../../models');

describe('clients', () => {
  let savedClient = {};

  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }));

  beforeEach(async () => {
    await Client.remove({});
    savedClient = await Client.create({
      name: 'mobile',
      clientId: '1',
      clientSecret: 'ssh-secret',
      trustedClient: true,
    });
  });

  afterEach(() => Client.remove({}));

  test('should not find an invalid client', async () => {
    const client = await Client.findById('000000000000000000000000');
    expect(client).toBeNull();
  });

  test('should find a client by id', async () => {
    const client = await Client.findById(savedClient.id);
    expect(client).toHaveProperty('name', 'mobile');
    expect(client).toHaveProperty('clientId', '1');
  });

  test('should find a client by clientId 1', async () => {
    const client = await Client.findOne({ clientId: '1' });
    expect(client).toHaveProperty('name', 'mobile');
    expect(client).toHaveProperty('clientId', '1');
  });
});
