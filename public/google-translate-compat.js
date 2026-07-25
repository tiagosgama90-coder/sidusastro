/**
 * Compatibilidade React + Tradutor do Google (Chrome).
 * O GT altera o DOM (envolve texto em <font>) e o React rebenta em insertBefore/removeChild.
 * Este patch impede o crash sem bloquear a tradução.
 */
(function installGoogleTranslateCompat() {
  if (typeof Node !== 'function' || !Node.prototype) return
  if (Node.prototype.__sidusGtCompat) return
  Node.prototype.__sidusGtCompat = true

  const origRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function removeChildPatched(child) {
    if (child && child.parentNode !== this) return child
    return origRemoveChild.apply(this, arguments)
  }

  const origInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function insertBeforePatched(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return origInsertBefore.call(referenceNode.parentNode, newNode, referenceNode.nextSibling)
      }
      return this.appendChild(newNode)
    }
    return origInsertBefore.apply(this, arguments)
  }
})()
