module.exports = function (app, log, db) {
require('./crud')(app, log, db)
require('./login')(app, log, db)

  // hello world (:)
  app.get('/hello', (req, res) => {
    res.json({ 'message': 'Hello World!' })
  })

  app.get('/table/:tableName', (req, res) => {
    console.log(req.params)
    db.query(`SELECT * FROM ${req.params.tableName}`).then(response => {
      res.json(response.rows)
    }).catch(err => {
      res.json({status: 'error', message: err.message})
    })
  })

  app.get('/list-functions', (req, res) => {
    const selectFunctions = `SELECT routines.routine_name, routines.specific_name as id,` +
      `parameters.data_type, parameters.parameter_name, parameters.ordinal_position` +
      `FROM information_schema.routines` +
      `LEFT JOIN information_schema.parameters ON routines.specific_name=parameters.specific_name` +
      `WHERE routines.specific_schema='public'` +
      `ORDER BY routines.routine_name, parameters.ordinal_position;`
    console.log('/tables', selectFunctions)
    db.query(selectFunctions).then(response => {
      res.json(response.rows)
    }).catch(err => {
      console.log(`catch`)
      res.json({status: 'error', message: err.message})
    })
  })

  app.get('/list-tables', (req, res) => {
    const selectTableNames = `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public'`
    console.log('/tables', selectTableNames)
    db.query(selectTableNames).then(response => {
      res.json(response.rows)
    }).catch(err => {
      console.log(`catch`)
      res.json({status: 'error', message: err.message})
    })
  })

  app.get('/load-menu', async (req, res) => {
    const selectTableNames = `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public' `
    const selectFunctions = `SELECT routines.routine_name, routines.specific_name as id, ` +
      `parameters.data_type, parameters.parameter_name, parameters.ordinal_position ` +
      `FROM information_schema.routines ` +
      `LEFT JOIN information_schema.parameters ON routines.specific_name=parameters.specific_name ` +
      `WHERE routines.specific_schema='public' ` +
      `ORDER BY routines.routine_name, parameters.ordinal_position;`
    console.log('load menu querying tables')
    try {
      const tables = await db.query(selectTableNames)
      console.log('done querying tables')
      const functions = await db.query(selectFunctions)
      console.log('done querying functions')

      const uniqueFunctions = {}
      functions.rows.forEach(r => {
        uniqueFunctions[r.id] = r.routine_name
      })
      let funcs = []
      Object.keys(uniqueFunctions).forEach(fk => {
        const funcParams = functions.rows.filter(f => f.id === fk)
        funcs.push({
          function: uniqueFunctions[fk],
          parameters: funcParams.map(p => {
            return {
              name: p.parameter_name,
              type: p.data_type,
              order: p.ordinal_position
            }
          })
        })
      })

      res.json({ tables: tables.rows, functions: funcs })
    } catch (e) {
      console.log('error')
      console.log(e)
      res.json(e)
    }
  })


  // 404
  app.get('*', function (req, res) {
    console.log('404')
    res.json({ status: 'error', message: '404 - not found'})
  })

  log.info('[other-routes] setup complete')

}
