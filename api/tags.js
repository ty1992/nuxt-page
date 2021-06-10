import {request} from '~/plugins/request.js'


/**
 * 
 * @returns {
  "tags": [
    "reactjs",
    "angularjs"
  ]
}
 */
export const getTags = () => request({
  url: '/tags'
})
