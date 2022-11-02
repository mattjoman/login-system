const mysql = require('mysql2'); // Important: use mysql2, not mysql
const cpm = require('mysql-connection-pool-manager');

/*
 * Database credentials.
 */
const dbCred = {
  host:     "database",
  user:     "root",
  password: "test123",
  database: "website"
};

/********* Database connection pool. *********/
const dbPool = mysql.createPool({
  ...dbCred,
  connectionLimit: 10
});

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
  dbPool,
  queryDatabase
};
