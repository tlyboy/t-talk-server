export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] open', peer)
  },

  message(peer, message) {
    console.log('[ws] message', peer, message)

    if (message.text().includes('ping')) {
      peer.send({ user: 'server', message: 'pong' })
    } else {
      peer.send({ user: peer.toString(), message: message.toString() })
    }
  },

  close(peer, event) {
    console.log('[ws] close', peer, event)
  },

  error(peer, error) {
    console.log('[ws] error', peer, error)
  },
})
