// define constants used throughout app

// tile edit mode
export const tile_mode = {
  props: 0,
  flags: 1,
  coll: 2, // collision
  terra: 3,
  anim: 4, // animation
}

// collision types
export const coll_type = {
  none: 0,
  all: 1,
  custom: 2,
}

// animation cycle types
export const anim_cycle_type = {
  beg_to_end: 0,
  back_and_forth: 1,
}

// anim block types
export const anim_block_type = {
  not_set: -1,
  tile: 0,
  terra: 1,
}

// terra shape types
export const terra_shape_type = {
  _4x3: 0,
  _5x1: 1,
}

export const map_mode = {
  point: 0,
  rect: 1,
  fill: 2,
}
