const stringToID = (str) => Buffer.from(str).toString('base64').substring(0, 22);

module.exports = stringToID;
