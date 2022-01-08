class Spot {
    constructor(id, requester, time, location, helper, reward, visible) {
        this.id = id;
        this.requester = requester;
        this.time = time;
        this.location = location;
        this.helper = helper;
        this.reward = reward;
        this.visible = visible;
    }
}
exports.model = Spot;
