import { query } from "express";

function getQuery(tableName) {
    const query = `SELECT * FROM ${tableName}  WHERE IsActive = 1`;
    return query
}

function getByParamQuery(tableName, param) {
    const query = `SELECT * FROM ${tableName} where  ${param} = ? AND IsActive = 1`;
    return query
}

function getByParamsQuery(tableName, keys) {
    const query = `SELECT * FROM ${tableName} where ${keys.map(key=>`${key} = ?`).join(' AND ')} AND IsActive = 1`;
    return query
}

function getByIdQuery(tableName,IdName) {
    const query = `SELECT * FROM ${tableName} where ${IdName} = ? AND IsActive = 1`;
    return query
}

function deleteQuery(tableName, param) {
    const query = `UPDATE ${tableName} SET IsActive = 0 WHERE ${param} = ? AND IsActive = 1`;
    return query
}

function postQuery(tableName,keys) {
    let query;
        query = `INSERT INTO ${tableName} (${keys.map(key=>key)}) VALUES (${keys.map(key=>"?")})`
    return query;
}

function putQuery(tableName,keys,IdName) {    
          let  query = `UPDATE ${tableName} SET ${keys.map(key=>`${key} = ?`)} WHERE ${IdName} = ? AND IsActive = 1`;      
    return query;
}

function postSomeQuery(tableName, keys) {
    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES ?`;
    return query;
  }

function limitQuery(tableName) {
    const query = `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`;
    return query;
}

export {
    getQuery, getByIdQuery, getByParamQuery,postSomeQuery, deleteQuery, postQuery, putQuery, limitQuery,getByParamsQuery
}
