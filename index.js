module.exports = function(field, tilesize, dimensions) {
  dimensions = dimensions || [ 
    Math.sqrt(field.length) >> 0
  , Math.sqrt(field.length) >> 0
  , Math.sqrt(field.length) >> 0
  ] 

  field = typeof field === 'function' ? field : function(x, y, z) {
    return this[x + y * dimensions[1] + (z * dimensions[1] * dimensions[2])]
  }.bind(field) 

  var coords

  coords = [0, 0, 0]

  return collide

  function collide(box, vec, oncollision) {
    if(vec[0] === 0 && vec[1] === 0 && vec[2] === 0) return

    // collide x, then y
    collideaxis(0)
    collideaxis(1)
    collideaxis(2)

    function collideaxis(i_axis) {
      var j_axis = (i_axis + 1) % 3
        , k_axis = (i_axis + 2) % 3 
        , posi = vec[i_axis] > 0
        , leading = box[posi ? 'max' : 'base'][i_axis] 
        , dir = posi ? 1 : -1
        , i_start = (leading / tilesize) >> 0
        , i_end = (((leading + vec[i_axis]) / tilesize) >> 0) + dir
        , j_start = (box.base[j_axis] / tilesize) >> 0
        , j_end = Math.ceil(box.max[j_axis] / tilesize) >> 0
        , k_start = (box.base[k_axis] / tilesize) >> 0
        , k_end = Math.ceil(box.max[k_axis] / tilesize) >> 0
        , done = false
        , edge_vector
        , edge
        , tile

      // loop from the current tile coord to the dest tile coord
      //    -> loop on the opposite axis to get the other candidates
      //      -> if `oncollision` return `true` we've hit something and
      //         should break out of the loops entirely.
      //         NB: `oncollision` is where the client gets the chance
      //         to modify the `vec` in-flight.
      // once we're done translate the box to the vec results

      var step = 0
      for(var i = i_start; !done && i !== i_end; ++step, i += dir) {
        if(i < 0 || i >= dimensions[i_axis]) continue
        for(var j = j_start; !done && j !== j_end; ++j) {
          if(j < 0 || j >= dimensions[j_axis]) continue
          for(var k = k_start; k !== k_end; ++k) {
            if(k < 0 || k >= dimensions[k_axis]) continue
            coords[i_axis] = i
            coords[j_axis] = j
            coords[k_axis] = k
            tile = field.apply(field, coords)

            if(tile === undefined) continue

            edge = dir > 0 ? i * tilesize : (i + 1) * tilesize
            edge_vector = edge - leading

            sign = function(x) { return x ? x / Math.abs(x) : 0 }
            if(oncollision(i_axis, tile, coords, dir, edge_vector)) {
              done = true
              break
            }
          } 
        }
      }

      coords[0] = coords[1] = coords[2] = 0
      coords[i_axis] = vec[i_axis]
      box.translate(coords)
    }
  }  
}
