class PlayerPart {
    constructor(x, y, w, h, color) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        this._color = color;

        this.moveVector = {
            x: 0,
            y: 0,
            angle: 0,
        }
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get w() {
        return this._w;
    }

    get h() {
        return this._h;
    }

    get color() {
        return this._color;
    }

    set x(val) {
        this._x = +val;
    }

    set y(val) {
        this._y = +val;
    }

    set color(val) {
        this._color = val;
    }
}
