const connection = require('../../config/nysql')
const path = require('path')
const fs = require('fs')

const index = (req, res, next) => {
    const{search} = req.query;
    let exec = {};
    if(search){
        exec = {
            sql: 'SELECT * FROM products WHERE name LIKE ?',
            values: [`%${search}%`]
        }
    }else {
        exec = {
            sql: 'SELECT * FROM products'
        }
    }
    connection.query(exec, _respones(res));
}


const view = (req, res) => {
    connection.query({
        sql: 'SELECT * FROM products WHERE id = ?',
        values: [req.params.id]
    }, _respones(res));
}
const destroy = (req, res, next) => {
    connection.query({
        sql: 'DELETE FROM products WHERE id = ?',
        values: [req.params.id]
    }, _respones(res));
}


const store = (req, res, next) => {
    const {users_id, name, price, stock, status} = req.body;
    const image = req.file
    if(image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target)
        connection.query({
            sql: 'INSERT INTO products (users_id, name, price, stock, status, image_url) VALUES (?, ?, ?, ?, ?, ?) ',
            values: [parseInt(users_id), name, price, stock, status, `http://localhost:public/${image.originalname}`]
        }, _respones(res));
    } 
    
}

const update = (req, res, next) => {
    const {users_id, name, price, stock, status} = req.body;
    const image = req.file
    let sql = '';
    let values = [];
    if(image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        sql =  'UPDATE products SET users_id = ?, name = ?,  price = ?, stock = ?, status = ?, image_url = ? WHERE id = ?';
        values = [parseInt(users_id), name, price, stock, status, `http://localhost:public/${image.originalname}`, req.params.id]
        
    }else {
        sql =  'UPDATE products SET users_id = ?, name = ?,  price = ?, stock = ?, status = ? WHERE id = ?';
        values = [parseInt(users_id), name, price, stock, status, req.params.id]
    }
    connection.query({sql, values,}, _respones(res));
    
}

const _respones = (res) => {
    return (error, result) => {
        if(error){
            res.send({
                status: 'FAILED',
                response: error
            })
        } else {
            res.send({
                status: 'SUCCES',
                response: result
            })
        }
    }
}

module.exports = {
    index,
    view,
    store,
    update,
    destroy
}