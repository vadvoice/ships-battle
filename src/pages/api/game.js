function handler (req, res) {
  if (req.method === 'POST') {
    // get message
    const message = req.body.message;

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit('message', message);

    // return message
    res.status(201).json(message);
  }
}

export default handler;