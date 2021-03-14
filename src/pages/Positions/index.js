import React, { useContext } from 'react'
import { Context } from '@/reducers/index'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import tableIcons from '@/constants/tableIcons'

const useStyles = makeStyles({
  root: {},
  iconButton: {
    padding: 6,
  },
})

const columns = [
  {
    field: 'symbol',
    title: '名称',
    render: (rowData) => (
      <span>
        {rowData.name}({rowData.symbol})
      </span>
    ),
  },

  {
    field: 'costPrice',
    title: '成本',
  },
  {
    field: 'position',
    title: '持仓',
  },
]

export default function Positions() {
  const classes = useStyles()
  const { store, dispatch } = useContext(Context)

  const handleAdd = (newData) =>
    new Promise((resolve) => {
      resolve(
        dispatch({
          type: '_ADD_STOCK_',
          payload: newData,
        })
      )
    })

  const handleUpdate = (newData) => new Promise((resolve) => {
      resolve(
        dispatch({
          type: '_UPDATE_STOCK_',
          payload: newData,
        })
      )
    })

  const handleDlete = (rowData) =>
    new Promise((resolve) => {
      resolve(
        dispatch({
          type: '_DEL_STOCK_',
          payload: rowData,
        })
      )
    }) 

  return (
    <div className={classes.root}>
      <MaterialTable
        title="持仓"
        icons={tableIcons}
        columns={columns}
        data={store._stocks}
        editable={{
          onRowAdd: handleAdd,
          onRowUpdate: handleUpdate,
          onRowDelete: handleDlete,
        }}
        options={{
          actionsColumnIndex: -1,
          paging: false,
        }}
        localization={{
          header: { actions: '操作' },
        }}
      />
    </div>
  )
}
