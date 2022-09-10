const cpm = require('mysql-connection-pool-manager');

/* 
 * Returns a promise object.
 */
function queryDatabase(myPool, myQuery, inputArr=[]) {
  return new Promise ((success, failure) => {
    myPool.getConnection((err1, con) => {
      if (err1) { failure(err1); }
      con.query(myQuery, inputArr, (err2, dbResult) => {
        if (err2) { failure(err2); }
        con.release();
        success(dbResult);
      });
    });
  });
}

module.exports = {
  queryDatabase
};
