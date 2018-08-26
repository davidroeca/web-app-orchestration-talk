const getEnvVar = (name, optional = false, default = null) => {
  const val = process.env[name];
  if (!val) {
    if (!optional) {
      throw new Error(`Environment variable "${name}" must be set`);
    } else {
      return default;
    }
  }
  return val;
}

const password = getEnvVar('DB_PASSWORD');
const username = getEnvVar('DB_USER');
const database = getEnvVar('DB_NAME');
const host = getEnvVar('DB_HOST', true, '127.0.0.1');

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    dialect: 'postgres',
  },
  test: {
    username,
    password,
    database,
    host,
    dialect: 'postgres',
  },
  production: {
    username,
    password,
    database,
    host,
    dialect: 'postgres',
  }
};
