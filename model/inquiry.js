const client = require('../config/dataBaseConnection');
module.exports = {
    departmentList: function () {
        return new Promise(
            function (resolve, reject) {
                var q = client.query(
                    `select 
                        * 
                    from 
                        department 
                    where 
                    status=1  ORDER BY id desc`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    checkDuplicateEntry: (title, department, type, uid = 0) => {
        return new Promise(
            function (resolve, reject) {
                var q = client.query(
                    `select 
                       * 
                   from 
                       inquiry 
                   where 
                        title='${title}' 
                            and department_id='${department}'
                            and type='${type}'
                            and user_id='${uid}'  limit 1`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    listOfInquiry: (type, uid = 0) => {
        return new Promise(
            function (resolve, reject) {
                var q = client.query(
                    `select
                        d.name as department,
                       i.* 
                   from 
                       inquiry i
                    inner join department d on d.id = i.department_id    
                   where 
                            type='${type}' 
                            and user_id='${uid}'
                    ORDER BY id desc 
                            limit 1`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    UserlistOfInquiry: (type, uid = 0, user_type = '', inquiry_id = 0) => {
        return new Promise(
            function (resolve, reject) {
                var whereCluase = '';
                if (user_type == 'admin') {
                    whereCluase = '';
                } else {
                    whereCluase = ` AND i.user_id='${uid}'`;
                }
                if (inquiry_id > 0) {
                    whereCluase = ` AND i.id='${inquiry_id}'`;
                }

                var q = client.query(
                    `select
                        d.name as department,
                        concat_ws(' ',u.first_name,u.last_name) as username,
                       i.* 
                   from 
                       inquiry i
                    inner join 
                            department d on d.id = i.department_id 
                    inner join 
                            users u on u.id = i.user_id   
                   where 
                            i.type='${type}' 
                            ${whereCluase}
                    ORDER BY id desc`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    interventionList: (uid = 0, user_type = '') => {
        return new Promise(
            function (resolve, reject) {
                var whereCluase = '';
                if (user_type == 'admin') {
                    whereCluase = '';
                } else {
                    whereCluase = ` AND q.user_id='${uid}'`;
                }

                var q = client.query(
                    `
                    SELECT
                       q.user_id,
                       q.id as inquiry_id,
                       i.id as intervention_id,
                       concat_ws(' ',u.first_name,u.last_name) as userFullName,
                       d.name as department,
                       q.title,
                       q.comment,
                       q.department_id,
                       q.comment as inquiryComment,
                       i.comment as departmentReply,
                       q.added_on as createDate,
                       i.added_on as replyDate
                     FROM inquiry q
                     inner join intervention i on q.id = i.inquiry_id
                     inner join department d on d.id = q.department_id
                     inner join users u on u.id = q.user_id
                     WHERE i.id in(SELECT max(id) from intervention where inquiry_id = q.id)
                            ${whereCluase}
                     order by i.added_on ASC`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    getInquiryById: (id = 0) => {
        return new Promise(
            function (resolve, reject) {

                var q = client.query(
                    `
                    SELECT
                       q.user_id,
                       q.id as inquiry_id,
                       concat_ws(' ',u.first_name,u.last_name) as userFullName,
                       d.name as department,
                       q.title,
                       q.comment,
                       q.department_id,
                       q.comment as inquiryComment,
                       q.added_on as createDate
                     FROM inquiry q
                     inner join department d on d.id = q.department_id
                     inner join users u on u.id = q.user_id
                     WHERE 
                           q.id='${id}'
                     `,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    getInterventionDetails: (id = 0) => {
        return new Promise(
            function (resolve, reject) {

                var q = client.query(
                    `
                    SELECT
                       i.id as intervention_id,
                       i.comment as comment,
                       i.added_on as added_on
                     FROM inquiry q
                     inner join intervention i on q.id = i.inquiry_id
                     WHERE 
                          q.id='${id}'
                     order by i.added_on ASC`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },

    insertInquiry: (params = {}) => {
        return new Promise(
            function (resolve, reject) {
                var q = client.query(
                    `INSERT 
                        INTO
                    inquiry
                        (title,comment,department_id,status,type,user_id,added_on,geolocation_lat,geolocation_long) 
                        VALUES
                        ('${params.title}','${params.comment}','${params.department_id}','${params.status}','${params.type}','${params.user_id}','${params.added_on}','${params.geolocation_lat}','${params.geolocation_long}')`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    insertIntervention: (params = {}) => {
        return new Promise(
            function (resolve, reject) {
                var q = client.query(
                    `INSERT 
                        INTO
                        intervention
                        (comment,inquiry_id,added_on) 
                        VALUES
                        ('${params.comment}','${params.inquiry_id}','${params.added_on}')`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    updateInquiry: (params = {}) => {
        return new Promise(
            function (resolve, reject) {
                var q = client.query(
                    `UPDATE 
                    inquiry
                        SET 
                            title='${params.title}',comment='${params.comment}',department_id='${params.department_id}' ,updated_on='${params.updated_on}',geolocation_lat='${params.geolocation_lat}',geolocation_long='${params.geolocation_long}'
                            WHERE id='${params.id}' and type='${params.type}'`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    deleteInquiry: (id = 0) => {
        return new Promise(
            function (resolve, reject) {
                var q = client.query(
                    `DELETE 
                    FROM
                    inquiry
                        WHERE id='${id}'
                        `,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    }
}