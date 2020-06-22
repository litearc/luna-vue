// converts a Buffer (values 0..255) to a Float32Array (values 0 to 1)
export function i8_to_f32(buf){
  let n = buf.length
  let arr = new Float32Array(n)
  for (let i = 0; i < n; i++)
    arr[i] = buf[i]/255
  return arr
}

export function clamp(v, vmin, vmax){
  return Math.min(Math.max(v, vmin), vmax)
}
