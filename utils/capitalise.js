export function capitalise(str) {
  const arr = str.split('');
  arr.unshift(arr.shift().toUpperCase());
  return arr.join('');
}
