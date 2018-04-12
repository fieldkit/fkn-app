const CHANNEL_CLOSED = Symbol('Channel Closed');

export function createChannel(name) {
    const messageQueue = []
    const resolveQueue = []

    let open = true;

    function close() {
        open = false;
        this.put(CHANNEL_CLOSED);
    }

    function isOpen() {
        return open;
    }

    function put(msg) {
        if (resolveQueue.length) {
            const nextResolve = resolveQueue.shift();
            nextResolve(msg);
        } else {
            messageQueue.push(msg);
        }
    }

    function take() {
        if (messageQueue.length) {
            return Promise.resolve(messageQueue.shift());
        } else {
            return new Promise((resolve) => resolveQueue.push(resolve));
        }
    }

    return {
        take,
        put,
        close,
        isOpen
    }
}

