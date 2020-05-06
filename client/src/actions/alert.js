import { v4 as uuid } from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (message, alertType, timeout = 3000) => dispath => {
 const id = uuid()
 console.log(id)
 dispath({
  type: SET_ALERT,
  payload: { message, alertType, id }
 })

 setTimeout(() => dispath({ type: REMOVE_ALERT, payload: id }), timeout);
}