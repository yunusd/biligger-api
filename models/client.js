const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;

/**
 * This is the configuration of the clients that are allowed to connected to your authorization
 * server. These represent client applications that can connect. At a minimum you need the required
 * properties of
 *
 *
 * name:               The name of your client application
 * clientId:           A unique id of your client application
 * clientSecret:       It's a virtual field which take unique password(ish) secret
*                      that is _best not_ shared with anyone but your
 *                     client application and the authorization server.
 * salt:               Salt for hashed password.
 * hashedClientSecret: Hashed client secret in db.
 *
 *
 * Optionally you can set these properties which are
 *
 * trustedClient: default if missing is false. If this is set to true then the client is regarded
 * as a trusted client and not a 3rd party application. That means that the user will not be
 * presented with a decision dialog with the trusted application and that the trusted application
 * gets full scope access without the user having to make a decision to allow or disallow the scope
 * access.
 */
const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    unique: true,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  hashedClientSecret: {
    type: String,
    required: true,
  },
  trustedClient: {
    type: Boolean,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

clientSchema.methods.encryptSecret = function (secret) {
  return crypto.pbkdf2Sync(secret, this.salt, 100000, 32, 'sha256');
};

clientSchema.virtual('clientSecret').set(
  function (secret) {
    this.salt = crypto.randomBytes(128).toString('hex');
    this.hashedClientSecret = this.encryptSecret(secret);
  },
);

clientSchema.methods.verifySecret = function (secret) {
  return this.encryptSecret(secret) == this.hashedClientSecret;
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
