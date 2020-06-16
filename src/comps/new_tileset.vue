<template lang='pug'>
#new_tileset
  .flex-row.align-bl.spaced-8px
    span File
    ui-input(
      placeholder='file not chosen'
      :value='fname'
      disabled
      mclass='expand'
    )
    faicon.icon.hover-hl(
      icon='folder-open'
      @click='on_file_select'
    )
  .grid.hgap-20px(style='grid-template-columns: 1fr 1fr; margin-top: 8px')
    .g11.bold Image
    .g21
      .flex-row.align-bl.spaced-8px
        span Width
        .expand
        ui-input(
          type='number'
          disabled
          placeholder='-'
          :value='im_width_text'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .g31
      .flex-row.align-bl.spaced-8px
        span Height
        .expand
        ui-input(
          type='number'
          disabled
          placeholder='-'
          :value='im_height_text'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .g12.bold Tile
    .g22
      .flex-row.align-bl.spaced-8px
        span Width
        .expand
        ui-input(
          v-model.number='tile_width'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .g32
      .flex-row.align-bl.spaced-8px
        span Height
        .expand
        ui-input(
          v-model.number='tile_height'
          mstyle='width: 60px; text-align: right'
        )
        span px
</template>

<script>
import image_sel_mixin from '../mixins/image_sel'
import { tile_mode } from '../const.js'

// returns json
export function get_json(o){
  return JSON.stringify({
    type: 'tileset',
    file: o.file,
    fpath: o.fpath,
    tile_w: o.tile_w,
    tile_h: o.tile_h,
    im_w: o.im_w,
    im_h: o.im_h,
    tileset_props: o.tileset_props,
    props: o.props,
    flags: o.flags,
    colls: o.colls,
    terra: o.terra,
    anims: o.anims,
    sec: tile_mode.props,
    itile: 0, // currently selected tile
    iflag: null,
    iterra: null,
    ianim: null,
    anim_pos: 0,
    zoom: o.zoom,
    grid: o.grid,
    dim: o.dim,
  })
}

export default
{
  name: 'new_tileset',
  mixins: [ image_sel_mixin ],

  data(){
    return {
      tile_width: 16,
      tile_height: 16,
    }
  },

  methods:
  {
    editor_data(){
      let ntiles = Math.round((this.im_width*this.im_height) /
        (this.tile_width*this.tile_height))

      return {
        file: null, // JSON file opened (if opened)
        fpath: this.fpath, // image file (e.g. .png) opened
        tile_w : this.tile_width,
        tile_h : this.tile_height,
        im_w : this.im_width,
        im_h : this.im_height,
        im_data : this.im_data,
        tileset_props: [ {key:'name', val:''} ],

        // these are all "tile" data (omit "tile" in variable names for brevity)
        // for `props`, cannot do Array(ntiles).fill([]) b/c:
        // > x = Array(4).fill({y:3})
        // [ { y: 3 }, { y: 3 }, { y: 3 }, { y: 3 } ]
        // > x[0].y = 4
        // 4
        // > x
        // [ { y: 4 }, { y: 4 }, { y: 4 }, { y: 4 } ]
        props: Array(ntiles).fill(0).map(x => []),
        flags: [],
        colls: Array(ntiles).fill(0).map(function(x){
          return {
            u:false, ur:false, r:false, dr:false,
            d:false, dl:false, l:false, ul:false,
          }
        }),
        terra: [],
        anims: [],
        sec: tile_mode.props,
        itile: 0, // currently selected tile
        iflag: null,
        iterra: null,
        ianim: null,
        anim_pos: 0,

        // PIXI graphics - todo: these don't need to be reactive
        // g_tiles: Array(ntiles).fill(0),  // Textures
        // g_anim_tiles: [],

        // editor options
        zoom: 1.0,
        grid: true,
        dim: true,
      }
    }
  },
}
</script>
