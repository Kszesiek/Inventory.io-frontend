export function enlistItems(items: string[] | undefined): string {
  if (!items || items.length === 0)
    return "nic"

  let itemsListed: string = ""
  items.slice(0, items.length > 3 ? 2 : 3).forEach(itemName => {  //
    itemsListed += itemName + ', '
  })
  itemsListed = itemsListed.slice(0, itemsListed.length - 2)
  if (items.length > 3) {
    itemsListed += ' i ' + (items.length - 2) + (items.length < 5 ? ' inne' : ' innych');
  }

  return itemsListed
}

export function writeOutArray(stringsArray: string[]): string {
  let output: string = ""
  let ending: string = ""
  if (stringsArray.length > 0) {
    output += stringsArray.shift()
  }
  if (stringsArray.length > 0) {
    ending = " and " + stringsArray.pop()
  }
  if (stringsArray.length > 0) {
    stringsArray.forEach(item => {
      output += ", " + item
    })
  }

  return output + ending
}