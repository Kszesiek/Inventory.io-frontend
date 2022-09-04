export default function enlistItems(items: string[]): string {
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
